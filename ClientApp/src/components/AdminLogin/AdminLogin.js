import React from 'react';
import { Footer } from '../Footer/Footer'
import './AdminLogin.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Redirect } from "react-router-dom";



export class AdminLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      email:'',
      password: '',
      Authentication: false,
      error: ''
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.submitForm = this.submitForm.bind(this);

  }

  

 handleEmailChange(e) {
      this.setState({...this.state, email: e.target.value})
  
}  

handlePasswordChange(e) {
    this.setState({...this.state, password: e.target.value})
}




  submitForm(e) {
    e.preventDefault();
    axios.post('/api/account/login', {Email: this.state.email, Password: this.state.password})
    .then(response => {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userdata', JSON.stringify(response.data))
      localStorage.setItem('id', JSON.stringify(response.data.id))
      localStorage.setItem('isAdmin', JSON.stringify(response.data.isAdmin))    
      //console.log(response)
     
      const admin = localStorage.getItem('isAdmin')
      let adminAuth = JSON.parse(admin)
        //console.log(adminAuth)
        let id = localStorage.getItem('id')
        this.setState({...this.state,  error:id, Authentication: adminAuth})
  
    })
    .catch(err => {
      console.log(err)
      const warn = document.getElementById("_warning");
      if(warn.classList.contains("d-none")){
        warn.classList.add("d-block");
      }
      else {
        warn.classList.remove("d-none") ;
      }
    })
  }


  isAuthenticated () {
    const data = localStorage.getItem('userdata');
    if(data) {
     return true
    } else {
        return false
    }
  
  }


  

    render() {
       //console.log(this.state)
      const isAlreadyAuthenticated = this.isAuthenticated();
      return (
         <div> 
                { isAlreadyAuthenticated ? <Redirect to = {{pathname: "/user"}}/> : ( 
                <div className="container-fluid bg">
                <div className="row">
                  <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                    <img className="img-fluid reduced rounded mx-auto d-block" src="images/GOVCHECK LOGO.png"/>
                    <div className="card card-signin my-5">
                      <div className="card-body">
                        <h5 className="card-title text-center">Admin Login</h5>
                        <form method="POST" onSubmit={this.submitForm}>  
                            <div className="input-group">
                                <input className="input--style-3" type="email" placeholder="Email Address" name="email address"  id="inputEmail" value={this.state.email} onChange={this.handleEmailChange} required autoFocus/>
                            </div>
  
                            <div className="input-group">
                                <input className="input--style-3"type="password" id="inputPassword" placeholder="Password" name="password" value={this.state.password} onChange={this.handlePasswordChange} required autoFocus/>
                            </div>
  
                          <button className="btn btn-lg btn-block text-uppercase" type="submit">Sign in</button>
                          <h6 className="text-center small-move"><Link className="green padding-left" to="/generatecode">Forgot Password </Link><a>or</a><Link className="green padding-right" to="/login"> Login with user</Link></h6>
                            <h6 className="text-center "> Don’t have an account? <Link className="green" to="/signup">SIGN UP</Link></h6>
                            <span id="_warning" className="d-none text-danger text-center">Username or Password not correct</span>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           
           )}
            <Footer/>
        </div>
        )
    }
}

