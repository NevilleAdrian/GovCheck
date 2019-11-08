import React from 'react'
import './ViewProject.css'
import '../Footer/Footer'
import { Footer } from '../Footer/Footer';
import api from '../../api/api'
import { Comment } from '../Comment/Comment'
import { Modal, Button } from 'react-bootstrap'

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
                    Modal heading
        </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    props.report
                }

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
export class ViewProject extends React.Component {
    constructor(props) {
        super(props)

        this.state = { project: null, hideComment: 'd-none', relatedProjects: [], checkedComments: [], checkedBoxes: [], htmlReport: '', modalShow: false, }
        //this.commentHolder;
    }

    componentDidMount() {
        api.all(`projects/${this.props.match.params.slug}`)
            .then(res => {
                this.setState({ project: res })
            }).catch(err => console.log(err))

    }

    showCommentBox = (event) => {
        if (this.state.hideComment === 'd-none') {
            this.setState({ hideComment: '' })
        }
        else {
            this.setState({ hideComment: 'd-none' })
        }
    }

    myCallback = (childData) => {
        this.setState({ checkedComments: childData })
        console.log(childData)
    }

    removeModalShow = () => {
        this.setState({ modalShow: false })
    }

    viewReport = (id) => {
        api.all(`projects/report/${id}`)
            .then(res => {
                console.log(res)
                this.setState({ modalShow: true, htmlReport: res.report })
            }).catch(err => console.log(err))
    }


    render() {
        //console.log(this.state.relatedProjects)


        if (this.state.project) {
            let endDate = Number(new Date(this.state.project.endDate))
            let startDate = Number(new Date(this.state.project.startDate))
            let today = Number(new Date())
            const startedOrNot = () => {
                if (today > startDate) {
                    return (<span className="pd_button main_pd_cal_button pd_smaller">NOT STARTED</span>)
                }
                else if (today >= endDate) {
                    return (<span className="pd_button pd_button_green pd_smaller">COMPLETED</span>)
                }
                else {
                    let noOfWeeks = this.weeksBetween(startDate, endDate)
                    return (<small className="pd_smaller m-0">{`started ${noOfWeeks} ago`}</small>)
                }
            }
            return (
                <div>
                    <MyVerticallyCenteredModal
                        report={this.state.htmlReport}
                        show={this.state.modalShow}
                        onHide={this.removeModalShow}
                    />

                    <div className="project_jumbotron">
                        <div className="project_header_banner">
                            <h1 className="project_heading mt-0">Projects </h1>
                        </div>
                    </div>

                    <div className="container project_main">
                        <div className="row m-0">

                            <h1 className="main_p_heading">{this.state.project.title}</h1>
                            <div className="row m-0">
                                <div className="col-xl-5 col-md-5 m-0 p-0 img_container">
                                    <img className="pdc_image" src={this.state.project.image} alt="project_image" />
                                    <p className="main_pd_small text-justify mt-4">{this.state.project.description}</p>
                                </div>
                                <div className="col-xl-6 col-md-7 main_img_details">
                                    <p className="main_pd_heading">{this.state.project.title}</p>
                                    <p className="main_pd_small mb-3">{this.state.project.brief}</p>
                                    <p className="main_pd_small mb-0">Category: <span style={{ color: '#85D866' }}>{this.state.project.category.name}</span></p>

                                    <div className="mt-4">{startedOrNot()}</div>
                                    <div className="mt-4"><button className="btn btn-success" onClick={() => this.viewReport(this.state.project.id)}>View Report</button></div>


                                    <div className="main_pd_cal">
                                        <hr className="main_pd_cal_line" />

                                        <button className="btn"><span className="fa fa-comment main_pd_smaller"> {this.state.project.comments.length}</span></button>

                                        <button className="main_pd_cal_button" onClick={() => this.showCommentBox()}>Comments</button>
                                    </div>

                                    <div className={this.state.hideComment}>
                                        <Comment projectID={this.state.project.id} comments={this.state.project.comments} checks={this.state.checkedComments} />
                                    </div>
                                </div>




                            </div>


                        </div>
                    </div>
                    <Footer />
                </div>


            )
        }
        else {
            return (<p>Loading...</p>)
        }

    }
}