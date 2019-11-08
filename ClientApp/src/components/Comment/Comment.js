import React from 'react';
import './Comment.css'
import api from '../../api/api'
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';
import { Modal, Button } from 'react-bootstrap'
import FIleUpload from './FileUpload';

const SweetAlert = withSwalInstance(swal);

const MyVerticallyCenteredModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  
        </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {
                    props.type === 'image' ? <img src={props.content} alt="user image" className="img-responsive" style={{ width: '100%'}} />
                        : <video src={props.content} className="img-responsive" controls autoPlay ></video>     
                }
               
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
export class Comment extends React.Component {
    constructor(props) {
        super(props)
        this.replyToComment = this.replyToComment.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleVideoUpload = this.handleVideoUpload.bind(this);
        this.commendID;
        this.checksObject = [];
        this.state = {
            allComments: this.props.comments,
            commentID: null,
            comtID: null,
            hideComment: new Array(this.props.comments.length).fill('d-none'),
            commentText: '',
            replyCommentText: '',
            commentImage: null,
            commentVideo: null,
            content:'',
            longitude: null,
            latitude: null,
            showw: false,
            modalShow: false, 
            fileObject: {},
            formData: {},
            style: { display: 'none' },
            styleForIT: { display: 'none'},
            type: '',
            showType: '',
            loggedUser: JSON.parse(localStorage.getItem('userdata'))
        }
        this.onCancel = this.onCancel.bind(this);
        this.onResourceClick = this.onResourceClick.bind(this);
    }

    onCancel() {
        this.setState({ style: { display: 'none' } , styleForIT: { display: 'none !important' }})
    }

    onResourceClick(e, type) {
        this.setState({ styleForIT: { display: 'block' }})
        e.preventDefault();
        switch (type) {
            case 'video':
                this.handleVideoUpload(e)
                break;
            case 'image':
                this.handleFileUpload(e)
               
                break;
            default:
                break;
        }
        
    }

    alertStuff = () => {
        alert("stuff here")
    }

    triggerInputFile = () => this.fileInput.click()
    triggerVideoFile = () => this.fileVideo.click()

    //handleTextarea = (event) => {
    //    if (event.keyCode == 13 && event.shiftKey == false) {
    //        event.preventDefault();
    //        this.myFormRef.submit();
    //    }
    //}

    setModalShow = (image, video) => {
        this.setState({ modalShow: true, content: image, showType: 'image' })
    }


    setModalVidShow = (video) => {
        this.setState({ modalShow: true, content: video, showType: 'video' })
    }

    removeModalShow = () => {
        this.setState({ modalShow: false })
    }
    

    handleClose = () => {
        this.setState({ showw: false })
    }

    handleShow = () => {
        this.setState({ showw: true})
    }

    replyToComment(cc, index) {
        const val = this.state.hideComment[index];
        const newh = [...this.state.hideComment];
        if (val == 'd-none') {
            newh[index] = '';
            this.setState({ ...this.state, commentID: cc, hideComment: newh })
        }
        else {
            newh[index] = 'd-none';
            this.setState({ ...this.state, commentID: cc, hideComment: newh })
        }
        //console.log(this.state)
    }

    handleCommentChange = (event) => {
        this.setState({ commentText: event.target.value })
    }

    handleReplyCommentChange = (event) => {
        this.setState({ replyCommentText: event.target.value })
    }

    handleFileUpload(e) {
        let file = e.target.getElementsByTagName('input')[0].files[0];
        //this.setState({ show: true, fileObject: file })
        //console.log(this.state.fileObject)
        let fileupload = new FormData()
        fileupload.append('file', file)
        console.log(fileupload)
        api.create('files/upload', fileupload)
            .then(res => {
                this.setState({ ...this.state, commentImage: res.name, style: { display: 'none' }, styleForIT: { display: 'none' } })
                //console.log(res)
                this.setState({ show: false})
                //this.setState({ commentImage: res.name })
            }).catch(err => console.log(err))
        
    }


    handleVideoUpload(e) {
        let file = e.target.getElementsByTagName('input')[0].files[0];
        console.log(this.state.fileObject)
        let fileupload = new FormData()
        fileupload.append('file', file)
        console.log(fileupload)
        api.create('files/upload', fileupload)
            .then(res => {
                this.setState({ ...this.state, commentVideo: res.name, styleForIT: { display: 'none' } })
                //console.log(res)this.setState({ styleForIT: { display: 'none' }})
                //this.setState({ commentImage: res.name })
            }).catch(err => console.log(err))

    }


    onFormSubmit = (event) => {
        event.preventDefault()
        api.create('comments/', {
            message: this.state.commentText,
            video: this.state.commentVideo,
            image: this.state.commentImage,
            longitude: this.state.longitude,
            latitude: this.state.latitude,
            userId: JSON.parse(localStorage.getItem('userdata')).id,
            projectId: this.props.projectID,
            commentId: this.state.commentID   
            //commentId: 0
        })

            .then(res =>
            {
                res.subComments = []
                res.user = JSON.parse(localStorage.getItem('userdata'))
                console.log(this.props.checks)
                if (this.props.checks) {
                    const userCheckList = this.props.checks.reduce((x, y) =>
                        x.concat({
                            commentId: res.id,
                            checkId: y
                        })
                        , [])
                    console.log(userCheckList)
                    api.create('userchecklist/collections', userCheckList)
                        .then(response => console.log(response))
                        .catch(err => console.log(err))
                }
                
                this.setState({ allComments: this.state.allComments.concat(res)})
                //console.log(this.state)
            }).catch(err => console.log(err))


       // console.log(this.checksObject)
       /* api.create('userchecklist/collections', {
        }).then(res => console.log(res))
        .catch(err => console.log(err))*/

    }

    
    onReplyFormSubmit = (event) => {
        event.preventDefault()
        //console.log(this.state)
        const commentToSend = {
            message: this.state.replyCommentText,
            video: this.state.commentVideo,
            image: this.state.commentImage,
            longitude: this.state.longitude,
            latitude: this.state.latitude,
            userId: JSON.parse(localStorage.getItem('userdata')).id,
            projectId: this.props.projectID,
            commentId: this.state.commentID
        };
        console.log(commentToSend)
        api.create('comments/', commentToSend)
            .then(res => {
               // console.log(res)
                res.user = JSON.parse(localStorage.getItem('userdata'))
                const newComments = [...this.state.allComments];
                const commentToUpdateToView = newComments.map(c => {
                    if (c.id === commentToSend.commentId) {
                        c.subComments.push(res);
                    }
                    return c;
                });
                //console.log(commentToUpdateToView)
                this.setState({ ...this.state, allComments: commentToUpdateToView, hideComment: new Array(this.props.comments.length).fill('d-none') })
                //console.log(this.state)
            }).catch(err => console.log(err))

    }

    componentDidMount() {
        this.getLocation()
        
    }


    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
        } else {
            alert("Sorry, we will not be able to record your comment unless you accept location request");
        }
    }

    geoSuccess = (position) => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        //alert("lat:" + lat + " lng:" + lng);
        this.setState({ latitude: lat, longitude: lng })
    }

    geoError = () => {
        alert("Geocoder failed.");
    }

    cancelAlert = () => {
        this.setState({ show: false, showVid: false })
    }
    

    render() {
        console.log(this.state.allComments)
        
        const vidImage = (image, video) => {
            const tags = [];
            console.log(image, video)
            if (image) {
                tags.concat(
                    <button className="btn btn-success" onClick={() => this.setModalShow(image)}>view image</button>
                )
            }

            if (video) {
                tags.concat(
                    <button className="btn btn-success" onClick={() => this.setModalVidShow(video)}>watch video</button>
                )
            }
            //console.log("tag a thing", tags)
            return tags
            
        }
        if (this.state.allComments) {
            const renderComments = this.state.allComments.map((comment, index) => {
                return (
                    //This is for ProjectComment}

                    <div key={comment.id} className="col-md-12">
                        <div className="col-md-12">
                            <div className="chat-box">
                                <div className="">
                                    <span className="user-name_">{comment.user.firstName + " " + comment.user.surName}</span><span className="user-state">{comment.user.state}</span>
                                </div>

                                <div className="pull-left user-chat" style={{ marginBottom: "3px !important" }}>
                                    {comment.message}
                                    
                                    <div>{comment.image && <button className="btn btn-success" onClick={() => this.setModalShow(comment.image)}>view image</button>}</div>
                                    <div>{comment.video && <button className="btn btn-success" onClick={() => this.setModalVidShow(comment.video)}>watch video</button>}</div>
                                </div>
                                <div style={{clear: 'both', marginBottom: "5px", fontSize: "10px"}}><span className="d-inline">{comment.date}</span> <span className="d-inline px-2"> {comment.time}</span></div>
                                <button className="reply-chat" onClick={() => this.replyToComment(comment.id, index)}>reply</button>
                            </div>
                            {comment.subComments.map(reply => {
                                return (
                                    <div key={reply.id} className="col-md-12">
                                        {reply.user.isAdmin ? <div className="col-md-9 offset-md-3">
                                            <span className="pull-right admin-name">Administrator</span><br />
                                            <div className="pull-right admin-chat">
                                                {reply.message}

                                            </div>
                                            <span className="">{}</span>
                                        </div> : <div className="col-md-9">
                                                <div className="chat-box">
                                                    <div className="">
                                                        <span className="user-name">{reply.user.firstName + " " + reply.user.surName}</span><span className="user-state">{reply.user.state}</span>
                                                    </div>
                                                   
                                                    <div className="pull-left user-chat">
                                                        {reply.message}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            })}
                            <div className={this.state.hideComment[index]}>
                                <form ref={el => this.myFormRef = el} onSubmit={this.onReplyFormSubmit}>
                                    <input hidden
                                        ref={fileInput => this.fileInput = fileInput}
                                        type="file" onChange={this.handleFileUpload}
                                    />
                                    <textarea placeholder="Type your comment here..." onChange={this.handleReplyCommentChange} className="write-comment"></textarea>
                                    <button type="submit" className="btn pd_button pd_button_green">submit</button>
                                </form>
                            </div>
                        </div>

                        <div className="col-md-1 offset-md-2"></div>
                      
                    </div>
                )
            })
            return (
                <div>
                    
                    <MyVerticallyCenteredModal
                        type={this.state.showType}
                        content={this.state.content}
                        imageUrl={this.state.commentImage}
                        videoUrl={this.state.commentVideo}
                        show={this.state.modalShow}
                        onHide={this.removeModalShow}
                    />
                   
                    <SweetAlert
                        show={this.state.show}
                        title="Image upload"
                        text="Do you wish to upload an attachment with your comment"
                        showCancelButton="true"
                        onConfirm={this.alertStuff}
                        closeOnCancel="true"
                        onCancel={this.cancelAlert}
                        closeOnClickOutside="true"
                    />
                    <SweetAlert
                        show={this.state.showVid}
                        title="Video upload"
                        text="Do you wish to upload an video with your comment"
                        showCancelButton="true"
                        onCancel={this.cancelAlert}
                        closeOnClickOutside="true"
                        onConfirm={this.alertStuff}
                    />

                    <div className="row mt-4">
                        <div className="col-md-12">
                            <FIleUpload onCancel={() => this.onCancel()} type={this.state.type} style={this.state.style} onSubmit={this.onResourceClick} />
                          
                            <div className="sp sp-loadbar" style={this.state.styleForIT}></div>
                            <form ref={el => this.myFormRef = el} onSubmit={this.onFormSubmit}>

                                <img className="fileUpload-attach" title="upload image" src="/images/attachment.png" onClick={() => this.setState({style: {display: 'block'}, type: 'image'})} alt="attachment" />
                                <img className="fileVideo-attach" title="upload video" src="/images/vidIcon.png" onClick={() => this.setState({ style: { display: 'block' }, type: 'video'})} alt="attachment" />
                            <textarea placeholder="Type your comment here..." onChange={this.handleCommentChange} className="write-comment"></textarea>
                            <button type="submit" className="btn pd_button_green text-white">submit</button>
                        </form>


                    </div>
                </div>
                    <div className="comment-container mt-4">
                        <div className="row">
                            {renderComments}
                        

                        </div>
                   
                    </div>
                </div>
            )
        }
        return (
            <p>loading...</p>
          )
    }
}