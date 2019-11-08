import React from 'react';
import { Footer } from '../Footer/Footer'
import './Signup.css';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { Link } from 'react-router-dom';



export class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      surname: '',
      firstname: '',
      phone: '',
      email:'',
      file: null,
      image:'',
      password: '',
      confirm:'',
      Authentication: false,
      success: false,
      display: 'none',
      signin: 'Sign up'
    }
    this.handleSurnameChange = this.handleSurnameChange.bind(this);
    this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmChange = this.handleConfirmChange.bind(this);
    this.submitForm = this.submitForm.bind(this);

  }

  handleSurnameChange(e) {
    this.setState({...this.state, surname: e.target.value})
  }

  handleFirstnameChange(e) {
  this.setState({...this.state, firstname: e.target.value})
  }

  handlePhoneChange(e) {
    this.setState({...this.state, phone: e.target.value})
  }

  handleEmailChange(e) {
      this.setState({...this.state, email: e.target.value})
  
   }  


 

handleFileChange(e) {

  this.setState({file: e.target.files[0]})

}

handleUpload(e) {
  let formData = new FormData()
  formData.append('file', this.state.file)
  
  axios.post('/api/files/upload', formData)
  .then(response => { 
  this.setState({...this.state, image: response.data.name, success: true})
  
}).catch(err => console.log(err))

}

handlePasswordChange(e) {
    this.setState({...this.state, password: e.target.value})
}

handleConfirmChange(e) {
    this.setState({...this.state, confirm: e.target.value})
}





  submitForm(e) {
    e.preventDefault();
    this.setState({display: 'inline', signin: 'signing up'})
    axios.post('/api/account/register', {
      SurName: this.state.surname, 
      FirstName: this.state.firstname, 
      PhoneNumber: this.state.phone,
      Email: this.state.email,
      Image: this.state.image,
      Password: this.state.password,
      ConfirmPassword: this.state.confirm
    })

    .then(response => {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userdata', JSON.stringify(response.data))
      localStorage.setItem('isAdmin', JSON.stringify(response.data.isAdmin))
      let userdata = localStorage.getItem('userdata')
       this.setState({...this.state, error:userdata, Authentication:true});
    
    })

    .catch(err => console.log(err))

    if( this.state.password !== this.state.confirm) {
      const danger = document.getElementById("_danger")
      if(danger.classList.contains("d-none")){
        danger.classList.remove("d-none");
        danger.classList.add("d-block");
      }
    }
    
    else {
      return this.isAuthenticated
    }

    if( this.state.Authentication === false && this.state.password === this.state.confirm){
      const warn = document.getElementById("_warning");
      if(warn.classList.contains("d-none")){
        warn.classList.remove("d-none");
        warn.classList.add("d-block");
      }
    }
    else{
      return this.isAuthenticated
    }

   
    
  }
  

  isAuthenticated () {
    const data = localStorage.getItem('userdata');
    const admin = localStorage.getItem('isAdmin')
    if (data) {
      return true;
    } else if (admin === true) {
      return false;
    }
    else {
      return false;
    } 
     
  }

    render() {
      //console.log(this.state)
 
      const isAlreadyAuthenticated = this.isAuthenticated();
   
        
        return (
            <div>
              { isAlreadyAuthenticated ? <Redirect to = {{pathname: "/"}}/> : ( 
                <div className="container-fluid bgg">
                    <div className="row">
                      <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                        <img className="img-fluid reduced rounded mx-auto d-block" alt="" src="images/logo-2.png"/>
                        <div className="card card-signin my-5">
                          <div className="card-body">
                            <h5 className="card-title text-center">Signup</h5>
                            <form method="POST" onSubmit={this.submitForm}>  

                              <div className="input-group">
                                    <input className="input--style-3" type="text" placeholder="Surname" name="Surname"  id="inputSurname" value={this.state.surname} onChange={this.handleSurnameChange}  required />
                                </div>

                                <div className="input-group">
                                    <input className="input--style-3" type="text" placeholder="Firstname" name="Firstname"  id="inputFirstame" value={this.state.firstname} onChange={this.handleFirstnameChange}required />
                                </div>
                                <div className="input-group">
                                    <input className="input--style-3" type="text" placeholder="Phone" name="Phone"  id="inputPhone" value={this.state.phone} onChange={this.handlePhoneChange} required />
                                </div>

                                <div className="input-group">
                                    <input className="input--style-3" type="email" placeholder="Email Address" name="email address"  id="inputEmail" value={this.state.email} onChange={this.handleEmailChange} required />
                                </div>

                                <div className="input-group">
                                    <input className="input--style-3"type="password" id="inputPassword" placeholder="Password" name="password" value={this.state.password} onChange={this.handlePasswordChange} required />
                                </div>

                                <div className="input-group">
                                    <input className="input--style-3"type="password" id="inputConfirmPassword" placeholder="Confirm Password" name="State" value={this.state.confirm} onChange={this.handleConfirmChange} required />
                                </div>

                              
                             
                                <div className="js-input-file move-down">      
                              <input class="input-class"type="file"id="file" name="file" onChange={this.handleFileChange}/>
                              <button class="btn-style"  type="button" onClick={this.handleUpload}>Upload</button>
                              <span id="success" className={this.state.success ? "d-block text-success" : "d-none "}>Succesfully Uploaded</span>
                              </div> 

                            

                              <button className="btn btn-lg btn-block text-uppercase button" type="submit">
                              <i
                                className="fa fa-refresh fa-spin"
                                style={{ marginRight: "5px", display: this.state.display }}
                              />
                              {this.state.signin}
                            </button>
                                <h6 className="text-center small-move"> Already have an Account? <Link className="green" to="/login">SIGN IN</Link></h6>
                                <span id="_warning" className="d-none text-danger text-center">Username already exists</span>
                                <span id="_danger" className="d-none text-danger text-center">Password doesn't match Confirm password</span>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
        <Footer />
    </div>
        )
    }
}
