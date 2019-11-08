import React from 'react'

export class CheckList extends React.Component {
   
    trackCheckbox = (event, id) => {
        console.log(this.props.checkedBoxes)
        if (event.target.checked === true) {
            console.log("I was checked", id)
            //const r = this.state.checkedBoxes.concat(id)
            //this.setState({ ...this.state, checkedBoxes: [...this.state.checkedBoxes.concat(id)] })
            
            this.props.parentCallback([...this.props.checkedBoxes.concat(id)])
        }
        else {
            console.log("I was unchecked", id)
            const filter = this.props.checkedBoxes.filter(checks => checks !== id)
            //console.log(filter)
            //this.setState({ checkedBoxes: filter })
            this.props.parentCallback(filter)
        }

        //console.log(this.state.checkedBoxes)
    }


    
    render() {
       
        return (
            <div className="mt-4">
                <h5>Your checks will only be recorded if you comment</h5>
                {this.props.checklists.map(checkbox => {
                    //console.log(checkbox)
                    return (
                        <div><input type="checkbox" onChange={(event) => this.trackCheckbox(event, checkbox.id)} style={{ width: '25px' }} /><span>{checkbox.name}</span></div>
                    )
                })}
            </div>
            )
    }
}