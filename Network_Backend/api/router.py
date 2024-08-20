from fastapi import APIRouter
from api.endpoint import router as identity_route

router = APIRouter()
router.include_router(router=identity_route.router)
