from typing import List

from pydantic import BaseModel, Field


# from api.base.schema import CommonModel
# from api.third_parties.database.model.base import BaseModel


class ResponseUser(BaseModel):
    user_code: str = Field("", example='')
    fullname: str = Field("", example='')
    picture: str = Field("", example='')
    background_picture: str = Field("", example='')
    picture_id: str = Field("", example='')
    given_name: str = Field("", example='')
    family_name: str = Field("", example='')
    username: str = Field("", example='')
    biography: str = Field("", example='')
    class_name: str = Field("", example='')
    faculty: str = Field("", example='')
    friends_code: List[str] = Field([], example='')
    birthday: str = Field("", example='')
    phone: str = Field("", example='')
    gender: str = Field("", example='')


class ResponseUserProfile(BaseModel):
    user_code: str = Field("", example='')
    fullname: str = Field("", example='')
    picture: str = Field("", example='')
    background_picture: str = Field("", example='')
    picture_id: str = Field("", example='')
    given_name: str = Field("", example='')
    family_name: str = Field("", example='')
    username: str = Field("", example='')
    biography: str = Field("", example='')
    class_name: str = Field("", example='')
    faculty: str = Field("", example='')
    # friends_code: List[] = Field("", example='')
    birthday: str = Field("", example='')
    phone: str = Field("", example='')
    gender: str = Field("", example='')
    is_current_login_user: bool = Field(
        default=False, example=False,
        description="sử dụng để kiểm tra xem profile có phải có người đang đăng nhập hay đang của người khác"
    )
    friend_status: str = Field(default="friend",
                               description='''kiểm tra trạng thái bạn bè của trang mà mình tìm kiếm với user hiện tại
                                <br>friend: bạn 
                                <br> pendding: chờ accept lời mời
                                <br> not_friend: không phải bản, ko có lời mời
                                '''
                               )


