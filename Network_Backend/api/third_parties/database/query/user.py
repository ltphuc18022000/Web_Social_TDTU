import uuid

from pymongo import ReturnDocument
from datetime import datetime

from api.library.function import verify_password, get_password_hash
from api.third_parties.database.model.user import User
from api.third_parties.database.mongodb import MongoDBService, is_valid_object_id
from api.third_parties.database.query.paging import paging


async def get_user_id(user_id):
    db = await MongoDBService().get_db()
    return await db['user'].find_one({"_id": is_valid_object_id(user_id)})


async def check_user(username: str, password: str):  # check user login
    db = await MongoDBService().get_db()
    user = await db['user'].find_one({"username": username})
    if user:
        check_pass = await verify_password(password, user['password'])
        if check_pass:
            return user
    return None


async def get_user_by_code(user_code):
    db = await MongoDBService().get_db()
    return await db['user'].find_one({"user_code": user_code})


async def get_list_user_by_code(list_user_code):
    db = await MongoDBService().get_db()
    return db['user'].find({"user_code": {"$in": list_user_code}})


async def get_user_by_email(email):
    db = await MongoDBService().get_db()
    return await db['user'].find_one({"username": email})


async def regex_user_name_email(name_or_email: str):  # find user by name or email
    db = await MongoDBService().get_db()
    cursor = db['user'].find({
        '$or': [
            {
                'fullname': {
                    '$regex': name_or_email,
                    '$options': 'i'
                }
            },
            {'username': {
                '$regex': name_or_email,
                '$options': 'i'
            }
            }
        ]
    })
    data = await cursor.to_list(None)
    return data


async def create_new_user(data: User):
    db = await MongoDBService().get_db()
    # user_code = str(uuid.uuid4())
    result = await db['user'].insert_one(data.to_json())
    return result.inserted_id


async def update_user(user_id, data_update):
    db = await MongoDBService().get_db()
    update_result = await db['user'].find_one_and_update(
        {"_id": is_valid_object_id(user_id)},
        {"$set": data_update},
        return_document=ReturnDocument.AFTER,
    )
    return update_result


async def update_user_friend(current_user_code, friend_user_code):
    db = await MongoDBService().get_db()
    update_result = await db['user'].find_one_and_update(
        {"user_code": current_user_code},
        {"$push": {"friends_code": friend_user_code}},
        return_document=ReturnDocument.AFTER,
    )
    return update_result


async def remove_user_friend(current_user_code, friend_user_code):
    db = await MongoDBService().get_db()
    update_result = await db['user'].find_one_and_update(
        {"user_code": current_user_code},
        {"$pull": {"friends_code": friend_user_code}},
        return_document=ReturnDocument.AFTER,
    )
    return update_result


async def get_list_user_in_list(list_user_code: list, last_user_id: str = ""):
    db = await MongoDBService().get_db()
    list_friend_request_cursor = await paging(
        query_param_for_paging=last_user_id,
        database_name="user",
        query_condition={"user_code": {"$in": list_user_code}},
        db=db,
        sort=1,
        limit=1000)
    return list_friend_request_cursor


