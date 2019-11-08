import React from 'react';
import './AdminNav.css';


export class AdminNav extends React.Component {
    

     stateChanger = (url) =>  {
        console.log(this.props)
         this.props.onClick(url);
         this.props.history.push(url)
        console.log(this.props.history)
    }

    render() {
        return (

            <div>

                <div className="admin-nav">
                    <button onClick={() => this.stateChanger('/user/dashboard')}><div className="link-style"><img src="/images/barCode.png" alt="barcode1"/><span className="link-text">Dashboard</span></div></button>
                    <button onClick={() => this.stateChanger('/user/projects')}><div className="link-style"><img src="/images/bcode.png" alt="barcode2" /><span className="link-text">Projects</span></div></button>
                    <button onClick={() => this.stateChanger('/user/addprojects')}><div className="link-style"><img src="/images/rxns.png" alt="barcode3" /><span className="link-text">Add Projects</span></div></button>
                    
                </div>
            </div>
         )
    }
}