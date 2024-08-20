import axios from "axios";
import { BASE_URL } from "./constant";
import { Cookies } from 'react-cookie';

export default axios.create({
    baseURL: BASE_URL
});

// return the user data from the session storage

const cookies = new Cookies();

export const getUser = () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return userStr;
    else return null;
}

// return the token from the session storage
export const getToken = () => {
    return sessionStorage.getItem('token') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', user);
}

export const setCookieUser = (userInfo) => {
    return cookies.set('user_info', userInfo);
}

export const getCookieUser = () => {
    return cookies.get('user_info') || null;
}

export const setCookieToken = (token, expires) => {
    return cookies.set('access_token', token, { path: '/', expires: expires });
}

export const getCookieToken = () => {
    return cookies.get('access_token') || null;
}

export const deleteCookieAccessToken = () => {
    return cookies.remove('access_token');
}

//--- localStorage
export const setLocalUsername = (u) => {
    return localStorage.setItem('Username', JSON.stringify(u));
}

export const getLocalUsername = () => {
    return JSON.parse(localStorage.getItem('Username')) || null;
}

export const removeLocalUsername = () => {
    return localStorage.removeItem('Username');
}


export const TimeFromCreateToNow = (created_time) =>{
    var timestamp = created_time
    // const current = new Date().getTime();
    // console.log( new Date(timestamp))
    var created_time = new Date(timestamp);
    const day = created_time.getDate();
    var monthIndex
    try{
        monthIndex = created_time.getMonth() + 1;
    }
    catch{
         monthIndex = created_time.getMonth();
    }
    const year = created_time.getFullYear();

    return `${day}/${monthIndex}/${year}`
}


// console.log(`Khoảng thời gian giữa hai thời điểm là ${hours} giờ ${minutes % 60} phút ${seconds % 60} giây.`);
// console.log(numberOfDays, seconds, minutes, hours)