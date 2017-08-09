package com.azavea.rf.database.tables

import com.azavea.rf.database.fields.{OrganizationFkFields, TimestampFields, VisibilityField}
import com.azavea.rf.database.query._
import com.azavea.rf.database.sort._
import com.azavea.rf.database.{Database => DB}
import com.azavea.rf.database.ExtendedPostgresDriver.api._
import com.azavea.rf.datamodel._
import java.util.UUID
import java.sql.Timestamp

import com.typesafe.scalalogging.LazyLogging
import com.lonelyplanet.akka.http.extensions.PageRequest

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

/** Table description of table chips. Objects of this class serve as prototypes for rows in queries. */
class Chips(_tableTag: Tag) extends Table[Chip](_tableTag, "chips")
                                         with OrganizationFkFields
                                         with TimestampFields
                                         with VisibilityField
{
  def * = (id, createdAt, modifiedAt, organizationId, x, heightPx, scene, url, thumbnailSize) <> (Chip.tupled, Chip.unapply _)

  val id: Rep[java.util.UUID] = column[java.util.UUID]("id", O.PrimaryKey)
  val createdAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("created_at")
  val modifiedAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("modified_at")
  val organizationId: Rep[java.util.UUID] = column[java.util.UUID]("organization_id")
  val visibility: Rep[Visibility] = column[Visibility]("visibility")
  val x: Rep[Int] = column[Int]("width_px")
  val heightPx: Rep[Int] = column[Int]("height_px")
  val scene: Rep[java.util.UUID] = column[java.util.UUID]("scene")
  val url: Rep[String] = column[String]("url", O.Length(255,varying=true))
  val thumbnailSize: Rep[ChipSize] = column[ChipSize]("thumbnail_size")

  /** Foreign key referencing Organizations (database name chips_organization_id_fkey) */
  lazy val organizationsFk = foreignKey("chips_organization_id_fkey", organizationId, Organizations)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  /** Foreign key referencing Scenes (database name chips_scene_fkey) */
  lazy val scenesFk = foreignKey("chips_scene_fkey", scene, Scenes)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
}

/** Collection-like TableQuery object for table Chips */
object Chips extends TableQuery(tag => new Chips(tag)) with LazyLogging {
  type TableQuery = Query[Chips, Chip, Seq]

  implicit val projectsSorter: QuerySorter[Chips] =
    new QuerySorter(
      new OrganizationFkSort(identity[Chips]),
      new TimestampSort(identity[Chips]))

  implicit class withChipsQuery[M, U, C[_]](chips: Chips.TableQuery) extends
      ChipDefaultQuery[M, U, C](chips)

  /** Insert a thumbnail into the database
    *
    * @param thumbnail Chip
    */
  def insertChip(thumbnail: Chip)
                     (implicit database: DB): Future[Chip] = {

    val action = Chips.forceInsert(thumbnail)
    logger.debug(s"Inserting thumbnail with: ${action.statements.headOption}")
    database.db.run {
      action.map( _ => thumbnail)
    }
  }

  /** Retrieve a single thumbnail from the database
    *
    * @param thumbnailId UUID ID Of thumbnail to query with
    * @param user        Results will be limited to user's organization
    */
  def getChip(thumbnailId: UUID, user: User)
                  (implicit database: DB): Future[Option[Chip]] = {

    val action = Chips
                   .filterToSharedOrganizationIfNotInRoot(user)
                   .filter(_.id === thumbnailId)
                   .result
    logger.debug(s"Retrieving thumbnail with: ${action.statements.headOption}")
    database.db.run {
      action.headOption
    }
  }

  def listChips(pageRequest: PageRequest, queryParams: ChipQueryParameters, user: User)
                    (implicit database: DB): Future[PaginatedResponse[Chip]] = {

    val chips = Chips
                       .filterToSharedOrganizationIfNotInRoot(user)
                       .filterBySceneParams(queryParams)

    val paginatedChips = database.db.run {
      val action = chips.page(pageRequest).result
      logger.debug(s"Query for chips -- SQL ${action.statements.headOption}")
      action
    }

    val totalChipsQuery = database.db.run { chips.length.result }

    for {
      totalChips <- totalChipsQuery
      chips <- paginatedChips
    } yield {
      val hasNext = (pageRequest.offset + 1) * pageRequest.limit < totalChips
      val hasPrevious = pageRequest.offset > 0
      PaginatedResponse[Chip](totalChips, hasPrevious, hasNext,
        pageRequest.offset, pageRequest.limit, chips)
    }
  }

  /** Delete a scene from the database
    *
    * @param thumbnailId UUID ID of scene to delete
    * @param user        Results will be limited to user's organization
    */
  def deleteChip(thumbnailId: UUID, user: User)
                     (implicit database: DB): Future[Int] = {

    val action = Chips
                   .filterToSharedOrganizationIfNotInRoot(user)
                   .filter(_.id === thumbnailId)
                   .delete
    logger.debug(s"Deleting thumbnail with: ${action.statements.headOption}")
    database.db.run {
      action.map {
        case 1 => 1
        case 0 => 0
        case c => throw new IllegalStateException(s"Error deleting thumbnail: update result expected to be 1, was $c")
      }
    }
  }

  /** Update a thumbnail in the database
    *
    * Allows updating the thumbnail from a user -- does not allow a user to update
    * createdBy or createdAt fields
    *
    * @param thumbnail Chip scene to use to update the database
    * @param thumbnailId UUID ID of scene to update
    */
  def updateChip(thumbnail: Chip, thumbnailId: UUID, user: User)
                     (implicit database: DB): Future[Int] = {

    val updateTime = new Timestamp((new java.util.Date).getTime)

    val updateChipQuery = for {
      updateChip <- Chips
                           .filterToSharedOrganizationIfNotInRoot(user)
                           .filter(_.id === thumbnailId)
    } yield (
      updateChip.modifiedAt, updateChip.x, updateChip.heightPx,
      updateChip.thumbnailSize, updateChip.scene, updateChip.url
    )
    database.db.run {
      updateChipQuery.update((
        updateTime, thumbnail.x, thumbnail.heightPx,
        thumbnail.thumbnailSize, thumbnail.sceneId, thumbnail.url
      )).map {
        case 1 => 1
        case c => throw new IllegalStateException(s"Error updating thumbnail: update result expected to be 1, was $c")
      }
    }
  }
}

class ChipDefaultQuery[M, U, C[_]](chips: Chips.TableQuery) {

  def filterBySceneParams(sceneParams: ChipQueryParameters): Chips.TableQuery = {
    chips.filter(_.scene === sceneParams.sceneId)
  }

  def page(pageRequest: PageRequest): Chips.TableQuery = {
    val sorted = chips.sort(pageRequest.sort)
    sorted.drop(pageRequest.offset * pageRequest.limit).take(pageRequest.limit)
  }
}
