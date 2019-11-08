import React from 'react';
import { Footer } from '../Footer/Footer'
import './ChangePassword.css';
import axios from 'axios';
import { Redirect } from "react-router-dom";



export class ChangePassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      old:'',
      new: '',
      Authentication:false,
    }
    this.handleOldChange = this.handleOldChange.bind(this);
    this.handleNewChange = this.handleNewChange.bind(this);
    this.submitForm = this.submitForm.bind(this);

  }

  

  handleOldChange(e) {
      this.setState({...this.state, old: e.target.value})
  
}  

handleNewChange(e) {
    this.setState({...this.state, new: e.target.value})
}

getUser() {
    if (localStorage.getItem('userdata') && this.isAuthenticated()) {
        return JSON.parse(localStorage.getItem('userdata'));
    }
}



                                                                                                                                                                                 
  submitForm(e) {
    e.preventDefault()
    let user = this.getUser()
    axios.put('/api/account/changepassword', { Id:user.id, OldPassword: this.state.old, NewPassword: this.state.new })
    .then(response => {
      localStorage.setItem('token', response.data.token)
      this.setState({...this.state, Authentication:true});
    })
    .catch(err => console.log(err))

    if( this.state.Authentication === false){
      const success = document.getElementById("_success");
      if(success.classList.contains("d-none")){
        success.classList.add("d-block");              
      } else {
        success.classList.remove("d-none"); 
      }     
    } 
    
  }


  isAuthenticated () {
    const token = localStorage.getItem('token');
    if(token )  
    return this.isSubmit;
    return false;
  }
  
  isSubmit () {
    const submit = localStorage.getItem('succeeded');
    if(submit) return true;
   
  }

    render() {
      const isAlreadyAuthenticated = this.isAuthenticated();
      return (
         <div> 
             { !isAlreadyAuthenticated ? <Redirect to = {{pathname: "/login"}}/> :
                <div className="container-fluid bgg">
                <div className="row">
                  <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                  <img className="img-fluid reduced rounded mx-auto d-block" src="images/logo-2.png"/>
                    <div className="card card-signin my-5">
                      <div className="card-body">
                        <h5 className="card-title text-center">Change Password</h5>
                        <form method="POST" onSubmit={this.submitForm}> 
                            <div className="input-group">
                                <input className="input--style-3" type="password" placeholder="Old Password" name="password"  id="mainInput" value={this.state.old} onChange={this.handleOldChange} required autoFocus/>
                            </div>
  
                            <div className="input-group">
                                <input className="input--style-3"type="password" id="mainInput" placeholder="New Password" name="password" value={this.state.new} onChange={this.handleNewChange} required autoFocus/>
                            </div>
  
                          <button className="btn btn-lg btn-block text-uppercase" type="submit">Generate</button>
                          {/* <span id="_danger" className="d-none text-danger text-center">Your password is incorrect</span> */}
                            <span id="_success" className="d-none text-success text-center move-up">You have succesfully changed your password</span>
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

