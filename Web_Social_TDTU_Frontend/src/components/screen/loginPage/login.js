import axios  from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { BASE_URL, LOGIN_URL, OAUTH2_URL} from "../../../common/constant";
import {getLocalUsername, setCookieToken, setLocalUsername, removeLocalUsername, getCookieToken } from "../../../common/functions"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { faUser as farUser } from '@fortawesome/free-regular-svg-icons'
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google';
import { SocketContext } from '../../../thirdparty/socket';
import "../../../css/login.css";
import logoTDTU from "../../../image/TDT logo.png";

// example: username.value = 'hello react'; console.log(username.value); 
const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    const handleChange = e => {
        setValue(e.target.value);
    }
    return {
        value,
        onChange: handleChange
    }
}
const Divider = ({ children }) => {
    return (
      <div className="container">
        <div className="border" />
        <span className="content">
          {children}
        </span>
        <div className="border" />
      </div>
    );
}

function LoginPage() {
    const [username, setUsername]= useState('');
    const password = useFormInput('');
    const [errMsg, setErrMsg] = useState(null);
    const [checkbox, setCheckbox] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const socket = useContext(SocketContext);
    const redirectPath = location.state?.path || '/';

    // check local storage
    useEffect(() => {
        const localUser = getLocalUsername();
        if (localUser) {
            setUsername(localUser);
            setCheckbox(true);
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append('username', username);
        formData.append('password', password.value);

        try {
            const response = await axios.post(BASE_URL+"get-token", formData);
            console.log("da vao ", response)
            let expires = new Date()
            expires.setTime(expires.getTime() + (60 * 60 * 4 * 1000))

            setCookieToken(response.data.access_token, expires);
            // lưu phiện đăng nhập
            if (checkbox) {
                setLocalUsername(username);
            } else {
                removeLocalUsername();
            }
            if (getCookieToken() !== null){
                navigate(redirectPath, { replace: true });
            }
           

        } catch (err) {
            if (err.response.status === 400 || err.response.status === 401)
                setErrMsg("Tài khoản google khong phải do trường TDT cấp");
            else
                setErrMsg('Đã xảy ra lỗi. Thử lại sau!');
        }
    }

    
    const onSuccess = async (response) => {
        try {
            console.log(response, { "client_id": response['clientId'], "credential": response['credential']})
            
            const dataLoginResponse = await axios.post(BASE_URL+OAUTH2_URL,  { "client_id": response['clientId'], "credential": response['credential']})
            console.log(dataLoginResponse)
            let expires = new Date()
            expires.setTime(expires.getTime() + (60 * 60 * 4 * 1000)) // hết hạn sau 4h 
            setCookieToken(dataLoginResponse.data.access_token, expires);
            navigate(redirectPath, { replace: true });

      
        } catch (err) {
            if (err?.response?.status === 400 || err?.response?.status === 401){

                setErrMsg("Tài khoản google khong phải do trường TDT cấp");
            }
       
            else
                setErrMsg('Đã xảy ra lỗi. Thử lại sau!');
        }
    }

    return (
            <section className="vh-100  d-flex justify-content-center align-items-center">
                <div className='container-fluid'>
                    <div className='row d-flex justify-content-center align-items-center'>
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        className="img-fluid" alt='BACKGROUND LOGO'></img>
                    </div>
                    <div className='col-md-8 col-lg-6 col-xl-4 offset-xl-'>
                        <GoogleOAuthProvider clientId='426416274883-i5379veh6gfj8oir6j0m6tnkmco705n0.apps.googleusercontent.com'>
                        <form className='form ' onSubmit={handleSubmit}>
                            <img src={logoTDTU}
                            className="img-logo-tdtu" alt='TDTU LOGO' />
                            <div className='form-outline mb-4 d-flex login-input-bar'>
                                <FontAwesomeIcon icon={farUser} className='my-auto me-2' />
                                <input type='text'
                                    name='username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete='off'
                                    placeholder='Tài khoản'
                                    className='form-control form-control-lg'
                                />
                            </div>
                            <div className='form-group d-flex mt-2 mb-4 login-input-bar w-100'>
                                <FontAwesomeIcon icon={faKey} className='my-auto me-2' />
                                <input type='password'
                                    name='password' {...password}
                                    placeholder='Mật khẩu'
                                    className='form-control form-control-lg'
                                />
                            </div>
                            <div className='text-center form-group'>
                                <button type='submit' className='btn btn-primary btn-lg'>ĐĂNG NHẬP</button>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                            {/* Checkbox */}
                                <div className="form-check checkbox-lg">
                                    <input className='form-check-input me-1' id='rememberCheckbox' type='checkbox' checked={checkbox} onChange={() => setCheckbox(!checkbox)} />
                                    <label className="form-check-label" htmlFor="rememberCheckbox">
                                        Remember me
                                    </label>
                                </div>
                                {/* <Link to='/forgot' className='text-body'>Quên mật khẩu?</Link> */}
                            </div>
                            <Divider>Or</Divider>
                            <div className='form-group mt-4 w-100'>
                                <div className='col d-flex justify-content-center'>
                                        <div className=''>
                                            <GoogleLogin
                                                type="icon"
                                            // theme="filled_blue"
                                                size="200px"
                                                width="100px"
                                                text="Đăng nhập với Google"
                                                onSuccess={(credentialResponse) => {
                                                    onSuccess(credentialResponse)
                                                    // console.log(credentialResponse);
                                                }}
                                                onError={() => {
                                                    console.log('Login Failed');
                                                }}
                                            
                                            />
                                        </div>
                    
                                </div>
                            </div>

                            <div className='form-group text-center'>
                                <div className={errMsg ? 'p-2 mt-2 bg-danger text-white rounded' : 'offscreen'} aria-live='assertive'>{errMsg}</div>
                            </div>
                        </form>
                        </GoogleOAuthProvider>
                    </div>
                    </div>
                </div>
            </section>
        
    );



}


export default LoginPage;