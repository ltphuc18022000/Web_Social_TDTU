import React, { useState, useEffect, useRef, useContext} from 'react';
import {getListConversation, getListMess, createMess, DeleteUserFromGroup} from "../../../common/callapi/chat"
import {getDataApiDetailUserLogin} from "../../../common/callapi/user"
import { SocketContext } from '../../../thirdparty/socket';
import "../../../css/chat.css";
import "../../../css/style.css";
import Popup from 'reactjs-popup';
import ModelCreateGroupChat from '../chat/model_create_group';
import ModelListMember from './modelListMember';
import InfiniteScroll from 'react-infinite-scroller';
import { getCookieToken } from '../../../common/functions';
import imageGroup from "../../../image/two-people.png";
import Alert from 'react-bootstrap/Alert';
function ChatPage() {
    const socket = useContext(SocketContext);
    const [lastConversationId, setLasConversationId] = useState()
    const [conversationInfo, setConversationInfo] = useState()
    const [messageInfo, setMessageInfo] = useState() // này đẻ lưu lại response từ backend khi vừa gọi xong api 
    const [lastMessId, setlastMessId] = useState()
    const [userLogin, setUserLogin] = useState()
    const [firstConversationCode, setfirstConversationCode] = useState()
    const [currentConversationCode, setcurrentConversationCode] = useState()
    const [reloadListMess, setreloadListMess] = useState(true)
    const [newChatRealTime, setNewChatRealTime] = useState()

    const [message, setMessage] = useState() // sử dụng để cập nhật thay đổi mess, bao gồm code html 
    const [newMess, setNewMess] = useState() // biến dùng để handle dữ liệu nhập ở input
    const [isScrollDownToBottom, setIsScrollDownToBottom] = useState(false) // biến dùng để handle khi nào thì nên tự động scroll xuống 
    const [onloadMore, setOnLoadMore] = useState(false)
    const [currentUserChatOrNameGroupChat, setcurrentUserChatOrNameGroupChat] = useState()
    const [changeName, setchangeName] = useState()
    const [isGroup, setIsGroup] = useState()
    const [groupBtn, setGroupBtn] = useState()
    const [messE, setmessE] = useState("")
    const token = getCookieToken()
    const btnElement = useRef()
    const btncreate = useRef()
    const messageRef = useRef(null)

    const parentRef = useRef(null);
    // này dùng để check nếu như scroll lên trên cùng của message sẽ thiết lập cho phép get data hay khong
    useEffect(() => {
        const handleScroll = (e) => {
            try{
                const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
                // Check if the scroll position is at the top
                  if (scrollTop === 0) {
                      console.log('Scroll is at the top of the parent div');
                      setOnLoadMore(true)
                      // parentRef.current.scrollTop = 50;
                      
                      
                    }
            }
            catch(error){
                console.error(error)
            }
     
        //   }
      
        };
    
        // Add event listener to the scroll event of the parent div
        parentRef.current.addEventListener('scroll', handleScroll);
    
        // Clean up by removing the event listener when component unmounts
        return () => {
            try{
                parentRef.current.removeEventListener('scroll', handleScroll);
            }
            catch(error){
                console.error(error)
            }

        };
      }, [currentConversationCode]); // cho thiết lâp theo conversation code để mỗi khi chọn qua conversation khác sẽ ko bị mất thanh scroll

    // tự động scroll xuống dưới
    useEffect(() => {
    if(isScrollDownToBottom === true){
        messageRef.current?.scrollIntoView() // tự động scroll xuống cuối 
        setIsScrollDownToBottom(false)
    }
    
    }, [message, currentConversationCode]) // set ,mỗi khi có mess mới hoặc đổi qua convert khác thì sẽ tự động scroll xuống
    // receive mess realtime
    useEffect(()=>{
        socket.on("event_chat", dataChat =>{
            setNewChatRealTime(dataChat)
        })
    }, [socket])
    useEffect(()=>{
        if(newChatRealTime?.data){
            setMessageInfo([...[newChatRealTime?.data], ...messageInfo])
        }

    }, [newChatRealTime])

    // hiển thị tên nhóm chat khi click qua conversation khác
    useEffect(()=>{
        setchangeName(<strong className='front_text_white'>{currentUserChatOrNameGroupChat}</strong>)
    }, [currentUserChatOrNameGroupChat])


    const dataProfileUser = async () => {
        try {
            const userInfo = await getDataApiDetailUserLogin(token);
            setUserLogin(userInfo)

        } catch (error) {
            console.error(error)
        }
    }

        
    const callApigetListMess = async (conversationCode) =>{
        try{
            socket.emit("join_room", conversationCode)
            const result = await getListMess(token, conversationCode)
            if(result?.data?.list_mess_info?.length> 0){
                setMessageInfo(result?.data?.list_mess_info)
        
                setlastMessId(result?.data?.last_mess_id)
            }
            else{
                setMessageInfo([])
                setlastMessId("")
            }
            

        }catch(error){
            console.error(error)
        }
    }
    const onloadMoreMessOfConversation = async () =>{
        try{
            const result = await getListMess(token, currentConversationCode, lastMessId)
            if(result?.data?.list_mess_info?.length> 0){
                setOnLoadMore(false)
                setMessageInfo([...messageInfo, ...result?.data?.list_mess_info])
                setlastMessId(result?.data?.last_mess_id)
            }

            

        }catch(error){
            console.error(error)
        }
    }

    function handleInput(event) {
        setNewMess(event.target.value)
    }
    //ĐIỀU HƯỚNG CLICK KHI CLICK NHẦM ICON CHỨ KO CLICK VÀO BTN
    function btncreateClick(){
        btncreate.current.click()
    }

    // thiết lập nhấn enter để chat

    function getMessOfConverstation(e){
        try{

            var convercode = e.target.attributes.getNamedItem('convercode')?.value
            var nameconvert = e.target.attributes.getNamedItem('nameconvert')?.value
            var isgroup = e.target.attributes.getNamedItem('isgroup')?.value
            setIsGroup(isgroup)
            setcurrentUserChatOrNameGroupChat(nameconvert)
            if(convercode !== undefined){
                setcurrentConversationCode(convercode)
                callApigetListMess(convercode)
                setIsScrollDownToBottom(true)
            }
   
        }
        catch(error){
            console.error(error)
        }
 
    }
    const callApiDeleteUserFromGroup = async() =>{
        try{
            const result = await DeleteUserFromGroup(token, currentConversationCode, [userLogin.data.user_code])
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
    const callGetAllConversation = async () => {
        try {
            const result = await getListConversation(token);
            if(result?.response_status.code === "00"){
                var listConversation = []
                if(result?.data.list_conversation_info?.length > 0){
                    setfirstConversationCode(result?.data.list_conversation_info[0].conversation_code)
                    setcurrentConversationCode(result?.data.list_conversation_info[0].conversation_code)
                   
                    for(var i =0 ; i< result?.data.list_conversation_info?.length; i++){
                        console.log(result?.data.list_conversation_info)
                        if(result?.data.list_conversation_info[i].type === "1"){
                            if(result?.data.list_conversation_info[i].members_obj.length >1){
                            setcurrentUserChatOrNameGroupChat(`${result?.data.list_conversation_info[i].members_obj[0].given_name}, ${result?.data?.list_conversation_info[i]?.members_obj[1].given_name} ...`)
                            }
                            else{
                                setcurrentUserChatOrNameGroupChat(`${result?.data.list_conversation_info[i].members_obj[0].given_name}`)

                            }
                        }
                        else{
                            if(result?.data.list_conversation_info[0].members_obj[0].user_code !== userLogin?.data.user_code){
                                setcurrentUserChatOrNameGroupChat(result?.data.list_conversation_info[0].members_obj[0].fullname)
                            }
                            else{
                                setcurrentUserChatOrNameGroupChat(result?.data.list_conversation_info[0].members_obj[1].fullname)
                            }
                        
                        }
                        if(result?.data.list_conversation_info[i].type === "0"){
                            listConversation.push(
                                // đổi thẻ a thành thẻ div chỗ này thì mới chạy được 
                                // <a className="list-group-item list-group-item-action p-2 list-group-item--select"  >
                                <a className="list-group-item list-group-item-action p-2 ">
                                    <div isgroup={"false"} nameconvert = {result?.data.list_conversation_info[i].members_obj[0].fullname} ref={btnElement} onClick={getMessOfConverstation} convercode = {result?.data.list_conversation_info[i].conversation_code} className="d-flex align-items-start list-group--padding">
                                        {/* avatar friend chat */}
                                        <img src={result?.data.list_conversation_info[i].members_obj[0].picture} className="rounded-circle mr-1  mt-2" alt="Avatar" width={50} height={50} />
                                    
                                        <div isgroup={"false"} nameconvert = {result?.data.list_conversation_info[i].members_obj[0].fullname}   onClick={getMessOfConverstation} convercode = {result?.data.list_conversation_info[i].conversation_code} className="pr-4 text-algin-left item-conversation">
                                            {result?.data.list_conversation_info[i].members_obj[0].fullname}

                                            {result.data.list_conversation_info[i].online ? <div className="small text-primary chat-online"><span> online</span></div> : <div className="small text-secondary chat-offline">Offline<span/> </div>}
                                        </div>

                                    </div>
                                </a>
                            )
                        }
                        else{
                            if(result?.data.list_conversation_info[i].members_obj.length >1){
                                var name_group = `${result?.data.list_conversation_info[i].members_obj[0].given_name}, ${result?.data?.list_conversation_info[i]?.members_obj[1].given_name} ...`
                            }
                            else{
                                var name_group = `${result?.data.list_conversation_info[i].members_obj[0].given_name}, ...`
                            }
                            listConversation.push(
                                // đổi thẻ a thành thẻ div chỗ này thì mới chạy được 
                                // <a className="list-group-item list-group-item-action p-2 list-group-item--select"  >
                                <a className="list-group-item list-group-item-action p-2 ">
                                    <div isgroup={"true"} nameconvert = {name_group}  ref={btnElement} onClick={getMessOfConverstation} convercode = {result?.data.list_conversation_info[i].conversation_code} className="d-flex align-items-start list-group--padding">
                                        {/* avatar friend chat */}
                                        <img src={imageGroup} className="rounded-circle mr-1  mt-2" alt="Avatar" width={50} height={50} />
                                    
                                        <div isgroup={"true"} nameconvert = {name_group}  onClick={getMessOfConverstation} convercode = {result?.data.list_conversation_info[i].conversation_code} className="pr-4 text-algin-left item-conversation">
                                            {result?.data.list_conversation_info[i].members_obj.length > 1 ? `${result?.data.list_conversation_info[i].members_obj[0]?.given_name},  ${result?.data.list_conversation_info[i].members_obj[1].given_name} ...` : `${result?.data.list_conversation_info[i].members_obj[0]?.given_name}...`}

                                            {result.data.list_conversation_info[i].online ? <div className="small text-primary chat-online"><span> online</span></div> : <div className="small text-secondary chat-offline">Offline<span/> </div>}
                                        </div>

                                    </div>
                                </a>
                            )
                        }
                    setConversationInfo(listConversation)
                }
            }
        }
        } catch (error) {
            console.error(error)
        }
    }
    const callApiCreateNewMess = async(conversationCode, text) =>{
        try{
            const result = await createMess(token,conversationCode, text)
            setMessageInfo([...[result?.data], ...messageInfo])
            setNewMess("")// cập nhật lại mess rỗng trong input 
            callGetAllConversation()
            setreloadListMess(false)
            setIsScrollDownToBottom(true)
        }
        catch(error){
            console.log(error)
        }
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            createNewMess()
        }
      };
    //hàm để onclick tạo mới mess
    // conversationcode và newMess đều được lưu ở state nên chỉ việc lấy ra dùng
    function createNewMess(e){
        callApiCreateNewMess(currentConversationCode, newMess)
    }

    useEffect(()=>{
        dataProfileUser()
        callGetAllConversation()
    }, [])

    // tự động lấy message cho conversation trong lần đầu tiên đi vào trang chat
    //getMessOfConverstation sẽ thiết lập sau khi đã vào trang chat bấm convert nào thì lấy message convert đó
    useEffect(()=>{
        if(reloadListMess===true){
            if (currentConversationCode !== undefined){
                callApigetListMess(currentConversationCode)
                setIsScrollDownToBottom(true)
            }
          
        }
        else{
            setreloadListMess(true)
        }

    }, [firstConversationCode])


    
    useEffect(()=>{
        var list_mess = []
        messageInfo?.slice().reverse().forEach(mess =>{
            if(mess['sender_code'] === userLogin['data']['user_code']){
                list_mess.push(

                    <div className="chat-message-right p-4">
                    <div>
                        <img src={userLogin['data']['picture']}  className="rounded-circle mr-1" alt="Chris Wood" width={40} height={40} />
                        {/* <div className="text-muted small text-nowrap mt-2">2:33 am</div> */}
                    </div>
                    <div className="flex-shrink-1 bg-custom text-white rounded py-2 px-3 mr-3 mess-text-content">
                        <span>
                        {mess.text}
                        </span>
                    </div>
                </div>
                )
            }
            else{
                list_mess.push(
                    <div className="chat-message-left pb-4">
                    <div>
                        <img src={mess?.sender_info?.picture}  className="rounded-circle mr-1" alt="Sharon Lessman" width={40} height={40} />
                        {/* <div className="text-muted small text-nowrap mt-2">2:36 am</div> */}
                    </div>
                    <div className="flex-shrink-1 bg-custom rounded py-2 px-3 ml-3 mess-text-content">
                        {mess.text}
                    </div>
                </div>
                )
            }
        }
        )
        setMessage(list_mess)
    }, [messageInfo])

    // thiết lập nút thêm người cho group, khi nào bấm vào group mới hiển thị lên 
    useEffect(()=>{
        if (isGroup === "true"){

            setGroupBtn(       
                <>   
            <Popup modal
                trigger={
                    <div className='button-group-create'>
                        <button className="btn border btn-success">Thêm người</button>
                    </div>
                }
            >
            {close => <ModelCreateGroupChat conversationCode={currentConversationCode}  isUpdate={true} userLogin={userLogin} close={close}/>}

            </Popup>
            <div className='button-group-create'>
                     <button onClick={callApiDeleteUserFromGroup} className="btn border btn-danger">Rời nhóm</button>
            </div>
            </>   
            )
        }
        else{
            setGroupBtn("")
        }


    }, [isGroup])

    useEffect(()=>{
        if(messE!==""){
            setTimeout(() => {
                setmessE("");
            }, 3000);
        }

    }, [messE])
    return (
        
        <div className='bg-light px-3'>
                 {messE && <Alert key={'danger'} variant={'danger'}>
            {messE}
        </Alert>}
           <div className='h-100'>
           <div className="row  row-content">
                    <div className="col-3 col-lg-3 col-xl-3 conversation-content">
                        <div className="p-2 d-none d-md-block">
                            <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                {/* <input type="text" className="form-control my-3 search-conversation" placeholder="Search message..." /> */}
                            </div>
                            </div>
                        </div>
                        {/* Danh sach cac chat */}
                        <div className='p-2 conversation-list-item'>
                            {conversationInfo}
                        </div>
                        {/* Tạo group */}
                        <div className='group-create'>
                            <div className='text-group-create'>
                                <span>Hãy tạo nhóm Chat</span>
                            </div>
                            
                            <Popup modal
                                trigger={
                                    <div className='button-group-create'>
                                        <button type="button" className="btn btn-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87">
                                            </path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            </svg>
                                        </button>
                                    </div>
                                }
                            >
                            {close => <ModelCreateGroupChat conversationCode={currentConversationCode} isUpdate={false} userLogin={userLogin} close={close}/>}

                            </Popup>

                        </div>
                        
                    </div>
                    {/* Khung chat  */}
                    <div className="col-9 col-lg-9 col-xl-9 chat-container">
                        <div className="py-2 d-lg-block header-chat">
                            {/* Header khung chat */}
                            <div className="d-flex align-items-center p-1 ">
                                {/* avatar */}
                                <div className="position-relative">
                                    <img src="https://cdn1.iconfinder.com/data/icons/animals-95/300/cat-circle-animal-pet-wild-domestic-256.png" className="rounded-circle m-2" alt="Sharon Lessman" width={50} height={50} />
                                </div>
                                <div className='m-3'>
                                <Popup modal
                                    trigger={
                                        <div className='button-group-create'>
                                        <button  className="btn border btn-info">Xem thành viên</button>
                                    </div>  
                                    }
                                >
                                {close => <ModelListMember conversationCode={currentConversationCode} close={close}/>}
                                </Popup>
                                      
                                </div>
                                <div className="flex-grow-1 pl-3">
                                    {changeName}
                                </div>
                                {/* button header khung chat */}
                                <div className='m-3'>
                                    {/* <button className="btn border btn-header-chat-custom">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal feather-lg"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                    </button> */}

                                    {groupBtn}
                  
                                </div>
                            </div>
                        </div>
                        <div className="position-relative" > 
                            {/* body noi dung chat */}
                            <div  id='scrollableDiv2' className="chat-messages p-4"  ref={parentRef}>
                            {/* <div  id='scrollableDiv2' className="chat-messages p-4 menu-popup noti-popu" > */}
                            <InfiniteScroll
          
                                    loadMore={onloadMoreMessOfConversation}
                                    hasMore={onloadMore}
                  
                                    isReverse={true}
                                    // useWindow={false}
                               
                              
                                >
                              {message}
                                </InfiniteScroll>
                          

                            {/* <InfiniteScroll
                                dataLength={6}
                                next={onloadMoreMessOfConversation}
                                hasMore={true}
                                loader={""} // ko truyền dữ liệu 
                                scrollableTarget='scrollableDiv2'
                                inverse={true}
                            >
                                      {message}
                            </InfiniteScroll>
                             */}
                            <div ref={messageRef} />
                            </div>
                            
                        </div>
                        <div className="py-3 px-4 chat-input-content">
                            <div className="input-group">
                                <input onChange={handleInput}  type="text" className="form-control rounded input-mess-custom" value={newMess} placeholder="Type your message" onKeyDown={handleKeyPress}/>
                                <button onClick={createNewMess} ref={btncreate} className="btn btn-danger">
                                <svg onClick={btncreateClick} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 9l6 6-6 6"/><path d="M4 4v7a4 4 0 0 0 4 4h11"/>
                                </svg>
                                    {/* <svg onClick={btncreateClick} height="48" viewBox="0 0 48 48"  width="48" xmlns="http://www.w3.org/2000/svg"><path d="M4.02 42l41.98-18-41.98-18-.02 14 30 4-30 4z"/><path d="M0 0h48v48h-48z" fill="none"/></svg> */}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        </div>
    );
}
export default ChatPage