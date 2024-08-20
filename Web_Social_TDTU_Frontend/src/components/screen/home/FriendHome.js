import { Link, useNavigate } from 'react-router-dom';
import { getAllFriendOfUser, deleteFriend } from "../../../common/callapi/friend"
import { createConversation } from "../../../common/callapi/chat"
import { useEffect, useState } from 'react';
import { getCookieToken } from '../../../common/functions';
import "../../../css/listfriend.css";
import "../../../css/style.css";

function FriendHome(props) {
    const {usercode} = props
    const [listFriend, setListFriend] = useState()
    const token = getCookieToken()
    const navigate = useNavigate();


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
    const callApiCreateConversation = async (user_code_need_to_chat) =>{
        try {
            const result = await createConversation(token, user_code_need_to_chat);
            if(result?.response_status.code === "00"){
                console.log("success")
                navigate(`/chat`,{ replace: true });
            }
        } catch (error) {
            console.error(error)
        }
    }
     function gotoChatPage(e){
        // console.log("123123",  e.target.attributes.getNamedItem('usercode'))
        var friendUserCode = e.target.attributes.getNamedItem('friendusercode').value;
        // chỗ này là ví dụ sử dụng navigate
        callApiCreateConversation(friendUserCode) 


    }
    function DeleteFriend(e) {
        var friendUserCode = e.target.attributes.getNamedItem('friendusercode').value;
        callGetAllDeleteFriend(friendUserCode)
      

    }
    const callGetAllFriendOfUser = async ()=> {
        var friends = []
        const result = await getAllFriendOfUser(token, usercode);
        if(result?.response_status.code==="00"){
            if(  result?.data.list_friend_info.length > 0){
                result?.data.list_friend_info.forEach(friend => {
                    friends.push(
                        <>
                            <div className="media card-friend-home">
                                <img src={friend.picture} width={56} height={56} className="rounded-circle mr-2" alt="Chris Wood" />
                                <div className="media-body">
                                    <p className="my-1"><strong>{friend.fullname}</strong></p>
                                    <div className='card-btn-home'>
                                        <a className="btn btn-sm  btn-outline-primary m-1" friendusercode={friend.user_code} onClick={DeleteFriend}>Unfriends</a>
                                       <div> 
                                       <a className="btn btn-sm btn-outline-primary m-1" onClick={gotoChatPage} friendusercode={friend.user_code}>
                                            Chat
                                        </a>
                                       </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-2" />
                            </>
    
                    )
                })
                setListFriend(friends)
            }
            else{
                setListFriend(<div className="media card-friend-home"> Chưa có bạn bè </div>)
            }
            
    
            
        }
    }
    useEffect(()=>{
        callGetAllFriendOfUser()
    }, [])
    return (
       <>
         {listFriend}
         </>
      
    )
}

export default FriendHome