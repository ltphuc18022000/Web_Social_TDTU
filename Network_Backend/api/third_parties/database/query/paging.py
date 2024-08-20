from typing import Union

from motor.motor_asyncio import AsyncIOMotorDatabase

from api.library.constant import PAGING_LIMIT
from api.third_parties.database.mongodb import is_valid_object_id


async def paging(
        query_param_for_paging: str,
        database_name: str,
        query_condition: dict,
        # key_query: str,
        # value_query: Union[str, dict, bool],
        db: AsyncIOMotorDatabase,
        show_value: dict = None,  # sau khi query sẽ hiển thị những field nào, mặc định hiển thị hết
        sort: int = 1,  # sort : -1 descending, 1 ascending,
        is_conversation: bool = False,
        limit:int = PAGING_LIMIT
):
    object_id = is_valid_object_id(query_param_for_paging)
    if show_value is None:
        show_value = {}
    query_greater_than_or_less_than = "$gt"  # query lớn hơn
    if sort == -1:
        query_greater_than_or_less_than = "$lt"  # query bé hơn
    if query_param_for_paging:
        query_condition["_id"] = {query_greater_than_or_less_than: object_id}

    print(query_condition)
    # lấy dữ liệu có điều kiện query
    # if not query_param_for_paging:
    if not is_conversation:
        cursor = db[database_name].find(query_condition, show_value).sort("_id", sort).limit(limit)
    else:
        cursor = db[database_name].find(query_condition, show_value).sort("stt", sort).limit(limit)
    # else:
    #     cursor = db[database_name].find(
    #         {
    #
    #             "_id": {
    #                 query_greater_than_or_less_than: object_id
    #             }
    #         },
    #         show_value
    #     ).sort("_id", sort).limit(PAGING_LIMIT)

    return cursor


async def paging_sort_by_create_time(
        query_param_for_paging: str,
        database_name: str,
        query_condition: dict,
        # key_query: str,
        # value_query: Union[str, dict, bool],
        db: AsyncIOMotorDatabase,
        show_value: dict = None,  # sau khi query sẽ hiển thị những field nào, mặc định hiển thị hết
        sort: int = 1  # sort : -1 descending, 1 ascending
):
    object_id = is_valid_object_id(query_param_for_paging)
    if show_value is None:
        show_value = {}
    query_greater_than_or_less_than = "$gt"  # query lớn hơn
    if sort == -1:
        query_greater_than_or_less_than = "$lt"  # query bé hơn
    if query_param_for_paging:
        query_condition["_id"] = {query_greater_than_or_less_than: object_id}

    print(query_condition)
    # lấy dữ liệu có điều kiện query
    # if not query_param_for_paging:
    cursor = db[database_name].find(query_condition, show_value).sort("created_time", sort).limit(5)
    # else:
    #     cursor = db[database_name].find(
    #         {
    #
    #             "_id": {
    #                 query_greater_than_or_less_than: object_id
    #             }
    #         },
    #         show_value
    #     ).sort("_id", sort).limit(PAGING_LIMIT)
    return cursor
