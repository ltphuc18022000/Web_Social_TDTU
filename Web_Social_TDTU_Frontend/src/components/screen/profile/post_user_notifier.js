import { getPostListUser } from "../../../common/callapi/post_service"
import { getCookieToken, TimeFromCreateToNow } from '../../../common/functions'
import Comment from '../home/Comment.js';
import { LikePost } from '../../../common/callapi/post';
import Popup from 'reactjs-popup';
import { deletePost } from '../../../common/callapi/post_service.js';
import ModelSharePost from "../home/model_share_post";
import { useEffect, useState, useRef } from "react";
function PostUser(props) {
    const { postInfoData,userLogin ,usercode} = props
    var token = getCookieToken()
    const [postState, setpostState] = useState([])
    const [listImage, setListImage] = useState([])
    const [showComment, setShowComment] = useState(false)
    const [postcodeState, setPostCode] = useState()
    const [dataLikePost, setDataLikePost] = useState()
    const [postContent, setpostContent] = useState("")
    const btnElement = useRef()
    const calApiLikePost = async (postcode) => {
        try {
            const likePostInfo = await LikePost(token, postcode);
            setDataLikePost(likePostInfo)

        } catch (error) {
            console.error(error)
        }
    }

    function handleLikePost(e) {
        try{
            var getPostcode = e.target.attributes.getNamedItem('postcode').value
            calApiLikePost(getPostcode)
        }
        catch(error){
            console.log(error)
        }

    }
    function getComments(e) {
        try{
            setShowComment(true)
            var getPostcode = e.target.attributes.getNamedItem('postcode').value
            setPostCode(getPostcode)
        }
        catch(error){
            console.log(error)
        }

    }
    const callApiDeletePost = async (postcode) =>{
        try {
            const result = await deletePost(token, postcode);
            if(result?.response_status.code === '00'){
                window.location.reload(true);
            }
        } catch (error) {
            console.error(error)
        }
    }
    function clickBtn(){
        // <FontAwesomeIcon className="btn" onClick={clickBtn} style={{ height: "35px" }} icon="fa-pencil-alt"/>
        // <div className="btn" usercode={currentUser?.data.user_code} ref={btnElement} onClick={gotosettingPag}></div>
        // khi bấm vào icon do icon ko lấy được attribute nên sẽ sử dụng useRef để thiết lập click btn ẩn, btn này có gắn user do đó sẽ lấy được user code để chuyển trang
        console.log("vooooooooooooo")
        btnElement.current.click()
    }
    function handleDeletePost(e) {
        try{
            var getPostcode = e.target.attributes.getNamedItem('postcode')?.value
            callApiDeletePost(getPostcode)
        }
        catch(e){
            console.log(e)
        }
 
    }

    useEffect(()=>{
        var images = []
        var video = []
        if (postInfoData.images.length > 2) {
            postInfoData.images.forEach(image => {
                images.push(
                    <div className="col-lg-4 col-6">
                        <img src={image} className="img-fluid pr-1" alt="Unsplash" />
                    </div>
                )
            })
        } else {
            postInfoData.images.forEach(image => {
                images.push(
                    <div className="">
                        <img src={image} className="img-fluid pr-1" alt="Unsplash" />
                    </div>
                )
            })
        }
        if (postInfoData !== "" && postInfoData?.videos !== "") {
            video.push(
                <video width="750" height="500" controls >
                    <source src={postInfoData.videos} type="video/mp4" />
                </video>)

        }

        // hình ảnh của bài post được share
        if(postInfoData.root_post_info && postInfoData.root_post_info.images.length > 0){
            images.push(

            postInfoData.root_post_info.images.forEach(image => {
                images.push(
                    <div className="">
                        <img src={image} className="img-fluid pr-1" alt="Unsplash" />
                    </div>
                )
            })
            )
        }
        setListImage(images)
    }, [postInfoData])
    return (
        <div className="card ">
        {/* chỗ này là 2 bài post nếu được share là ngay sau dấu ? còn nếu tự tạo sẽ ngay phía sau dấu :  */}
        {postInfoData.root_post!=="" ?       
        <div className="post-card h-100">
            {userLogin?.data.user_code === usercode &&
            <div className="btn-delete-post-custom">
                <div className="btn btn-delete-custom" ref={btnElement}  postcode = {postInfoData.post_code} onClick={handleDeletePost}> 
                    <svg  onClick={clickBtn}  postcode = {postInfoData.post_code} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line onClick={clickBtn} postcode = {postInfoData.post_code}  x1="18" y1="6" x2="6" y2="18"></line><line onClick={clickBtn} postcode = {postInfoData.post_code}  x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
            </div>
            }
            <div className="media">
                <div className="media-header">
                    <div className="avatar-user-post">
                        <img src={postInfoData?.created_by.picture} width={56} height={56} className="rounded-circle mr-3" alt="Ashley Briggs" />
                    </div>
                    <div className="media-header-info">
                        <p className="mb-2"><strong>{postInfoData?.created_by.fullname}</strong></p>
                        <small className="text-muted">{TimeFromCreateToNow(postInfoData?.created_time)}</small>{/*time real dòng trạng thái*/}
                    </div>
                </div>
                
                <div className="media-body post-user">
                   
                    <span className="text-content-post m-3">{postInfoData?.content}</span>

                    {/* nội dung phần share */}
                    <div className="post-card-share">
                        {postInfoData.root_post_info!==null ?
                        // nếu hiển thị được vài viết gốc
                            <div className="card-body h-100">
                                <div className="media-header">
                                    <div className="avatar-user-post">
                                        <img src={postInfoData?.root_post_info?.created_by.picture} width={56} height={56} className="rounded-circle mr-3" alt="Ashley Briggs" />
                                    </div>
                                    <div className="media-header-info">
                                        <p className="mb-2"><strong>{postInfoData?.root_post_info?.created_by.fullname}</strong></p>
                                        <small className="text-muted">{TimeFromCreateToNow(postInfoData?.root_post_info?.created_time)}</small>
                                    </div>
                                </div>
                                <div className="media">
                                    
                                    <div className="media-body post-user">
                                        
                                        <p className="text-content-post">{postInfoData.root_post_info.content}</p>
                                        {/*hình ảnh được upload*/}
                                        <div className="row no-gutters mt-1 mb-2">

                                            {listImage}
                                            { 
                                                        postInfoData?.root_post_info?.videos && 
                                                        <video width="750" height="500" controls >
                                                            <source src={postInfoData?.root_post_info?.videos} type="video/mp4" />
                                                        </video>
                                                        }
                                        </div>
                    
                                    </div>
                                </div>
                            </div>:
                        // nếu bài viết gốc đã bị xóa 
                        <div className="card-body h-100">
                            <div className="media">
                                    <div className="media-body post-user">
                                        <p className="text-content-post">Bài viết đã bị gỡ bởi chủ sở hữu</p>
                                    </div>
                                </div>
                        </div>
                        }
                    </div>
                    {/* hết nội dung phần share*/}

                    {/*nút like*/}
                    <div className='like-number'>
                        <span className="text-like m-3">
                        Đã có {dataLikePost ? dataLikePost?.data.like_number : postInfoData?.liked_by.length} lượt thích
    
                        </span>
                    </div>
                    <div className="icon-post">
                        {/*nút like*/}
                        <a onClick={handleLikePost} postcode={postInfoData.post_code} className="btn btn-sm btn-danger mt-1 m-1">
                            <svg  postcode={postInfoData.post_code}  xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                <path postcode={postInfoData.post_code} d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                            </svg>
                        </a>

                        {/*nút bình luận*/}
                        <a onClick={getComments} postcode={postInfoData.post_code} className="btn btn-sm btn-danger mt-1 m-1">
                        <svg  postcode={postInfoData.post_code}  xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-chat-dots bi-sm" viewBox="0 0 16 16">
                            <path postcode={postInfoData.post_code} d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                            <path postcode={postInfoData.post_code} d="M2.165 15.803l.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                        </svg>
                        </a>
                        {/* nút share */}
                        {/* <a postcode={postInfoData.post_code} className="btn btn-sm btn-primary mt-1 m-1">
                            <svg  postcode={postInfoData.post_code}  xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-share" viewBox="0 0 16 16">
                                <path postcode={postInfoData.post_code} d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                            </svg>
                        </a> */}
                        <Popup modal
                            trigger={
                                <div postcode={postInfoData.post_code} className="btn btn-sm btn-primary mt-1 m-1 icon-color-custom">
                                    <svg postcode={postInfoData.post_code} xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                                    </svg>
                                </div>
                            }
                        >
                        {close => <ModelSharePost postInfoData={postInfoData} close={close}/>}

                        </Popup>
                    </div>

        

                    {/*dòng bình luận*/}
                    {showComment && <Comment postcode={postInfoData.post_code} />}
                    {/* {showComment &&  } */}
                    {/* */}
                </div>
            </div>
        </div> :         
        <div className="post-card h-100">
            {/* bài post tự tạo*/}
            {/* Nếu đang ở trang cá nhân cuar mình thì mới hiển thị nút xóa bài viết*/}
            {userLogin?.data.user_code === usercode &&
                <div className="btn-delete-post-custom">
                    <div className="btn btn-delete-custom" postcode = {postInfoData.post_code} onClick={handleDeletePost}> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
            }
            <div className="media">
                <div className="media-header">
                    <div className="avatar-user-post">
                        <img src={postInfoData.created_by.picture} width={56} height={56} className="rounded-circle mr-3" alt="Ashley Briggs" />
                    </div>
                    <div className="media-header-info">
                        <p className="mb-2"><strong>{postInfoData.created_by.fullname}</strong></p>
                        <small className="text-muted">{TimeFromCreateToNow(postInfoData?.created_time)}</small>{/*time real dòng trạng thái*/}
                    </div>
                </div>
                
                <div className="media-body post-user">
                    
                    <p className="text-content-post m-3">{postInfoData.content}</p>
                    {/*hình ảnh được upload*/}
                    <div className="row no-gutters mt-1">

                        {listImage}
                        { 
                        postInfoData?.videos && 
                        <video width="750" height="500" controls >
                            <source src={postInfoData?.videos} type="video/mp4" />
                        </video>
                        }
                    </div>
                    

                    
                    {/*nút like*/}
                    <div className='like-number'>
                        <span className="text-like m-3">
                            Đã có {dataLikePost ? dataLikePost?.data.like_number : postInfoData?.liked_by.length} lượt thích
    
                        </span>
                    </div>
                    {/* //icon post */}
                    <div className="icon-post">
                            {/*nút like*/}
                        <a onClick={handleLikePost} postcode={postInfoData.post_code} className="btn btn-sm btn-danger mt-1 m-1">
                            <svg  postcode={postInfoData.post_code}  xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                            </svg>
                        </a>

                        {/*nút bình luận*/}
                        <a onClick={getComments} postcode={postInfoData.post_code} className="btn btn-sm btn-danger mt-1 m-1">
                        <svg  postcode={postInfoData.post_code}  xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-chat-dots bi-sm" viewBox="0 0 16 16">
                            <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                            <path d="M2.165 15.803l.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                        </svg>
                        </a>
                        {/* nút share */}
                        <Popup modal
                            trigger={
                                <div postcode={postInfoData.post_code} className="btn btn-sm btn-primary mt-1 m-1 icon-color-custom">
                                    <svg postcode={postInfoData.post_code} xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                                    </svg>
                                </div>
                            }
                        >
                        {close => <ModelSharePost postInfoData={postInfoData} close={close}/>}

                        </Popup>
                    </div>
                    {/*dòng bình luận*/}
                    {showComment && <Comment postcode={postInfoData.post_code} />}
                    {/* {showComment &&  } */}
                    {/* */}
                </div>
            </div>
        </div>}
         {/* {postContent} */}
        </div>


    );

}

export default PostUser