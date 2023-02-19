import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonLight } from "../components/ButtonLight";


export function NewOwnerDog(){

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
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

  function createNewOwnerDog() {

  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
     
      <div className="flex-col bg-white w-full p-4 md:p-8 mt-4 rounded items-center">
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-3xl md:text-4xl text-neutral-700 my-5">New Owner</h1>
        </div>
    
        <form className="flex flex-col" onSubmit={createNewOwnerDog}>

        <div className="flex flex-col xl:flex-row md:justify-around">
          <div className="flex-col xl:w-[500px]" >
            <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
              <label htmlFor="text" className="block text-sm font-semibold text-neutral-800">
                Name
              </label>
              <input
                placeholder="Owner Name"
                onChange={event => setName(event.target.value)} autoFocus type="text"
                className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
              />
            </div>
          
          

          <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
            <label htmlFor="email" className="block text-sm font-semibold text-neutral-800">
              Email
            </label>
            <input
              placeholder="Owner Email"
              onChange={event => setEmail(event.target.value)} autoFocus type="email"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>

          <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
            <label htmlFor="text" className="block text-sm w-[100px] font-semibold text-neutral-800">
              Phone One
            </label>
            <input
              placeholder="+353 8x xxx xxxx"
              onChange={event => setPhoneOne(event.target.value)} autoFocus type="tel"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>

          <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
            <label htmlFor="text" className="block text-sm w-[100px] font-semibold text-neutral-800">
              Phone Two
            </label>
            <input
              placeholder="+353 8x xxx xxxx"
              onChange={event => setPhoneTwo(event.target.value)} autoFocus type="tel"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>

          <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
            <label htmlFor="text" className="block text-sm font-semibold text-neutral-800">
              Address
            </label>
            <input
              placeholder="Owner Address"
              onChange={event => setAddress(event.target.value)} autoFocus type="text"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>

          </div>
          <div className="flex-col xl:w-[500px]">

          <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
            <label htmlFor="text" className="block text-sm w-[100px] font-semibold text-neutral-800">
              Dog Name
            </label>
            <input
              placeholder="Ex. Einstein"
              onChange={event => setDogName(event.target.value)} autoFocus type="text"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>

          <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
            <label htmlFor="date" className="block text-sm w-[140px] font-semibold text-neutral-800">
              Birthday Date
            </label>
            <input
              onChange={event => setBirthdayDate(dayjs(event.target.value).toDate())} autoFocus type="date"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>

          <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
            <label htmlFor="text" className="block text-sm font-semibold text-neutral-800">
              Gender
            </label>
            <input
              placeholder="Ex. Male, Female"
              onChange={event => setGender(event.target.value)} autoFocus type="text"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>

          <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
            <label htmlFor="text" className="block text-sm font-semibold text-neutral-800">
              Colour
            </label>
            <input
              placeholder="Ex. Black, White"
              onChange={event => setColour(event.target.value)} autoFocus type="text"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>

          <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
            <label htmlFor="text" className="block text-sm font-semibold text-neutral-800">
              Breed
            </label>
            <input
              placeholder="Ex. Collin, Cockapoo"
              onChange={event => setBreed(event.target.value)} autoFocus type="text"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>

          </div>
          </div>

          <div className="flex flex-col md:items-center">
          <div className="w-full xl:w-[500px]">
          <div className="mb-2 md:flex md:flex-row md:items-center">
            <label htmlFor="date" className="block text-sm font-semibold text-neutral-800">
              Vaccine Date
            </label>
            <input
              onChange={event => setDateVaccine(dayjs(event.target.value).toDate())} autoFocus type="date"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>

          <div className="mb-2 md:flex md:flex-row md:items-center">
            <label htmlFor="text" className="block text-sm font-semibold text-neutral-800">
              Type Vaccine
            </label>
            <input
              placeholder="Ex. 7N1KC"
              onChange={event => setTypeVaccine(event.target.value)} autoFocus type="text"
              className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
            />
          </div>
          </div>
          </div>

          <div className={`mt-6 ${errorMessage !== "" ? 'opacity-100':'hidden opacity-0'}`}>
            <span className='text-red-500 font-semibold text-base'>{errorMessage}</span>
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