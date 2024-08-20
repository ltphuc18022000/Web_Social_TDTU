from pymongo import ReturnDocument

from api.third_parties.database.model.user_online import UserOnline
from api.third_parties.database.mongodb import MongoDBService, is_valid_object_id


async def create_new_user_online(user_online: UserOnline):
    db = await MongoDBService().get_db()
    result = await db['user_online'].insert_one(user_online.to_json())
    return result.inserted_id


async def update_user_online(user_code, data_update: dict):
    db = await MongoDBService().get_db()
    return await db['user_online'].find_one_and_update(
        {"user_code": user_code},
        {"$set": data_update},
        return_document=ReturnDocument.AFTER
    )


async def disconnect_user_online_socketid(socket_id):
    db = await MongoDBService().get_db()
    return await db['user_online'].find_one_and_update(
        {"socket_id": socket_id},
        {"$set": {"status": False}},
        return_document=ReturnDocument.AFTER
    )


async def get_user_online(user_code):
    db = await MongoDBService().get_db()
    return await db['user_online'].find_one(
        {"user_code": user_code}
    )


async def get_user_if_user_is_online(user_code):
    db = await MongoDBService().get_db()
    return await db['user_online'].find_one(
        {"user_code": user_code, "status": True}
    )



