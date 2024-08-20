from fastapi import APIRouter

from api.endpoint.notification import view

router = APIRouter()

router.include_router(router=view.router)


