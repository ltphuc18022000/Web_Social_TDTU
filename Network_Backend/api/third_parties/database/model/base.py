import datetime


class BaseModel:
    def __init__(self, created_time = datetime.datetime.now(), updated_time = datetime.datetime.now()):
        self.created_time = created_time
        self.updated_time = updated_time

    def to_json(self):
        data = self.__dict__
        for key, value in list(data.items()):
            if value is None:
                del data[key]
        return data
