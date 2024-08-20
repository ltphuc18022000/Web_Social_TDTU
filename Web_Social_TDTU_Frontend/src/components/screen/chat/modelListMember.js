import React, { useState, useEffect, useRef, useContext } from 'react';
import { GetConversationInfo } from "../../../common/callapi/chat"
import "../../../css/chat.css";
import { getCookieToken } from '../../../common/functions';
export default function ModelListMember(props) {
    const { close, conversationCode } = props
    const [users, setUser] = useState([])
    const token = getCookieToken()
    const callApiGetConverInfo = async () => {
        try {
            const result = await GetConversationInfo(token, conversationCode)
            if (result?.response_status?.code === "00") {
                console.log(result)
                var listUser = []
                if (result?.data?.members_obj.length > 0) {

                    result?.data?.members_obj.forEach(user => {
                        listUser.push(
                            <div>
                                <div className="d-flex align-items-center list-group--padding list-group-add-item">
                                    {/* avatar friend chat */}
                                    <img src={user?.picture} className="rounded-circle mr-1  mt-2" alt="Avatar" width={50} height={50} />

                                    <div className="m-2 text-algin-center">
                                        <span>{user?.fullname}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    });
                }
                setUser(listUser)
            }
        }
        catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        callApiGetConverInfo()

    }, [])

    return (
        <div>
            {/* The Modal */}
            <div className="modal-post-container p-5 border bg-custom mt-1 h-100" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title text-white">Thành viên nhóm</h4>
                        </div>
                        {/* Modal body */}
                        <div className="modal-body">
                            <form>
                                {/* list friend chon add vào group */}
                                <div>

                                    <div className="list-friend-group">
                                        {users}
             
                       
                                    </div>
                                </div>
                            </form>
                            {/* Modal footer */}
                            <div className="modal-footer p-3">
                                <button type="button" className="btn btn-secondary m-1" data-dismiss="modal" onClick={close}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
