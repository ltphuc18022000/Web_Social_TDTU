from typing import List

from pydantic import BaseModel,  Field

from api.third_parties.database.mongodb import PyObjectId


# from bson import ObjectId
# from api.base.schema import CommonModel
# from api.third_parties.database.model.base import BaseModel


class ResponseCreateFriendRequest(BaseModel):
    message: str = Field("")


class ResponseFriendRequest(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    friend_request_code: str = Field("")
    user_code_receive: str = Field("")
    user_code_request: str = Field("")
    status: bool = Field("")


class ResponseFriendOfUser(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_code: str = Field("", example='')
    fullname: str = Field("", example='')
    family_name: str = Field("", example='')
    given_name: str = Field("", example='')
    picture: str = Field("", example='')
    background_picture: str = Field("", example='')
    picture_id: str = Field("", example='')
    friend_status: str = Field(default="friend",
                                description='''kiểm tra trạng thái bạn bè của trang mà mình tìm kiếm với user hiện tại
                                <br>friend: bạn 
                                <br> pendding: chờ accept lời mời
                                <br> not_friend: không phải bản, ko có lời mời
                                '''
                                )


class ResponseListFriend(BaseModel):
    list_friend_request_info: List[ResponseFriendOfUser] = Field(...)
    last_friend_request_id: PyObjectId = Field(default_factory=PyObjectId, alias="last_friend_request_id")


class ResponseListFriendOfUser(BaseModel):
    list_friend_info: List[ResponseFriendOfUser] = Field(...)
    last_friend_id: PyObjectId = Field(default_factory=PyObjectId, alias="last_friend_id")
