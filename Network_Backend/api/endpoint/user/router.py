from fastapi import APIRouter

from api.endpoint.user import view

router = APIRouter()

router.include_router(router=view.router)


