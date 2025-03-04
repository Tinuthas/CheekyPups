
import Banner from "../assets/cheekypupsbannerfront.png"
import { Map } from '../components/Map'
import { SliderPhotos } from "../components/SliderPhotos"
import '../styles/global.css'

const API_MAPS = import.meta.env.VITE_API_MAPS || ""

export function LandingPage() {
//lg:w-[1024px]
  return (
    <div className="flex w-full h-full flex-col">
      <div className="bg-mobile-background md:bg-blue-background bg-fixed">
      <div className="md:mx-[100px] lg:mx-[200px] lg:mt-10">

      
      <header className="h-fit w-full flex flex-col justify-center ">
      
        <div className="flex justify-center">
          <img src={Banner} className=" max-h-[300px] md:rounded-xl"/>
        </div>
        {
        //<h1 className="font-cursed leading-6 text-center break-words antialiased hover:subpixel-antialiased font-bold text-neutral-50 text-5xl md:text-7xl bg-background-image p-2  mt-10"><span className="text-xl md:text-2xl align-middle	">Declan's </span>Cheeky Pups <br/><span className="md:text-5xl text-3xl">Dog Grooming & Daycare</span></h1>
        }
       
      </header>
      <main className="w-full text-neutral-800 text-base md:text-lg">
        <div className="">
          <div className="m-5 bg-white p-7 md:rounded">
          <h3 className="text-center font-extrabold text-3xl md:text-4xl text-pinkBackground font-borsok">WHAT DO WE DO?</h3>
            <p className="mt-5 text-center">Declan’s Cheeky Pups is a calm and controlled environment, we have professional staff who are highly trained to take care of your dog.</p>
            <p className="mt-2 text-center">We work from Monday to Friday and you can schedule your dog to daycare or grooming by calling or texting us, our phone lines are open from <strong>9AM</strong> ultil <strong>5PM</strong>. For bookings call us on <strong>083 487 1320</strong>.</p>
          </div>
          <div className="mx-5 p-7 md: rounded bg-white">
            <h3 className="text-center font-extrabold text-3xl md:text-4xl text-pinkBackground font-borsok">DAYCARE</h3>
            <p className="mt-5 text-center">Cheeky Pups Daycare offers your dog a fun, safe and relaxing space to socialise, exercise and learn. We are offering you peace of mind while you are out busy running errands or at work that your dog is being looked after by highly trained staff in a cozy intimate environment. While at Cheeky Pups your dog will make lots of new friends and enjoy mental stimulation throughout the day.</p>
            <p className="mt-2 text-center">Cheeky Pups Dog Daycare opens <strong>7:30AM</strong> ultil <strong>6:30PM</strong> Monday to Friday.</p>
            <table className="table-auto border-collapse border border-zinc-400  hover:border-zinc-600 w-full justify-center align-middle mt-5 mb-5 text-center bolder text-sm md:text-base">
              <thead>
                <tr>
                  <th className="border border-zinc-300 bg-zinc-200 h-11">Description</th>
                  <th className="border border-zinc-300 bg-zinc-200 h-11">Price</th>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td className="border border-zinc-300 h-8">Full Day</td>
                <td className="border border-zinc-300 h-8">€20</td>
              </tr>
              <tr>
                <td className="border border-zinc-300 h-8">Half Day</td>
                <td className="border border-zinc-300 h-8">€15 (up to 5 hours)</td>
              </tr>
              <tr>
                <td className="border border-zinc-300 h-8">Two dogs per day</td>
                <td className="border border-zinc-300 h-8">€35 (save €5) </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 h-8">Full week for one dog</td>
                <td className="border border-zinc-300 h-8">€85 (Save €15) for this dog</td>
              </tr>
              <tr>
                <td className="border border-zinc-300 h-8">Full week for second dog</td>
                <td className="border border-zinc-300 h-8">€75 (save €25) for this dog</td>
              </tr>
              </tbody>
            </table>
            <SliderPhotos mainHeight="350px" secondHeight="250px" images={[
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Freception.jpg?alt=media&token=8b6945d4-91fc-4551-a99e-db886c929adb'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare12024.jpg?alt=media&token=f08e46b9-3de6-4699-a559-204999e75ba4'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare22024.jpg?alt=media&token=1a3d8826-d421-49f3-bf0e-8ac2daba1ef6'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare32024.jpg?alt=media&token=f2aba298-a163-4e3c-9bb1-101731ff6b70'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare62024.jpg?alt=media&token=879eae2a-fa28-48a8-9d4a-beef51747d85'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare42024.jpg?alt=media&token=d8fb97c1-b517-4a19-9f07-395e2a2bbd29'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare6.jpeg?alt=media&token=738302e5-3122-46a0-bbaf-cc3aa27de906'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare8.jpeg?alt=media&token=48f9aaff-7514-43f5-add4-cf3c8647e336'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare7.jpeg?alt=media&token=84a0a838-754a-405c-b2fd-245f3d2f51fe'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare3.jpeg?alt=media&token=a5aa94fa-b26b-4b01-b08d-18e158eff878'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare4.jpeg?alt=media&token=1ac626f4-8019-41f0-9421-8ec8c4bbc6d7'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare5.jpeg?alt=media&token=e6094769-47f4-4f1a-907f-6e1dadfed67b'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare9.jpeg?alt=media&token=b458e12d-0ca0-4a65-a52c-ca7b9e4e4a99'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare10.jpeg?alt=media&token=c843e1cb-db70-42a7-8043-cb4a7dd58446'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare11.jpeg?alt=media&token=663dd446-e65a-4d5b-bac4-3d3d6ff52b7f'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare12.jpeg?alt=media&token=7721914d-9b3c-4a3e-999b-1a0462254027'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare13.jpeg?alt=media&token=24658036-d912-4d6f-9ef7-a930250c42b8'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare14.jpeg?alt=media&token=5d062ada-1464-46d6-8a52-76ca1d99f1c8'},
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2Fdaycare15.jpeg?alt=media&token=8c3d4a87-1f38-4761-a6bc-82c4e5c974e0'}]} />
          </div>
          {/*
          <div className="m-5 bg-white p-7 md:rounded">
            <h3 className="text-center font-medium text-lg font-cursed">WHAT DO WE OFFER?</h3>
            <p className="mt-5">We pride ourselves in offering your pooch the best grooming experience possible! We offer a range of services for your furry friend. We cater to Small, Medium & Large dogs.</p>
            <p className="mt-2">THE WORKS SESSION INCLUDES: Hair cut, Wash & Dry PLUS Nails & Ears at no extra cost.</p>
          </div>
          */}
          <div className="m-5 bg-white p-7 md:rounded">
            <h3 className="text-center font-extrabold text-3xl md:text-4xl text-pinkBackground font-borsok">GROOMING</h3>
            <p className="mt-5 text-center">We pride ourselves in offering your pooch the best grooming experience possible! We offer a range of services for your furry friend. We cater to Small, Medium & Large dogs.</p>
            <p className="mt-2 mb-5 text-center">THE WORKS SESSION INCLUDES: <strong>Hair cut, Wash & Dry</strong> PLUS <strong>Nails & Ears</strong> at no extra cost.</p>


            <SliderPhotos mainHeight="580px" secondHeight="370px" images={[
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2FGrooming1.jpg?alt=media&token=23c46778-5023-42a3-a5ed-38d7e1f506bd'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2FGrooming2.jpg?alt=media&token=f46b095f-341f-4f62-b06c-964c2da19e7b'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2FGrooming3.jpg?alt=media&token=98daeeae-8f66-4131-bee6-c3de0891bf45'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2FGrooming4.jpg?alt=media&token=477a5ba4-ed7b-4d73-801d-c433b06a6846'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2FGrooming5.jpg?alt=media&token=c4aa962f-d476-4464-8c05-6e6c2c8140db'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2FGrooming6.jpg?alt=media&token=e546f632-6031-4b5b-ba06-a785c1f3599b'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2FGrooming7.jpg?alt=media&token=4b3fd8e8-bdf2-4398-a2fc-08cb09b6f5b7'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2FGrooming8.jpg?alt=media&token=30cf8ebc-e4ff-4cdb-a3ea-4c0106a46781'}, 
              {url: 'https://firebasestorage.googleapis.com/v0/b/cheekypups-42685.appspot.com/o/website%2FGrooming9.jpg?alt=media&token=7aee5960-7adc-4045-89eb-b0c219bfb1bd'}]} />
          </div>

          <div className="m-5 bg-white p-7 md:rounded">
            <h3 className="text-center font-extrabold text-3xl md:text-4xl text-pinkBackground font-borsok">GET IN TOUCH</h3>
            <p className="mt-5 text-center">
              Give us a call on <span className="font-bold">083 487 1320</span> or send us a email <span className="font-bold">info@cheekypups.com</span>.
            </p>
            <p className="mt-2 text-center">
              You can find us on Facebook <a href="https://www.facebook.com/CheekyDogsDogGrooming/?fref=ts" className="font-bold">here</a>.
            </p>
          </div>
          <div className="m-5 bg-white p-7 md:rounded w-f">
            <h3 className="text-center font-extrabold text-3xl md:text-4xl text-pinkBackground font-borsok">WHERE ARE WE?</h3>
            <p className="mt-5 text-center">
              Green Gate Business Centre, Gould St, The Lough, Cork - <strong>T12 Y65D</strong>
            </p>
            <Map googleMapsApiKey={API_MAPS} lat={51.890693} lng={-8.482955} zoom={15}/>
          </div>
        </div>
      </main>
      </div>
      <footer className="">
        <div className="my-4 flex justify-center">
            <a
              href="https://www.facebook.com/CheekyDogsDogGrooming/?fref=ts"
              type="button"
              className="m-1 h-11 w-11 rounded-full border-2 border-pinkBackground uppercase leading-normal text-pinkBackground transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
              data-te-ripple-init
              data-te-ripple-color="light">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-full w-4"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path
                  d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/cheeky.pups/"
              type="button"
              className="m-1 h-11 w-11 rounded-full border-2 border-pinkBackground uppercase leading-normal text-pinkBackground transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
              data-te-ripple-init
              data-te-ripple-color="light">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-full w-4"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            
            <a
              href="https://www.tiktok.com/@cheeky.pups"
              type="button"
              className="m-1 h-11 w-11 rounded-full border-2 border-pinkBackground uppercase leading-normal text-pinkBackground transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
              data-te-ripple-init
              data-te-ripple-color="light">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mx-auto h-full w-4" viewBox="0 0 16 16"> <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/> </svg>
            </a>
        </div>
        <hr className="mx-10 border-pinkBackground"/>
        <p className="text-pinkBackground font-medium text-center m-4">Copyright © 2025 Declan's Cheeky Pups</p>
      </footer>
      </div>
    </div>
  )
}