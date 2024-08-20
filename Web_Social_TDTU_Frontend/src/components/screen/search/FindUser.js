import React, { useEffect, useState, } from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useSearchParams, Link } from 'react-router-dom';
import { getDataApiFindUser } from '../../../common/callapi/user'
import { getCookieToken } from '../../../common/functions'
import "../../../css/FindFriend.css"
import { getAllFriendOfUser, deleteFriend, createNewFriendRequest, acceptFriendRequest } from "../../../common/callapi/friend"
function FindUser() {
    var token = getCookieToken()
    const [searchParams, setSearchParams] = useSearchParams()
    const [allUser, setAllUser] = useState([])
    const [isChangebtnStyle, setisChangebtnStyle] = useState(false)

    var nameInSearchParam = searchParams.get('name')
    const callApiRequestNewFriend = async (friendusercode) =>{
        try {
            const result = await createNewFriendRequest(token, friendusercode);
            console.log(result?.response_status)
            if(result?.response_status.code === "00"){
                setisChangebtnStyle(true)
            }
          } catch (error) {
            console.error(error)
          }
    }
    const callApiAcceptFriendRequest = async (friendusercode) =>{
        try {
            const result = await acceptFriendRequest(token, friendusercode);
            console.log(result?.response_status)
            if(result?.response_status.code === "00"){
                setisChangebtnStyle(true)

            }
          } catch (error) {
            console.error(error)
          }
    }

     const callGetAllDeleteFriend = async (friendusercode) => {
        try {
            const result = await deleteFriend(token, friendusercode);
            console.log(result)
            if(result?.response_status.code === "00"){
                setisChangebtnStyle(true)

            }
        } catch (error) {
            console.error(error)
        }
    }
    function DeleteFriend(e) {
        var friendUserCode = e.target.attributes.getNamedItem('usercode').value;
        console.log("friendUserCode", friendUserCode)
        callGetAllDeleteFriend(friendUserCode)
      

    }

    function RequestNewFriend(e){
        var usercodeWantToRequest = e.target.attributes.getNamedItem('usercode').value;
        callApiRequestNewFriend(usercodeWantToRequest)

    }

    function AcceptFriendRequest(e){
        var usercodeWaitForAccept = e.target.attributes.getNamedItem('usercode').value;
        callApiAcceptFriendRequest(usercodeWaitForAccept)
    }
    useEffect(() => {
        var listUser = []
        const dataUserFound = async () => {
            try {
                const result = await getDataApiFindUser(token,nameInSearchParam);
                console.log(result?.data)
                if (result?.data.length > 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        var btn = ""
                        if(result.data[i].is_current_login_user === false){
                            if(result.data[i].friend_status === "friend"){
                                btn=<Button variant='danger' onClick={DeleteFriend} usercode={result.data[i].user_code}>Hủy kết bạn</Button>
    
                            }
                            if(result.data[i].friend_status === "not_friend"){
                                btn=<Button variant='success'  onClick={RequestNewFriend} usercode={result.data[i].user_code}>Thêm bạn bè</Button>
                             
                              
                            }
                            if(result.data[i].friend_status === "pendding"){
                                btn=<Button variant='light' disabled usercode={result.data[i].user_code}>Đã gửi lời mời</Button>
        
                               
                            }
                            if(result.data[i].friend_status === "wait_accept"){
                                btn=<Button  onClick={AcceptFriendRequest} usercode={result.data[i].user_code}>Xác nhận</Button>
                            
                            }
                        }
                        listUser.push(  
                            <div className='find-user-item bg-custom'>
                                    <div className='info-find-user'>
                                        <div className='my-auto'>
                                            <img src={result.data[i].picture} className='rounded-circle mr-1 p-1' width={70} height={70} alt='avatar'></img>
                                        </div>
                                        <div className='my-auto flex-grow-1'>
                                            <h5><Link className='text-dark fw-bold text-decoration-none' to={`/profile/${result.data[i].user_code}/post/`} state={{ 'usercode': "" }}>{result.data[i].fullname}</Link></h5>
                                        </div>
                                    </div>
                                    <div className='my-auto me-2'>{btn}</div>
                            </div>
                        )
                
                     
                    }
                }
                else{
                    listUser.push( <div className='row d-flex justify-content-center align-items-center'>Không tìm thấy người dùng này</div>)
                }
                setAllUser(listUser)
            } catch (error) {
                console.error(error)
            }
        }
        setisChangebtnStyle(false)
        dataUserFound()
    }, [nameInSearchParam, isChangebtnStyle])
    // console.log(allUser)
    return (
        <div className='container find-user'>
            <div className='header-find-user'>
                <h3>Những người bạn mà bạn có thể biết</h3>
            <hr className='border-5'></hr>

            </div>
            <div className='find-user-list'>
                {allUser}

            </div>
        </div>
    )
}

export default FindUser