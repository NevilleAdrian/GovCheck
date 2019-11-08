import React from 'react'
import './SingleProject.css'
import '../Footer/Footer'
import { Footer } from '../Footer/Footer';
import api from '../../api/api'
import { Comment } from '../Comment/Comment'
import { CheckList } from '../CheckList/CheckList';
import { Redirect } from "react-router-dom";
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
                <Modal.Title id="contained-modal-title-vcenter" style={{display:'none'}}>
                    Close
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
export class SingleProject extends React.Component {
    constructor(props) {
        super(props)

        this.state = { project: null, hideComment: 'd-none', relatedProjects: [], checkedComments: [], checkedBoxes: [], htmlReport: '', modalShow: false, showRelated: 'd-none' }
        //this.commentHolder;
    }

    componentDidMount() {
        api.all(`projects/${this.props.match.params.slug}`)
            .then(res => {
                api.all(`categories/${res.category.id}?projects=true`)
                    .then(resi => {
                        console.log(res)
                        const projects = resi.category.projects.filter(project => project.id !== res.id)
                        this.setState({
                            relatedProjects: projects, project: res, showRelated: projects.length > 0 ? '': 'd-none'
                        })
                    }).catch(err => console.log(err))

            }).catch(err => console.log(err))

    }

    viewReport = (id) => {
        api.all(`projects/report/${id}`)
            .then(res => {
                console.log(res)
                this.setState({ modalShow: true, htmlReport: res.report })
            }).catch(err => console.log(err))
    }

    removeModalShow = () => {
        this.setState({ modalShow: false })
    }

    handleSingleProjectClick = (params) => {
        console.log(this.props.history)
        this.props.history.push(`/projects/${params}`)
        api.all(`projects/${params}`)
            .then(res => {
                api.all(`categories/${res.category.id}?projects=true`)
                    .then(resi => {
                        //console.log(resi)
                        const projects = resi.category.projects.filter(project => project.id !== res.id)
                        this.setState({ relatedProjects: projects, project: res })
                        window.scrollTo(0, 200)
                    }).catch(err => console.log(err))

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
        //console.log(childData)
    }


    isAuthenticated() {
        const token = localStorage.getItem('token');
        if (token) return true;
        return false;
    }
    weeksBetween = (d1, d2) => {
        return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
    }

    render() {
        
        
        const isAlreadyAuthenticated = this.isAuthenticated();
        let relatedProjects = []
        if (this.state.relatedProjects) {
            relatedProjects = this.state.relatedProjects.map(project => {
                let endDate = Number(new Date(project.endDate))
                let startDate = Number(new Date(project.startDate))
                let today = Number(new Date())
                const startedOrNot = () => {
                    if (startDate > today && today < endDate) {
                        return (<span className="pd_button main_pd_cal_button pd_smaller">NOT STARTED</span>)
                    }
                    else if (today >= endDate) {
                        return (<span className="pd_button pd_button_green pd_smaller">COMPLETED</span>)
                    }
                    else {
                        let noOfWeeks = this.weeksBetween(startDate, endDate)
                        return (<small className="pd_smaller m-0">{`started ${noOfWeeks} weeks ago`}</small>)
                    }
                }
                return (

                    <div className="row">

                        <div className="col-xl-3 col-md-5 m-0 mb-4 p-0 img_container">
                            <img className="pdc_image" src={project.image} alt="project_image" onClick={() => this.handleSingleProjectClick(project.id)} />
                        </div>
                        <div className="col-xl-5 col-md-7 img_details" onClick={() => this.handleSingleProjectClick(project.id)} >
                            <p className="inc_font pd_heading">{project.title}</p>
                            <small className="pd_smaller m-0 pr-0">2 weeks ago Updates (0)</small>
                            {startedOrNot()}
                            <div className="">

                            </div>
                            <div className="pd_cal">
                                <span className="fa fa-comment pd_smaller">{project.totalComments}</span>
                            </div>
                        </div>

                    </div>


                )
            })
        }


        
        if (this.state.project) {
            const percentComplete = this.state.project.category.checks && this.state.project.comments.length > 0 ?
                this.state.project.comments.reduce((acc, checks_) => {
                    acc += checks_.checks.length / this.state.project.category.checks.length
                    //console.log(checks_.checks.length)
                    return acc;

                }, 0) : 0
            const calcAvg = `${((percentComplete / this.state.project.comments.length) * 100).toFixed(2)}%`;
            console.log(calcAvg)


            let endDate = Number(new Date(this.state.project.endDate))
            let startDate = Number(new Date(this.state.project.startDate))
            let today = Number(new Date())
            const startedOrNot = () => {
                if (startDate > today && today < endDate) {
                    return { status: 'd-none', jsx: <span className="pd_button main_pd_cal_button pd_smaller">NOT STARTED</span>}
                    
                }
                else if (today >= endDate) {
                    return { status: '', jsx: <span className="pd_button pd_button_green pd_smaller">COMPLETED</span> }
                }
                else {
                    let noOfWeeks = this.weeksBetween(startDate, endDate)
                    return { status: '', jsx: <small className="pd_smaller m-0">{`started ${noOfWeeks} ago`}</small> }
                }
            }
            return (
                <div>
                    <MyVerticallyCenteredModal
                        report={this.state.htmlReport}
                        show={this.state.modalShow}
                        onHide={this.removeModalShow}
                    />
                    {isAlreadyAuthenticated ?
                        <div>

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
                                            <div className="mt-4 mb-4">
                                                <div>{this.state.project.category.checks.length > 0 ? <span>This project is {calcAvg} complete</span> : " "}</div>
                                            </div>
                                            <div className="mt-4">{startedOrNot().jsx}</div>
                                            <div className="mt-4"><button className="btn btn-success" onClick={() => this.viewReport(this.state.project.id)}>View Report</button></div>

                                            <CheckList checklists={this.state.project.category.checks} checkedBoxes={this.state.checkedComments} parentCallback={this.myCallback} />

                                            <div className="main_pd_cal">
                                                <hr className="main_pd_cal_line" />

                                                <button className="btn"><span className="fa fa-comment main_pd_smaller"> {this.state.project.comments.length}</span></button>

                                                <button className={`main_pd_cal_button ${startedOrNot().status}`} onClick={() => this.showCommentBox()}>Comments</button>
                                            </div>

                                            <div className={this.state.hideComment}>
                                                <Comment projectID={this.state.project.id} comments={this.state.project.comments} checks={this.state.checkedComments} />
                                            </div>
                                        </div>




                                    </div>

                                    
                                    <div className={`m-0 p-0 mt-5 ${this.state.showRelated} `}>
                                        <div className="col-12 m-0 p-0 mt-5 mb-4">
                                            <h4 className="p_heading f_h4">Related Projects</h4>
                                        </div>
                                        {relatedProjects}

                                    </div>

                                </div>
                            </div>
                            <Footer />
                        </div>
                        : (<Redirect to={{ pathname: "/login" }} />)}
                </div>
            )
        }
        else {
            return (<p>Loading...</p>)
        }

    }
}