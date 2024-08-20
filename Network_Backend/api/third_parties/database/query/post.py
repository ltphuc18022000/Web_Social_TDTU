import uuid

from pymongo import ReturnDocument

from api.third_parties.database.model.post import Post
from api.third_parties.database.mongodb import MongoDBService, is_valid_object_id
from api.third_parties.database.query.paging import paging_sort_by_create_time, paging


async def get_all_post_by_user_code(user_code: str, last_post_id=""):
    db = await MongoDBService().get_db()
    # cursor = db['post'].find({"created_by": user_code})
    # posts = await cursor.to_list(None)
    # return posts
    list_post_cursor = await paging(
        query_param_for_paging=last_post_id,
        database_name="post",
        query_condition={"created_by": user_code},
        db=db,
        sort=-1)
    return list_post_cursor

async def get_all_post(user_code, friends_code, last_post_id="" ):
    db = await MongoDBService().get_db()
    # cursor = db['post'].find({"created_by": user_code})
    # posts = await cursor.to_list(None)
    # return posts
    list_post_cursor = await paging(
        query_param_for_paging=last_post_id,
        database_name="post",
        query_condition={ "$or": [{ "created_by": user_code }, { "created_by": { "$in": friends_code } }] },
        db=db,
        sort=-1)
    return list_post_cursor


async def get_post_by_post_code(post_code: str):
    db = await MongoDBService().get_db()
    post = await db['post'].find_one({"post_code": post_code})
    return post


async def get_post_by_id(post_id):
    db = await MongoDBService().get_db()
    post = await db['post'].find_one({"_id": post_id})
    return post


async def create_post(data: Post):
    db = await MongoDBService().get_db()
    result = await db['post'].insert_one(data.to_json())
    return result.inserted_id


async def update_post(post_code, data_update):
    db = await MongoDBService().get_db()
    result = await db['post'].find_one_and_update(
        {"post_code": post_code},
        {"$set": data_update},
        return_document=ReturnDocument.AFTER
    )

    return result


async def update_like_post(post_code, user_code_like, add_like=True):
    db = await MongoDBService().get_db()
    if add_like:
        print("vapf nef")
        result = await db['post'].find_one_and_update(
            {"post_code": post_code},
            {"$push": {'liked_by': user_code_like}},
            return_document=ReturnDocument.AFTER
        )
        print(result)
    else:
        result = await db['post'].find_one_and_update(
            {"post_code": post_code},
            {"$pull": {'liked_by': user_code_like}},
            return_document=ReturnDocument.AFTER
        )

    return result


async def delete_post(post_code):
    db = await MongoDBService().get_db()
    result = await db['post'].delete_one({"post_code": post_code})
    return result.deleted_count


async def get_post_of_user_by_code(user_code, post_code):
    db = await MongoDBService().get_db()
    result = await db['post'].find_one({"root_post": post_code, "created_by": user_code})
    return result


async def push_comment_to_post(post_code, comment_code):
    db = await MongoDBService().get_db()
    result = await db['post'].find_one_and_update(
        {'post_code': post_code},
        {'$push': {'comments': comment_code}},  # đẩy comment vào post
        return_document=ReturnDocument.AFTER
    )
    return result


async def pull_comment_to_post(post_code, comment_code):
    db = await MongoDBService().get_db()
    result = await db['post'].find_one_and_update(
        {'post_code': post_code},
        {'$pull': {'comments': comment_code}},  # xóa comment trong post
        return_document=ReturnDocument.AFTER
    )
    return result
