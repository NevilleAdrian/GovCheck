import React from 'react'
import './MainContent.css'
import api from '../../api/api'




export class MainContent extends React.Component {
    constructor(props) {
        super(props)
        //console.log(this.props)
        this.state = { projects: [],}
    }

    handleSingleProjectClick = (params) => {
        //console.log(this.props.history)
        this.props.history.push(`/projects/${params}`)
    }

    componentDidMount() {
        api.all('projects/')
            .then(res => {
                ////console.log(res)
                //const projects = res.projects.map(item => console.log(item))
                this.setState({ projects: res.projects})
                ////console.log(projects)
            }).catch(err => console.log(err))
    }

     weeksBetween = (d1, d2) =>  {
        return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
    }
       
    render() {
   
        const allproject = this.state.projects.map(project => {
            let endDate = Number(new Date(project.endDate))
            let startDate = Number(new Date(project.startDate))
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
                <div className="row m-0 mt-5">
                    <div className="col-xl-5 col-md-5 m-0 p-0 img_container" onClick={() => this.handleSingleProjectClick(project.id)}>
                        <img className="pdc_image" src={project.image} alt="project_image" />
                    </div>
                    <div className="col-xl-7 col-md-7 img_details">
                        <div className="descript" onClick={() => this.handleSingleProjectClick(project.id)}>
                            <p className="pd_heading">{project.title}</p>
                            <p className="pd_small mb-0">{project.brief}</p>
                        </div>
                        <p className="pd_small mb-0">Category: <span style={{ color: ' #85D866' }}>{project.category.name}</span></p>

                        <div className="pd_cal">
                            <hr className="pd_cal_line" />
                            <span className="fa fa-comment pd_smaller descript" onClick={() => this.handleSingleProjectClick(project.id)}>{project.totalComments}</span>
                            {startedOrNot()}
                        </div>
                    </div>
                </div>)
        })
        //console.log(this.state.projects)
     
        return (
       
            <div className="main-section">
                <div className="banner">
                    <div className="container banner-div">
                        <h1 className="big-text"><span className="d-md-block d-sm-inline"><strong>COLLABORATE, TRACK</strong></span> <span className="d-md-block d-sm-inline"><strong>AND GIVE FEEDBACK</strong></span></h1>
                        <h1 className="small-text"><strong>on public projects in your community.</strong></h1>
                        <p className="learn-more-p"><a href="" className="learn-more"><strong>Learn More</strong></a></p>
                    </div>
                </div>

                <div className="container smaller-text">
                    GovCHECK is a community of active citizens tracking the implementation of Government projects in their community to ensure service delivery.
                    </div>

                <div className="projects">
                    <div className="container">
                        <div className="projects-text">
                            <h4 className="realtime-projects">Get realtime updates on projects around you!</h4>
                        </div>
                    </div>

                    <div className="container">

                        {allproject}
                     
                                                               
                        </div>
                                                        </div>
                </div>
     
            )
    }
}