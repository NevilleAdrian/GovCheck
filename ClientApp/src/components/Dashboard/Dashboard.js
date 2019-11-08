import React from 'react';
import './Dashboard.css';
import axios from 'axios';


export class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            total: 0,
            startedTotal : 0,
            completedTotal: 0
        }
       
    }

  

    componentDidMount() {
        axios.get('/api/Projects/count')
        .then(response => {
            this.setState({...this.state, total: response.data.total})
            //console.log(response)
        })
        .catch(err => console.log(err))

        axios.get('/api/Projects/started/count')
        .then(response => {
            this.setState({...this.state, startedTotal: response.data.total})
            //console.log(response)
        })
        .catch(err => console.log(err))

        axios.get('/api/Projects/completed/count')
        .then(response => {
            this.setState({...this.state, completedTotal: response.data.total})
            //console.log(response)
        })
        .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="container-fluid">
          <div className="row dashboard">
             <div className="col-xl">


                        <div className=" col-md-4 p-3 mt-3 d-flex align-items-center  outer-w3-agile justify-content-between">
                            <div className="s-l">
                            <h5>Total Projects</h5>
                                <p className="paragraph-agileits-w3layouts">{this.state.total}</p>
                            </div>
                            <div className="s-r">
                        
                                <h6>
                                  <img class="img-fluid" src="/images/Bar Chart 1.png"></img>
                                </h6>
                            </div>
                        </div>
                        <div className="col-md-4 p-3 mt-3 d-flex align-items-center  outer-w3-agile  justify-content-between ">
                            <div className="s-l">
                                <h5>Started Projects</h5>
                                <p className="paragraph-agileits-w3layouts">{this.state.startedTotal}</p>
                            </div>
                            <div className="s-r">
                                <h6>
                                <img class="img-fluid" src="/images/Bar Chart 2.png"></img>
                                </h6>
                            </div>
                        </div>
                        <div className="col-md-4 p-3 mt-3 d-flex align-items-center outer-w3-agile  justify-content-between ">
                            <div className="s-l">
                                <h5>Completed Projects</h5>
                                <p className="paragraph-agileits-w3layouts">{this.state.completedTotal}</p>
                            </div>
                            <div className="s-r">
                                <h6>
                                <img class="img-fluid" src="/images/Bar Chart.png"></img>
                                </h6>
                            </div>
                        </div>
                        
                            
                       
                    </div>
                    </div>
            </div>
        
        )
    }
}