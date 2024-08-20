import uuid
import logging
from typing import List

from bson import ObjectId
from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException, Query
from starlette.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_500_INTERNAL_SERVER_ERROR
from api.base.authorization import get_current_user
from api.base.schema import SuccessResponse, FailResponse, ResponseStatus
from api.endpoint.comment.schema import ResponseComment, ResponseCreateUpdateComment, ResponseDeleteComment, \
    ResponseListComment
from api.library.constant import CODE_SUCCESS, TYPE_MESSAGE_RESPONSE, CODE_ERROR_COMMENT_CODE_NOT_FOUND, \
    CODE_ERROR_INPUT, CODE_ERROR_SERVER, CODE_ERROR_WHEN_UPDATE_CREATE_NOTI, CODE_ERROR_POST_CODE_NOT_FOUND, \
    CODE_ERROR_WHEN_UPDATE_CREATE_COMMENT, CODE_ERROR_WHEN_DELETE_COMMENT, CODE_ERROR_WHEN_PUSH_COMMENT, EVENT_COMMENT
from api.third_parties.cloud.query import upload_image_comment_cloud, delete_image
from api.third_parties.database.query import comment as comment_query
from api.third_parties.database.query import post as post_query
from api.third_parties.database.query import user as user_query
from api.third_parties.database.query.user_online import get_user_if_user_is_online
from api.third_parties.socket.socket import send_noti, send_mess_room
from settings.init_project import open_api_standard_responses, http_exception
from api.third_parties.database.model.comment import Comment
from api.third_parties.database.query import notification as notification_query
from api.third_parties.database.model.notification import Notification
from fastapi.encoders import jsonable_encoder
logger = logging.getLogger("comment.view.py")
router = APIRouter()


@router.get(
    path="/post/{post_code}/comments",
    name="get_all_comment",
    description="get all comment of post",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseListComment],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def get_all_comment(post_code: str, last_comment_ids: str = Query(default="")):
    code = message = status_code = ''

    try:
        if not post_code:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = "post_code not allow empty"
            raise HTTPException(status_code)

        list_comment_cursor = await comment_query.get_all_comment_by_post_code(
            post_code=post_code,
            last_comment_id=last_comment_ids
        )
        list_comment_cursor = await list_comment_cursor.to_list(None)

        for comment in list_comment_cursor:
            user = await user_query.get_user_by_code(comment['created_by'])
            comment['created_by'] = user

        last_comment_id = ObjectId(
            "                        ")  # 24-character hex string để mặc đinh nếu kO pyobjetc sẽ ko parse được
        if list_comment_cursor:
            last_comment = list_comment_cursor[-1]
            last_comment_id = last_comment['_id']

        response = {
            "data":
                {
                    "list_comment_info": list_comment_cursor,
                    "last_comment_id": last_comment_id
                },
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }
        return SuccessResponse[ResponseListComment](**response)
    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )


@router.post(
    path="/post/{post_code}/comment",
    name="create_comment",
    description="create a comment",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_201_CREATED,
        success_response_model=SuccessResponse[ResponseComment],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def create_comment(
        post_code: str,
        content: str = Form(""),
        user: dict = Depends(get_current_user),
        image_upload: UploadFile = File(None)
):
    status_code = code = message = ""

    try:
        if not user:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = "user not allow empty"
            raise HTTPException(status_code)
        if not post_code:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = "post_code not allow empty"
            raise HTTPException(status_code)
        if not content and not image_upload:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = "content or image_upload not allow empty"
            raise HTTPException(status_code)

        image_id = ""
        image = ""

        if image_upload:
            data_image_byte = await image_upload.read()
            info_image_upload = await upload_image_comment_cloud(data_image_byte, user['user_code'])
            image_id += info_image_upload['public_id']
            image += info_image_upload['url']

        comment_data = Comment(
            comment_code=str(uuid.uuid4()),
            content=content,
            created_by=user['user_code'],
            image_id=image_id,
            image=image,
            post_code=post_code
        )
        new_comment_id = await comment_query.create_comment(comment_data)
        if not new_comment_id:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_WHEN_UPDATE_CREATE_COMMENT
            raise HTTPException(status_code)
        new_comment = await comment_query.get_comment_by_id(new_comment_id)

        if not new_comment:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_COMMENT_CODE_NOT_FOUND
            raise HTTPException(status_code)
        new_comment['created_by'] = user if user else None
        # đẩy comment vào post
        ## hiện tại ko can công đoạn này nữa
        # print(post_code, new_comment['comment_code'])
        # push_comment = await post_query.push_comment_to_post(post_code, new_comment['comment_code'])
        # print(push_comment)
        # if not push_comment:
        #     status_code = HTTP_400_BAD_REQUEST
        #     code = CODE_ERROR_WHEN_PUSH_COMMENT
        #     raise HTTPException(status_code)

        # Lấy thông tin bài viết
        post = await post_query.get_post_by_post_code(post_code)
        if not post:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_POST_CODE_NOT_FOUND
            raise HTTPException(status_code)

        # Kiểm tra xem có phải chủ bài viết comment hay không
        get_other_user_if_online = None
        if user['user_code'] != post['created_by']:
            notification = Notification(
                notification_code=str(uuid.uuid4()),
                user_code=post['created_by'],
                user_code_guest=user['user_code'],
                content=f" đã bình luận bài viết của bạn"
            )  # Tạo thông báo
            new_noti = await notification_query.create_noti(notification)
            if not new_noti:
                status_code = HTTP_400_BAD_REQUEST
                code = CODE_ERROR_WHEN_UPDATE_CREATE_NOTI
                raise HTTPException(status_code)
            # # Gửi socket notification (nếu online)
            else:
                get_other_user_if_online = await get_user_if_user_is_online(post['created_by'])
                if get_other_user_if_online:
                    await send_noti(f"{user['fullname']} đã bình luận bài viết của bạn",
                                    get_other_user_if_online['socket_id'])

        # new_comment["_id"] = str(new_comment["_id"])
        response = {
            "data": new_comment,
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }
        await send_mess_room(event=EVENT_COMMENT,data=jsonable_encoder(SuccessResponse[ResponseComment](**response)), room=post['post_code'])

        return SuccessResponse[ResponseComment](**response)

    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )


@router.delete(
    path="/post/{post_code}/comment/{comment_code}",
    name="delete_comment",
    description="delete comment",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_201_CREATED,
        success_response_model=SuccessResponse[ResponseDeleteComment],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def delete_comment(comment_code: str):
    code = message = status_code = ''
    try:
        if not comment_code:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = "comment_code not allow empty"
            raise HTTPException(status_code)

        comment = await comment_query.get_comment_by_comment_code(comment_code)
        if not comment:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_COMMENT_CODE_NOT_FOUND
            raise HTTPException(status_code)
        else:
            for image_id in comment.get("image_id", []):
                await delete_image(image_id)

        deleted = await comment_query.delete_comment(comment_code)
        if not deleted:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_WHEN_DELETE_COMMENT
            raise HTTPException(status_code)

        return SuccessResponse[ResponseDeleteComment](**{
            "data": {"message": "delete comment success"},
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
    path="/post/{post_code}/comment/{comment_code}",
    name="update_comment",
    description="update comment",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_201_CREATED,
        success_response_model=SuccessResponse[ResponseCreateUpdateComment],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def update_comment(
        comment_code: str,
        content: str = Form(""),
        user: dict = Depends(get_current_user),
        image_upload: UploadFile = File(None)

):
    code = message = status_code = ''
    try:
        if not user:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = "user not allow empty"
            raise HTTPException(status_code)
        if not comment_code:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = "comment_code not allow empty"
            raise HTTPException(status_code)
        if not content and not image_upload:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = "content or image_upload not allow empty"
            raise HTTPException(status_code)
        image_id = ""
        image = ""

        comment_update = await comment_query.get_comment_by_comment_code(comment_code)
        if not comment_update:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_COMMENT_CODE_NOT_FOUND
            raise HTTPException(status_code)

        list_image_need_delete_in_cloud = comment_update['image_id']

        if image_upload:
            data_image_byte = await image_upload.read()
            info_image_upload = await upload_image_comment_cloud(data_image_byte, user['user_code'])
            image_id += info_image_upload['public_id']
            image += info_image_upload['url']
            comment_update['image_id'] = image_id
            comment_update['image'] = image
            for image_ids in list_image_need_delete_in_cloud:
                await delete_image(image_ids)

        if content:
            comment_update['content'] = content

        new_comment = await comment_query.update_comment(comment_code, comment_update)
        if not new_comment:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_WHEN_UPDATE_CREATE_COMMENT
            raise HTTPException(status_code)

        new_comment['created_by'] = user

        response = {
            "data": new_comment,
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }

        return SuccessResponse[ResponseCreateUpdateComment](**response)
    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )
