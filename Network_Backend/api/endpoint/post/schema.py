import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from api.endpoint.user.schema import ResponseUser
from api.third_parties.database.mongodb import PyObjectId


class ResponsePost(BaseModel):
    post_code: str = Field("", example='')
    created_by: ResponseUser = Field()
    content: str = Field("", example='')
    images: List[str] = Field([], example=[''])
    images_id: List[str] = Field([], example=[''])
    liked_by: List[str] = Field([], example=[''])
    comment_post: List[str] = Field([], example=[''])
    root_post: str = Field("", example='', description="bài gốc của bài được chia sẻ")
    videos: str = Field("", example='')
    video_ids: str = Field("", example='')
    created_time: datetime.datetime

class ResponseListSharePost(BaseModel):
    post_code: str = Field("", example='')
    created_by: ResponseUser = Field()
    content: str = Field("", example='')
    images: List[str] = Field([], example=[''])
    images_id: List[str] = Field([], example=[''])
    liked_by: List[str] = Field([], example=[''])
    comment_post: List[str] = Field([], example=[''])
    root_post: str = Field("", example='', description="bài gốc của bài được chia sẻ")
    root_post_info: Optional[ResponsePost] = Field(None)
    videos: str = Field("", example='')
    video_ids: str = Field("", example='')
    created_time: datetime.datetime


class ResponseCreateUpdatePost(BaseModel):
    post_code: str = Field("", example='')
    created_by: ResponseUser = Field(None)
    content: str = Field("", example='')
    images: List[str] = Field([], example=[''])
    images_id: List[str] = Field([], example=[''])
    liked_by: List[str] = Field([], example=[''])
    comment_post: List[str] = Field([], example=[''])
    videos: str = Field("", example='')
    video_ids: str = Field("", example='')


class ResponseDeletePost(BaseModel):
    message: str = Field("")


class CreateUpdatePost(BaseModel):
    content: str = Field("", example='')
    images: List[str] = Field([], example=[''])
    videos: str = Field("", example='')


class ResponseLikePost(BaseModel):
    status: bool = Field(False, description="True: like bài viết, False: displike bài viết")
    like_number: int = Field(default=0, description="số lượng like")
    liked_by: List[ResponseUser] = Field(None)


class ResponseSharePost(BaseModel):
    message: str = Field("")


class ResponseListPost(BaseModel):
    list_post_info: List[ResponseListSharePost] = Field(...)

    last_post_id: PyObjectId = Field(default_factory=PyObjectId, alias="last_post_id")


class CreateSharePost(BaseModel):
    content: str = Field("", example='')