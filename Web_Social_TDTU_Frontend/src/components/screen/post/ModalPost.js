import React, { useState } from 'react'
import { createPost } from '../../../common/callapi/post_service';
import { getCookieToken } from '../../../common/functions'
import BounceLoader from 'react-spinners/BounceLoader';

export default function ModalPost(props) {
    const {close,userLogin, setLastPostId, setPostInfo, setpostState} = props 
    const [textPost, setTextPost] = useState("")
    const [postImages, setPostImages] = useState();
    const [postVideo, setpostVideo] = useState([]);
    const [onLoading, setOnLoading] = useState(false)
    var token = getCookieToken()

    function handleInput(event) {
        console.log(event.target.value)
        setTextPost(event.target.value)
    }
    const changeImage  = (e) => {
        const files = Array.from(e.target.files);
        setPostImages(files);

    };
    const changeVideo  = (e) => {
        const video = e.target.files[0];
        setpostVideo(video);

    };
    const callApiCreateNewPost = async (formdata) =>{
        try {
            const newPost = await createPost(token, formdata);
            if(newPost?.response_status?.code === "00"){
                console.log("vaof nef")
                setOnLoading(false)
                window.location.reload(true);
                close()
            }
            console.log(newPost)
        } catch (error) {
            console.log(error)
        }
    }
    const createNewPost = ()=>{
        try{
            var formData = new FormData();
            formData.append('content', textPost);
            if(postImages?.length > 0 ){
                postImages.forEach((image, index) => {
                    formData.append(`images_upload`, image);
                  });
            }
            formData.append('video_upload', postVideo);
            setOnLoading(true)
            callApiCreateNewPost(formData)


        
        }
        catch(error){
            console.log(error)
        }

    }
  return (
    <div>
        {/* The Modal */}
        <div className="modal-post-container p-5 border bg-custom mt-1" >
            <div className="modal-dialog">
                <div className="modal-content">
                    
                    <div className='modal-post-header-custom'>
                        <a className='btn btn-custom ' onClick={close}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </a>
                    </div>
                    {/* Modal Header */}
                    <div className="modal-header ">
                        <h2 className="modal-title ">Tạo bài viết</h2>
                        
                    </div>
                    {/* Modal body */}
                    <div className="modal-body">
                        <form>
                            <div className="form-group bg-post-home--custom rounded m-1">
                                <label htmlFor="recipient-name" className="col-form-label ">{userLogin?.data.fullname}</label>
                                {/* <input type="text" className="form-control" id="recipient-name" defaultValue="@username" /> */}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Message:</label>
                                <div className='rounded input-post-custom'>
                                <textarea onChange = {handleInput} className="form-control" id="message-text" defaultValue="" />
                                </div>
                                
                            </div>
                            {/*Mục input hình ảnh, file, video*/}
                            <div>
                                <div className="input-group m-2">
                                    <div>
                                        <i className="bi bi-file-earmark-richtext" />
                                        <label htmlFor="image_uploads" className='p-1'>Choose images to upload (PNG, JPG, JPEG)</label>
                                        {/* <input hidden onChange={onImageChange} type='file' id='input-img' accept='image/*'></input> */}
                                        <input onChange={changeImage} className="btn rounded btn-custom p-2" type="file" id="image_uploads" name="image_uploads" accept=".jpg, .jpeg, .png" multiple aria-hidden="true" />
                                    </div>
                                    <div>
                                        <label htmlFor="file_uploads" className='p-1'>Choose video to upload</label>
                                        <input  onChange={changeVideo} className="fa fa-file icon " type="file" id="file_uploads" aria-hidden="true" />

                                    </div>
                                    <div className="preview">
                                    </div>
                                </div>
                            </div></form>
                        {/* Modal footer */}
                        <div className="modal-footer">


                        {onLoading ?
                                            <div className='mt-3'>
                                            <BounceLoader color="#36d7b7" loading={onLoading} size={40} />  </div>
                                            :
                                            <button type="button" onClick={createNewPost} className="btn btn-danger mt-5 btn-lg w-100">Posted</button>
                                        }

              
             
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
