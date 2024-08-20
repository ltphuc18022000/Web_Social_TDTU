import uuid

import socketio

from api.third_parties.database.model.user_online import UserOnline
from api.third_parties.database.query.user_online import create_new_user_online, get_user_online, update_user_online, \
    disconnect_user_online_socketid

sio_server = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=[]
)

sio_app = socketio.ASGIApp(
    socketio_server=sio_server,
    socketio_path='socket.io'
)


@sio_server.event
async def connect(sid, environ, auth):
    print("connect")
    print(f'{sid}: connected')


@sio_server.event
async def disconnect(sid):
    print(f'{sid}: disconnected')
    await disconnect_user_online_socketid(socket_id=sid)


@sio_server.on("disconnect_server")
async def change_status_user_online(sid):
    print(f'{sid}: disconnected')
    await disconnect_user_online_socketid(socket_id=sid)


@sio_server.on("new_user_connect")
async def new_user(sid, user_code):
    print(user_code, sid)
    user_online = await get_user_online(user_code)
    if not user_online:
        new_user_online = UserOnline(user_online_code=str(uuid.uuid4()), user_code=user_code, socket_id=sid, status=True)
        await create_new_user_online(new_user_online)
    else:
        await update_user_online(user_code=user_code, data_update={"socket_id": sid, "status": True})


@sio_server.on("join_room")
async def join_room(sid, data):
    print("da tao room", data, sid)
    # sio_server.enter_room(sid, 'chat_users')
    sio_server.enter_room(sid, data)

@sio_server.on("leave_room")
def exit_room(sid, room_id):
    sio_server.leave_room(sid, room_id)
@sio_server.event
async def send_mess_room(event, room, data):
    await sio_server.emit(event, data, room=room)


@sio_server.event
async def send_noti(data, user_sid):
    print(user_sid, data)
    await sio_server.emit("send_noti", data, room=user_sid)

