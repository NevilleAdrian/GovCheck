import axios from 'axios';

const baseUrl = "/api/";
const all = (uri) =>
    axios
        .get(baseUrl + uri)
        .then(response => response.data)
        .catch(err => console.log(err))


const create = (uri, personObject) =>
    axios
        .post(baseUrl + uri, personObject)
        .then(response => response.data)
        .catch(err => console.log(err))

const get = async (url) =>
    await axios
            .get(baseUrl + url)
            .then(response => response.data)
            .catch(err => { throw new Error(err) })

const remove = (id) =>
    axios
        .delete(baseUrl + id)
        .then()
        .catch()


const update = (personObject) =>
    axios
        .put(baseUrl + personObject.id, personObject)
        .then(response => response.data)
        .catch(err => console.log(err))


export default
    {
        all,
        create,
        get,
        remove,
        update
    }

