
import logging

from bson import ObjectId
from fastapi import APIRouter, Depends, Query, HTTPException
from starlette.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR

from api.base.schema import SuccessResponse, FailResponse, ResponseStatus


from api.endpoint.notification.schema import (ResponseNotification, ResponseListNotification,
                                              ResponseNumberNotification, ResponseDeleteNotification)
from api.library.constant import (CODE_SUCCESS, TYPE_MESSAGE_RESPONSE, CODE_ERROR_NOTIFICATION_CODE_NOT_FOUND,
                                  CODE_ERROR_SERVER, CODE_ERROR_WHEN_UPDATE_CREATE_NOTI, CODE_ERROR_USER_CODE_NOT_FOUND,
                                  CODE_ERROR_WHEN_DELETE_NOTIFICATION, CODE_ERROR_INPUT)


from api.third_parties.database.query import notification as query_notification
from api.third_parties.database.query.user import get_user_by_code
from settings.init_project import open_api_standard_responses, http_exception
from api.base.authorization import get_current_user

logger = logging.getLogger("notification.view.py")
router = APIRouter()


@router.get(
    path="/notification",
    name="get_all_notification",
    description="get all notification",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseListNotification],
        fail_response_model=FailResponse[ResponseStatus]
    )

)
async def get_notification(user: dict = Depends(get_current_user), last_notification_id: str = Query(default="")):
    code = message = status_code = ''
    try:
        if not user:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = 'user_code not allow empty'
            raise HTTPException(status_code)
        notifications = await query_notification.get_notifications(
            user_code=user['user_code'],
            last_notification_id=last_notification_id
        )
        list_notifications_cursor = await notifications.to_list(None)

        for noti in list_notifications_cursor:
            user_guest = await get_user_by_code(noti['user_code_guest'])
            noti["user_info"] = user
            noti["user_guest_info"] = user_guest
        last_noti_id = ObjectId("                        ")
        if list_notifications_cursor:
            last_noti = list_notifications_cursor[-1]
            last_noti_id = last_noti['_id']

        response = {
            "data": {
                "list_noti_info": list_notifications_cursor,
                "last_noti_id": last_noti_id

            },
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }

        return SuccessResponse[ResponseListNotification](**response)
    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )


@router.delete(
    path="/notifications/{notification_code}",
    name="delete_notification",
    description="delete a notification",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseDeleteNotification],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def delete_notification(notification_code: str, user: dict = Depends(get_current_user)):
    code = message = status_code = ''

    try:
        if not user:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = 'user_code not allow empty'
            raise HTTPException(status_code)
        if not notification_code:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = 'notification_code not allow empty'
            raise HTTPException(status_code)

        deleted = await query_notification.delete_notification(
            notification_code,
            user['user_code']
        )
        if not deleted:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_WHEN_DELETE_NOTIFICATION
            raise HTTPException(status_code)

        return SuccessResponse[ResponseDeleteNotification](**{
            "data": {"message": "thông báo đã được ẩn đi"},
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        })
    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )

@router.put(
    path="/notifications/{notification_code}",
    name="update_notification",
    description="update a notification",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseNotification],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def update_notification(notification_code: str, user: dict = Depends(get_current_user)):
    code = message = status_code = ''

    try:
        if not user:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = 'user_code not allow empty'
            raise HTTPException(status_code)
        if not notification_code:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = 'notification_code not allow empty'
            raise HTTPException(status_code)

        updated = await query_notification.update_notification(
            notification_code,
            user['user_code']
        )
        if not updated:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_WHEN_UPDATE_CREATE_NOTI
            raise HTTPException(status_code)

        response = {
            "data": updated,
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }

        return SuccessResponse[ResponseNotification](**response)
    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )

@router.get(
    path="/number-notification",
    name="get_number_notification",
    description="get all number of notification which user not read",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseNumberNotification],
        fail_response_model=FailResponse[ResponseStatus]
    )

)
async def get_number_notification(user: dict = Depends(get_current_user)):
    try:
        notifications = await query_notification.get_noti_not_read(user_code=user['user_code'])
        list_notifications_cursor = await notifications.to_list(None)
        count = 0

        for noti in list_notifications_cursor:
            if noti['is_checked'] is False:
                count += 1

        response = {
            "data": {
                "number_noti_not_read": str(count)

            },
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }
        return SuccessResponse[ResponseNumberNotification](**response)
    except:
        logger.error(exc_info=True)
        return http_exception(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            code=CODE_ERROR_SERVER,
        )
