import React from 'react';
import { Footer } from '../Footer/Footer'
import './Update.css';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import location from '../../js/location-helper';
import { Link } from 'react-router-dom';




export class Update extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      surname: '',
      firstname: '',
      phone: '',
      email:'',
      file: null,
      image:'',
      Authentication: false,
    }
    this.handleSurnameChange = this.handleSurnameChange.bind(this);
    this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
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



componentDidMount(){
    let user = this.getUser()
    //console.log(user)
    this.setState({
        surname: user.surName,
        firstname: user.firstName,
        phone: user.phoneNumber,
        email:user.email,
        file: null,
        image:user.image
    });
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
  

                                                                                                                                                                             
  submitForm(e) {
    e.preventDefault()
    //console.log(this.state)
    axios.put('/api/account/user', {
        Id:this.getUser().id,
        SurName: this.state.surname, 
        FirstName: this.state.firstname, 
        PhoneNumber: this.state.phone,
        Email: this.state.email,
        Image: this.state.image,
      })
    .then(response => {
        //console.log(response)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userdata', JSON.stringify(response.data))
      this.setState({...this.state, Authentication:true});
    })
    .catch(err => console.log(err))
    
  }


  isAuthenticated () {
    const token = localStorage.getItem('token');
    if(this.state.Authentication === true){
      return true
    }
    else if(token )  {
      return this.isSubmit;
    }
    else {
      return false;
    }

  }
  
  isSubmit () {
    const submit = localStorage.getItem('succeeded');
    if(submit) return true;
   
  }

  getUser() {
    if (localStorage.getItem('userdata')) {
        return JSON.parse(localStorage.getItem('userdata'));
    }
}

    render() {
      //console.log(this.state)
      const isAlreadyAuthenticated = this.isAuthenticated();
      return (
         <div> 
             { (!isAlreadyAuthenticated) ? <Redirect to = {{pathname: "/login"}}/> :( this.Authentication === true) 
             ?   
             <Redirect to = {{pathname: "/"}}/> :
              <div className="container-fluid bgg"> 
              <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                  <img className="img-fluid reduced rounded mx-auto d-block" alt="" src="images/logo-2.png"/>
                  <div className="card card-signin my-5">
                    <div className="card-body">
                      <h5 className="card-title text-center">Update details</h5>
                      <form method="POST" onSubmit={this.submitForm}>  
  
                         <div className="input-group">
                              <input className="input--style-3" type="text"  name="Surname"  id="inputSurname" value={this.state.surname} onChange={this.handleSurnameChange}  required autoFocus/>
                          </div>
  
                          <div className="input-group">
                              <input className="input--style-3" type="text"  name="Firstname"  id="inputFirstame" value={this.state.firstname} onChange={this.handleFirstnameChange}required autoFocus/>
                          </div>
                          
                          <div className="input-group">
                              <input className="input--style-3" type="text" name="Phone"  id="inputPhone" value={this.state.phone} onChange={this.handlePhoneChange} required autoFocus/>
                          </div>
  
                          <div className="input-group">
                              <input className="input--style-3" type="email"  name="email address"  id="inputEmail" value={this.state.email} onChange={this.handleEmailChange} required autoFocus/>
                          </div>

                         <div className="js-input-file move-down">     
                        {/* <img className="circle" src={user.image}></img> */}
                         <input class="input-class"type="file" id="file" name="file"  onChange={this.handleFileChange}/>
                         <button class="btn-style"  type="button" onClick={this.handleUpload}>Upload</button>
                         <span id="success" className={this.state.success ? "d-block text-success" : "d-none "}>Succesfully Uploaded</span>
                        </div> 
  
                      
  
                        <button className="btn btn-lg btn-block text-uppercase" type="submit">Update</button>
                        <span id="success" className={this.state.Authentication === true ? "d-block successful text center" : "d-none "}>Succesfully Uploaded</span>
                          <span id="_warning" className="d-none text-danger text-center">Username already exists</span>
                          <span id="_danger" className="d-none text-danger text-center">Password doesn't match Confirm password</span>
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

// {(num === num) ? "positive" : (num > num) ? "negative" : "zero"}