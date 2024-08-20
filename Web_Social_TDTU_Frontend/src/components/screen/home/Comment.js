import { useEffect, useState, useContext } from "react";
import { getListComment, createNewComment, deleteComment } from "../../../common/callapi/comment"
import { getDataApiDetailUserLogin } from "../../../common/callapi/user"
import { getCookieToken } from '../../../common/functions'
import "../../../css/home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/fontawesome-free-solid';
import { SocketContext } from '../../../thirdparty/socket';
import Popup from 'reactjs-popup';
function Comment(props) {
    const { postcode, dataComment } = props
    const socket = useContext(SocketContext);
    var token = getCookieToken()
    const [postCodeFromHomeComponent, setPostCodeFromHomeComponent] = useState(postcode ? postcode : "")
    const [commentState, setCommentState] = useState([])
    const [textComment, setTextComment] = useState()
    const [currentUser, setCurrentUser] = useState()
    const [listComment, setListComment] = useState()
    const [lasCommentId, setLastCommentId] = useState()
    const [NewDataComment, setNewDataComment] = useState()
    const [needToUpdateCommentRealTime, setNeedToUpdateCommentRealTime] = useState(true)

    const callApiGetListComment = async () => {
        try {
            const result = await getListComment(token, postcode);
            setLastCommentId(result?.data.last_comment_id)
            setCommentState(result?.data.list_comment_info)
        } catch (error) {
            console.error(error)
        }
    }

    // để bắt được socket cần dùng 2 useEffect, 1 cái để handle sự thay đổi của socket, 
    // 1 cái đểcập nhật dữ lieuj socket vao dữ liệu hiện có trong state
    // nếu chỉ sử dụng 1 useEffect handle socket và cập nhật dữ liệu sẽ xảy ra th dữ liệu state của comment bị mất sạch => cạp nhật bị sai
    useEffect(()=>{
        socket.on("event_comment", dataComment =>{
            console.log(dataComment)
            setNewDataComment(dataComment)
        })
    }, [socket])
    useEffect(()=>{
        if(NewDataComment?.data){
            setCommentState([...[NewDataComment?.data], ...commentState])
        }

    }, [NewDataComment])
    const loadMoreComment = async () => {
        try {
            if(lasCommentId){
                const result = await getListComment(token, postCodeFromHomeComponent, lasCommentId);
                setLastCommentId(result?.data.last_comment_id)
                setCommentState([...commentState, ...result?.data.list_comment_info])

            }

        } catch (error) {
            console.error(error)
        }
    }
    const callApiDeleteComment = async (commentcode) => {
        try {
            const result = await deleteComment(token, postCodeFromHomeComponent, commentcode);
            callApiGetListComment()
        } catch (error) {
            console.error(error)
        }
    }

    const dataProfileUser = async () => {
        try {
            const result = await getDataApiDetailUserLogin(token);
            setCurrentUser(result)
        } catch (error) {
            console.error(error)
        }
    }
    const callApicreateNewComment = async (formData) => {
        try {
            const result = await createNewComment(token, postCodeFromHomeComponent, formData);
            if (result?.response_status.code === "00") {
                setTextComment("")
                setCommentState([...[result?.data], ...commentState])
                
                
            }

        } catch (error) {
            console.error(error)
        }
    }
    function handleInput(event) {

        setTextComment(event.target.value)
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            createComment()
        }
      };
    function createComment() {
        var formData = new FormData();
        formData.append('content', textComment);
        setNeedToUpdateCommentRealTime(false)
        // choox nayf neeus cos ảnh sẽ làm thêm 
        callApicreateNewComment(formData)
     
    }

    function handleDeleteComment(e) {
        try{
            var commentcode = e.target.attributes.getNamedItem('commentcode').value
            console.log(commentcode)
            callApiDeleteComment(commentcode)
        }
        catch(error){
            console.log(error)
        }

    }

    // thay đổi nội dung danh sách comment bằng useEffect bắt sự kiệm mỗi khi commentState thay đổi giá trị 
    useEffect(() => {
        var comments = []
        if (commentState?.length !== 0 && commentState[0] !== undefined) {

            commentState.forEach(comment => {
                comments.push(
                    <div className="media mt-2 p-1 media-comment">
                        <a className="pr-2 m-1">
                            <img src={comment.created_by.picture} width={50} height={50} className="rounded-circle " alt="Stacie Hall" />
                        </a>
                        <div className="media-body bg-custom comment-content mt-1">
                            <p className="text-muted">
                                <strong>{comment.created_by.fullname}</strong>
                            </p>
                           <div className="comment-content-text">
                            <span>
                                {comment.content}
                            </span>
                           </div>
                        </div>
                        <div className='mt-1 p-2'>
                            {currentUser?.data.user_code === comment?.created_by?.user_code &&
                            <Popup
                                trigger={
                                    <div className='three-dot-icon '>
                                        <FontAwesomeIcon icon={faEllipsisH} /> 
                                    </div>
                                }
                                position='bottom left'
                                on='hover'
                                closeOnDocumentClick
                                mouseLeaveDelay={300}
                                mouseEnterDelay={0}
                                contentStyle={{ padding: '0px', border: 'none' }}
                                arrow={false}
                            >
                                <div className='d-flex flex-column'>
                                    <a className="btn btn-danger" commentcode={comment.comment_code} onClick={handleDeleteComment}>delete</a>
                                </div>
                            </Popup>
            }
                        </div>
                    </div>

                )
            })
            if (commentState?.length >= 10){
                comments.push(<div onClick={loadMoreComment}>hiển thị thêm </div>)
            }

        }
        setListComment(comments)
    }, [commentState])


    useEffect(() => {
        dataProfileUser()
        setPostCodeFromHomeComponent(postcode)
        callApiGetListComment()
    }, [postcode])
    return (
        <div>
            <div className="row">
                <hr />
                <div className="col-auto mt-2">
                    {/* Avatar */}
                    <div className="avatar avatar-sm">
                        <img src={currentUser?.data.picture} width={36} height={36} className="rounded-circle mr-2" alt="img" />
                    </div>
                </div>
                <div className="col ml-n2">
                    {/* Input */}
                    <form className="input-comment mt-1">
                        <label className="sr-only">Leave a comment...</label>
                        <textarea  onKeyDown={handleKeyPress} onChange={handleInput} className="form-control form-control-flush" data-toggle="autosize" rows={1} placeholder="Leave a comment" style={{ overflow: 'hidden', overflowWrap: 'break-word', height: '50px' }} value={textComment} defaultValue={""} />
                        <button type="button" onClick={createComment} className="btn btn-custom"><FontAwesomeIcon  usercodeComment = {currentUser?.data.user_code} className='my-auto' />
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                            </svg>
                        </button>
                        
                    </form>
                </div>
                <div className="col-auto align-self-end">
                    {/* Icons input file phần bình luân */}
                    {/* <div className="input-container mb-2">
                        <a className="text-reset mr-3" href="#!" type="file" data-toggle="tooltip" title data-original-title="Add photo">
                            <i className="fa fa-camera" />
                        </a>
                        <a className="text-reset mr-3" href="#!" data-toggle="tooltip" title data-original-title="Attach file">
                            <i className="fa fa-paperclip" />
                        </a>
                    </div> */}
                </div>
            </div>
            {listComment}

        </div>

    )
}

export default Comment;