import React from 'react';
import './User.css'
import { AdminNav } from '../AdminNav/AdminNav'
import { Footer } from '../Footer/Footer';
import { BrowserRouter } from 'react-router-dom'
import { AddProject } from '../AddProject/AddProject';
import { ShowProjects } from '../ShowProjects/ShowProjects';
import {Dashboard} from '../Dashboard/Dashboard'
import { SingleProject } from '../SingleProject/SingleProject';
import { Redirect } from "react-router-dom";

const styleOverflow = {overflow: 'hidden'}
export class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {url: ""};
        console.log(this.props.match.url)
    }


    someFunc = (url) => {
        this.setState({ url: url })
        
    }

    renderSwitch(param) {
        console.log(param)
        console.log(this.props)
        switch (param) {
            case '/user/addproject':
                return <AddProject history={this.props.history} />;
            case '/user/projects':
                return <ShowProjects history={this.props.history} />;
            case '/user/dashboard':
                return <Dashboard />;
            default:
                return <AddProject history={this.props.history} />;
        }
        
    }

    isAuthenticated () {
        const admin = localStorage.getItem('isAdmin')  
        let adminAuth = JSON.parse(admin)
        const data = localStorage.getItem('userdata');
        if(data) {
         return adminAuth
        } else {
            return false
        }
      }

      getUser() {
        if (localStorage.getItem('userdata')) {
            return JSON.parse(localStorage.getItem('userdata'));
        }
    }


    
    render() {
        const isAlreadyAuthenticated = this.isAuthenticated();
        return (
        <div>
              { isAlreadyAuthenticated ?
            <div className=" container-fluid px-0" style={styleOverflow}>
                
                <div className="admin-body container-fluid">
                    <div className="row">
                        <div className="col-md-3 admin-sidebar">
                            <div className="user-profile">
                                <img className="img-responsive profile-pic circle-big" src={this.getUser().image}  alt="user profile" />
                                <div className="user-name">
                                        <h3>{this.getUser().surName} {this.getUser().firstName}</h3>
                                </div>
                               
                            </div>
                            
                                <AdminNav history={this.props.history} onClick={this.someFunc} />
                           
                        </div>
                        <div className="col-md-8">
                            {this.renderSwitch(this.state.url)}

                        </div>
                    </div>
                </div>

                <Footer />
            </div>
     : (  <Redirect to = {{pathname: "/login"}}/> )} 
        </div>
        )
    }
}