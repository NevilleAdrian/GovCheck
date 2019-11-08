import React, { Component } from 'react';
import { MainContent } from '../MainContent/MainContent';
import { Footer } from '../Footer/Footer';
import { Projects} from '../Projects/Projects'

export class Home extends Component {
    isAuthenticated () {
        const token = localStorage.getItem('token');
        if(token) return true;
        return false;
      }
       

    render() {
        const isAlreadyAuthenticated = this.isAuthenticated();
        //console.log(this.props.match)
        return (
            <div>
                  {!isAlreadyAuthenticated ?
                  <div>
                        <MainContent history={this.props.history}/>
                     <Footer />
                  </div>
                    
          : (
                <div>
                  <Projects history={this.props.history} />
                   <Footer />
                </div>
                  
                )}

            </div>

        );
    }
}
