
import React, { useState, useEffect } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import { Form } from 'react-bootstrap';
import {getDataApiDetailUserLogin, updateUsrProfile} from "../../../common/callapi/user"
import { getCookieToken } from '../../../common/functions';
import "../../../css/setting_profile.css"
// import PasswordModal from './PasswordModal';

function SettingProfile() {;
    const token = getCookieToken()
    const [currUserInfo, setcurrUserInfo] = useState()
    const [loadingState, setLoadingState] = useState(false);

    const [familyName, setFamilyName] = useState()
    const [givenName, setGivenName] = useState()
    const [className, setClassName] = useState()
    const [username, setUsername] = useState()
    const [phone, setPhone] = useState()
    const [gender, setGender] = useState()
    const [picture, setPicture] = useState("")
    const [faculty, setFaculty] = useState()
    const [biography, setBiography] = useState()
    const [backgroundPicture, setBackgroundPicture] = useState("")
    const [password, setPassword] = useState("")
    const [birthday, setBirthday] = useState()

    const [imageChoosen, setImageChoosen] = useState()
    const [backgroundImageChoosen, setBackgroundImageChoosen] = useState()

    // formData.append('image', picture)
    // function handleChange(e) {
    //     // console.log(e.target.value)
    //     setGender(e.target.value)
    // }


    const dataProfileUser = async () => {
        try {
            const userInfo = await getDataApiDetailUserLogin(token);
            console.log('lllllll', userInfo)
            setcurrUserInfo(userInfo)

        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        dataProfileUser()
    }, [])
    useEffect(() => {
        console.log("currUserInfo", currUserInfo)
        setFamilyName(currUserInfo?.data.family_name)
        setGivenName(currUserInfo?.data.given_name)
        setClassName(currUserInfo?.data.class_name)
        setUsername(currUserInfo?.data.username)
        setPhone(currUserInfo?.data.phone)
        setGender(currUserInfo?.data.gender ? currUserInfo?.data.gender : "Nam")
        // setPicture(currUserInfo?.data.picture)
        setFaculty(currUserInfo?.data.faculty)
        setBiography(currUserInfo?.data.biography)
        // setBackgroundPicture(currUserInfo?.data.background_picture)
        setBirthday(currUserInfo?.data.birthday)
        setImageChoosen(currUserInfo?.data.picture)
        setBackgroundImageChoosen(currUserInfo?.data.background_picture)

    },[currUserInfo])


    function onchangePhone(e) {
        setPhone(e.target.value)
    }
    const onchangeClassName = (e) => {
        setClassName(e.target.value)
    }
    const onchangeGivenName = (e) => {
        setGivenName(e.target.value)
    }
    const onchangeFamalyName = (e) => {
        setFamilyName(e.target.value)
    }
    const onchangeGender = (e) => {
        console.log(gender)
        setGender(e.target.value)
    }
    const onchangeFaculty = (e) => {
        setFaculty(e.target.value)
    }

    const onchangePicture = (e) => {
        console.log("da vo roi ", e.target.files[0])
        setPicture(e.target.files[0])
        setImageChoosen(URL.createObjectURL(e.target.files[0]))
    }
    const onchangeBackgroundPicture = (e) => {
        setBackgroundPicture(e.target.files[0])
        setBackgroundImageChoosen(URL.createObjectURL(e.target.files[0]))
    }
    const onchangeBirthday = (e) => {
        setBirthday(e.target.value)
    }
    const callApiUpdateProfile = async(formdata)=>{
        console.log(formdata)
        const result = await updateUsrProfile(token, currUserInfo?.data.user_code, formdata)
        setLoadingState(false)
        console.log("result", result)
    }
    function handleSubmit(e) {
        e.preventDefault()
        var formData = new FormData()
        if(picture){
            formData.append('picture', picture)
        }
        if(backgroundPicture){
            formData.append('background_picture', backgroundPicture)
        }
 
        if (familyName){
            console.log("vao nef ", familyName)
            formData.append('family_name', familyName)
            console.log(formData)
        }

        if (givenName)
            formData.append('given_name', givenName)
        if(biography)
            formData.append('biography', biography)
        if(className)
            formData.append('class_name', className)
        if(phone)
            formData.append('phone', phone)
        if(gender)
            formData.append('gender', gender)
        if(faculty)
            formData.append('faculty', faculty)
        if(birthday)
            formData.append('birthday', birthday)
        if(password)
            formData.append('password', password)
        setLoadingState(true)
        callApiUpdateProfile(formData)


    }
    // useEffect(() => {
    //     if (checkShowMess) {
    //         setTimeout(() => {bg-tab-setting-custom
    //             setCheckShowMess(false);
    //         }, 3000);
    //     }
    // }, [checkShowMess]);

    return (
        <main className='container p-0'>

            <div className='container-fluid p-0 '>
                {/* <!--icon bar--> */}

                <div className='row mt-3'>
                    <div className='col-md-3 bg-tab-left-setting-custom tab-content-left'>
                        <div className='pt-3'>
                            <button className='btn btn-custom btn-lg w-100'>Sửa đổi thông tin</button>
                        </div>
                        <hr/>
                        {/* <div className='pb-3'>
                            <button className='btn btn-custom btn-lg w-100'>Thay đổi mật khẩu</button>
                        </div> */}
                    </div>
                    <div className='col-md-9 '>

                        <div className='tab-pane' id='account'>
                            {/* <!--Phần setting tài khoàn public info--> */}
                            <div className='card my-box-shadow bg-tab-setting-custom p-2'>
                                <div className='card-header d-flex justify-content-between'>
                                    <h2 className='card-title p-1'>Thông tin cá nhân</h2>
                                    {/* <div>
                                        <PasswordModal currUserInfo={currUserInfo} setMessage={setMessage} setCheckShowMess={setCheckShowMess} />
                                    </div> */}
                                </div>
                                <div className='card-body'>
                                    <Form onSubmit={handleSubmit}>
                                        <div className='row'>
                                            <div className='col-md-8 content-left p-2'>
                                                <Form.Group className='bg-group-custom p-3'>
                                                    <Form.Label className='fw-bold pt-2'>Họ</Form.Label>
                                                    <Form.Control type='text' value={familyName} onChange={onchangeFamalyName} />
                                                </Form.Group>
                                                <Form.Group className='bg-group-custom p-3'>
                                                    <Form.Label className='fw-bold pt-2'>Tên</Form.Label>
                                                    <Form.Control type='text' value={givenName} onChange={onchangeGivenName} />
                                                </Form.Group>
                                                <Form.Group className='bg-group-custom p-3'>
                                                    <Form.Label className='fw-bold'>Email/ Tài khoản</Form.Label>
                                                    <Form.Control type='text' value={username} disabled />
                                                </Form.Group>
                                                <Form.Group className='bg-group-custom p-3'>
                                                    <Form.Label className='fw-bold'>Lớp</Form.Label>
                                                    <Form.Control type='text' value={className} onChange={onchangeClassName} />
                                                </Form.Group>
                                                <Form.Group className='bg-group-custom p-3'>
                                                    <Form.Label className='fw-bold'>Số điện thoại</Form.Label>
                                                    <Form.Control type='text' value={phone} onChange={onchangePhone} />
                                                </Form.Group>
                                                <Form.Group className='bg-group-custom p-3'>
                                                    <Form.Label className='fw-bold'>Ngày sinh</Form.Label>
                                                    <Form.Control type='text' value={birthday} onChange={onchangeBirthday} />
                                                </Form.Group>
                                                <Form.Group className='bg-group-custom p-3'>
                                                    <Form.Label className='fw-bold'>Giới tính</Form.Label>
                                                    <select className='mt-1 ms-1 w-100 rounded p-2' value={gender} onChange={onchangeGender}>
                                                        <option name='Nam'> Nam</option>
                                                        <option name='Nữ'>Nữ</option>
                                                    </select>
                                                </Form.Group>
                                                <Form.Group className='bg-group-custom p-3'>
                                                    <Form.Label className='fw-bold'>Khoa </Form.Label>
                                                    <select className='mt-1 ms-1 rounded p-2 w-100' value={faculty} onChange={onchangeFaculty}>
                                                        <option name='Công nghệ thông tin'>Công nghệ thông tin</option>
                                                        <option name='Lao động công đoàn'>Lao động công đoàn</option>
                                                        <option name='Luật'>Luật</option>
                                                        <option name=' Mỹ thuật công nghiệp'>Mỹ thuật công nghiệp</option>
                                                        <option name='Điện-điện tử'>Điện-điện tử</option>
                                                        <option name='Công nghệ thông tin'>Công nghệ thông tin</option>
                                                        <option name='Quản trị kinh doanh'>Quản trị kinh doanh</option>
                                                        <option name='Tài chính ngân hàng'> Tài chính ngân hàng</option>
                                                        <option name='Lao động công đoàn'> Lao động công đoàn</option>
                                                        <option name='Môi trường và bảo hộ lao động'>  Môi trường và bảo hộ lao động</option>
                                                        <option name='Lao động công đoàn'> Lao động công đoàn</option>
                                                        <option name='Ngoại ngữ'>Ngoại ngữ</option>
                                                        <option name='Toán - thống kê'>Toán - thống kê</option>
                                                        <option name='Dược'>Dược</option>
                                                        <option name='Kế toán'>Kế toán</option>
                                                        <option name='Khoa học xã hội nhân văn'>Khoa học xã hội nhân văn</option>
                                                    </select>
                                                </Form.Group>

                                                <Form.Group className='bg-group-custom p-3'>
                                                    <Form.Label className='fw-bold'>Tiểu sử</Form.Label>
                                                    <Form.Control as='textarea' value={biography} rows={3} onChange={(e) => { setBiography(e.target.value) }} />
                                                </Form.Group>
                                                
                                                <Form.Group>
                                                    <Form.Label className='fw-bold'>Mật Khẩu</Form.Label>
                                                    <Form.Control type='password' value={password} rows={3} onChange={(e) => { setPassword(e.target.value) }} />
                                                </Form.Group>
                                                

                                            </div>
                                            <div className='col-md-4 bg-group-custom content-right p-2'>
                                                <h4>Thay đổi ảnh đại diện </h4>
                                                <div className='text-center h-50'>
                                                    <img alt='avatar' className='img-upload' src={imageChoosen}></img>
                                                    <div className='mt-2'>
                                                        {/* <!-- lồng 2 button thành 1 --> */}
                                                        {/* <!--<input type='button' className=' btn btn-primary' id='my-button' value='Upload image'>className='d-none'  --> */}
                                                        <div className='w-100'>
                                                            <label htmlFor='input-avt' className='w-100'>
                                                                <div className='btn btn-success'> 
                                                                    <span className='mr-1'>Chọn hình ảnh  </span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M20.4 14.5L16 10 4 20"/></svg>
                                                                </div>
                                                            </label>
                                                            <input hidden onChange={onchangePicture} id='input-avt' type='file' accept='image/*'></input>
                                                        </div>
                                                        {/* <input type='file' name='image' id='my-file' accept='.jpg, .jpeg, .png' onChange={onchangePicture} ></input> */}
                                                    </div>
                                                </div>

                                                <h4>Thay đổi ảnh bìa</h4>
                                                <div className='text-center h-50'>
                                                    <img alt='background' className='img-bg-upload' src={backgroundImageChoosen} width='160' height='80'></img>
                                                    <div className='mt-2'>
                                                        {/* <!-- lồng 2 button thành 1 --> */}
                                                        {/* <!--<input type='button' className=' btn btn-primary' id='my-button' value='Upload image'>className='d-none'  --> */}
                                                        <div className='w-100'>
                                                            <label htmlFor='input-bg' className='w-100'>
                                                                <div className='btn btn-success'>
                                                                    <span className='mr-1'>Chọn hình ảnh  </span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M20.4 14.5L16 10 4 20"/></svg>
                                                                </div>
                                                            </label>
                                                            <input hidden onChange={onchangeBackgroundPicture} id='input-bg' type='file' accept='image/*'></input>
                                                        </div>
                                                        {/* <input type='file' name='image' id='my-file' accept='.jpg, .jpeg, .png' onChange={onchangeBackgroundPicture}></input> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {loadingState ?
                                            <div className='mt-3'>
                                            <BounceLoader color="#36d7b7" loading={loadingState} size={40} />  </div>
                                            :
                                            <button type='Submit' className='btn btn-danger btn-lg w-100 mt-4 px-3'>Cập nhật</button>
                                        }
                                    </Form>

                                </div>
                            </div>

                        </div>



                    </div>
                    {/* <div className='col-md-2'></div> */}
                </div>

            </div>
        </main>
    )
}
export default SettingProfile