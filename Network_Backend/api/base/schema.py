from pydantic import BaseModel, Field
from typing import Generic, TypeVar, Optional
from pydantic.generics import GenericModel


# from api.third_parties.database.model.base import BaseModel


# class CommonModel(BaseModel):
#     created_time: str = Field("", example='')
#     updated_time: str = Field("", example='')


class ResponseStatus(BaseModel):
    code: str = Field("", example='')
    type: str = Field("success", example='')
    message: str = Field("", example='')


TypeX = TypeVar("TypeX")


class SuccessResponse(GenericModel, Generic[TypeX]):
    data: Optional[TypeX]
    response_status: ResponseStatus


class FailResponse(GenericModel, Generic[TypeX]):
    detail: Optional[TypeX]


