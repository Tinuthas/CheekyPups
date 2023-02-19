import axios from 'axios'

export const api = axios.create({baseURL:'http://localhost:3333/api'})

export function updateToken() {

  const token = localStorage.getItem("authenticated");
  if(token != ""){
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;
  }else
    axios.defaults.headers.common['Authorization'] = null;
  
}

export function getToken() {
  const token:string = localStorage.getItem("authenticated") || "";
  return "Bearer " + token
}

/*axios.interceptors.request.use(function (config) {
  
   

  return config;
});*/

