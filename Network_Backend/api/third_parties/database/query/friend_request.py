from pymongo import ReturnDocument

from api.third_parties.database.model.friend_request import FriendRequest
from api.third_parties.database.mongodb import MongoDBService, is_valid_object_id
from api.third_parties.database.query.paging import paging


async def get_friend(user_code_request, user_code_receive_request):
    db = await MongoDBService().get_db()
    return await db['friend_request'].find_one({
        "user_code_request": user_code_request,
        "user_code_receive": user_code_receive_request,
        "status": False
    })

async def get_friend_request_of_2_user(user_code_1, user_code_2, status=True):
    db = await MongoDBService().get_db()
    fr_request = await db['friend_request'].find_one({
        "user_code_request": user_code_1,
        "user_code_receive": user_code_2,
        "status": status
    })
    if not fr_request:
        fr_request = await db['friend_request'].find_one({
            "user_code_request": user_code_2,
            "user_code_receive": user_code_1,
            "status": status
        })
    return fr_request
async def create_fr(friend_request: FriendRequest):
    db = await MongoDBService().get_db()
    result = await db['friend_request'].insert_one(friend_request.to_json())
    return result.inserted_id


async def update_friend_request(user_code_in_queue_request, user_code, current_status: bool, status_update: bool):
    db = await MongoDBService().get_db()
    result = await db['friend_request'].find_one_and_update(
        {"user_code_request": user_code_in_queue_request, "user_code_receive": user_code, "status": current_status},
        {"$set": {"status": status_update}},
        return_document=ReturnDocument.AFTER
    )
    return result


async def get_all_friend_request(user_code: str, last_friend_request_id=""):
    db = await MongoDBService().get_db()
    list_friend_request_cursor = await paging(
        query_param_for_paging=last_friend_request_id,
        database_name="friend_request",
        query_condition={"user_code_receive": user_code, "status": False},
        db=db,
        sort=1)
    return list_friend_request_cursor


async def delete_friend_request(friend_request_code: str):
    db = await MongoDBService().get_db()
    result = await db['friend_request'].delete_one({"friend_request_code": friend_request_code})
    return result.deleted_count

