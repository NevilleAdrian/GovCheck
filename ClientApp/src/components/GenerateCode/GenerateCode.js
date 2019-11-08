import React from 'react';
import { Footer } from '../Footer/Footer'
import './GenerateCode.css';
import axios from 'axios';
import { Redirect } from "react-router-dom";



export class GenerateCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      email: '',
      messageSent: false
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.submitForm = this.submitForm.bind(this);

  }

  
handleEmailChange(e) {
    this.setState({...this.state, email: e.target.value})

}  





                                                                                                                                                                                 
  submitForm(e) {
    e.preventDefault()
    axios.post('/api/account/generatecode?email=' + this.state.email)
    .then(response => {
      //console.log(response)
      const success = document.getElementById("_success");
      if(success.classList.contains("d-none")){
        success.classList.remove("d-none");
        success.classList.add("d-block");
      }
      this.setState({...this.state, messageSent: true});
    })
    .catch(err => {
      console.log(err)
      const warn = document.getElementById("_warning");
      if(warn.classList.contains("d-none")){
        warn.classList.remove("d-none");
        warn.classList.add("d-block");
    } 
    })
    this.setState({...this.state, messageSent: true});
  }

  isAuthenticated () {
    const data = localStorage.getItem('userdata');
    if(this.state.messageSent === true) {
      return true;
    }
    else if(data){
      return true;
    } else {
      return false;
    }


  }
 

    render() {
    //console.log(this.state)
    const isAlreadyAuthenticated = this.isAuthenticated();
        //console.log(this.props.history.location.search);
      return (
         <div> 
       
            { isAlreadyAuthenticated ? <Redirect to = {{pathname: "/login"}}/> : <div className="container-fluid bgg">
                <div className="row">
                  <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                  <img className="img-fluid reduced rounded mx-auto d-block" src="images/logo-2.png"/>
                    <div className="card card-signin my-5">
                      <div className="card-body">
                        <h5 className="card-title text-center">Forgot Password</h5>
                        <form method="POST" onSubmit={this.submitForm}> 

                           <div className="input-group">
                                <input className="input--style-3" type="email" placeholder="Email" name="password"  id="mainInput" value={this.state.email} onChange={this.handleEmailChange} required autoFocus/>
                            </div>
  
                    
                          <button className="btn btn-lg btn-block text-uppercase" type="submit">Generate</button>
                            <span id="_warning" className="d-none text-danger text-center move-up">Email doesn't exist</span>
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