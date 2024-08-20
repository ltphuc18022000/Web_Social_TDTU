import { faEllipsisH } from '@fortawesome/fontawesome-free-solid';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllFriendOfUser, deleteFriend } from "../../../common/callapi/friend"
import { useEffect, useState } from 'react';
import { getCookieToken } from '../../../common/functions';
import "../../../css/listfriend.css";
import "../../../css/style.css";
function ListFriend(props) {
    const { usercode, userLogin } = props
    const token = getCookieToken()
    const [elementFriend, setElementFriend] = useState()
    const navigate = useNavigate()
    function goToFriendPage(e){
        var usercode = e.target.attributes.getNamedItem('usercode').value
        navigate(`/profile/${usercode}/post/`, { replace: true, state: { 'usercode': usercode } });
    }
    const callGetAllFriendOfUser = async () => {
        var cardRow = []
   
        try {
            const result = await getAllFriendOfUser(token, usercode);
            if (result.data.list_friend_info.length > 0) {
                for (var i = 0; i < result.data.list_friend_info.length; i++) {
                    cardRow.push(
                        
                        <div className='friends-profile bg-custom m-2 p-2'>
                            <div className='friend_card'>
                                <div className="card-body ">
                                    <div className="media card-friend-profile">
                                        <img src={result.data.list_friend_info[i].picture} width={56} height={56} className="rounded-circle mr-2" alt="avatar" />
                                        <div className="media-body">


                                        <div onClick={goToFriendPage} usercode = {result.data.list_friend_info[i].user_code } className='card-title text-decoration-none mb-0' > {result.data.list_friend_info[i].fullname}</div>
                                            {/* <div className='card-btn-home'>
                                                <a className="btn btn-sm btn-outline-primary m-1" href="#">Unfriend</a>
                                                <a className="btn btn-sm btn-outline-primary m-1" href="#">Chat</a>
                                            </div> */}
                                        </div>
                                        {/* nếu đang ở trang cá nhân của mình thì mới hiển thị nút xóa bạn bè*/}
                                        {userLogin?.data.user_code === usercode &&
                                        <div className='col-2 md-2'>
                                            <div>
                                                <Popup
                                                    trigger={<div className='three-dot-icon '><FontAwesomeIcon icon={faEllipsisH} /> </div>}
                                                    position='right top'
                                                    on='click'
                                                    closeOnDocumentClick
                                                    mouseLeaveDelay={300}
                                                    mouseEnterDelay={0}
                                                    contentStyle={{ padding: '0px', border: 'none' }}
                                                    arrow={false}
                                                >
                                                    <div type='button' className='btn btn-danger' friendusercode={result.data.list_friend_info[i].user_code} onClick={DeleteFriend}>
                                                        Hủy kết bạn
                                                    </div>
                                                </Popup>
                                            </div>
                                        </div>
                                         }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                setElementFriend(cardRow)
            }
            else {
                cardRow.push(
                    <div className='text-secondary fs-4'>Bạn chưa có người bạn nào, hãy kết bạn thêm nhé</div>)
                // console.log("váo ")
                // setListFriendUser([])
                setElementFriend(cardRow)
            }

        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => {
        callGetAllFriendOfUser()


    }, [])
    const callGetAllDeleteFriend = async (friendusercode) => {
        try {
            const result = await deleteFriend(token, friendusercode);
            if(result?.response_status.code === "00"){
                callGetAllFriendOfUser()
            }
        } catch (error) {
            console.error(error)
        }
    }
    function DeleteFriend(e) {
        var friendUserCode = e.target.attributes.getNamedItem('friendusercode').value;
        callGetAllDeleteFriend(friendUserCode)
      

    }



    return (
                <div className='container p-3'>
                    <div className='friend_profile_container p-3'>
                        <div className='listfriend_title'>
                                <div className="card-header">
                                    <h3 className="card-title text-white mb-0">Friends</h3>
                                </div>
                                <hr className='border-5'/>
                            
                            
                        </div>
                        <div className='card-body'>
                            <div className='listfriend_content'>
                                {elementFriend}
                            </div>

                        </div>
                    </div>
                </div>
    )
}

export default ListFriend