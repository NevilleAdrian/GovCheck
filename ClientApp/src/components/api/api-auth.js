import axios from 'axios';

const baseUrl = '/api/account';

const login = (loginObject) =>{
    axios
        .post(`${baseUrl}/login`, loginObject)
        .then(response => response)
        .catch(err => console.error(err));
}

const register = (registerObject) =>{
    axios
        .post(`${baseUrl}/register`, registerObject)
        .then(response => response)
        .catch(err => console.error(err));
}


export default {
    login,
    register,
};