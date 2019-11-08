import React from 'react';
import { Footer } from '../Footer/Footer'
import './ForgotPassword.css';
import axios from 'axios';
import { Redirect } from "react-router-dom";



export class ForgotPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      email: '',
      newpassword:'',
      confirmpassword: '',
      Authentication:false,
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNewChange = this.handleNewChange.bind(this);
    this.handleConfirmChange = this.handleConfirmChange.bind(this);
    this.submitForm = this.submitForm.bind(this);

  }

  
handleEmailChange(e) {
    this.setState({...this.state, email: e.target.value})

}  

handleNewChange(e) {
      this.setState({...this.state, newpassword: e.target.value})
  
}  

handleConfirmChange(e) {
    this.setState({...this.state, confirmpassword: e.target.value})
}

getUser() {
    if (localStorage.getItem('userdata') && this.isAuthenticated()) {
        return JSON.parse(localStorage.getItem('userdata'));
    }
}



                                                                                                                                                                                 
  submitForm(e) {
    e.preventDefault()
    axios.put('/api/account/forgotpassword' + this.props.history.location.search ,{ Email:this.state.email, NewPassword: this.state.newpassword, ConfirmNewPassword: this.state.confirmpassword })
    .then(response => {
      localStorage.setItem('succeeded', response.data.succeeded)
     
      this.setState({...this.state, Authentication:true});
    })
    .catch(err => {
      console.log(err)
      const warn = document.getElementById("_warning");
      if(warn.classList.contains("d-none")){
        warn.classList.add("d-block");              
      } else {
        warn.classList.remove("d-none"); 
      }     
    }
  
    
    )}

  isSubmit () {
    const submit = localStorage.getItem('succeeded');
    if(submit && this.state.Authentication === true) 
    return true;    
  }

  isAuthenticated () {
    const data = localStorage.getItem('userdata');
    if(this.state.Authentication === true) {
      return true
    }
    else if(data) {
      return this.isSubmit;
    }
    else {
      return false;
    }
  }
  
 

    render() {
      const isAlreadyAuthenticated = this.isAuthenticated();
      return (
         <div> 
       
            { isAlreadyAuthenticated ? <Redirect to = {{pathname: "/login"}}/> :<div className="container-fluid bgg">
                <div className="row">
                  <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                  <img className="img-fluid reduced rounded mx-auto d-block" alt="logo"src="images/logo-2.png"/>
                    <div className="card card-signin my-5">
                      <div className="card-body">
                        <h5 className="card-title text-center">Forgot Password</h5>
                        <form method="POST" onSubmit={this.submitForm}> 

                           <div className="input-group">
                                <input className="input--style-3" type="email" placeholder="Email" name="password"  id="mainInput" value={this.state.email} onChange={this.handleEmailChange} required autoFocus/>
                            </div>
  
                            <div className="input-group">
                                <input className="input--style-3" type="password" placeholder="New Password" name="password"  id="mainInput" value={this.state.newpassword} onChange={this.handleNewChange} required autoFocus/>
                            </div>
  
                            <div className="input-group">
                                <input className="input--style-3"type="password" id="mainInput" placeholder="Confirm Password" name="password" value={this.state.confirmpassword} onChange={this.handleConfirmChange} required autoFocus/>
                            </div>
  
                          <button className="btn btn-lg btn-block text-uppercase" type="submit">Generate</button>
                            <span id="_success" className="d-none text-success text-center move-up">You succesfully changed your password</span>
                            <span id="_warning" className="d-none text-danger text-center move-up">Password doesn't match or Email already in database</span>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             }
            
            
            <Footer/>
        </div>
        )
    }
}

