from fastapi import APIRouter

from api.endpoint.message import view

router = APIRouter()

router.include_router(router=view.router)


