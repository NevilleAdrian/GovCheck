import React from 'react';

const FIleUpload = (props) => {
    const onSubmitForm = (e) => {
        e.preventDefault();
        props.onSubmit(e, props.type)
    }
    return (

        <form style={props.style} onSubmit={onSubmitForm}>
            <label style={{ display: 'block' }}>Upload a {props.type}</label>
            <input type="file" style={{ backgroundColor: '#62d039', marginRight: '20px' }} />
            <button className="btn" style={{ backgroundColor: '#62d039', marginRight: '10px' }} type="submit">Upload</button>
            <button type="button" className=" btn btn-danger" onClick={props.onCancel}>Cancel</button>
            
        </form>
    )
}

export default FIleUpload

