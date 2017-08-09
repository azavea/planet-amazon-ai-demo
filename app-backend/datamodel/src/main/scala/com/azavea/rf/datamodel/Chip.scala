package com.azavea.rf.datamodel

import java.util.UUID

import com.azavea.rf.bridge._
import geotrellis.vector.Geometry
import geotrellis.slick.Projected

import io.circe._
import io.circe.generic.JsonCodec

@JsonCodec
case class SceneFilterFields(
  cloudCover: Option[Float] = None,
  sunAzimuth: Option[Float] = None,
  sunElevation: Option[Float] = None
)

object SceneFilterFields {
  def tupled = (SceneFilterFields.apply _).tupled

  type TupleType = (
    Option[Float],
    Option[Float],
    Option[Float]
  )
}

@JsonCodec
case class SceneStatusFields(
  thumbnailStatus: JobStatus,
  boundaryStatus: JobStatus,
  ingestStatus: IngestStatus
)

object SceneStatusFields {
  def tupled = (SceneStatusFields.apply _).tupled

  type TupleType = (
    JobStatus,
    JobStatus,
    IngestStatus
  )
}

@JsonCodec
case class Chip(
  id: UUID,
  ingestSizeBytes: Int, // needed?
  tileFootprint: Option[Projected[Geometry]] = None,
  dataFootprint: Option[Projected[Geometry]] = None,
  ingestLocation: Option[String] = None,
  filterFields: SceneFilterFields = new SceneFilterFields(),
  statusFields: SceneStatusFields
) {
  def toScene = this

  def withRelatedFromComponents(
    images: Seq[Image.WithRelated],
    thumbnails: Seq[Thumbnail]
  ): Scene.WithRelated = Scene.WithRelated(
    this.id,
    this.ingestSizeBytes, // needed?
    this.tileFootprint,
    this.dataFootprint,
    images,
    thumbnails,
    this.ingestLocation,
    this.filterFields,
    this.statusFields
  )
}


object Scene {
  /** Case class extracted from a POST request */
  @JsonCodec
  case class Create(
    id: Option[UUID],
    ingestSizeBytes: Int, // needed?
    tileFootprint: Option[Projected[Geometry]],
    dataFootprint: Option[Projected[Geometry]],
    images: List[Image.Banded],
    thumbnails: List[Thumbnail.Identified],
    ingestLocation: Option[String],
    filterFields: SceneFilterFields = new SceneFilterFields(),
    statusFields: SceneStatusFields
  ) {
    def toScene(user: User): Scene = {
      Scene(
        id.getOrElse(UUID.randomUUID),
        ingestSizeBytes, // needed?
        tileFootprint,
        dataFootprint,
        ingestLocation,
        filterFields,
        statusFields
      )
    }
  }

  @JsonCodec
  case class WithRelated(
    id: UUID,
    ingestSizeBytes: Int, // needed?
    tileFootprint: Option[Projected[Geometry]],
    dataFootprint: Option[Projected[Geometry]],
    images: Seq[Image.WithRelated],
    thumbnails: Seq[Thumbnail],
    ingestLocation: Option[String],
    filterFields: SceneFilterFields = new SceneFilterFields(),
    statusFields: SceneStatusFields
  ) {
    def toScene: Scene =
      Scene(
        id,
        ingestSizeBytes, // needed?
        tileFootprint,
        dataFootprint,
        ingestLocation,
        filterFields,
        statusFields
      )
    }

  object WithRelated {
    /** Helper function to create Iterable[Scene.WithRelated] from join
      *
      * It is necessary to map over the distinct scenes because that is the only way to
      * ensure that the sort order of the query result remains ordered after grouping
      *
      * @param records result of join query to return scene with related
      * information
      */
    @SuppressWarnings(Array("TraversableHead"))
    def fromRecords(records: Seq[(Scene, Option[Image], Option[Band], Option[Thumbnail])])
      : Iterable[Scene.WithRelated] = {
      val distinctScenes = records.map(_._1.id).distinct
      val groupedScenes = records.map(_._1).groupBy(_.id)
      val groupedRecords = records.groupBy(_._1.id)
      val groupedBands = records.flatMap(_._3).distinct.groupBy(_.image)

      distinctScenes.map { scene =>
        val (seqImages, seqThumbnails) = groupedRecords(scene).map {
          case (_, image, _, thumbnail) => (image, thumbnail)
        }.unzip
        val imagesWithComponents: Seq[Image.WithRelated] = seqImages.flatten.distinct.map {
          image => image.withRelatedFromComponents(groupedBands.getOrElse(image.id, Seq[Band]()))
        }
        groupedScenes.get(scene) match {
          case Some(scene) => scene.head.withRelatedFromComponents(
            imagesWithComponents, seqThumbnails.flatten.distinct
          )
          case _ => throw new Exception("This is impossible")
        }
      }
    }
  }
}
