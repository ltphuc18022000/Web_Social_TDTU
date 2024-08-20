from fastapi import APIRouter
from api.endpoint.user import router as user_route
from api.endpoint.comment import router as comment_route
from api.endpoint.conversation import router as conversation_route
from api.endpoint.friend_request import router as friend_request_route
from api.endpoint.message import router as message_route
from api.endpoint.notification import router as notification_route
from api.endpoint.post import router as post_route
from api.endpoint.authen import router as authen_route


router = APIRouter()
router.include_router(router=user_route.router, tags=['USER'])
router.include_router(router=comment_route.router, tags=['COMMENT'])
router.include_router(router=conversation_route.router, tags=['CONVERSATION'])
router.include_router(router=friend_request_route.router, tags=['FRIEND_REQUEST'])
router.include_router(router=message_route.router, tags=['MESSAGE'])
router.include_router(router=notification_route.router, tags=['NOTIFICATION'])
router.include_router(router=post_route.router, tags=['POST'])
router.include_router(router=authen_route.router, tags=['AUTHEN'])
