package com.azavea.rf.datamodel

import java.util.UUID
import java.sql.Timestamp

import io.circe._
import io.circe.generic.JsonCodec

@JsonCodec
case class Chip(
  id: UUID,
  createdAt: Timestamp,
  modifiedAt: Timestamp,
  organizationId: UUID,
  widthPx: Int,
  heightPx: Int,
  sceneId: UUID,
  url: String,
  thumbnailSize: ThumbnailSize
) {
  def toChip = this
}

object Chip {
  def tupled = (Chip.apply _).tupled

  def create = Create.apply _

  def identified = Identified.apply _

  /** Chip class prior to ID assignment */
  @JsonCodec
  case class Create(
    organizationId: UUID,
    thumbnailSize: ThumbnailSize,
    widthPx: Int,
    heightPx: Int,
    sceneId: UUID,
    url: String
  ) {
    def toChip: Chip = {
      val now = new Timestamp((new java.util.Date).getTime)
      Chip(
        UUID.randomUUID, // primary key
        now, // created at,
        now, // modified at,
        organizationId,
        widthPx, // width in pixels
        heightPx, // height in pixels
        sceneId,
        url,
        thumbnailSize
      )
    }
  }

  /** Chip class when posted with an ID */
  @JsonCodec
  case class Identified(
    id: Option[UUID],
    organizationId: UUID,
    thumbnailSize: ThumbnailSize,
    widthPx: Int,
    heightPx: Int,
    sceneId: UUID,
    url: String
  ) {
    def toChip(userId: String): Chip = {
      val now = new Timestamp((new java.util.Date()).getTime())
      Chip(
        this.id.getOrElse(UUID.randomUUID), // primary key
        now, // createdAt
        now, // modifiedAt
        this.organizationId,
        this.widthPx,
        this.heightPx,
        this.sceneId,
        this.url,
        this.thumbnailSize
      )
    }
  }
}
