package com.azavea.rf.api.chip

import java.util.UUID
import java.sql.Timestamp
import java.time.Instant

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.{Directive1, Rejection}
import akka.http.scaladsl.server.directives.ParameterDirectives.parameters
import com.azavea.rf.database.query.ChipQueryParameters

import com.azavea.rf.api.utils.queryparams._

trait ChipQueryParameterDirective extends QueryParametersCommon {

  val chipSpecificQueryParameters = parameters(
    'x.as[Int].?,
    'y.as[Int].?,
    'sceneId.as[UUID].?,
    'filters.as[Json].?
  ).as(ChipQueryParameters.apply _)
}
