import datetime
import uuid

from api.third_parties.database.model.base import BaseModel


class Post(BaseModel):

    def __init__(self, post_code=None, created_by=None, content=None, images=[],
                 image_ids=[], videos=None, video_ids=None, liked_by=[],
                 comment_post=[], root_post="", user_root_post=""):
        super().__init__()
        self.post_code = post_code
        self.created_by = created_by
        self.content = content
        self.images = images
        self.image_ids = image_ids
        self.videos = videos
        self.video_ids = video_ids
        self.liked_by = liked_by
        self.comment_post = comment_post
        self.root_post = root_post
        self.user_root_post = user_root_post

    def to_json(self):
        data = self.__dict__
        for key, value in list(data.items()):
            if value is None:
                del data[key]
        return data
