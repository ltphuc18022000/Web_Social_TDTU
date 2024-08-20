import  React, { useEffect, useState } from 'react';
import { getCookieToken } from '../../../common/functions'
import "../../../css/share.css"
import {sharePost} from '../../../common/callapi/post_service'
import { getDataApiDetailUserLogin } from "../../../common/callapi/user";

function ModelSharePost(props) {
    const {close, postInfoData} = props 
    console.log(postInfoData, postInfoData.post_code)
    const [textPost, setTextPost] = useState("")
    const [userLogin, setUserLogin] = useState("")
    const [imageInPost, setImageInPost] = useState("")
    const [videoInPost, setVideoInPost] = useState("")

    var token = getCookieToken()
    function handleInput(event) {
        console.log(event.target.value)
        setTextPost(event.target.value)
    }
    const dataProfileUser = async () => {
        try {
            const userInfo = await getDataApiDetailUserLogin(token);
            setUserLogin(userInfo)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        dataProfileUser() 
    }, [])

    useEffect(()=>{
        var images = []
        var videos = []
        var postData = []
        if(postInfoData !=="" && postInfoData.images.length > 0){
            postInfoData.images.forEach(image => {
                images.push(
                    <div className='posted-image'>
                    <img src={image} className="img-fluid img-posted" alt="Unsplash"></img>
                  </div>
      

                )
            })
            setImageInPost(images)
        }
        
        if(postInfoData !=="" && postInfoData.videos){

                videos.push(
                    <video  controls >
                        <source src={postInfoData.videos} type="video/mp4"/>
                    </video>

                )
            setVideoInPost(videos)
        }

        
    }, [])
    const callApiSharePost = async()=>{
        try{

            const result = await sharePost(token, postInfoData.post_code, textPost)
            if(result?.response_status?.code === "00"){
                console.log("da share bai viet")
 
            }
            close()
        }
        catch(error){
            console.error(error)
        }

      
    }

  return (
    <div>
        {/* The Modal */}
        <div className="modal-share-container p-5 border bg-custom mt-1" >
            <div className="modal-dialog">
                <div className="modal-content">
                    
                    <div className='modal-post-header-custom'>
                        <a className='btn btn-custom ' onClick={close}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </a>
                    </div>
                    {/* Modal Header */}
                    <div className="modal-header ">
                        <h2 className="modal-title ">Chia sẻ bài viết</h2>
                        
                    </div>
                    {/* Modal body */}
                    <div className="modal-body modal-body-custom">
                        <form>
                            {/* Info nguoi share post */}
                            <div className="form-group bg-post-home--custom rounded mb-2 mt-2">
                                <label htmlFor="recipient-name" className="col-form-label">
                                    {userLogin?.data?.fullname}
                                    </label>
                                {/* <input type="text" className="form-control" id="recipient-name" defaultValue="@username" /> */}
                            </div>
                            <div className="form-group">
                                <div className='rounded input-post-custom'>
                                <textarea  className="form-control" id="message-text" value = {textPost} onChange={handleInput}  >Bạn đang nghĩ gì thế?</textarea>
                                </div>
                                
                            </div>
                           {/* bài viết dược share */}
                
                            <div className='posted-container rounded '>
                                {/* info chu bai post */}
                                <div className='p-2 header-posted bg-light'>
                                    <div className='info-user-posted'>
                                      <img src={postInfoData.created_by.picture}  className="rounded-circle m-2" alt="Sharon Lessman" width={50} height={50}/>
                                      <div className='name-posted-content'>
                                        <span className=''><strong>{postInfoData?.created_by.fullname}</strong></span>
                                        <small>5m</small>
                                      </div>
                                    </div>
                                    <b className='text-posted'>{postInfoData.content}</b>
                                </div>
                                {/* hinh bai post dc share */}
                                {imageInPost}
                                {videoInPost}
                                {/* <div className='posted-image'>
                                  <img src="http://res.cloudinary.com/darjwnxvd/image/upload/v1709994210/xinhnh2/o4koarfg7giyvjw9pqgd.jpg" class="img-fluid img-posted" alt="Unsplash"></img>
                                </div> */}
                            </div>
                            {/*Mục input hình ảnh, file, video*/}
                            
                        </form>
                        {/* Modal footer */}
                        <div className="modal-footer w-100">
                            <button onClick={callApiSharePost} type="button" className="btn btn-primary mt-5 btn-lg w-100">Share</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ModelSharePost