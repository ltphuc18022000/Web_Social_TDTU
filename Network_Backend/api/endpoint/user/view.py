from typing import List, Optional

from fastapi import APIRouter, Depends, Form, UploadFile, Query
from starlette.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from api.base.authorization import get_current_user
from api.base.schema import SuccessResponse, FailResponse, ResponseStatus
from api.endpoint.user.schema import ResponseUser, ResponseUserProfile

from api.library.constant import CODE_SUCCESS, TYPE_MESSAGE_RESPONSE, CODE_ERROR_USER_CODE_NOT_FOUND, \
    CODE_ERROR_CANT_CHANGE_INFO, CODE_ERROR_WHEN_UPDATE_CREATE
from api.library.function import check_friend_or_not_in_profile, get_password_hash
from api.third_parties.cloud.query import upload_image_cloud
from api.third_parties.database.query.user import get_user_by_code, regex_user_name_email, update_user, create_new_user

from settings.init_project import open_api_standard_responses, http_exception

router = APIRouter()


@router.get(
    path="/user/find-user",
    name="find_user",
    description="find user",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[List[ResponseUserProfile]],
        fail_response_model=FailResponse[ResponseStatus]
    )

)
async def find_friend(name_or_email: str = Query(default=""), user: dict = Depends(get_current_user)):

    list_data = []
    if name_or_email:
        list_data = await regex_user_name_email(name_or_email)
        for data in list_data:
            if data['user_code'] == user['user_code']:
                # nếu là người dùng hiện tại thì không kiểm tra bạn bè
                data['is_current_login_user'] = True
            else:
                data['is_current_login_user'] = False
                # chỉ kiêm tra bạn bè nếu vào profile người khác, ko kiểm tra nếu trang đó là của cá nhận
                data['friend_status'] = await check_friend_or_not_in_profile(user['user_code'], data['user_code'], user['friends_code'])
    response = {
        'data': list_data,
        "response_status": {
            "code": CODE_SUCCESS,
            "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
        }
    }
    return SuccessResponse[List[ResponseUserProfile]](**response)


@router.get(
    path="/user",
    name="detail_user",
    description="user page for show in setting",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseUser],
        fail_response_model=FailResponse[ResponseStatus]
    )

)
async def get_user_login(user: dict = Depends(get_current_user)):
    response = {
        "data": user,
        "response_status": {
            "code": CODE_SUCCESS,
            "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
        }
    }

    return SuccessResponse[ResponseUser](**response)


@router.get(
    path="/user/profile/{user_code}",
    name="get_profile_user",
    description="get profile user",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseUserProfile],
        fail_response_model=FailResponse[ResponseStatus]
    )

)
async def get_user_profile(user_code: str, user: dict = Depends(get_current_user)):
    if not user_code:
        return http_exception(status_code=HTTP_400_BAD_REQUEST, message='user_code not allow empty')
    profile = await get_user_by_code(user_code)
    if not profile:
        return http_exception(status_code=HTTP_400_BAD_REQUEST,
                              code=CODE_ERROR_USER_CODE_NOT_FOUND)
    if user_code == user['user_code']:
        profile['is_current_login_user'] = True
    else:
        profile['is_current_login_user'] = False
        # chỉ kiêm tra bạn bè nếu vào profile người khác, ko kiểm tra nếu trang đó là của cá nhận
        profile['friend_status'] = await check_friend_or_not_in_profile(user['user_code'], user_code, user['friends_code'])
    # cần làm thêm trang cá nhân của người đó có được gửi yêu cầu kết bạn hay không
    return SuccessResponse[ResponseUserProfile](**{
        "data": profile,
        "response_status": {
            "code": CODE_SUCCESS,
            "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
    })


@router.post(
    path="/user/{user_code}",
    name="get_profile_user",
    description="get profile user",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseUser],
        fail_response_model=FailResponse[ResponseStatus]
    )

)
async def update_user_info(
        user_code: str,
        given_name: str = Form(""),
        family_name: str = Form(""),
        biography: str = Form(""),
        faculty: str = Form(""),
        birthday: str = Form(""),
        phone: str = Form(""),
        gender: str = Form(""),
        class_name: str = Form(""),
        picture: Optional[UploadFile] = Form(""),
        background_picture: Optional[UploadFile] = Form(""),
        password: str = Form(""),
        user: dict = Depends(get_current_user)):
    if user_code != user['user_code']:
        return http_exception(status_code=HTTP_400_BAD_REQUEST,
                              code=CODE_ERROR_CANT_CHANGE_INFO)
    data_update = {

    }
    if given_name:
        data_update['given_name'] = given_name
    if family_name:
        data_update['family_name'] = family_name
    if biography:
        data_update['biography'] = biography
    if faculty:
        data_update['faculty'] = faculty
    if birthday:
        data_update['birthday'] = birthday
    if phone:
        data_update['phone'] = phone
    if gender:
        data_update['gender'] = gender
    if class_name:
        data_update['class_name'] = class_name

    if given_name and family_name:
        data_update['fullname'] = family_name + ' ' + given_name
    if password:
        data_update['password'] = await get_password_hash(password)
        print(data_update['password'])
    picture_id = ""
    picture_update = ""
    background_picture_id =  ""
    background_picture_update = ""
    if picture:
        picture_data = await picture.read()
        response_picture = await upload_image_cloud(picture_data, user["user_code"])
        picture_id = response_picture['public_id']
        picture_update = response_picture['url']
        data_update['picture_id'] = picture_id
        data_update['picture'] = picture_update
    if background_picture:
        background_picture_data = await background_picture.read()
        response_back_ground = await upload_image_cloud(background_picture_data, user["user_code"])
        background_picture_id = response_back_ground['public_id']
        background_picture_update = response_back_ground['url']
        data_update['background_picture_id'] = background_picture_id
        data_update['background_picture'] = background_picture_update
    user_after_update = await update_user(user['_id'], data_update)

    if not user_after_update:
        return http_exception(code=CODE_ERROR_WHEN_UPDATE_CREATE,status_code=HTTP_400_BAD_REQUEST)

    return SuccessResponse[ResponseUser](**{
        "data": user_after_update,
        "response_status": {
            "code": CODE_SUCCESS,
            "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
        }
    })

