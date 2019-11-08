import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userdata: {},
        }
        this.handleLogout = this.handleLogout.bind(this);
    }


    isAuthenticated() {
        const data = localStorage.getItem('userdata');
        if (data) return true;
        return false;
    }

    getUser() {
        if (localStorage.getItem('userdata')) {
            return JSON.parse(localStorage.getItem('userdata'));
        }
    }



    handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userdata');
        this.setState();
    }



    render() {
        const isAlreadyAuthenticated = this.isAuthenticated();
        return (
            <div>
                {isAlreadyAuthenticated ?
                    <div className="navigation_bar">
                        <div className="container">
                            <div className="brand_name"><Link to="/"><img className="gov_logo" src="/images/logo.svg" alt="gov_logo" /></Link></div>

                            <div className="menu-bar">
                                <span className="bar1"></span>
                                <span className="bar2"></span>
                                <span className="bar3"></span>
                            </div>
                            <div className="close-bar">
                                <span style={{ fontWeight: 100 }}>&times;</span>
                            </div>
                  
                         <div className="navigation_links _openMobileLink">
                         <div className="dropdown">
                            <button className="dropbtn">{this.getUser().surName} {this.getUser().firstName}</button>
                            <div className="dropdown-content">
                            <Link className='hover-class' to="/changepassword">Change Password</Link> 
                            <hr className="no-margin"></hr>
                            <Link className='hover-class' to="/update">Update details</Link>                       
                            </div>
                            </div>
                                  
                            <a><img className="circle" src={this.getUser().image} ></img></a>
                           
                                <Link onClick={this.handleLogout} to="/" id="log_in">Log out</Link>
              
                            </div>
                        </div>
                    </div>


                    : (
                        <div className="navigation_bar">
                            <div className="container">
                                <div className="brand_name"><Link to="/"><img className="gov_logo" src="/images/logo.svg" alt="gov_logo" /></Link></div>

                                <div className="menu-bar">
                                    <span className="bar1"></span>
                                    <span className="bar2"></span>
                                    <span className="bar3"></span>
                                </div>
                                <div className="close-bar">
                                    <span style={{ fontWeight: 100 }}>&times;</span>
                                </div>


                                <div className="navigation_links _openMobileLink">
                                    <Link to="/login" id="log_in">Log in</Link>
                                    <Link to="/signup" id="sign_up">Sign up</Link>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        )
    }

}

