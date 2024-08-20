from api.third_parties.database.model.message import Message, MessageGroup
from api.third_parties.database.mongodb import MongoDBService, is_valid_object_id
from api.third_parties.database.query.paging import paging_sort_by_create_time, paging


async def get_message_by_message_code(message_code):
    db = await MongoDBService().get_db()
    return await db['message'].find_one({"message_code": message_code})


async def get_message_id(message_id):
    db = await MongoDBService().get_db()
    return await db['message'].find_one({"_id": is_valid_object_id(message_id)})


async def get_all_message_by_conversation_code(conversation_code: str, last_message_id=""):
    db = await MongoDBService().get_db()
    list_mess_cursor = await paging(
        query_param_for_paging=last_message_id,
        database_name="message",
        query_condition={"conversation_code": conversation_code},
        db=db,
        sort=-1)
    return list_mess_cursor


async def create_message(data: Message):
    db = await MongoDBService().get_db()
    result = await db['message'].insert_one(data.to_json())
    return result.inserted_id


async def create_message_group(message_group_data: MessageGroup):
    db = await MongoDBService().get_db()
    result = await db['message'].insert_one(message_group_data.to_json())
    return result.inserted_id

#
# async def get_max_stt_of_message_in_conver(conversation_code):
#     db = await MongoDBService().get_db()
#     return db['message'].find({"conversation_code": conversation_code}).sort("stt", -1).limit(1)
