from pydantic import BaseModel,  Field

from api.endpoint.user.schema import ResponseUser


class ResponseToken(BaseModel):
    access_token: str
    token_type: str = Field(default="bearer")
    # user_info: ResponseUser


class RequestInfoToken(BaseModel):
    client_id: str = Field(...)
    credential: str = Field(...)
