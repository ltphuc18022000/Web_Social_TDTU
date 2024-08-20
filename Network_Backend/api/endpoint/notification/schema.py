import datetime
from typing import List

from pydantic import BaseModel,  Field

from api.endpoint.user.schema import ResponseUser
from api.third_parties.database.mongodb import PyObjectId


class ResponseNotification(BaseModel):
    notification_code: str = Field("", example='')
    user_code: str = Field("", example='')
    user_code_guest: str = Field("", example='')
    content: str = Field("", example='')
    is_checked: bool = Field("", example=False)
    deleted_flag: bool = Field("", example=False)


class ResponseDeleteNotification(BaseModel):
    message: str = Field("")


class ResponseNotificationInfo(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    notification_code: str = Field("", example='')
    user_info: ResponseUser
    user_guest_info: ResponseUser
    content: str = Field("", example='')
    is_checked: bool = Field("", example=False)
    deleted_flag: bool = Field("", example=False)
    created_time: datetime.datetime


class ResponseListNotification(BaseModel):
    # number_noti_not_read: str = Field("0")
    list_noti_info: List[ResponseNotificationInfo] = Field(...)
    last_noti_id: PyObjectId = Field(default_factory=PyObjectId, alias="last_noti_id")


class ResponseNumberNotification(BaseModel):
    number_noti_not_read: str = Field("0")
