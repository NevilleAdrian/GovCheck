import React from 'react';
import './Projects.css';
import { Redirect } from "react-router-dom";
import api from '../../api/api'
import axios from 'axios'
//import locations from '../../js/location'
import { Spinner } from '../Spinner/Spinner'

export class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.handleSearchSelection = this.handleSearchSelection.bind(this);

        this.state = {
            projects: [], categoryFilter: [], locationFilter: [], searchInput: '', search: '',
            showSpinner: "",
            searchID: 0}
    }

   
    handleSearchInput = (event) => {
        this.setState({ search: event.target.value })
    }

    handleSearchSelection = (e) => {
        let searchText = e.target.textContent.toLocaleLowerCase()
        this.setState({ ...this.state, search: searchText })
        document.querySelector('.api-list1 ul').classList.add('d-none')
     }


    handleSearchRender = (event) => {
        this.setState({ showSpinner: '' })
        event.preventDefault()
        axios.get('/api/projects/search?search=' + this.state.search)
            .then(response => {
                console.log(response)
                this.setState({ projects: response.data, showSpinner: 'd-none' })
            })
            .catch(err => console.log(err))
    }
 
    componentDidMount() { 
        api.all('projects/')
            .then(res => {
                console.log(res)
                //const states = this.state.locationFilter.push()
                const states = res.projects.map(item => {
                    if (this.state.locationFilter.indexOf(item.state) == -1) {
                        this.setState({ locationFilter: this.state.locationFilter.concat(item.state) }) 
                    }
                })
                console.log(this.state.locationFilter)
                //console.log(states)
                this.setState({ projects: res.projects, showSpinner: 'd-none' })
                //console.log(projects)
            }).catch(err => console.log(err))

        //show available categories to filter with
        api.all('categories/')
            .then(res => {
                //console.log(res)
                const categories = res.map(item => item.name)
                this.setState({ categoryFilter: categories })
                //console.log(projects)
            }).catch(err => console.log(err))

        //show available location to filter with 
        //const states = locations.map(loc => loc.state.name)
        //this.setState({ locationFilter: states })    
    }

    handleSingleProjectClick = (params) => {
        console.log(this.props.history)
        this.props.history.push(`/projects/${params}`)
    }

    isAuthenticated() {
        const token = localStorage.getItem('token');
        if (token) return true;
        return false;
    }

    //handle filter by categories
    handleCategoryFilter = (event) => {
        let txt = event.target.textContent;
        api.all('projects/')
            .then(res => {
                console.log(res)
                const projects = res.projects.filter(project => project.category.name === txt )
                this.setState({ projects: projects })
                console.log(projects)
            }).catch(err => console.log(err))
    }
    //handle filter by location
    handleFilterByLocation = (event) => {
        let txt = event.target.textContent;
        api.all('projects/')
            .then(res => {
                console.log(res)
                const projects = res.projects.filter(project => project.state  === txt)
                this.setState({ projects: projects })
                console.log(projects)
            }).catch(err => console.log(err))
    }

    //get number of weeks between two dates
    weeksBetween = (d1, d2) =>  {
        return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
    }
    allproject() {
        return this.state.projects.map(project => {
            console.log(project.category)
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
    }

    render() {
        //console.log(this.state.categoryFilter)
        const isAlreadyAuthenticated = this.isAuthenticated();
        //console.log(this.props.oncLick)
        const allCategories = this.state.categoryFilter.map(cat => {
            return (
                <li className="list_items"><button style={{
                    background: 'none',
                    border: 'none'
                }} onClick={this.handleCategoryFilter} className="list_items">{cat}</button></li>
                )
        })
        const allStates = this.state.locationFilter.map(loc => {
            return (
                <li className="list_items mt-4 py-0"><button style={{
                    background: 'none',
                    border: 'none'
                     }}
                    onClick={this.handleFilterByLocation} className="list_items">{loc}</button></li>
                )
        })

        return (
            <div>
                <div className={this.state.showSpinner}>
                    <Spinner />
                </div>
                {isAlreadyAuthenticated ?
                    <div>
                        <div className=" project_jumbotron">
                            <div className="project_header_banner">
                                <h1 className="project_heading mt-0">Projects</h1>
                            </div>
                        </div>

                        <div className="container project_main">
                            <div className="row m-0">
                                <div className="col-12 md m-0 p-0">
                                    <div className="search_form">
                                        <form className="row m-0" onSubmit={this.handleSearchRender}>
                                            <div className="col-9 p-0">
                                                <input className="pm_input" value={this.state.search} type="text" name="search" onChange={this.handleSearchInput} placeholder="Search State or Project" />
                                            </div>
                                            <div className="col-3 px-2">
                                                <button className="pm_button" onClick={this.searchHandler} type="submit" name="submit">Search</button>
                                            </div>
                                            
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="row m-0">
                                <div className="col-xl-9 m-0 p-0">
                                    <div className="detail_container">
                                        {this.state.projects !== [] ? this.allproject() : <div style={{marginTop: '200px'}}>project loading...</div>}
                                    </div>
                                </div>
                                <div className="col-xl-3 m-0 p-0">
                                    <div className="search_categories">
                                        <ul className="list_categories_1"><h4>Track By Categories</h4>
                                            {allCategories}
                                        </ul>
                                        
                                        <ul className="list_categories_3">
                                            <h4>Track By Location</h4>
                                            {allStates}
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-12 m-0 p-0">
                                   
                                </div>

                            </div>

                        </div>
                    </div>
                    : (<Redirect to={{ pathname: "/login" }} />)}
                
            </div>
        )
    }
}