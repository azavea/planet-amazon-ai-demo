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
  x: Int,
  y: Int,
  z: Int,
  sceneId: UUID,
  url: String,
  labelProbabilities: Json
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
    x: Int,
    y: Int,
    z: Int,
    sceneId: UUID,
    url: String,
    labelProbabilities: Json
  ) {
    def toChip: Chip = {
      val now = new Timestamp((new java.util.Date).getTime)
      Chip(
        UUID.randomUUID, // primary key
        now, // created at,
        now, // modified at,
        organizationId,
        x, // x in tile server
        y, // y in tile server
        z, // z in tile server
        sceneId,
        url,
        labelProbabilities
      )
    }
  }

  /** Chip class when posted with an ID */
  @JsonCodec
  case class Identified(
    id: Option[UUID],
    organizationId: UUID,
    x: Int,
    y: Int,
    z: Int,
    sceneId: UUID,
    url: String,
    labelProbabilities: Json
  ) {
    def toChip(userId: String): Chip = {
      val now = new Timestamp((new java.util.Date()).getTime())
      Chip(
        this.id.getOrElse(UUID.randomUUID), // primary key
        now, // createdAt
        now, // modifiedAt
        this.organizationId,
        this.x,
        this.y,
        this.z,
        this.sceneId,
        this.url,
        this.labelProbabilities
      )
    }
  }
}
