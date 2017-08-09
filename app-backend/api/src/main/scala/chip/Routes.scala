package com.azavea.rf.api.chip

import com.azavea.rf.common.{UserErrorHandler, Authentication, S3, CommonHandlers}
import com.azavea.rf.database.tables.Chips
import com.azavea.rf.database.Database
import com.azavea.rf.datamodel._
import com.azavea.rf.api.utils.Config

import akka.http.scaladsl.server.Route
import akka.http.scaladsl.model.{StatusCodes, ContentType, HttpEntity, HttpResponse, MediaType, MediaTypes}
import com.lonelyplanet.akka.http.extensions.PaginationDirectives
import de.heikoseeberger.akkahttpcirce.CirceSupport._
import kamon.akka.http.KamonTraceDirectives

import java.util.UUID
import java.net.URI

trait ChipRoutes extends Authentication
    with ChipQueryParameterDirective
    with PaginationDirectives
    with CommonHandlers
    with UserErrorHandler
    with Config
    with KamonTraceDirectives {

  implicit def database: Database

  val chipRoutes: Route = handleExceptions(userExceptionHandler) {
    pathEndOrSingleSlash {
      get { listChips } ~
      post {
        traceName("chips-list") {
          createChip
        }
      }
    } ~
    pathPrefix(JavaUUID) { chipId =>
      pathEndOrSingleSlash {
        get { traceName("chips-detail") {
          getChip(chipId) }
        } ~
        put { updateChip(chipId) } ~
        delete { deleteChip(chipId) }
      }
    } ~
    pathPrefix(Segment) { chipPath =>
      pathEndOrSingleSlash {
        get { getChipImage(chipPath) }
      }
    }
  }

  val chipImageRoutes: Route = handleExceptions(userExceptionHandler) {
    pathPrefix(Segment) { chipPath =>
      pathEndOrSingleSlash {
        get { getChipImage(chipPath) }
      }
    }
  }

  def listChips: Route = {
    (withPagination & chipSpecificQueryParameters) { (page, chipParams) =>
      complete {
        Chips.listChips(page, chipParams)
      }
    }
  }

  def createChip: Route = authenticate { user =>
    entity(as[Chip.Create]) { newChip =>
      authorize(user.isInRootOrSameOrganizationAs(newChip)) {
        onSuccess(Chips.insertChip(newChip.toChip)) { chip =>
          complete(StatusCodes.Created, chip)
        }
      }
    }
  }

  def getChip(chipId: UUID): Route = authenticate { user =>
    withPagination { page =>
      rejectEmptyResponse {
        complete {
          Chips.getChip(chipId, user)
        }
      }
    }
  }

  def getChipImage(chipPath: String): Route = validateTokenParameter { token =>
    var uriString = s"http://s3.amazonaws.com/${chipBucket}/${chipPath}"
    val uri = new URI(uriString)
    val s3Object = S3.getObject(uri)
    val metaData = S3.getObjectMetadata(s3Object)
    val s3MediaType = MediaType.parse(metaData.getContentType()) match {
      case Right(m) => m.asInstanceOf[MediaType.Binary]
      case Left(_) => MediaTypes.`image/png`
    }
    complete(HttpResponse(entity =
      HttpEntity(ContentType(s3MediaType), S3.getObjectBytes(s3Object))
    ))
  }

  def updateChip(chipId: UUID): Route = authenticate { user =>
    entity(as[Chip]) { updatedChip =>
      authorize(user.isInRootOrSameOrganizationAs(updatedChip)) {
        onSuccess(Chips.updateChip(updatedChip, chipId, user)) {
          completeSingleOrNotFound
        }
      }
    }
  }

  def deleteChip(chipId: UUID): Route = authenticate { user =>
    onSuccess(Chips.deleteChip(chipId, user)) {
      completeSingleOrNotFound
    }
  }
}
