import logging
import uuid


from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from starlette.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
from fastapi import APIRouter, Depends, HTTPException, Query

from api.base.authorization import get_current_user
from api.base.schema import SuccessResponse, FailResponse, ResponseStatus
from api.endpoint.comment.schema import ResponseComment
from api.endpoint.message.schema import ResponseMessage, RequestCreateMessage, \
     ResponseListMessage
from api.library.constant import CODE_SUCCESS, TYPE_MESSAGE_RESPONSE, CODE_ERROR_SERVER, CODE_ERROR_INPUT, \
    CODE_ERROR_CONVERSATION_CODE_NOT_FOUND, EVENT_CHAT
from api.library.function import get_max_stt_and_caculate_in_convertsation
from api.third_parties.database.model.message import Message, MessageGroup
from api.third_parties.database.query.conversation import get_conversation_by_code, update_stt_conversation
from api.third_parties.database.query.message import create_message, get_message_by_message_code, \
    get_all_message_by_conversation_code, get_message_id, create_message_group
from api.third_parties.database.query.user import get_user_by_code, get_list_user_by_code

from api.third_parties.database.query.user_online import get_user_if_user_is_online
from api.third_parties.socket.socket import sio_server, send_mess_room
from settings.init_project import open_api_standard_responses, http_exception

router = APIRouter()
logger = logging.getLogger("message.view.py")


@router.post(
    path="/message",
    name="create_message",
    description="create message",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseMessage],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def create_a_message(request_message_data: RequestCreateMessage,
                           user: dict = Depends(get_current_user)):
    code = message = status_code = ''

    try:

        conversation_code = request_message_data.conversation_code
        conversation = await get_conversation_by_code(conversation_code)
        print(conversation_code)
        if not conversation:
            status_code = HTTP_400_BAD_REQUEST
            code = CODE_ERROR_CONVERSATION_CODE_NOT_FOUND
            raise HTTPException(status_code)

        message_data = Message(
            message_code=str(uuid.uuid4()),
            conversation_code=conversation_code,
            sender_code=user['user_code'],
            text=request_message_data.text,
            # stt=await get_max_stt_caculate_in_message(conversation_code)
        )

        new_message = await create_message(message_data)
        max_stt = await get_max_stt_and_caculate_in_convertsation(user['user_code'])

        await update_stt_conversation(conversation_code, max_stt)
        new_message_info = await get_message_id(new_message)

        sender_info = await get_user_by_code(new_message_info['sender_code'])

        new_message_info['sender_info'] = sender_info
        response = {
            "data": new_message_info,
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }
        for member in conversation['members']:
            print(member)
            if member != user['user_code']:
                get_other_user_if_online = await get_user_if_user_is_online(member)
                if get_other_user_if_online:
                    await send_mess_room(event=EVENT_CHAT,data=jsonable_encoder(SuccessResponse[ResponseMessage](**response)), room=conversation_code)

        return SuccessResponse[ResponseMessage](**response)
    except:
        logger.error(TYPE_MESSAGE_RESPONSE["en"][code] if not message else message, exc_info=True)
        return http_exception(
            status_code=status_code if status_code else HTTP_500_INTERNAL_SERVER_ERROR,
            code=code if code else CODE_ERROR_SERVER,
            message=message
        )


@router.get(
    path="/conversation/{conversation_code}/message",
    name="get_all_message",
    description="get all message by conversation_code",
    status_code=HTTP_200_OK,
    responses=open_api_standard_responses(
        success_status_code=HTTP_200_OK,
        success_response_model=SuccessResponse[ResponseListMessage],
        fail_response_model=FailResponse[ResponseStatus]
    )
)
async def get_all_message( conversation_code: str, user: dict = Depends(get_current_user), last_message_id: str = Query(default=""), ):
    code = message = status_code = ''
    try:
        if not conversation_code:
            return http_exception(status_code=HTTP_400_BAD_REQUEST, message='conversation_code not allow empty')
        conversation = await get_conversation_by_code(conversation_code)
        if not conversation:
            code = CODE_ERROR_CONVERSATION_CODE_NOT_FOUND
            status_code = 400
            raise HTTPException(status_code)
        list_mess_cursor = await get_all_message_by_conversation_code(
            conversation_code=conversation_code,
            last_message_id=last_message_id
        )
        list_mess = await list_mess_cursor.to_list(None)
        list_other_memeber = conversation['members']
        list_other_memeber.remove(user['user_code'])
        all_memeber_info_cursor = await get_list_user_by_code(list_other_memeber)
        all_memeber_info = await all_memeber_info_cursor.to_list(None)
        user_code__user_info = {}
        for user_info in all_memeber_info:
            user_code__user_info[user_info['user_code']] = user_info
        for mess in list_mess:
            if mess['sender_code'] != user['user_code']:
                if mess['sender_code'] in user_code__user_info:
                    mess['sender_info'] = user_code__user_info[mess['sender_code']]
                elif conversation['type'] == '1':
                    mess['sender_info'] = await get_user_by_code(mess['sender_code'])
            else:
                mess['sender_info'] = user
        last_conversation_id = ObjectId("                        ")
        if list_mess:
            last_conversation = list_mess[-1]
            last_conversation_id = last_conversation['_id']

        response = {
            "data":
                {
                    "list_mess_info": list_mess,
                    "last_mess_id": last_conversation_id
                },
            "response_status": {
                "code": CODE_SUCCESS,
                "message": TYPE_MESSAGE_RESPONSE["en"][CODE_SUCCESS],
            }
        }

        return SuccessResponse[ResponseListMessage](**response)
    except:
        logger.error(exc_info=True)
        return http_exception(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            code=CODE_ERROR_SERVER,
        )

