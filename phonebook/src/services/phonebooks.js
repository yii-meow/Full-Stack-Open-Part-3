import axios from "axios"

const baseUrl = "/api/persons"

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addPerson = (newPerson) => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}
 
const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const replacePhoneNo = (id, modifiedPerson) => {
    const request = axios.put(`${baseUrl}/${id}`, modifiedPerson)
    return request.then(response => response.data)
}

export default { getAll, addPerson, deletePerson, replacePhoneNo }