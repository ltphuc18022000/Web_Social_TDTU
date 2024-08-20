from fastapi import APIRouter

from api.endpoint.conversation import view

router = APIRouter()

router.include_router(router=view.router)


