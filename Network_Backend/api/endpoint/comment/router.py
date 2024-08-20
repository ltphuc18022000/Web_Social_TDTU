from fastapi import APIRouter

from api.endpoint.comment import view

router = APIRouter()

router.include_router(router=view.router)


