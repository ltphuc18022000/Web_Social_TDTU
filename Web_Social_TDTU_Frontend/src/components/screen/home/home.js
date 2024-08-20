import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { getDataApiDetailUserLogin } from "../../../common/callapi/user";
import { getCookieToken } from '../../../common/functions'
import { SocketContext } from '../../../thirdparty/socket';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from "./post_notifier";
import FriendHome from "./FriendHome"
import "../../../css/home.css";
import "../../../css/style.css"
import Popup from 'reactjs-popup';
import ModalPost from '../post/ModalPost';

import { getPosts } from "../../../common/callapi/post_service"

function HomePage(props) {

    const [showComment, setShowComment] = useState(false)
    const [postcodeState, setPostCode] = useState()
    const [userLogin, setUserLogin] = useState()
    const [dataLikePost, setDataLikePost] = useState()
    const [postInfo, setPostInfo] = useState()
    const [lastPostId, setLastPostId] = useState()
    const [postState, setpostState] = useState()
    var token = getCookieToken()
    const socket = useContext(SocketContext);
    const { close } = useParams()
    function getComments(e) {
        try {
            var getPostcode = e.target.attributes.getNamedItem('postcode').value
            setShowComment(true)
            setPostCode(getPostcode)
        }
        catch (error) {
            console.error(error)
        }

    }

    useEffect(() => {
        const dataProfileUser = async () => {
            try {
                const userInfo = await getDataApiDetailUserLogin(token);

                setUserLogin(userInfo)
                socket.emit("new_user_connect", userInfo?.data.user_code);

            } catch (error) {
                console.error(error)
            }
        }

        dataProfileUser() 


    }, [])
    

    const callApiGetListPostUser = async () => {
        try {
            console.log("fffffffffff", lastPostId)
            const result = await getPosts(token, lastPostId);
            if(lastPostId){
                setLastPostId(result?.data.last_post_id)
                // setPostInfo(result?.data.list_post_info)
                console.log(result?.data.list_post_info)
                setPostInfo([...postInfo, ...result?.data.list_post_info])
            }
            else{
                console.log(result.data)
                setPostInfo(result?.data.list_post_info)
                console.log(result?.data.last_post_id)
                setLastPostId(result?.data.last_post_id)
            }
            
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        callApiGetListPostUser()
    }, [])

    useEffect(()=>{

        var listPost = []
        if (postInfo?.length === 0 ){
            listPost.push(      <>
                {<Post postInfoData={""}
                />}
            </>)
        }
        else{

           for (let i = 0; i < postInfo?.length; i++) {
                socket.emit('join_room', postInfo[i]?.post_code)
                listPost.push(
                    <>
                        {<Post key={postInfo[i]?._id}
                            postInfoData={postInfo[i]}
                        />}
                    </>
                )
            }
        }
        setpostState(listPost)
    }, [postInfo])

    // var listPost = []

    // if (postInfo?.length === 0 ){
    //     listPost.push(      <>
    //         {<Post postInfoData={""}
    //         />}
    //     </>)
    // }
    // else{
        
    //     console.log("vaof nef", postInfo)
    //     for (let i = 0; i < postInfo?.length; i++) {
    //         socket.emit('join_room', postInfo[i]?.post_code)
    //         console.log( postInfo[i]?.post_code)
    //         listPost.push(
    //             <>
    //                 {<Post key={postInfo[i]?._id}
    //                     postInfoData={postInfo[i]}
    //                 />}
    //             </>
    //         )
    //     }
    // }
   

    return (
        <>

            {/* {<Post postcode ={postcodeState}/>} */}
            {/*main*/}
            <div className="home-container">
                {/*media objects (dòng trạng thái)*/}
                <div className="container p-0">
                    <div className="row home-post-content">
                        <div className="col-lg-8">
                            {/*Đăng tin*/}
                            <div className="bg-post-home d-flex align-items-center p-3 my-3 text-black-50 rounded box-shadow">
                                <div className="p-3">
                                    <img className="mr-3 img-fluid rounded-circle mb-2" src={userLogin?.data['picture']} alt="" width={50} height={50} />

                                </div>
                                <div className="post-header-button lh-100">
                                    <h6 className="mb-0 text-white lh-100">Home</h6>
                                    <h5 className='text-white'>Hi <strong>{userLogin?.data.fullname}!</strong> Please write something in this post</h5>
                                    {/* Button to Open the Modal */}

                                    <Popup modal
                                        trigger={
                                            <button type="button" className="btn btn-block btn-danger">
                                                Post
                                            </button>}
                                    >
                                    {close => <ModalPost setpostState={setpostState} setLastPostId={setLastPostId} setPostInfo={setPostInfo} userLogin={userLogin} close={close}/>}

                                    </Popup>
                                </div>
                            </div>
                            <InfiniteScroll
                                dataLength={10}
                                next={callApiGetListPostUser}
                                hasMore={true}
                                loader={""} // ko truyền dữ liệu 
                                scrollableTarget='scrollableDiv'
                                >
                                {postState}
                         
                                </InfiniteScroll>
                                            
                            {/* <div className='card'>
               
                            </div> */}
                        </div>

                        {/*cột thông báo trnang thái*/}
                        {/* <div className="col-lg-4 home-info mt-3"> */}

                        {/*cột thông báo trang thái*/}
                        <div className="col-12 col-lg-4 sticky home-info mt-3 sticky-scroll__post">
                            <div className="card mb-3">
                                <div className="card-body text-center">
                                <Link className='card-title text-decoration-none mb-0' to={`/profile/${userLogin?.data.user_code}/post/`} state={{ "usercode": userLogin?.data.user_code }}>
                                    <img src={userLogin?.data['picture']} alt="Chris Wood" className="img-fluid rounded-circle mb-2" width={128} height={128} />
                                    <div >
                                    <p>
                                         {userLogin?.data.fullname}
                                    </p>
                                    </div>
                                </Link>
                                </div>
                            </div>
                            {/* friendlist */}



                            <div className="card mb-3">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Friends</h5>
                                </div>
                                <div className="card-body ">
                                    {userLogin?.data.user_code && <FriendHome usercode={userLogin?.data.user_code} />}
                                    {/* <div className="media card-friend-home">
                                        <img src="https://cdn1.iconfinder.com/data/icons/animals-95/300/cat-circle-animal-pet-wild-domestic-256.png" width={56} height={56} className="rounded-circle mr-2" alt="Chris Wood" />
                                        <div className="media-body">
                                            <p className="my-1"><strong>@username</strong></p>
                                            <div className='card-btn-home'>
                                                <a className="btn btn-sm btn-outline-primary m-1" href="#">Unfriend</a>
                                                <a className="btn btn-sm btn-outline-primary m-1" href="#">Chat</a>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default HomePage;