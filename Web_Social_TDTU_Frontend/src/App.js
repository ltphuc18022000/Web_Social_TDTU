
import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './common/PrivateRoute';
import PublicRoute from './common/PublicRoute';
import { Helmet } from "react-helmet";
import LoginPage from './components/screen/loginPage/login.js'
import HomePage from './components/screen/home/home.js';
import ErrorPage from './components/screen/error/error.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext, socket } from './thirdparty/socket';
import UserProfile from './components/screen/profile/UserProfile';
import SettingProfile from './components/screen/profile/settingProfile.js';
import FindUser from './components/screen/search/FindUser';
import ChatPage from "./components/screen/chat/chat_page.js";

function App() {
  const [currUserInfo, setCurrUserInfo] = useState()
  useEffect(()=> {
    console.log(currUserInfo)
  }, [currUserInfo])
  return (
    <SocketContext.Provider value={socket}>
    <div className='App'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>MXH TDTU</title>
      </Helmet>
      <BrowserRouter>
        <Fragment>
          <div>
            <div className='content'>
              <Routes>

                <Route element={<PublicRoute />}>
                  <Route path='/login' element={<LoginPage/>} />
                </Route>

                <Route element={<PrivateRoute currUserInfo={currUserInfo} setCurrUserInfo={setCurrUserInfo} />}>
                  <Route path='/' element={<HomePage currUserInfo={currUserInfo} />} />
                  <Route path='/profile/:usercode/*' element={<UserProfile/>}></Route>
                  <Route path='/find-user' element={<FindUser />}> </Route>
                  <Route path='/user/:usercode/update-info' element={<SettingProfile/>}> </Route>
                  <Route path='/chat' element={<ChatPage/>}> </Route> 
                  {/* <Route path='/chat' element={<ChatPage />}> </Route>  */}

                </Route>

                <Route path='*' element={<ErrorPage />} />
              </Routes>
            </div>
          </div>
        </Fragment>
      </BrowserRouter>

    </div>
  </SocketContext.Provider>
);
}

export default App;
