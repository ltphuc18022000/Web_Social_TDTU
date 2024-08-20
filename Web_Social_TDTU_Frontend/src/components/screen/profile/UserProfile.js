import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import {getDataApiProfileUser, getDataApiDetailUserLogin} from "../../../common/callapi/user"
import {acceptFriendRequest, createNewFriendRequest, denyFriendRequest} from "../../../common/callapi/friend"
import InfoUserInUserProfile from "./InfoUserInUserProfile"
import PostInProfile from "./PostInProfile"
import ListFriend from "../friend/Listfriend"
import { getCookieToken } from '../../../common/functions';
import "../../../css/userProfile.css"
function UserProfile() {
    const navigate = useNavigate();
    const {usercode} = useParams()
    console.log("user", usercode)
    const [userLogin, setUserLogin] = useState()
    const [chooseMenu, setChooseMenu] = useState("post") // đang chọn tab menu nào post, user, fiend, mặc định là post
    const [inforUserInCurrentPage, setUserInfoCurrentPage] = useState() // thông tin của user ở trang cá nhân hiện tại theo usercode
    const token = getCookieToken()
    const [btnFriendStatus, setBtnFriendStatus] = useState() // dùng để gắn code html của nut bấm
    const dataCurentUserLogin = async () =>{
        try {
            const result = await getDataApiDetailUserLogin(token);
            console.log(result)
            setUserLogin(result)
          } catch (error) {
            console.error(error)
          }
    }

    
    useEffect(()=>{
        const dataProfileUser = async () =>{
            try {
                const result = await getDataApiProfileUser(token, usercode);
                console.log(result)
                setUserInfoCurrentPage(result)
              } catch (error) {
                console.error(error)
              }
        }
        dataProfileUser() 
        dataCurentUserLogin()
    }, [usercode])
    const callApiRequestNewFriend = async (usercode) =>{
        try {
            const result = await createNewFriendRequest(token, usercode);
            console.log(result?.response_status)
            if(result?.response_status.code === "00"){
                setBtnFriendStatus(
                    <div className='btn btn-success d-block d-md-inline-block lift send-friend-request'>Đã gửi lời mời</div>)
            }
          } catch (error) {
            console.error(error)
          }
    }
    const callApiAcceptFriendRequest = async (usercode) =>{
        try {
            const result = await acceptFriendRequest(token, usercode);
            console.log(result?.response_status)
            if(result?.response_status.code === "00"){
                setBtnFriendStatus(
                    <div className='btn btn-success d-block d-md-inline-block lift send-friend-request'>Bạn bè</div>)
            }
          } catch (error) {
            console.error(error)
          }
    }
     const callApiDenyFriendRequest = async (usercode) => {
        try {
            const result = await denyFriendRequest(token, usercode);
            console.log(result?.response_status)
            if(result?.response_status.code === "00"){
                setBtnFriendStatus(
                    <div usercode={inforUserInCurrentPage?.data.user_code} onClick={RequestNewFriend} className='btn btn-success d-block d-md-inline-block lift send-friend-request'>Thêm bạn bè</div>)
            }
          } catch (error) {
            console.error(error)
          }
     }

    function DenyFriendRequest(e){
        var usercodeWantToRequest = e.target.attributes.getNamedItem('usercode').value;
        callApiDenyFriendRequest(usercodeWantToRequest)
    }

    function RequestNewFriend(e){
        var usercodeWantToRequest = e.target.attributes.getNamedItem('usercode').value;
        callApiRequestNewFriend(usercodeWantToRequest)

    }

    function AcceptFriendRequest(e){
        var usercodeWaitForAccept = e.target.attributes.getNamedItem('usercode').value;
        callApiAcceptFriendRequest(usercodeWaitForAccept)
    }
    
    function gotoChatPage(){
        navigate(`/chat`,{ replace: true });
    }
    useEffect(()=>{

        const dataProfileUser = async () =>{
            try {
                const result = await getDataApiProfileUser(token, usercode);
                console.log(result)
                setUserInfoCurrentPage(result)
              } catch (error) {
                console.error(error)
              }
        }
        dataProfileUser() 
    }, [])

    // phần hiển thị nút bạn bè/ thêm bạn/ đã gửi lời mời
    
    useEffect(()=> {
        if(inforUserInCurrentPage?.data.is_current_login_user === false){
            if(inforUserInCurrentPage?.data.friend_status === "friend"){
                setBtnFriendStatus(
                    <div className='btn btn-success d-block d-md-inline-block lift send-friend-request'>Bạn bè</div>)
            }
            if(inforUserInCurrentPage?.data.friend_status === "not_friend"){
                setBtnFriendStatus(
                    <div usercode={inforUserInCurrentPage?.data.user_code} onClick={RequestNewFriend} className='btn btn-success d-block d-md-inline-block lift send-friend-request'>Thêm bạn bè</div>)
            }
            if(inforUserInCurrentPage?.data.friend_status === "pendding"){
                setBtnFriendStatus(
                    <div className='btn btn-success d-block d-md-inline-block lift send-friend-request'> Đã gửi lời mời</div>)
            }
            if(inforUserInCurrentPage?.data.friend_status === "wait_accept"){
                setBtnFriendStatus(
                    <><div usercode={inforUserInCurrentPage?.data.user_code} onClick={AcceptFriendRequest} className='btn btn-warning d-block d-md-inline-block lift send-friend-request'>Chấp nhận lời mời</div>
                    <div usercode={inforUserInCurrentPage?.data.user_code} onClick={DenyFriendRequest} className='btn btn-danger d-block d-md-inline-block lift send-friend-request'>Từ chối</div></>)
            }
        }

    }, [inforUserInCurrentPage])



    return (
            <div className='bg-light profile-header m-2'>
                <div className='h-100'>
                    <div className='header'>
                        <div className='background-profile--position image-fluid'>
                            <img src={inforUserInCurrentPage?.data.background_picture} alt='Blog img' 
                            className='image-background-profile'></img>
                           
                        </div>

                        <div className='container-fluid'>
                            <div className='header-body mt-n5 mt-md-n6'>
                                <div className='avatar-content-profile align-items-end'>

                                    <div className='col-auto'>
                                        <div className='avatar avatar-xxl header-avatar-top'>
                                            <img alt='user logo' src={inforUserInCurrentPage?.data.picture} 
                                            className='avatar-img rounded-circle border border-4 border-body'></img>
                                        </div>

                                    </div>

                                    <div className='col mb-3 ml-n3 ml-md-n2'>
                                        <h1 className='header-title'>
                                            {inforUserInCurrentPage?.data.fullname}
                                        </h1>
                                        <h6 className='header-pretitle'>
                                            Class: {inforUserInCurrentPage?.data.class_name}
                                        </h6>

                                    </div>
                                    {/*- phần btn hiện thị kêt bạn/ban bè/đã gửi lời mời và btn tin nhắn
                                        - nut xem tin nhắn nếu là ở trang người khác sẽ là nhắn tin còn trang bản thân sẽ là vào trang tin nhắn*/}
                                    <div className='col-12 col-md-auto mt-2 mt-md-0 mb-md-3'>

                                        {btnFriendStatus}
                                        <button type='button' onClick={gotoChatPage} className='btn btn-primary  d-md-inline-block lift'>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-chat-square-dots-fill' viewBox='0 0 16 16'>
                                                <path d='M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' />
                                            </svg> {inforUserInCurrentPage?.data.is_current_login_user !== false ? 'Xem tin nhắn' : 'Nhắn tin'}
                                        </button>

                                    </div>
                                

                                </div>
                                <hr></hr>

                                <div className='row align-items-center tab-bar-post-user'>
                                    <ul className='nav nav-tabs nav-overflow header-tabs'>
                                        <li className='nav-item'>
                                            <Link  to={`/profile/${usercode}/post`} className={chooseMenu === 'post' ? 'active nav-link' : 'nav-link'} onClick={() => { setChooseMenu('post') }}>Bài đăng</Link>
                                        </li>
                                        <li className='nav-item'>
                                            <Link  to={`/profile/${usercode}/friend`} className={chooseMenu === 'friend' ? 'active nav-link' : 'nav-link'} onClick={() => { setChooseMenu('friend') }}>Bạn bè</Link>
                                        </li>
                                        <li className='nav-item'>
                                            <Link  to={`/profile/${usercode}/infomation`} className={chooseMenu === 'infomation' ? 'active nav-link' : 'nav-link'} onClick={() => { setChooseMenu('infomation') }}>Thông tin</Link>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div className='container-tab-body '>
                                <Routes>
                                    <Route path='/post' element={<PostInProfile userLogin = {userLogin} usercode={usercode}/>}></Route>

                                    {/* <Route path='/post'     component={() =><PostCard id={idUser} />}></Route> */}
                                    { /* 
                                    */}
                                    <Route path='/friend' element={<ListFriend userLogin = {userLogin} usercode={usercode}/>}></Route>
                                    <Route path='/infomation' element={<InfoUserInUserProfile userLogin = {userLogin} usercode={usercode} />}></Route>
                                </Routes>
                            </div>

                        </div>
                    </div>

                </div>

            
            </div>
            
    )

}
export default UserProfile
