import os
from datetime import datetime, timedelta
from fastapi import Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from starlette.status import HTTP_403_FORBIDDEN

from api.library.constant import CODE_TOKEN_NOT_VALID
from api.third_parties.database.query.user import get_user_by_code
from settings.init_project import http_exception, config_system


# Tạo JWT token chứa thông tin xác thực user để trả về cho client
async def create_access_token(username: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=config_system['EXPIRES_TIME'])
    encode_data = {"exp": expire, "sub": str(username)}
    encoded_jwt = jwt.encode(encode_data, config_system['JWT_SECRET_KEY'], algorithm=config_system["ALGORITHM"])
    return encoded_jwt


# Xác thực và lấy thông tin user từ JWT token
# Kiểm tra tính hợp lệ của token khi request tới API để lấy thông tin user từ token để dùng xử lý ở mục endpoint
async def get_current_user(
        scheme_and_credentials: HTTPAuthorizationCredentials = Security(HTTPBearer())
):
    try:
        payload = jwt.decode(
            scheme_and_credentials.credentials, config_system['JWT_SECRET_KEY'], algorithms=[config_system['ALGORITHM']]
        )
        user_code: str = payload.get("sub")
        if user_code is None:
            return http_exception(status_code=HTTP_403_FORBIDDEN, code=CODE_TOKEN_NOT_VALID)
        user = await get_user_by_code(user_code)
        return user
    except JWTError:
        raise http_exception(status_code=HTTP_403_FORBIDDEN, code=CODE_TOKEN_NOT_VALID)