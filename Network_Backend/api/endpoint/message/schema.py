from typing import List

from pydantic import BaseModel,  Field

from api.endpoint.user.schema import ResponseUser
from api.third_parties.database.mongodb import PyObjectId


# from bson import ObjectId
# from api.base.schema import CommonModel
# from api.third_parties.database.model.base import BaseModel


class ResponseMessage(BaseModel):
    message_code: str = Field("", example='')
    conversation_code: str = Field("", example='')
    sender_code: str = Field("", example='')
    text: str = Field("", example='')
    sender_info: ResponseUser = Field()


class ResponseListMessage(BaseModel):
    list_mess_info: List[ResponseMessage] = Field(...)
    last_mess_id: PyObjectId = Field(default_factory=PyObjectId, alias="last_mess_id")


class RequestCreateMessage(BaseModel):
    conversation_code: str = Field("", example='')
    # sender_code: str = Field("", example='')
    text: str = Field("", example='')


class ResponseGroupMessage(BaseModel):
    message_code: str = Field("", example='')
    conversation_code: str = Field("", example='')
    sender_code: str = Field("", example='')
    text: str = Field("", example='')