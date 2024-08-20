from pymongo import ReturnDocument

from api.third_parties.database.model.conversation import Conversation
from api.third_parties.database.mongodb import MongoDBService, is_valid_object_id
from api.third_parties.database.query.paging import paging_sort_by_create_time, paging


async def get_conversation_by_code(conversation_code):
    db = await MongoDBService().get_db()
    return await db['conversation'].find_one({"conversation_code": conversation_code})


async def get_conversation_by_id(conversation_id):
    db = await MongoDBService().get_db()
    return await db['conversation'].find_one({"_id": is_valid_object_id(conversation_id)})


async def get_all_conversation_of_current_user(user_code: str, last_conversation_stt=""):
    db = await MongoDBService().get_db()
    list_conversation_cursor = await paging(
        query_param_for_paging=last_conversation_stt,
        database_name="conversation",
        query_condition={"members": {"$in": [user_code]}},
        db=db,
        sort=-1,
        is_conversation=True,
        limit=1000
    )
    return list_conversation_cursor


async def create_conversation(data: Conversation):
    db = await MongoDBService().get_db()
    result = await db['conversation'].insert_one(data.to_json())
    return result.inserted_id


async def get_conversation_by_members(members):
    db = await MongoDBService().get_db()
    # Lấy số lượng phần tử trong danh sách members
    members_count = len(members)
    # Sắp xếp các phần tử trong danh sách members để đảm bảo thứ tự giống nhau
    members.sort()
    return await db['conversation'].find_one({
        "members": {
            "$all": members,
            "$size": members_count  # Đảm bảo số lượng phần tử trong danh sách members giống nhau
        }
    })


async def get_conversation_by_members_and_name(members, name):
    db = await MongoDBService().get_db()
    members_count = len(members)
    members.sort()
    return await db['conversation'].find_one({
        "members": {
            "$all": members,
            "$size": members_count
        },
        "name": name
    })


async def get_group_by_name(name):
    db = await MongoDBService().get_db()
    return await db['conversation'].find_one({"name": name})


async def update_group(members, conversation_code, name):
    db = await MongoDBService().get_db()
    result = await db['conversation'].find_one_and_update(
        {"conversation_code": conversation_code},
        {"$set": {"members": members, "name": name}},
        return_document=ReturnDocument.AFTER
    )
    return result


async def update_group_name(conversation_code, name):
    db = await MongoDBService().get_db()
    result = await db['conversation'].find_one_and_update(
        {"conversation_code": conversation_code},
        {"$set": {"name": name}},
        return_document=ReturnDocument.AFTER
    )
    return result


async def get_max_stt(user_code):
    db = await MongoDBService().get_db()
    return db['conversation'].find({"members": {"$in": [user_code]}}).sort("stt", -1).limit(1)


async def update_stt_conversation(conversation_code, new_stt):
    db = await MongoDBService().get_db()
    return db['conversation'].find_one_and_update({"conversation_code": conversation_code}, {"$set": {"stt": new_stt}},)
