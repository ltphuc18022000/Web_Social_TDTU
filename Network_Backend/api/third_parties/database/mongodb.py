import motor.motor_asyncio
from bson import ObjectId
from bson.errors import InvalidId

from settings.init_project import config_system


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return str(ObjectId(v))

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class MongoDBService:
    _instance = None
    def __new__(cls, *args, **kwargs): #singleton
        if cls._instance is None:
            cls._instance = super(MongoDBService, cls).__new__(cls, *args, **kwargs)
            cls._instance.create_connection()
        else:
            print("da khoi tao ket noi mongodb")
        return cls._instance

    def create_connection(self):
        MONGO_DETAILS = \
            f"mongodb+srv://{config_system['MONGO_DB_USER']}:{config_system['MONGO_DB_PASSWORD']}@" \
            f"{config_system['MONGO_DB_HOST']}" \
            f"/?retryWrites=true&w=majority"
        print(MONGO_DETAILS)
        self.client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

    async def check_connection(self):
        if self.client is not None:
            return True
        return False

    async def get_db(self):
        return self.client[config_system['MONGO_DB_NAME']]

    async def close_connection(self):
        self.client.close()

def is_valid_object_id(id: str):
    try:
        object_id = ObjectId(id)
        return object_id
    except InvalidId:
        return None
