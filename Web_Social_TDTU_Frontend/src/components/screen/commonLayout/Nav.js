import { NavLink, useNavigate, Link } from 'react-router-dom';
import React, { useEffect, useState, useContext, useRef } from 'react';
import {getDataApiDetailUserLogin} from "../../../common/callapi/user"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import {getCookieToken, deleteCookieAccessToken} from '../../../common/functions'
import { getDataApiNumberNotification } from "../../../common/callapi/notification"
import Popup from 'reactjs-popup';
import Notification from '../notification/Notification';
import { SocketContext } from '../../../thirdparty/socket';
import "../../../css/Nav.css"
import logoTDTU from "../../../image/TDT logo.png";

function NavBar() {
    const navigate = useNavigate();
    const [userLogin, setUserLogin] = useState()
    const [nameOfUserWantToFind, setNameUserWantToFind] = useState()
    var token = getCookieToken()
    const [numberNotiNotRead, setNumberNotiNotRead] = useState(0)
    const socket = useContext(SocketContext);
    const numberNoti = async () =>{
        try {
            const userInfo = await getDataApiNumberNotification(token);
            setNumberNotiNotRead(userInfo?.data.number_noti_not_read)
          } catch (error) {
            console.error(error)
          }
    }
    useEffect(()=>{
        const dataProfileUser = async () =>{
            try {
                const userInfo = await getDataApiDetailUserLogin(token);

                setUserLogin(userInfo)
                socket.emit("new_user_connect", userInfo?.data.user_code);
     
              } catch (error) {
                console.error(error)
              }
        }
        dataProfileUser() 
        numberNoti()
    }, [])
    useEffect(()=>{
        socket.on("send_noti", (data) => {
            numberNoti()
        });
    }, [socket])
    
    function finUserByName(event){
        event.preventDefault();
        if (nameOfUserWantToFind?.length > 0)
            navigate(`/find-user/?name=${nameOfUserWantToFind}`,{ replace: true });
    }
    const logout = () =>{
        deleteCookieAccessToken();
        socket.emit("disconnect_server")
        navigate('/login', { replace: true });
    }
    return (
        <div className='nav-sticky'>
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <div className='d-flex justify-content-between w-100 mx-5'>
                    <NavLink to='/' className='navbar-brand'>
                        <img src={logoTDTU} alt='TDTU logo' width='52px' height='26px'></img>
                    </NavLink>

                    <form className='d-flex rounded-pill px-3 search-bar' onSubmit={finUserByName}>
                        <input type='text' className='search-input py-2' placeholder='Tìm kiếm bạn bè...' onChange={(event) => {setNameUserWantToFind(event.target.value)}}></input>
                        <button type="submit" className="btn"><FontAwesomeIcon icon={faSearch} className='my-auto' /></button>
                    </form>

                    <div className='d-flex flex-row my-auto'>
                        <NavLink to='/chat'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </NavLink>
                        <Popup
                            trigger={
                                <div>
                            <div className='noti-style m-2'>
                            <div className='style-number-noti'>{numberNotiNotRead}</div> 
                        
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
                                </div>
                            </div>
                            }
                
                            position='bottom right'
                        >
                        <div className=''>
                        <Notification
                            setNumberNotiNotRead= {setNumberNotiNotRead}
                                // loadingNotiList={loadingNotiList}
                                // setNotificationInfo={setNotificationInfo}
                                // lenNotification={lenNotification}
                                // noifiInfos={notificationInfos}
                                // numberNotiNotChecked={numberNotiNotChecked}
                                // setNumberNotiNotChecked={setNumberNotiNotChecked}
                            />
                        </div>

                        </Popup>
                        <Popup
                            trigger={
                                <div>
                                    <img src={userLogin?.data.picture} className='rounded-circle nav-avatar' alt='avatar'></img>
                                </div>
                            }
                            position='bottom center'
                        >
                            <div className='menu-popup d-flex flex-column bg-custom'>
                                <button type='button' className='btn btn-primary mb-2'><Link className='btn-link-text' to={`/user/${userLogin?.data.user_code}/update-info`}>Edit profile</Link></button>
                                <button type='button' className='btn btn-danger' onClick={logout}><span className='btn-link-text'>Log out</span></button>
                            </div>
                        </Popup>
                    </div>
                </div>


            </nav>
        </div>
    );
}
export default NavBar