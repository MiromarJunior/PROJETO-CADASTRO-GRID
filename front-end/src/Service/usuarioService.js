const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveUsuario = data=>{
    return axios.post(`${baseURL}cadastrarUsuario`,data);
} 

module.exports = {saveUsuario};