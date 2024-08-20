import { useEffect, useState, useContext } from "react";
import { getCookieToken, TimeFromCreateToNow } from '../../../common/functions'
import { Link } from 'react-router-dom';
import Comment from './Comment';
import { LikePost } from '../../../common/callapi/post';
import { SocketContext } from '../../../thirdparty/socket';
import ModelSharePost from "./model_share_post";
import Popup from 'reactjs-popup';
import { getDataApiDetailUserLogin } from "../../../common/callapi/user";

function Post(props) {
    const socket = useContext(SocketContext);
    const { postInfoData } = props
    const [listImage, setListImage] = useState([])
    const [showComment, setShowComment] = useState(false)
    const [commentState, setCommentState] = useState()
    const [postcodeState, setPostCode] = useState()
    const [dataPost, setDataPost] = useState()
    const [newDataComment, setNewDataComment] = useState()
    const [dataLikePost, setDataLikePost] = useState()
    const [userLogin, setUserLogin] = useState()
    var token = getCookieToken()
    const calApiLikePost = async (postcode) => {
        try {
            const likePostInfo = await LikePost(token, postcode);
            setDataLikePost(likePostInfo)

        } catch (error) {
            console.error(error)
        }
    }
    // useEffect(()=>{
    //     socket.on("event_comment", dataComment =>{
    //         setNewDataComment(dataComment)
    //     })
    // })

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
            console.log("da vo")
            var getPostcode = e.target.attributes.getNamedItem('postcode')?.value
            setPostCode(getPostcode)
            console.log("vao fnef", getPostcode, postcodeState)
        }
        catch(error){
            console.log(error)
        }

    }

    useEffect(() => {
        const dataProfileUser = async () => {
            try {
                const userInfo = await getDataApiDetailUserLogin(token);
                setUserLogin(userInfo)
            } catch (error) {
                console.error(error)
            }
        }
        dataProfileUser()
    }, [])
    useEffect(() => {
        const listPost = []
        var images = []
        var videos = []
        var imageShare = []

        if (postInfoData !== "" && postInfoData.images.length > 0) {
            postInfoData.images.forEach(image => {
                images.push(
                    <div className="col-auto flex-column">
                        <img src={image} className="img-fluid pr-1" alt="Unsplash" />
                    </div>


                )
            })
            // setListImage(images)
        }
        if (postInfoData !== "" && postInfoData?.videos !== "") {
            videos.push(
                <video width="750" height="500" controls >
                    <source src={postInfoData.videos} type="video/mp4" />
                </video>)

        }

        if (postInfoData === "") {
            listPost.push(
                <div className="card">
                    <div className="card-body h-100">
                        <div className="media">
                            Bạn chưa có bài viết nào
                        </div>
                        {/*hết trang tin*/}
                        {/* <div className="media-body">
                    <img src="https://cdn1.iconfinder.com/data/icons/animals-95/300/cat-delete-animal-pet-wild-domestic-256.png" width={56} height={56} className="mr-3" alt="Ashley Briggs" />
                    <h5 className="text-center lh-100">You have watched all the news</h5>
                </div> */}
                    </div>
                </div>
            )
            setDataPost(listPost)

        }
        else {

            if (postInfoData?.root_post !== "") {
                /////////////// phần share bài vieesrt //////////////////////////////////////////////////////
                // lấy hình ảnh của bài post được share
                if (postInfoData?.root_post && postInfoData?.root_post_info?.images.length > 0) {
                    postInfoData?.root_post_info?.images.forEach(image => {
                        imageShare.push(
                            <div className="col-auto flex-column">
                                <img src={image} className="img-fluid pr-1" alt="Unsplash" />
                            </div>


                        )
                    })
                }
                listPost.push(
                    <div className="card-body h-100">
                    <div className="media">
                        <div className="media-header">
                            <img src={postInfoData.created_by.picture} width={56} height={56} className="rounded-circle mr-3" alt="Ashley Briggs" />
                            <div className="media-header-info">
                               <Link className="text-dark fw-bold text-decoration-none" to={`/profile/${postInfoData.created_by.user_code}/post/`} state={{ "usercode": postInfoData.created_by.user_code }}><p className="mb-2"><strong>{postInfoData.created_by.fullname}</strong></p></Link>
                                <small className="text-muted">{TimeFromCreateToNow(postInfoData?.created_time)}</small>{/*time real dòng trạng thái*/}
                            </div>
                        </div>
                        <div className="media-body">
                            <span className="text-content-post p-1 m-2">{postInfoData?.content}</span>
                                {/*Content share post chinh la bai post duoc share*/}


               
                                <div className="card card-post mb-3">
                                {postInfoData.root_post_info!==null &&
                                    <div className="card-body h-100">
                                        <div className="media">
                                            <div className="media-header">
                                                <img src={postInfoData?.root_post_info?.created_by.picture} width={56} height={56} className="rounded-circle mr-3" alt="Ashley Briggs" />
                                                <div className="media-header-info">
                                                <Link className="text-dark fw-bold text-decoration-none" to={`/profile/${postInfoData?.root_post_info?.created_by.user_code}/post/`} state={{ "usercode": postInfoData?.root_post_info?.created_by.user_code }}><p className="mb-2"><strong>{postInfoData?.root_post_info?.created_by.fullname}</strong></p></Link>
                                                    <small className="text-muted">{TimeFromCreateToNow(postInfoData?.root_post_info?.created_time)}</small>{/*time real dòng trạng thái*/}
                                                </div>
                                            </div>
                                            <div className="media-body">
                                                <span className="text-content-post p-1 m-2"><p>{postInfoData?.root_post_info?.content}</p></span>
                                                    {/*hình ảnh được upload*/}
                                                    <div className="row no-gutters mt-1">

                                                        {imageShare}
                                                        

                                                        { 
                                                        postInfoData?.root_post_info?.videos && 
                                                        <video width="750" height="500" controls >
                                                            <source src={postInfoData?.root_post_info?.videos} type="video/mp4" />
                                                        </video>
                                                        }
                                                                                
                                                    </div>
            

                                            </div>
                                        </div>
            
                                    </div>
                                          }
                                            {
                                    postInfoData.root_post_info===null &&             <div className="card-body h-100">
                                    <div className="media">
                                            <div className="media-body post-user">
                                                <p className="text-content-post">Bài viết đã bị gỡ bởi chủ sở hữu</p>
                                            </div>
                                        </div>
                                </div>
                                }

                                </div>
                          
                              

                                 {/* hết nội dung của bài viết được share  */}


                                {/* <div className="row no-gutters mt-1">
                                </div> */}
                              <div className='like-number'>
                                <span className="m-3 text-like">
                                        Đã có {dataLikePost ? dataLikePost?.data.like_number : postInfoData?.liked_by.length} lượt thích
                                </span>
                                  
                                </div>
                                <div className="icon-post">
                                    {/*nút like*/}
                                    <div onClick={handleLikePost} postcode={postInfoData.post_code} className="btn btn-sm btn-danger mt-1 m-1">
                                        <svg postcode={postInfoData.post_code} xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                                        </svg>
                                    </div>
                                    {/*nút bình luận*/}
            
                                    <div onClick={getComments} postcode={postInfoData.post_code} className="btn btn-sm btn-secondary mt-1 m-1">
                                        <svg postcode={postInfoData.post_code} xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-chat-dots bi-sm" viewBox="0 0 16 16">
                                            <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                                            <path d="M2.165 15.803l.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                                        </svg>
            
                                    </div>
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
                                        {close => <ModelSharePost postInfoData={postInfoData}  userLogin={userLogin} close={close}/>}
            
                                        </Popup>
                                </div>
                                
            
                                {/*dòng bình luận*/}    
                                {/* {showComment && <Comment dataComment = {newDataComment} postcode={postInfoData.post_code} />} */}
                                {showComment && <Comment  postcode={postInfoData.post_code} />}
                                {/* {showComment &&  } */}
                                {/* */}
                            </div>
                        </div>
                        {/*hết trang tin*/}
                        {/* <div className="media-body">
                            <img src="https://cdn1.iconfinder.com/data/icons/animals-95/300/cat-delete-animal-pet-wild-domestic-256.png" width={56} height={56} className="mr-3" alt="Ashley Briggs" />
                            <h5 className="text-center lh-100">You have watched all the news</h5>
                        </div> */}
                    </div> )
            }
            else {
                listPost.push(   
                    <div className="card-body h-100">
                        <div className="media">
                            <div className="media-header">
                                <img src={postInfoData.created_by.picture} width={56} height={56} className="rounded-circle mr-3" alt="Ashley Briggs" />
                                <div className="media-header-info">
                                <Link className="text-dark fw-bold text-decoration-none" to={`/profile/${postInfoData.created_by.user_code}/post/`} state={{ "usercode": postInfoData.created_by.user_code }}><p className="mb-2"><strong>{postInfoData.created_by.fullname}</strong></p></Link>
                                    <small className="text-muted">{TimeFromCreateToNow(postInfoData?.created_time)}</small>{/*time real dòng trạng thái*/}
                                </div>
                            </div>
                            <div className="media-body">
                                <span className="text-content-post p-1 m-2">{postInfoData?.content}</span>
                                {/*hình ảnh được upload*/}
                                <div className="row no-gutters mt-1">
                                    {/* {listImage} */}
                                    {images}
                                    {videos}
                                </div>
                                
                                <div className='like-number'>
                                <span className="m-3 text-like">
                                        Đã có {dataLikePost ? dataLikePost?.data.like_number : postInfoData?.liked_by.length} lượt thích
                                </span>
                                  
                                </div>
                                <div className="icon-post">
                                    {/*nút like*/}
                                    <div onClick={handleLikePost} postcode={postInfoData.post_code} className="btn btn-sm btn-danger mt-1 m-1">
                                        <svg postcode={postInfoData.post_code} xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                            <path postcode={postInfoData.post_code} d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                                        </svg>
                                    </div>
                                    {/*nút bình luận*/}
            
                                    <div onClick={getComments} postcode={postInfoData.post_code} className="btn btn-sm btn-secondary mt-1 m-1">
                                        <svg postcode={postInfoData.post_code} xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-chat-dots bi-sm" viewBox="0 0 16 16">
                                            <path postcode={postInfoData.post_code} d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                                            <path postcode={postInfoData.post_code} d="M2.165 15.803l.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                                        </svg>
            
                                    </div>
                                    {/* nút share */}
                                
                                    <Popup modal
                                            trigger={
                                                <div postcode={postInfoData.post_code} className="btn btn-sm btn-primary mt-1 m-1 icon-color-custom">
                                                    <svg postcode={postInfoData.post_code} xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                                                      <path postcode={postInfoData.post_code} d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                                                   </svg>
                                                </div>
                                            }
                                        >
                                        {close => <ModelSharePost postInfoData={postInfoData} userLogin={userLogin} close={close}/>}
            
                                        </Popup>
                                </div>
                                
            
                                {/*dòng bình luận*/}    
                                {/* {showComment && <Comment dataComment = {newDataComment} postcode={postInfoData.post_code} />} */}
                                {showComment && <Comment  postcode={postInfoData.post_code} />}
                                {/* {showComment &&  } */}
                                {/* */}
                            </div>
                        </div>
                        {/*hết trang tin*/}
                        {/* <div className="media-body">
                            <img src="https://cdn1.iconfinder.com/data/icons/animals-95/300/cat-delete-animal-pet-wild-domestic-256.png" width={56} height={56} className="mr-3" alt="Ashley Briggs" />
                            <h5 className="text-center lh-100">You have watched all the news</h5>
                        </div> */}
                    </div> )
            }
            setDataPost(listPost)

        }

    }, [showComment, postInfoData, dataLikePost])

    // useEffect(()=>{
    //     if(showComment === true){
    //         setCommentState(<Comment dataComment = {newDataComment} postcode={postInfoData.post_code} />)
    //     }
    // }, [showComment])
    return (

        <div>


        {/* <div className="card"> */}

        <div className="card card-post mb-3">

            {dataPost}
        </div>
        </div>
    );
}
export default Post;
