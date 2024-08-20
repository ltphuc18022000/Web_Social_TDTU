import React, { useState, useEffect, useRef, useContext} from 'react';
import "../../../css/chat.css";
import {getAllFriendOfUser} from "../../../common/callapi/friend"
import { getCookieToken } from '../../../common/functions';
import {getDataApiDetailUserLogin} from "../../../common/callapi/user"
import {createGroupConversation, UpdateGroupConversation} from "../../../common/callapi/chat"
import Alert from 'react-bootstrap/Alert';
import InfiniteScroll from 'react-infinite-scroll-component';
export default function ModelCreateGroupChat(props) {
    const {close, userLogin, isUpdate, conversationCode} = props 
    const token = getCookieToken()
    const [listFriend, setListFriend] = useState([])
    const [objectFriendInfo, setObjectFriendInfo] = useState(null)
    const [userChooseInfo, setUserChooseInfo] = useState(null) // lưu object user bao gồm
    const [userChoose, setUserChoose] = useState([]) // code html hieenr thij user được chọn
    const [listUserCode, setListUsercode] = useState([])
    const [messE, setmessE] = useState("")
    const [lastFriendId, setLastFriendId] = useState("")
    // const listUserCodeForCreate = []
    var user_code__info_user = {}
    // const [userLogin, setUserLogin] = useState()
// 
    function addUserToGroup(e){
        console.log("vao roi")
        try{
            var usercode = e.target.attributes.getNamedItem('usercode').value
            console.log(usercode, user_code__info_user)
            if (user_code__info_user){
                console.log("dfdfdf", user_code__info_user.hasOwnProperty(usercode))
                if (user_code__info_user.hasOwnProperty(usercode)){
                    // if(userChoose.length===0){
                        console.log("voooo", user_code__info_user[usercode])
                        setUserChooseInfo(user_code__info_user[usercode])
                        // setUserChoose([   
                        //     <a className='btn btn-header-chat-custom p-2 m-1 align-item-center'>
                        //     Xinh
                        //     {/* icon xoas */}
                        //     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        //     </a>])
                    // }
                // else{
                    // setUserChoose([...userChoose, ...[   
                    //     <a className='btn btn-header-chat-custom p-2 m-1 align-item-center'>
                    //     Xinh
                    //     {/* icon xoas */}
                    //     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    //     </a>]])
                // }
             
                 
                }
            }
        }
        catch(error){
            console.log("loi roi ")
            console.error(error)
        }
    }

    useEffect(()=>{
        if(userChooseInfo!== null){
            setListUsercode([...listUserCode, ...[userChooseInfo?.user_code]])
            setUserChoose([...userChoose, ...[   
                <a className='btn btn-header-chat-custom p-2 m-1 align-item-center'>
                {userChooseInfo?.given_name}
                {/* icon xoas */}
                {/* <svg onClick = {removeFromcurrentChooseGroup} usercode = {userChooseInfo.user_code} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line onClick = {removeFromcurrentChooseGroup} usercode = {userChooseInfo.user_code} x1="18" y1="6" x2="6" y2="18"></line><line onClick = {removeFromcurrentChooseGroup} usercode = {userChooseInfo.user_code} x1="6" y1="6" x2="18" y2="18"></line></svg> */}
                </a>]])
        }

    }, [userChooseInfo])


    const removeFromcurrentChooseGroup = (e)=>{
        var usercode = e.target.attributes.getNamedItem('usercode').value
        console.log("listUserCodeForCreate", listUserCode, usercode)
        const index = listUserCode.indexOf(usercode); 
        console.log(index)

    }
    const callApiGetAllFriend = async(usercode) =>{
        const result = await getAllFriendOfUser(token, usercode)
        if(result?.response_status.code){
            var friends = []
            if(result?.data.list_friend_info.length > 0){
               
                result?.data.list_friend_info.forEach(friend =>{
                    user_code__info_user[friend.user_code] = friend 
                    friends.push(       
                    <div className="list-group-add-item  p-2">
                        <div className="d-flex align-items-center list-group--padding">
                            {/* avatar friend chat */}
                            <img src={friend?.picture} className="rounded-circle mr-1  mt-2" alt="Avatar" width={50} height={50} />
                        
                            <div className="m-2 text-algin-left">
                                <span>{friend?.fullname}</span>
                            </div>
                            

                        </div>
                        {/* button chọn add vao nhóm */}
                        <button onClick ={addUserToGroup} usercode = {friend?.user_code} type="button" className='btn btn-danger btn-sm'>
                            <svg onClick ={addUserToGroup} usercode  = {friend?.user_code} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line onClick ={addUserToGroup} usercode = {friend?.user_code} x1="12" y1="5" x2="12" y2="19"></line><line onClick ={addUserToGroup} usercode = {friend?.user_code} x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>)
             
                })
                setLastFriendId(result?.data.last_friend_id)
            }
            setObjectFriendInfo(user_code__info_user)
            setListFriend(friends)
        }
        
    }
    // const onloadMoreFriend = async() =>{
    //     console.log(lastFriendId)
    //     const result = await getAllFriendOfUser(token, userLogin?.data.user_code, lastFriendId)
    //     if(result?.response_status.code){
    //         var friends = []
    //         if(result?.data.list_friend_info.length > 0){
    //             console.log(result?.data.last_friend_id)
    //             setLastFriendId(result?.data.last_friend_id)
    //             result?.data.list_friend_info.forEach(friend =>{
    //                 user_code__info_user[friend.user_code] = friend 
    //                 console.log("ssssssssssssssssss", friend?.fullname)
    //                 friends.push(       
    //                 <div className="list-group-add-item  p-2">
    //                     <div className="d-flex align-items-center list-group--padding">
    //                         {/* avatar friend chat */}
    //                         <img src={friend?.picture} className="rounded-circle mr-1  mt-2" alt="Avatar" width={50} height={50} />
                        
    //                         <div className="m-2 text-algin-left">
    //                             <span>{friend?.fullname}</span>
    //                         </div>
                            

    //                     </div>
    //                     {/* button chọn add vao nhóm */}
    //                     <button onClick ={addUserToGroup} usercode = {friend?.user_code} type="button" className='btn btn-danger btn-sm'>
    //                         <svg onClick ={addUserToGroup} usercode  = {friend?.user_code} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    //                             <line onClick ={addUserToGroup} usercode = {friend?.user_code} x1="12" y1="5" x2="12" y2="19"></line><line onClick ={addUserToGroup} usercode = {friend?.user_code} x1="5" y1="12" x2="19" y2="12"></line>
    //                         </svg>
    //                     </button>
    //                 </div>)
             
    //             })
             
    //         }
    //         setObjectFriendInfo(user_code__info_user)
    //         setListFriend([ ...listFriend, ...friends])
    //     }
    // }


    const callApiCreateGroup = async(data_user_code,name) =>{
        await createGroupConversation(token,data_user_code, name)
        window.location.reload(true);

    }
    const callApiUpdateGroup = async(data_user_code,name) =>{

        try{
            var result = await UpdateGroupConversation(token, conversationCode, data_user_code, name)
            if (result.hasOwnProperty('detail')){   
                setmessE(result?.detail?.message)
                
            }
            else{
                window.location.reload(true);
            }

        }
        catch(error){
            console.log(error)
        }


    }
    
    // const dataProfileUser = async () => {
    //     try {
    //         const userInfo = await getDataApiDetailUserLogin(token);
    //         setUserLogin(userInfo)

    //     } catch (error) {
    //         console.error(error)
    //     }
    // }
    useEffect(()=>{
        callApiGetAllFriend(userLogin?.data.user_code)

    }, [])
    function creategroup(){
        try{
            callApiCreateGroup(listUserCode, "")
        }
        catch(error){
            console.log(error)
        }

    }
    function updategroup(){
        try{
        callApiUpdateGroup(listUserCode, "")
        }
        catch(error){
            
            console.log(error)
        }

    }

    useEffect(()=>{
        if(messE!==""){
            setTimeout(() => {
                setmessE("");
            }, 3000);
        }

    }, [messE])
    return(
        <div>
        {messE && <Alert key={'danger'} variant={'danger'}>
            {messE}
        </Alert>}
        {/* The Modal */}
        <div className="modal-post-container p-5 border bg-custom mt-1 h-100" >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className='modal-post-header-custom'>
                        <a className='btn btn-custom ' onClick={close}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </a>
                    </div>
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h4 className="modal-title text-white">Tạo Nhóm Chat</h4>
                    </div>
                    {/* Modal body */}
                    <div className="modal-body">
                        <form>
                            {/* list friend chon add vào group */}
                           <div>
                           <div className='m-2 list-item-add'>
                           {userChoose}
                                {/* <a className='btn btn-header-chat-custom p-2 m-1 align-item-center'>
                                    Xinh
                  
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </a>
                                <a className='btn btn-header-chat-custom p-2 m-1 align-item-center'>
                                    Như
                       
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </a>
                                <a className='btn btn-header-chat-custom p-2 m-1 align-item-center'>
                                    Anh
                     
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </a>
                                */}
                            </div>
                            <div className="list-friend-group" id = 'scrollableParent'>  
                            {listFriend}
                                {/* <InfiniteScroll
                                dataLength={1}
                                next={onloadMoreFriend}
                                hasMore={true}
                                loader={""} 
                                scrollableTarget='scrollableParent'
                                >
                         
                         
                                </InfiniteScroll>
                     */}
                                 
                                </div>
                           </div>
                        </form>
                        {/* Modal footer */}
                        <div className="modal-footer p-2 ">
                            <button type="button" onClick={isUpdate? updategroup : creategroup}  className="btn btn-success btn-lg m-1 w-100 align-item-center">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
