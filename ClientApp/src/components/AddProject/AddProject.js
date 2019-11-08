import React from 'react';
import './AddProject.css';
import api from '../../api/api';
import axios from 'axios'
import location from '../../js/location-helper';
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';


//const greenSelected = { backgroundColor: 'green'}
const SweetAlert = withSwalInstance(swal);
export class AddProject extends React.Component {
    constructor(props) {
        super(props)

        //this.myRef = React.createRef()
        this.contractorItem;
        this.sponsorItem;
        this.state = {
            category: '',
            hideChecks: 'd-none',
            catShow: 'd-none',
            sponsShow: 'd-none',
            contractShow: 'd-none',
            catName: '',
            sponsName: '',
            projects: [],
            contrName: '',
            checksInput: '',
            imageUploadView: 'd-none',
            categories: [],
            checkLists: [],
            title: '',
            name: '',
            NumberOfViews: 0,
            justRender: '',
            description: '',
            state: '',
            lga: '',
            amount: '',
            startDate: '',
            endDate: '',
            sponsor: '',
            contractor: '',
            sponsorID: 0,
            contractorID: 0,
            categoryID: 0, fileObj: {}, fileResp: '', datePosted: null, views: 0
        }

        this.setTextInputRef = element => {
            console.log(element)
        };
    }

    handleTitleInput = (event) => {
        this.setState({ title: event.target.value })
    }

    handleSingleProjectClick = (params) => {
        console.log(this.props.history)
        this.props.history.push(`/projects/${params}`)
    }

    handleSponsorInput = (event) => {
        this.setState({ sponsor: event.target.value })
        if (event.target.value.length > 1) {
            document.querySelector('.api-list1 ul').classList.remove('d-none')
            api.all('sponsors/')
                .then(res => {
                    //console.log(res)
                    this.sponsorItem = res.map(item => <li onClick={this.handleSponsorSelection}>{item.name}</li>)
                    //console.log(categories)
                }).catch(err => console.log(err))
        }
        else {
            this.sponsorItem = ''
        }

    }

    handleContractorInput = (event) => {
        this.setState({ contractor: event.target.value })
        if (event.target.value.length > 1) {
            document.querySelector('.api-list ul').classList.remove('d-none')
            api.all('contractors/')
                .then(res => {
                    //console.log(res)
                    this.contractorItem = res.map(item => <li onClick={this.handleContractorSelection}>{item.pm}</li>)

                    //console.log(categories)
                }).catch(err => console.log(err))
        }
        else {
            this.contractorItem = ''
        }

    }

    
    handleDescriptionInput = (event) => {
        this.setState({ description: event.target.value })

    }

    /**handleStateInput = (event) => {
        let input = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1); 
        this.setState({ state: event.target.value })
        axios.get('http://locationsng-api.herokuapp.com/api/v1/lgas')
            .then(res => {
                console.log(res)
                const states = res.data.map(item => item.state).filter(state => state.includes(input))
                // this.setState({ categories: categories })
                //console.log(this.state.categories.length)
                console.log(states)
            }).catch(err => console.log(err))
    } */

    handleStateChange = (event) => {
        this.setState({ state: event.target.value })
    }

    handleLgaChange = (event) => {
        this.setState({ lga: event.target.value })
    }

    handleAmount = (event) => {
        this.setState({ amount: Number(event.target.value) })

    }
    formatDate = (dateString) => {
        var splitDate = dateString.split('-')
        return splitDate[1] + '/' + splitDate[2] + '/' + splitDate[0]
    }

    handleStartDateInput = (event) => {
        this.setState({ startDate: this.formatDate(event.target.value) })
        //console.log(this.formatDate(event.target.value))

    }

    handleEndDateInput = (event) => {
        this.setState({ endDate: this.formatDate(event.target.value) })
       // console.log(this.formatDate(event.target.value))
    }

    categoryInput = (event) => {
        this.setState({ category: event.target.value })

    }

    addSponsorhandler = (event) => {
        api.create('sponsors', { Name: this.state.sponsor })
            .then(res => {
               // console.log(res)
                this.setState({ sponsorID: res.id, sponsName: res.name })
                document.querySelector('.api-list1 ul').classList.add('d-none')
                //alert("Selected sponsor is " + res.name)
                if (this.state.catShow === 'd-none') {
                    this.setState({ sponsShow: '' })

                }
                
            }).catch(err => console.log(err))
    }

    addContractorhandler = (event) => {

        api.create('contractors', { PM: this.state.contractor })
            .then(res => {
                //console.log(res)
                this.setState({ contractorID: res.id, contrName: res.pm })
                document.querySelector('.api-list ul').classList.add('d-none')
                if (this.state.catShow === 'd-none') {
                    this.setState({ contractShow: '' })

                }
                
            }).catch(err => console.log(err))
    }

    fileUploadChange = (e) => {
        let file = e.target.files[0]
        this.setState({ fileObj: file })
    }
    addFilehandler = (event) => {
        let fileupload = new FormData()
        fileupload.append('file', this.state.fileObj)
        //console.log(fileupload);
        api.create('files/upload', fileupload)
            .then(res => {
                //console.log(res)
                this.setState({ fileResp: res.name, imageUploadView: 'd-block' })
            }).catch(err => console.log(err))
    }

    addNewProject = (event) => {
        event.preventDefault()
        let briefD = this.state.description.substr(0, 100) + ' ...';
        console.log({
            Title: this.state.title,
            Description: this.state.description,
            Brief: briefD,
            State: this.state.state,
            LGA: this.state.lga,
            Image: this.state.fileResp,
            Amount: this.state.amount,
            StartDate: this.state.startDate,
            EndDate: this.state.endDate,
            DatePosted: this.state.datePosted,
            NumberOfViews: this.state.NumberOfViews,
            sponsor: this.state.sponsor,
            SponsorId: this.state.sponsorID,
            ContractorId: this.state.contractorID,
            CategoryId: this.state.categoryID
        })

        api.create('projects', {
            Title: this.state.title,
            Description: this.state.description,
            Brief: briefD,
            State: this.state.state,
            LGA: this.state.lga,
            Image: this.state.fileResp,
            Amount: this.state.amount,
            StartDate: this.state.startDate,
            EndDate: this.state.endDate,
            DatePosted: this.state.datePosted,
            NumberOfViews: this.state.NumberOfViews,
            sponsor: this.state.sponsor,
            SponsorId: this.state.sponsorID,
            ContractorId: this.state.contractorID,
            CategoryId: this.state.categoryID


        }).then(res => {
            if (res) {
                this.setState({ show: true })
            }
            else {
                alert("Please completly fill all the fields")
            }
            //console.log(res)
            })
            .catch(err => {
                //console.log(err)
                alert(err)
            })
    }


    submitCategory = (event) => {
        event.preventDefault()
        api.create('categories/', { Name: this.state.category })
            .then(res => {
                //console.log(res)
                this.setState({ categories: this.state.categories.concat(res) })

            }).catch(err => console.log(err))

    }

    componentDidMount() {
        api.all('projects/')
            .then(res => {
                //console.log(res)
                this.setState({ projects: res.projects})
                //console.log(projects)
            }).catch(err => console.log(err))

        let today = new Date()
        this.setState({ datePosted: today.toLocaleDateString() })
        api.all('categories/')
            .then(res => {
                //console.log(res)
                //const categories = res.map(item => item)
                this.setState({ categories: res })
                //console.log(this.state.categories.length)
                //console.log(this.lists)
            }).catch(err => console.log(err))
    }

    selectCategory = (event, id) => {
        let cat = event.target.textContent
        api.all(`categories/${id}`)
            .then(res => {
                //console.log(res, cat)
                this.setState({ categoryID: res.id, catName: res.name, checkLists: res.checks })
                if (this.state.catShow === 'd-none') {
                    this.setState({ catShow: '' })
                   
                }
                //alert("Selected category is " + res.name)
                //console.log(category)
                if (this.state.hideChecks === 'd-none') {
                    this.setState({ hideChecks: '' })
                }
            }).catch(err => console.log(err))
        
    }

    handleContractorSelection = (event) => {
        let contr = event.target.textContent
        this.setState({ contractor: event.target.textContent })
        api.all('contractors/')
            .then(res => {
                //console.log(res, cat)
                const contractor = res.find(item => contr === item.pm)
                this.setState({ contractorID: contractor.id, contrName: contractor.pm })
                //alert("selected contractor is "+ contractor.pm)
                if (this.state.catShow === 'd-none') {
                    this.setState({ contractShow: '' })

                }
                document.querySelector('.api-list ul').classList.add('d-none')
                //console.log(contractor)
            }).catch(err => console.log(err))
    }

    handleSponsorSelection = (event) => {
        let spons = event.target.textContent
        this.setState({ sponsor:  event.target.textContent })
        api.all('sponsors/')
            .then(res => {
                //console.log(res, cat)
                const sponsor = res.find(item => spons === item.name)
                this.setState({ sponsorID: sponsor.id, sponsName: sponsor.name })
                //alert("selected sponsor is " + sponsor.name)
                if (this.state.catShow === 'd-none') {
                    this.setState({ sponsShow: '' })
          
                }
                document.querySelector('.api-list1 ul').classList.add('d-none')
                //console.log(sponsor)
            }).catch(err => console.log(err))
    }

    showallProjects = () => {
        //console.log(this.props.history)
        this.props.history.push('/user/projects')
        this.setState({justRender: ' '})
    }

    inputChecks = (event) => {
        this.setState({ checksInput: event.target.value })
    }

    submitCheck = (event) => {
        event.preventDefault()
        //console.log({ name: this.state.checksInput, categoryId: this.state.categoryID })
       api.create('checks/', { name: this.state.checksInput, categoryId: this.state.categoryID })
            .then(res => {
                //console.log(res)
                this.setState({ checkLists: this.state.checkLists.concat(res) })
                //console.log(this.state.checkLists)
            }).catch(err => console.log(err))
    }

    deleteChecklist = (id, name) => {
        api.remove(`checks/${id}`)
            .then(res => {
                //console.log(res)
                const filtered = this.state.checkLists.filter(filth => filth.name !== name)
                //console.log(this.state.checkLists)
                //console.log(filtered)
                this.setState({ checkLists: filtered })
            }).catch(err => console.log(err))
    }

    render() {
        const state = (
            <select className="custom-select input-group input-field move" id="inputGroupSelect01" value={this.state.state} onChange={this.handleStateChange} required autoFocus>
                <option>State</option>
                {location.getStates().map((state, i) => <option key={i} value={state}>{state}</option>)}
            </select>
        )
        const lga = (
            <div>
                {console.log(this.state.state)}
                <select className="custom-select input-group input-field move" id="inputGroupSelect02" value={this.state.lga} onChange={this.handleLgaChange} required autoFocus>
                    <option> -- LGA -- </option>
                    {location.getLGA(this.state.state).map((lga, i) => <option key={i} value={lga}>{lga}</option>)}
                </select>
            </div>
        )

        const checklists = (
            <div className={this.state.hideChecks}>
                <form onSubmit={this.submitCheck}>
                    <div className="row">
                        <div class="form-group col-9 input-adcat">
                            <label for="addChecks">Add Checklist for {this.state.catName}</label>
                            <input type="text" class="form-control" id="addChecks" onChange={this.inputChecks} placeholder="Add a checklist for this project" />
                        </div>
                        <div className="col-3">
                            <button className="btn position-checklist" type="submit">Add to checklist</button>
                        </div>
                    </div>

                </form>
            </div>
        )

        const checkItems = (
            this.state.checkLists.map(checkbox => {
                console.log(checkbox)
                return (
                    <div className="py-3"><input className="px-3" type="checkbox" style={{ width: '25px' }} /><span>{checkbox.name}</span> <button className="btn btn-danger" onClick={(event) => this.deleteChecklist(checkbox.id, checkbox.name)}>Delete</button></div>
                    )
            }) 
        )

        const { length, [length - 1]: lastItem } = this.state.projects

        
        //const lastAdded = (
        //    <div>
        //        <div className="col-md-6 ">
        //            <div className="view-content">
        //                <h5>View Reports from ongoing projects</h5>
        //                <h4>
        //                    {lastItem.title}
        //                </h4>
        //                <h6>
        //                    {lastItem.Brief}
        //                </h6>
        //                <div className="view-projects">
        //                    <button className="btn btn-lg" onClick={this.showallProjects}>View Project</button>
        //                </div>
        //            </div>

        //        </div>
        //        <div className="col-md-6">
        //            <img src={lastItem.Image} alt="admin image" className="img-responsive" />
        //        </div>
        //    </div>
        //)
          
         
        return (
            <div>
                <div className="row dashboard">
                    <div>
                        
                        <SweetAlert
                            show={this.state.show}
                            title="New Project Added"
                            text="You have succesfully added a new project"
                           
                            onConfirm={() => this.setState({ show: false })}
                        />
                    </div>
                    {lastItem ? (<div>
                        <div className="col-md-6 ">
                            <div className="view-content">
                                <h5>View Reports from ongoing projects</h5>
                                <h4>
                                    {lastItem.title}
                                </h4>
                                <h6>
                                    {lastItem.brief}
                                </h6>
                                <div className="view-projects">
                                    <button className="btn btn-lg" onClick={() => this.handleSingleProjectClick(lastItem.id)}>View Project</button>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <img src={lastItem.image} alt="admin image" className="img-responsive" />
                        </div>
                    </div>): <p>Loading project...</p>}

                </div>
                <form onSubmit={this.submitCategory}>
                    <div className="row">

                        <div class="form-group col-9 input-addcat">
                            <label for="addCategory">ADD CATEGORY</label>
                            <input type="text" class="form-control" id="addCategory" onChange={this.categoryInput} placeholder="Add new category" />
                        </div>

                        <div className="col-3 add-category">
                            <button className="btn-lg " type="submit">Submit</button>
                        </div>
                        <div className={`${this.state.catShow} px-4`}>Selected Category is {this.state.catName}</div>
                        <div class="col-md-12">
                            <ul className="category-list">
                                {this.state.categories.map(listItem => {
                                    
                                    return <li onClick={(event) => this.selectCategory(event, listItem.id)}>{listItem.name}</li>
                                })}
                            </ul>
                          
                        </div>

                    </div>
                </form>
                <div>{checklists}</div>
                <div>{checkItems}</div>
                <div className="row addproject-form">
                    <div className="form-heading col-md-12">
                        <h4>INITIATE PROJECT</h4>
                    </div>
                    <form onSubmit={this.addNewProject}>
                        <div className="form-group col-md-12">
                            <label for="addTitle">Title of Report *</label>
                            <input type="text" class="form-control" onChange={this.handleTitleInput} id="addTitle" placeholder="eg Pothole at roundabout" />
                        </div>

                        <div class="form-group col-md-12 px-0">
                            <div className="row" style={{ marginLeft: '15px', marginRight: '15px' }}>
                                <div class="form-group col-9 input-addcat px-0">
                                    <label for="addSponsor">Add sponsor</label>
                                    <input type="text" class="form-control" value={this.state.sponsor} id="addSponsor" onChange={this.handleSponsorInput} placeholder="Add new category" />
                                </div>
                                <div className="col-3 add-category">
                                    <button className="btn-lg " type="button" onClick={this.addSponsorhandler}>Add</button>
                                </div>
                                <div className={`${this.state.sponsShow} px-4`}>Selected Sponsor is {this.state.sponsName}</div>
                            </div>
                            <div className="api-list1">
                                <ul>{this.sponsorItem}</ul>
                            </div>
                            <div className="row" style={{ marginLeft: '15px', marginRight: '15px' }}>
                                <div class="form-group col-9 input-addcat px-0">
                                    <label for="addContractor">Add contractor</label>
                                    <input type="text" class="form-control" value={this.state.contractor} id="addContractor" onChange={this.handleContractorInput} placeholder="Add new category" />
                                </div>

                                <div className="col-3 add-category">
                                    <button className="btn-lg " type="button" onClick={this.addContractorhandler}>Add</button>
                                </div>
                                <div className={`${this.state.contractShow} px-4`}>Selected Contractor is {this.state.contrName}</div>
                                <div className="api-list">
                                    <ul>{this.contractorItem}</ul>
                                </div>
                            </div>

                        </div>

                        <div class="form-group col-md-12">
                            <label for="addState">State</label>
                            {state}
                        </div>

                        <div class="form-group col-md-12">
                            <label for="addCategory">Local Government</label>
                            {lga}
                        </div>

                        <div class="form-group col-md-12">
                            <label for="describeReport">Describe your report</label>
                            <textarea class="form-control" onChange={this.handleDescriptionInput} id="describeReport" placeholder="Add Description"></textarea>
                        </div>
                        
                        <div className="col-md-12">
                            <div className="row">

                                <div class="form-group col-md-4">
                                    <label for="commencementDate">Commencement Date</label>
                                    <input type="date" class="form-control" onChange={this.handleStartDateInput} id="commencementDate" placeholder="Commencement Date" />
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="completionDate">Completion Date</label>
                                    <input type="date" class="form-control" onChange={this.handleEndDateInput} id="completionDate" placeholder="Completion Date" />
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="projectAmount">Project Amount</label>
                                    <input type="text" class="form-control" onChange={this.handleAmount} id="projectAmount" placeholder="Project Amount" />
                                </div>
                            </div>
                        </div>

                        <div class="form-group col-md-12">
                            <div className="row" style={{ marginLeft: '0px', marginRight: '0px' }}>
                                <div class="form-group col-9 input-addcat px-0">
                                    <label for="addProjectImage">Add Project Image</label>
                                    <input type="file" class="form-control" id="addProjectImage" onChange={this.fileUploadChange} ref={this.setTextInputRef} placeholder="Add new category" />
                                </div>

                                <div className="col-3 add-category">
                                    <button className="btn-lg " type="button" onClick={this.addFilehandler}>Add</button>
                                </div>
                                <span className={this.state.imageUploadView} style={{ color: 'limegreen' }}>Image successfully uploaded</span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <button type="submit" className="btn btn-large add-projectBtn">SUBMIT</button>
                        </div>
                    </form>



                </div>
            </div>
        )
    }
}