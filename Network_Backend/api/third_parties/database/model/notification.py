import datetime

from api.third_parties.database.model.base import BaseModel


class Notification(BaseModel):

    def __init__(self, notification_code=None, user_code=None, user_code_guest=None, content=None,
                 is_checked=False, deleted_flag=False):
        super().__init__()
        self.notification_code = notification_code
        # ví dụ: 123 like bài viết của 456 => user_code= 456, user_code_guest=123 vì 123 là người tương tác để tạo ra thông báo cho 456
        self.user_code = user_code  # user code thể hiện người nào sẽ nhận thông báo này
        self.user_code_guest = user_code_guest  # user code của người mà tương tác để tạo thông báo đến cho người kia (user_code)
        self.content = content
        self.is_checked = is_checked  # đã đọc thông báo hay chưa
        self.deleted_flag = deleted_flag  # đã xóa thông báo hay chưa

    def to_json(self):
        data = self.__dict__
        for key, value in list(data.items()):
            if value is None:
                del data[key]
        return data
