import axios from 'axios'

const URLBASE = import.meta.env.VITE_URLBASE

export const api = axios.create({baseURL: URLBASE})

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

