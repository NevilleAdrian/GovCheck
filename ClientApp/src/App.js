import React, { Component } from 'react';
import { Home } from './components/Home/Home';
import { NavMenu } from './components/NavMenu/NavMenu'
import { Route } from 'react-router';
import { Projects } from './components/Projects/Projects';
import { Signup } from './components/Signup/Signup'
import { Login } from './components/Login/Login'
import { SingleProject } from './components/SingleProject/SingleProject';
import { ViewProject } from './components/ViewProject/ViewProject';
import { User } from './components/User/User';
import { NotFound } from './components/NotFound/NotFound';
import { GenerateCode } from './components/GenerateCode/GenerateCode';
import {
  Switch,
} from 'react-router-dom'
import { ChangePassword } from './components/ChangePassword/ChangePassword';
import { Update } from './components/Update/Update';
import { ForgotPassword } from './components/ForgotPassword/ForgotPassword';
import { AdminLogin } from './components/AdminLogin/AdminLogin';

export default class App extends Component {

  render() {
      return (
          <div>
              <NavMenu />

              <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/projects' component={Projects} />
              <Route path='/signup' component={Signup} />
              <Route path='/login' component={Login} />
              <Route exact path='/project/' component={SingleProject} />
              <Route path='/user' component={User} />
              <Route exact path='/user/:id' component={User} />
              <Route path='/changepassword' component={ChangePassword} />
              <Route path='/update' component={Update} />
              <Route path='/forgotpassword' component={ForgotPassword} />
              <Route path='/generatecode' component={GenerateCode} />
              <Route path='/adminlogin' component={AdminLogin} />
              <Route path='/projects/:slug' component={SingleProject} />
                  <Route exact path='/user' component={User} />
                  <Route exact path='/user/:slug' component={User} />
                  <Route path='/project/:slug' component={ViewProject} />
              <Route component={ NotFound } />
              </Switch>
        
          </div>

          
    );
  }
}
