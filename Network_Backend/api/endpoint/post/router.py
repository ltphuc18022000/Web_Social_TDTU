from fastapi import APIRouter

from api.endpoint.post import view

router = APIRouter()

router.include_router(router=view.router)


