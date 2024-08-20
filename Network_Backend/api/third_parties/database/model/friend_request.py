import datetime

from api.third_parties.database.model.base import BaseModel


class FriendRequest(BaseModel):

    def __init__(self, friend_request_code=None, user_code_receive=None, user_code_request=None, status=False):
        super().__init__()
        self.friend_request_code = friend_request_code
        self.user_code_receive = user_code_receive  # user_code của người nhận lời mời kết bạn
        self.user_code_request = user_code_request  # user_code của người gửi lời mời kết bạn
        self.status = status  # False: đang trong thời gian chờ kết ban, True đã chấp nhận lời mời kết bạn

    def to_json(self):
        data = self.__dict__
        for key, value in list(data.items()):
            if value is None:
                del data[key]
        return data
