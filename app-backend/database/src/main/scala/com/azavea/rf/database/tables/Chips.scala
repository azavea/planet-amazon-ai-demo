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
  val id: Rep[java.util.UUID] = column[java.util.UUID]("id", O.PrimaryKey)
  val createdAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("created_at")
  val modifiedAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("modified_at")
  val organizationId: Rep[java.util.UUID] = column[java.util.UUID]("organization_id")
  val visibility: Rep[Visibility] = column[Visibility]("visibility")
  val x: Rep[Int] = column[Int]("x")
  val y: Rep[Int] = column[Int]("y")
  val scene: Rep[java.util.UUID] = column[java.util.UUID]("scene")
  val url: Rep[String] = column[String]("url", O.Length(255,varying=true))
  val agriculture: Rep[Float] = column[Float]("agriculture")
  val artisinalMine: Rep[Float] = column[Float]("artisinal_mine")
  val bareGround: Rep[Float] = column[Float]("bare_ground")
  val blooming: Rep[Float] = column[Float]("blooming")
  val blowDown: Rep[Float] = column[Float]("blow_down")
  val clear: Rep[Float] = column[Float]("clear")
  val cloudy: Rep[Float] = column[Float]("cloudy")
  val conventionalMine: Rep[Float] = column[Float]("conventional_mine")
  val cultivation: Rep[Float] = column[Float]("cultivation")
  val habitation: Rep[Float] = column[Float]("habitation")
  val haze: Rep[Float] = column[Float]("haze")
  val partlyCloudy: Rep[Float] = column[Float]("partly_cloudy")
  val primary: Rep[Float] = column[Float]("primary")
  val road: Rep[Float] = column[Float]("road")
  val selectiveLogging: Rep[Float] = column[Float]("selective_logging")
  val slashBurn: Rep[Float] = column[Float]("slash_burn")
  val water: Rep[Float] = column[Float]("water")

  /** Foreign key referencing Organizations (database name chips_organization_id_fkey) */
  lazy val organizationsFk = foreignKey("chips_organization_id_fkey", organizationId, Organizations)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  /** Foreign key referencing Scenes (database name chips_scene_fkey) */
  lazy val scenesFk = foreignKey("chips_scene_fkey", scene, Scenes)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)

  type ChipTupleType = (
    UUID,
    java.sql.Timestamp,
    java.sql.Timestamp,
    UUID,
    Int,
    Int,
    UUID,
    String,
    ChipLabelProbabilities.TupleType
  )

  def toModel: ChipTupleType => Chip = { chipTuple =>
    Chip(
      chipTuple._1, // id
      chipTuple._2, // createdAt
      chipTuple._3, // modifiedAt
      chipTuple._4, // organizationId
      chipTuple._5, // x
      chipTuple._6, // y
      chipTuple._7, // sceneId
      chipTuple._8, // url
      ChipLabelProbabilities.tupled.apply(chipTuple._9) // labelProbabilities
    )
  }

  @SuppressWarnings(Array("OptionGet"))
  def toTuple: Chip => Option[ChipTupleType] = { chip =>
    Some {
      (
        chip.id,
        chip.createdAt,
        chip.modifiedAt,
        chip.organizationId,
        chip.x,
        chip.y,
        chip.sceneId,
        chip.url,
        // scalastyle:off
        ChipLabelProbabilities.unapply(chip.labelProbabilities).get
        // scalastyle:on
      )
    }
  }

  val chipShapedValue = (
    id,
    createdAt,
    modifiedAt,
    organizationId,
    x,
    y,
    scene,
    url,
    (agriculture, artisinalMine, bareGround, blooming, blowDown, clear, cloudy, conventionalMine, cultivation, habitation, haze, partlyCloudy, primary, road, selectiveLogging, slashBurn, water)
  ).shaped[ChipTupleType]

  def * = chipShapedValue <> (toModel, toTuple)

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

  /** Insert a chip into the database
    *
    * @param chip Chip
    */
  def insertChip(chip: Chip)
                     (implicit database: DB): Future[Chip] = {

    val action = Chips.forceInsert(chip)
    logger.debug(s"Inserting chip with: ${action.statements.headOption}")
    database.db.run {
      action.map( _ => chip)
    }
  }

  /** Retrieve a single chip from the database
    *
    * @param chipId UUID ID Of chip to query with
    * @param user        Results will be limited to user's organization
    */
  def getChip(chipId: UUID, user: User)
                  (implicit database: DB): Future[Option[Chip]] = {

    val action = Chips
                   .filterToSharedOrganizationIfNotInRoot(user)
                   .filter(_.id === chipId)
                   .result
    logger.debug(s"Retrieving chip with: ${action.statements.headOption}")
    database.db.run {
      action.headOption
    }
  }

  def listChips(pageRequest: PageRequest, queryParams: ChipQueryParameters)
                    (implicit database: DB): Future[PaginatedResponse[Chip]] = {

    val chips = Chips.filterBySceneParams(queryParams)

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
    * @param chipId UUID ID of scene to delete
    * @param user        Results will be limited to user's organization
    */
  def deleteChip(chipId: UUID, user: User)
                     (implicit database: DB): Future[Int] = {

    val action = Chips
                   .filterToSharedOrganizationIfNotInRoot(user)
                   .filter(_.id === chipId)
                   .delete
    logger.debug(s"Deleting chip with: ${action.statements.headOption}")
    database.db.run {
      action.map {
        case 1 => 1
        case 0 => 0
        case c => throw new IllegalStateException(s"Error deleting chip: update result expected to be 1, was $c")
      }
    }
  }

  /** Update a chip in the database
    *
    * Allows updating the chip from a user -- does not allow a user to update
    * createdBy or createdAt fields
    *
    * @param chip Chip scene to use to update the database
    * @param chipId UUID ID of scene to update
    */
  def updateChip(chip: Chip, chipId: UUID, user: User)
                     (implicit database: DB): Future[Int] = {

    val updateTime = new Timestamp((new java.util.Date).getTime)

    val updateChipQuery = for {
      updateChip <- Chips
                           .filterToSharedOrganizationIfNotInRoot(user)
                           .filter(_.id === chipId)
    } yield (
      updateChip.modifiedAt, updateChip.x, updateChip.y, updateChip.scene, updateChip.url,
      updateChip.agriculture, updateChip.artisinalMine, updateChip.bareGround,
      updateChip.blooming, updateChip.blowDown, updateChip.clear,
      updateChip.cloudy, updateChip.conventionalMine, updateChip.cultivation,
      updateChip.habitation, updateChip.haze, updateChip.partlyCloudy,
      updateChip.primary, updateChip.road, updateChip.selectiveLogging,
      updateChip.slashBurn, updateChip.water
    )
    database.db.run {
      updateChipQuery.update((
        updateTime, chip.x, chip.y, chip.sceneId, chip.url,
        chip.labelProbabilities.agriculture, chip.labelProbabilities.artisinalMine, chip.labelProbabilities.bareGround,
        chip.labelProbabilities.blooming, chip.labelProbabilities.blowDown, chip.labelProbabilities.clear,
        chip.labelProbabilities.cloudy, chip.labelProbabilities.conventionalMine, chip.labelProbabilities.cultivation,
        chip.labelProbabilities.habitation, chip.labelProbabilities.haze, chip.labelProbabilities.partlyCloudy,
        chip.labelProbabilities.primary, chip.labelProbabilities.road, chip.labelProbabilities.selectiveLogging,
        chip.labelProbabilities.slashBurn, chip.labelProbabilities.water
      )).map {
        case 1 => 1
        case c => throw new IllegalStateException(s"Error updating chip: update result expected to be 1, was $c")
      }
    }
  }
}

class ChipDefaultQuery[M, U, C[_]](chips: Chips.TableQuery) {

  def filterBySceneParams(chipParams: ChipQueryParameters): Chips.TableQuery = {
    chips
      .filter(_.x === chipParams.x)
      .filter(_.y === chipParams.y)
      .filter(_.scene === chipParams.sceneId)
  }

  def page(pageRequest: PageRequest): Chips.TableQuery = {
    val sorted = chips.sort(pageRequest.sort)
    sorted.drop(pageRequest.offset * pageRequest.limit).take(pageRequest.limit)
  }
}
