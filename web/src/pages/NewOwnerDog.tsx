import { AxiosError } from "axios";
import dayjs from "dayjs";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ZodError } from "zod";
import { api, getToken } from "../lib/axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InputLabel } from "../components/InputLabel";

export function NewOwnerDog(){

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneOne, setPhoneOne] = useState("");
  const [phoneTwo, setPhoneTwo] = useState("");
  const [address, setAddress] = useState("");
  const [dogName, setDogName] = useState("");
  const [birthdayDate, setBirthdayDate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [colour, setColour] = useState("");
  const [breed, setBreed] = useState("");
  const [dateVaccine, setDateVaccine] = useState(new Date());
  const [typeVaccine, setTypeVaccine] = useState("");

  function handleNewOwnerDog(event: FormEvent) {
    event.preventDefault();

    if(name == '' || email == '' || phoneOne == '' || dogName == '' || breed == '' || dateVaccine.toDateString() == '') {
      toast.error("You need to fill some fields", {position: 'top-center', autoClose: 2000,});
      return
    }
    try{
      createNewOwnerDog({nameOwner: name, emailAddress: email, phoneOne, phoneTwo, address, nameDog: dogName, birthdayDate: birthdayDate.toISOString(), gender, colour, breed, dateVaccine: dateVaccine.toISOString(), typeVaccine})
    }catch(err: any) {
      const validation:ZodError = err
      validation.errors.map(error => {
        toast.error(error.message, { position: "top-center",autoClose: 5000, });
      })
    }
  }
  
  function createNewOwnerDog(body:Object) {
    console.log(body)
    api.post('/dogs', body, {
      headers: { 'Content-Type': 'application/json', 'Authorization': getToken() }
    }).then( response =>{
      
      toast.success(`Owner ${name} is created`, { position: "top-center", autoClose: 5000, })
    }).catch((err: AxiosError) => {
      console.log(err)
      console.log(err.response?.data)
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      return 
    })
  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
     
      <div className="flex-col bg-white w-full p-4 md:p-8 mt-4 rounded items-center">
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-3xl md:text-4xl text-neutral-700 my-5">New Owner</h1>
        </div>
        <form className="flex flex-col" onSubmit={handleNewOwnerDog}>
          <div className="flex flex-col xl:flex-row md:justify-around">
            <div className="flex-col xl:w-[580px] 2xl:w-[680px]" >
              <InputLabel onChange={event => setName(event.target.value)} placeholder="Owner Name" type="text" labelName={"Name"} value={name}/>
              <InputLabel onChange={event => setEmail(event.target.value)} placeholder="Owner Email" type="email" labelName={"Email"} value={email}/>
              <InputLabel onChange={event => setPhoneOne(event.target.value)} placeholder="+353 8x xxx xxxx" type="tel" labelName={"Phone One"} value={phoneOne}/>
              <InputLabel onChange={event => setPhoneTwo(event.target.value)} placeholder="+353 8x xxx xxxx" type="tel" labelName={"Phone Two"} value={phoneTwo}/>
              <InputLabel onChange={event => setAddress(event.target.value)} placeholder="Owner Address" type="text" labelName={"Address"} value={address}/>
            </div>
            <div className="flex-col xl:w-[580px] 2xl:w-[680px]">
              <InputLabel onChange={event => setDogName(event.target.value)} placeholder="Ex. Einstein" type="text" labelName={"Dog Name"} value={dogName}/>
              <InputLabel onChange={event => setBirthdayDate(dayjs(event.target.value).toDate())} placeholder="Ex. Einstein" type="date" labelName={"Birthday Date"} value={birthdayDate.toDateString()}/>
              <InputLabel onChange={event => setGender(event.target.value)} placeholder="Ex. Male, Female" type="text" labelName="Gender" value={gender}/>
              <InputLabel onChange={event => setColour(event.target.value)} placeholder="Ex. Black, White" type="text" labelName="Colour" value={colour}/>
              <InputLabel onChange={event => setBreed(event.target.value)} placeholder="Ex. Collin, Cockapoo" type="text" labelName="Breed" value={breed}/>
            </div>
          </div>
          <div className="flex flex-col md:items-center">
            <div className="w-full xl:w-[580px] 2xl:w-[680px]">
              <InputLabel onChange={event => setDateVaccine(dayjs(event.target.value).toDate())} placeholder="Ex. Einstein" type="date" labelName={"Vaccine Date"} value={dateVaccine.toDateString()}/>
              <InputLabel onChange={event => setTypeVaccine(event.target.value)} placeholder="Ex. 7N1KC" type="text" labelName="Type Vaccine" value={typeVaccine}/>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center">
            <button className="w-full md:w-[500px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-pinkBackground rounded hover:bg-pink-600 focus:outline-none focus:bg-bg-pink-600">
              Create New Owner
            </button>

          </div>
        </form>
        <div className="flex flex-col items-center">
          <button onClick={() => navigate(-1)} className="w-full md:w-[500px] mt-5 px-4 py-2 tracking-wide text-neutral-700 hover:text-white transition-colors duration-200 transform bg-white border-[1px] border-neutral-700 rounded hover:bg-pink-600 focus:outline-none focus:bg-bg-pink-600">
            Go Back
          </button>
        </div>
        
      </div>
    </div>
  )
}