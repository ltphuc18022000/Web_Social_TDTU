from fastapi import APIRouter

from api.endpoint.friend_request import view

router = APIRouter()

router.include_router(router=view.router)


