CODE_SUCCESS = "00"
CODE_TOKEN_NOT_VALID = "01"
CODE_LOGIN_FAIL = "02"
CODE_ERROR_USER_CODE_NOT_FOUND = "03"
CODE_ERROR_POST_CODE_NOT_FOUND = "04"
CODE_ERROR_CANT_CHANGE_INFO = '05'
CODE_ERROR_WHEN_UPDATE_CREATE = "06"
CODE_ERROR_INPUT = "07"
CODE_ERROR_WHEN_UPDATE_CREATE_NOTI = '08'
CODE_ERROR_WHEN_UPDATE_CREATE_FRIEND_REQUEST = "09"
CODE_ERROR_WHEN_UPDATE_CREATE_USER = '10'
CODE_ERROR_FRIEND_REQUEST_NOT_FOUND = "11"
CODE_ERROR_NOTIFICATION_CODE_NOT_FOUND = "12"
CODE_ERROR_COMMENT_CODE_NOT_FOUND = "13"
CODE_ERROR_WHEN_UPDATE_CREATE_COMMENT = "15"
CODE_ERROR_WHEN_UPDATE_CREATE_POST = "16"
CODE_ERROR_WHEN_UPDATE_CREATE_CONVERSATION = "17"
CODE_ERROR_WHEN_DELETE_POST = "18"
CODE_ERROR_WHEN_DELETE_COMMENT = "19"
CODE_ERROR_WHEN_DELETE_NOTIFICATION = "20"
CODE_ERROR_WHEN_UPDATE_CREATE_NOTIFICATION = "21"
CODE_ERROR_WHEN_PUSH_COMMENT = "22"
CODE_ERROR_WHEN_UPDATE_CREATE_GROUP = "23"
CODE_ERROR_CONVERSATION_CODE_NOT_FOUND = "24"

EMAIL_LOGIN_FAIL = "14"
CREATE_USER_FAIL = "26"

CODE_ERROR_SERVER = "99"

TYPE_MESSAGE_RESPONSE = {
    "en": {
        CODE_SUCCESS: "Success",
        CODE_TOKEN_NOT_VALID: 'Token is not valid',
        CODE_LOGIN_FAIL: "Username or password was wrong",
        CODE_ERROR_USER_CODE_NOT_FOUND: "User code not found",
        CODE_ERROR_POST_CODE_NOT_FOUND: "Post code not found",
        CODE_ERROR_CANT_CHANGE_INFO: "Can't change information of other use",
        CODE_ERROR_WHEN_UPDATE_CREATE: "Got some error when update or create data",
        CODE_ERROR_INPUT: "",
        CODE_ERROR_WHEN_UPDATE_CREATE_NOTI: "Got some error when create notification",
        CODE_ERROR_WHEN_UPDATE_CREATE_FRIEND_REQUEST: "Got some error when create friend request",
        CODE_ERROR_WHEN_UPDATE_CREATE_USER: "Got some error when create user",
        CODE_ERROR_SERVER: "Got some error",
        CODE_ERROR_FRIEND_REQUEST_NOT_FOUND: "Friend request not found",
        CODE_ERROR_NOTIFICATION_CODE_NOT_FOUND: "Notification not found",
        CODE_ERROR_COMMENT_CODE_NOT_FOUND: "Comment not found",
        EMAIL_LOGIN_FAIL: "Email not allow",
        CODE_ERROR_WHEN_UPDATE_CREATE_COMMENT: "Got some error when create comment",
        CODE_ERROR_WHEN_UPDATE_CREATE_POST: "Got some error when create post",
        CODE_ERROR_WHEN_UPDATE_CREATE_CONVERSATION: "Got some error when create conversation",
        CODE_ERROR_WHEN_DELETE_POST: "Got some error when delete post",
        CODE_ERROR_WHEN_DELETE_COMMENT: "Got some error when delete comment",
        CODE_ERROR_WHEN_DELETE_NOTIFICATION: "Got some error when delete notification",
        CODE_ERROR_WHEN_UPDATE_CREATE_NOTIFICATION: "Got some error when update notification",
        CODE_ERROR_WHEN_PUSH_COMMENT: "Got some error when push comment to post",
        CODE_ERROR_WHEN_UPDATE_CREATE_GROUP: "Got some error when create group",
        CODE_ERROR_CONVERSATION_CODE_NOT_FOUND: "Conversation code not found",
        CREATE_USER_FAIL: "Create user fail",

    }
}

PAGING_LIMIT = 10

FRIEND = 'friend'
NOT_FRIEND = 'not_friend'
PENDDING = 'pendding'
WAIT_ACCEPT = 'wait_accept'

EVENT_COMMENT = "event_comment"
EVENT_CHAT = "event_chat"