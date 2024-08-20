import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getDataApiAllnotification, getDataApiUpdateNoti, getDataApiNumberNotification } from "../../../common/callapi/notification"
import { getCookieToken, TimeFromCreateToNow } from '../../../common/functions'
import { Link, Redirect } from 'react-router-dom';
function Notification(props) {
    const [notisState, setNotisState] = useState()
    const {setNumberNotiNotRead} = props
    const [lastIdNotiId, setLastNotiId] = useState() 
    const [flagchagenotiState, setFlagChangeNotiState] = useState(false)
    
    var token = getCookieToken() 
    var notis = []

    const current = new Date().getTime();
    const updateNotiSeen = async (e) =>{
        try {
            console.log( e.target.attributes)
            var notificationCode = e.target.attributes.getNamedItem('noticode').value;
            console.log(notificationCode)
            const result = await getDataApiUpdateNoti(token, notificationCode);
            
            setFlagChangeNotiState(true)
          } catch (error) {
            console.error(error)
          }
    }
    const numberNoti = async () =>{
        try {
            const userInfo = await getDataApiNumberNotification(token);
            setNumberNotiNotRead(userInfo?.data.number_noti_not_read)
          } catch (error) {
            console.error(error)
          }
    }
    const listNotification = async () => {
        try {
            console.log("123123123", lastIdNotiId)
            const result = await getDataApiAllnotification(token);
            numberNoti() // gọi để lấy số lượng thông báo chưa đọc để truyền lại vào state cho nav hiển thị
            if (result?.data.list_noti_info.length > 0) {
                setLastNotiId(result?.data.last_noti_id)
                result?.data.list_noti_info.forEach(noti => {
                    notis.push(
                        <div className='d-flex mb-2' style={{ background: noti.is_checked ? "": "#fccb9078" , borderRadius:"10px"}} key={noti.notification_code} >
                            <div className='noti-user-avata'>
                                <img alt='user avatar' src={noti.user_guest_info.picture} className='rounded-circle mr-1 p-1' width={70} height={70}></img>
                            </div>
                            <div className='noti-content'>
                                <div  >
                                    <Link noticode={noti.notification_code} onClick={updateNotiSeen} style={{        
                                        color:'black',
                                        textDecoration: 'none'
                                    }} to={`/profile/${noti.user_guest_info.user_code}/post/`} state={{ 'usercode': noti.user_guest_info.user_code }} >
                                        <b  >{noti.user_guest_info.fullname + " "}</b>{noti.content}
                                    </Link> 
                                    </div>
                                <div className='fs-smaller text-secondary'>{TimeFromCreateToNow(noti.created_time)}</div>
                            </div>
                        </div>
              
                    )
                });
            }
            setNotisState(notis)
        } catch (error) {
            console.error(error)
        }
    }

    const loadNotiOnScroll = async () => {
        try {
            console.log("123123123", lastIdNotiId)
            const result = await getDataApiAllnotification(token, lastIdNotiId);
            numberNoti() // gọi để lấy số lượng thông báo chưa đọc để truyền lại vào state cho nav hiển thị
            if (result?.data.list_noti_info.length > 0) {
                setLastNotiId(result?.data.last_noti_id)
                result?.data.list_noti_info.forEach(noti => {
                    notis.push(
                        <div className='d-flex mb-2' style={{ background: noti.is_checked ? "white": "azure" }} key={noti.notification_code} >
                            <div className='noti-user-avata'>
                            <img alt='user avatar' src={noti.user_guest_info.picture} className='rounded-circle mr-1 p-1' width={70} height={70}></img>
                            </div>
                            <div className='noti-content'>
                                <div  >
                                    <Link noticode={noti.notification_code} onClick={updateNotiSeen} style={{        
                                        color:'black',
                                        textDecoration: 'none'
                                    }} to={`/profile/${noti.user_guest_info.user_code}/post/`} state={{ 'usercode': noti.user_guest_info.user_code }} >
                                        <b  >{noti.user_guest_info.fullname + " "}</b>{noti.content}
                                    </Link> 
                                    </div>
                                <div className='fs-smaller text-secondary'>{TimeFromCreateToNow(noti.created_time)}</div>
                            </div>
                        </div>
              
                    )
                });
            }
            setNotisState([...notisState, ...notis])
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        listNotification()
    }, [])
    useEffect(() => {
        if(flagchagenotiState===true){
            listNotification()
        }
 
        setFlagChangeNotiState(false)
        
    }, [flagchagenotiState, setFlagChangeNotiState])
    return (
        <div 
      
            id='scrollableDiv'
            className='menu-popup bg-custom' style={{ width: "350px", height: "300px", overflow: "auto" }}
        >
            {/*Put the scroll bar always on the bottom*/}
            <InfiniteScroll
                dataLength={10}
                next={loadNotiOnScroll}
                hasMore={true}
                loader={""} // ko truyền dữ liệu 
                scrollableTarget='scrollableDiv'
            >
                <div className='d-flex mb-2 noti_title'>
                <h4><b> Thông báo </b> </h4>
                </div>
                {notisState}
            </InfiniteScroll>
        </div>
    )
}

export default Notification