from pydantic import BaseModel, Field
from typing import List

from api.endpoint.user.schema import ResponseUser
from api.third_parties.database.mongodb import PyObjectId


# from bson import ObjectId
# from api.base.schema import CommonModel
# from api.third_parties.database.model.base import BaseModel


class ResponseComment(BaseModel):
    comment_code: str = Field("", example='')
    post_code: str = Field("", example='')
    created_by: ResponseUser = Field(None)
    image: str = Field("", example='')
    image_id: str = Field("", example='')
    content: str = Field("", example='')
    liked_by: List[str] = Field([], example=[''])


class ResponseCreateUpdateComment(BaseModel):
    comment_code: str = Field("", example='')
    image: str = Field("", example='')
    image_id: str = Field("", example='')
    created_by: ResponseUser = Field(None)
    content: str = Field("", example='')
    liked_by: List[str] = Field([], example=[''])


class ResponseListComment(BaseModel):
    # number_noti_not_read: str = Field("0")
    list_comment_info: List[ResponseComment] = Field(...)
    last_comment_id: PyObjectId = Field(default_factory=PyObjectId, alias="last_comment_id")

class CreateUpdateComment(BaseModel):
    content: str = Field("", example='')
    image: str = Field("", example='')
    post_code: str = Field("", example='')


class ResponseDeleteComment(BaseModel):
    message: str = Field("")
