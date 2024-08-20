import logging
import uuid
from typing import List

from bson import ObjectId
from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException, Query
from starlette.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_500_INTERNAL_SERVER_ERROR

from api.base.authorization import get_current_user
from api.library.constant import CODE_SUCCESS, TYPE_MESSAGE_RESPONSE, CODE_ERROR_POST_CODE_NOT_FOUND, CODE_ERROR_INPUT, \
    CODE_ERROR_SERVER, CODE_ERROR_WHEN_UPDATE_CREATE_NOTI, CODE_ERROR_WHEN_UPDATE_CREATE_POST, \
    CODE_ERROR_USER_CODE_NOT_FOUND, CODE_ERROR_WHEN_DELETE_POST
from api.base.schema import SuccessResponse, FailResponse, ResponseStatus
from api.endpoint.post.schema import ResponsePost, ResponseCreateUpdatePost, ResponseLikePost, ResponseSharePost, \
    ResponseDeletePost, ResponseListPost, CreateSharePost, ResponseListSharePost
from api.third_parties.cloud.query import upload_image_cloud, delete_image, upload_video
from api.third_parties.database.model.notification import Notification
from api.third_parties.database.model.post import Post
from api.third_parties.database.query import post as post_query
from api.third_parties.database.query import user as user_query
from api.third_parties.database.query import comment as comment_query
from api.third_parties.database.query.notification import create_noti
from api.third_parties.database.query.post import get_post_by_id, get_post_by_post_code, update_like_post, \
    get_post_of_user_by_code
from api.third_parties.database.query.user import get_list_user_in_list
from api.third_parties.database.query.user_online import get_user_if_user_is_online
from api.third_parties.socket.socket import send_noti
from settings.init_project import open_api_standard_responses, http_exception

router = APIRouter()

logger = logging.getLogger("post.view.py")


@router.get(
    path="/post/user/{user_code}",
    name="get_all_post_of_user",
    description="get all posts of user",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseListPost],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def get_all_posts_of_user(user_code: str, user: dict = Depends(get_current_user),  last_post_ids: str = Query(default="")):
    code = message = status_code = ''

    try:
        if not user:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = "user not allow empty"
            raise HTTPException(status_code)
        list_post_cursor = await post_query.get_all_post_by_user_code(
            user_code=user_code,
            last_post_id=last_post_ids
        )

        list_post_cursor = await list_post_cursor.to_list(None)

        for post in list_post_cursor:

            post['root_post_info'] = None
            if "root_post" in post and post['root_post'] != "":
                post['root_post_info'] = await get_post_by_post_code(post['root_post'])
                if post['root_post_info']:
                    if post['root_post_info']['created_by']:
                        user_root_post_info = await user_query.get_user_by_code(post['root_post_info']['created_by'])
                        post['root_post_info']['created_by'] = user_root_post_info

            user_info = await user_query.get_user_by_code(post['created_by'])
            post['created_by'] = user_info
            post['liked_by'] = list(post['liked_by'])
            post['videos'] = str(post['videos'])
            post['video_ids'] = str(post['video_ids'])

        last_post_id = ObjectId("                        ")
        if list_post_cursor:
            last_post = list_post_cursor[-1]
            last_post_id = last_post['_id']

        response = {
            "data":
                {
                    "list_post_info": list_post_cursor,
                    "last_post_id": last_post_id
                },
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }
        # print(response)
        return SuccessResponse[ResponseListPost](**response)
    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )


@router.get(
    path="/post",
    name="get_all_post",
    description="get all posts",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseListPost],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def get_all_posts(user: dict = Depends(get_current_user), last_post_ids: str = Query(default="")):
    code = message = status_code = ''
    try:
        if not user:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            message = "user not allow empty"
            raise HTTPException(status_code)
        list_post_cursor = await post_query.get_all_post(
            user_code=user['user_code'],
            friends_code=user['friends_code'],
            last_post_id=last_post_ids
        )
        list_post_cursor = await list_post_cursor.to_list(None)

        for post in list_post_cursor:
            post['root_post_info'] = None
            if "root_post" in post and post['root_post']:
                post['root_post_info'] = await get_post_by_post_code(post['root_post'])
                if post['root_post_info']:
                    if post['root_post_info']['created_by']:
                        user_root_post_info = await user_query.get_user_by_code(post['root_post_info']['created_by'])
                        post['root_post_info']['created_by'] = user_root_post_info
            user_info = await user_query.get_user_by_code(post['created_by'])
            post['created_by'] = user_info
            post['liked_by'] = list(post['liked_by'])
            post['videos'] = str(post['videos'])
            post['video_ids'] = str(post['video_ids'])

        last_post_id = ObjectId("                        ")
        if list_post_cursor:
            last_post = list_post_cursor[-1]
            last_post_id = last_post['_id']

        response = {
            "data":
                {
                    "list_post_info": list_post_cursor,
                    "last_post_id": last_post_id
                },
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }
        return SuccessResponse[ResponseListPost](**response)
    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )

@router.get(
    path="/post/{post_code}",
    name="get_a_post",
    description="get information of a post",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponsePost],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def get_post(post_code: str):
    code = message = status_code = ''

    try:
        if not post_code:
            status_code = HTTP_400_BAD_REQUEST
            message = "post_code not allow empty"
            code = CODE_ERROR_INPUT
            raise HTTPException(status_code)

        post = await post_query.get_post_by_post_code(post_code)
        if not post:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_POST_CODE_NOT_FOUND
            raise HTTPException(status_code)

        response = {
            "data": post,
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }
        return SuccessResponse[ResponsePost](**response)

    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )


@router.post(
    path="/post",
    name="create_post",
    description="create post",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_201_CREATED,
        success_response_model=SuccessResponse[ResponseCreateUpdatePost],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def create_post(
        content: str = Form(""),
        images_upload: List[UploadFile] = File(None),
        video_upload: UploadFile = File(None),
        user: dict = Depends(get_current_user)
):
    code = message = status_code = ''

    try:
        if not user:
            status_code = HTTP_400_BAD_REQUEST
            message = "user not allow empty"
            code = CODE_ERROR_INPUT
            raise HTTPException(status_code)

        if not content and not images_upload and not video_upload:
            status_code = HTTP_400_BAD_REQUEST
            message = "content, image, video not allow empty"
            code = CODE_ERROR_INPUT
            raise HTTPException(status_code)

        if images_upload and len(images_upload) > 4:
            status_code = HTTP_400_BAD_REQUEST
            message = "Maximum image number is 4"
            code = CODE_ERROR_INPUT
            raise HTTPException(status_code)

        image_ids = []
        video_ids = ""
        videos = ""
        images = []

        if images_upload:
            for image in images_upload:
                data_image_byte = await image.read()
                info_image_upload = await upload_image_cloud(data_image_byte, user['user_code'])
                image_ids.append(info_image_upload['public_id'])
                images.append(info_image_upload['url'])

        if video_upload:
            data_video_byte = await video_upload.read()
            info_video_upload = await upload_video(data_video_byte, user['user_code'])
            video_ids += info_video_upload['public_id']
            videos += info_video_upload['url']

        post_data = Post(
            post_code=str(uuid.uuid4()),
            content=content,
            image_ids=image_ids,
            images=images,
            video_ids=video_ids,
            videos=videos,
            created_by=user['user_code']
        )

        new_post_id = await post_query.create_post(post_data)
        if not new_post_id:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_WHEN_UPDATE_CREATE_POST
            raise HTTPException(status_code)

        new_post = await get_post_by_id(new_post_id)
        if not new_post:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_POST_CODE_NOT_FOUND
            raise HTTPException(status_code)
        new_post['created_by'] = user

        response = {
            "data": new_post,
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }
        return SuccessResponse[ResponseCreateUpdatePost](**response)

    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )


@router.delete(
    path="/post/{post_code}",
    name="delete_post",
    description="delete post",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseDeletePost],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def delete_post(post_code: str):
    code = message = status_code = ''

    try:
        if not post_code:
            status_code = HTTP_400_BAD_REQUEST
            message = "post_code not allow empty"
            code = CODE_ERROR_INPUT
            raise HTTPException(status_code)
        post = await post_query.get_post_by_post_code(post_code)  # lấy thông tin bài viết
        if not post:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_POST_CODE_NOT_FOUND
            raise HTTPException(status_code)

        else:
            await comment_query.delete_comments_by_post(post_code)  # xóa tất cả comment của bài viết
            for image_id in post.get("image_ids", []):  # xóa tất cả ảnh của bài viết
                await delete_image(image_id)
            for video_id in post.get("video_id", ""):  # xóa tất cả video của bài viết
                await delete_image(video_id)
        deleted = await post_query.delete_post(post_code) # xóa bài viết
        if not deleted:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_WHEN_DELETE_POST
            raise HTTPException(status_code)

        return SuccessResponse[ResponseDeletePost](**{
            "data": {"message": "delete post success"},
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
    path="/post/{post_code}",
    name="update_post",
    description="update post",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseCreateUpdatePost],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def update_post(
        post_code: str,
        content: str = Form(""),
        images_upload: List[UploadFile] = File(None),
        video_upload: UploadFile = File(None),
        user: dict = Depends(get_current_user)

):
    code = message = status_code = ''

    try:
        if not user:
            status_code = HTTP_400_BAD_REQUEST
            message = "user not allow empty"
            code = CODE_ERROR_INPUT
            raise HTTPException(status_code)
        if not post_code:
            status_code = HTTP_400_BAD_REQUEST
            message = 'post_code not allow empty'
            code = CODE_ERROR_INPUT
            raise HTTPException(status_code)
        if not content and not images_upload and not video_upload:
            status_code = HTTP_400_BAD_REQUEST
            message = "content, image, video not allow empty"
            code = CODE_ERROR_INPUT
            raise HTTPException(status_code)

        image_ids = []
        video_ids = ""
        videos = ""
        images = []

        post_need_update = await get_post_by_post_code(post_code)
        if not post_need_update:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_POST_CODE_NOT_FOUND
            raise HTTPException(status_code)

        list_image_need_delete_incloud = post_need_update['image_ids']
        list_video_need_delete_incloud = post_need_update['video_ids']
        if images_upload:
            for image in images_upload:
                data_image_byte = await image.read()
                info_image_upload = await upload_image_cloud(data_image_byte, user['user_code'])
                image_ids.append(info_image_upload['public_id'])
                images.append(info_image_upload['url'])
            post_need_update['images'] = images
            post_need_update['image_ids'] = image_ids
            for image_id in list_image_need_delete_incloud:
                print(image_id)
                await delete_image(image_id)

        if video_upload:
            data_video_byte = await video_upload.read()
            info_video_upload = await upload_video(data_video_byte, user['user_code'])
            video_ids += info_video_upload['public_id']
            videos += info_video_upload['url']
            post_need_update['videos'] = videos
            post_need_update['video_ids'] = video_ids
            for video_id in list_video_need_delete_incloud:
                print(video_id)
                await delete_image(video_id)

        if content:
            post_need_update['content'] = content

        post_update = await post_query.update_post(post_code, post_need_update)
        if not post_update:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_WHEN_UPDATE_CREATE_POST
            raise HTTPException(status_code)

        post_update['created_by'] = user

        response = {
            "data": post_update,
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }
        return SuccessResponse[ResponseCreateUpdatePost](**response)

    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )


@router.post(
    path="/post/{post_code}/like",
    name="like_post",
    description="like post",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseLikePost],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def like_post(post_code: str, user: dict = Depends(get_current_user)):
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
            message = 'post_code not allow empty'
            raise HTTPException(status_code)

        post = await get_post_by_post_code(post_code)
        if not post:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_POST_CODE_NOT_FOUND
            raise HTTPException(status_code)
        if user['user_code'] in post['liked_by']:
            new_post_like_info = await update_like_post(post['post_code'], user['user_code'], False)
            status = False
        else:
            status = True
            new_post_like_info = await update_like_post(post['post_code'], user['user_code'], True)
            if user['user_code'] != post['created_by']:
                notification = Notification(
                    notification_code=str(uuid.uuid4()),
                    user_code=post['created_by'],
                    user_code_guest=user['user_code'],
                    content=f"đã thích bài viết của bạn",
                )
                new_noti = await create_noti(notification)
                if not new_noti:
                    logger.error(TYPE_MESSAGE_RESPONSE[CODE_ERROR_WHEN_UPDATE_CREATE_NOTI])

                else:
                    get_other_user_if_online = await get_user_if_user_is_online(post['created_by'])
                    if get_other_user_if_online:
                        await send_noti(f"{user['fullname']} đã thích bài viết của bạn",
                                        get_other_user_if_online['socket_id'])

        list_liked_by = []
        # if len(new_post_like_info['liked_by']) >= 3:
        for index, user_code in enumerate(new_post_like_info['liked_by'][::-1]):
            if user_code != post['created_by'] and len(list_liked_by) < 4:
                list_liked_by.append(user_code)

        list_user = await get_list_user_in_list(list_user_code=list_liked_by)
        list_user = await list_user.to_list(None)
        response = {
            "data": {
                "status": status,
                "like_number": len(new_post_like_info['liked_by']),
                "liked_by": list_user
            },
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }
        return SuccessResponse[ResponseLikePost](**response)
    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )


@router.post(
    path="/post/{post_code}/share",
    name="share_post",
    description="like post",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseSharePost],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def create_share_post(post_code: str, createSharePost: CreateSharePost,  user: dict = Depends(get_current_user)):
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
            message = 'post_code not allow empty'
            raise HTTPException(status_code)
        post = await get_post_by_post_code(post_code)
        if not post:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_POST_CODE_NOT_FOUND
            raise HTTPException(status_code)
        # nếu bài viết là bài đã được share lại của người khác thì nhâ share sẽ share bài gốc
        # B SHARE A, C SHARE BÀI MÀ B ĐÃ SHARE CỦA A => BÀI GỐC LÀ A
        post_exist = await get_post_of_user_by_code(user['user_code'], post_code)

        if post_exist:
            message = "Bạn đã share bài viết này"
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_INPUT
            raise HTTPException(status_code)
        post_data = Post(
            post_code=str(uuid.uuid4()),
            content=createSharePost.content,
            image_ids=[],
            images=[],
            video_ids="",
            videos="",
            root_post=post['post_code'] if post['root_post'] == "" else post['root_post'],
            created_by=user['user_code'],
            user_root_post=post['created_by']
        )
        new_share_post = await post_query.create_post(post_data)
        if new_share_post:
            if user['user_code'] != post['created_by']:
                notification = Notification(
                    notification_code=str(uuid.uuid4()),
                    user_code=post['created_by'],
                    user_code_guest=user['user_code'],
                    content=f"đã chia sẻ bài viết của bạn",
                )
                new_noti = await create_noti(notification)
                if not new_noti:
                    logger.error(TYPE_MESSAGE_RESPONSE[CODE_ERROR_WHEN_UPDATE_CREATE_NOTI])

                else:
                    get_other_user_if_online = await get_user_if_user_is_online(post['created_by'])
                    if get_other_user_if_online:
                        await send_noti(f"{user['fullname']} đã chia sẻ bài viết của bạn",
                                        get_other_user_if_online['socket_id'])
        response = {
            "data": {
                "message": "Bài viết đã được chia sẻ trên trang cá nhân của bạn"
            },
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }

        return SuccessResponse[ResponseSharePost](**response),

    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )
