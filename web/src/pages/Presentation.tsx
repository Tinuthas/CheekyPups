
import Cropped from "../assets/croppedcheekypups.jpg"

export function Presentation() {

  return (
    <div className="flex w-full h-screen flex-col">
      <header className="bg-pinkBackground h-fit w-full flex flex-col justify-center">
        <div className="flex justify-center md:mt-10">
          <img src={Cropped} className="md:h-[200px] md:rounded"/>
        </div>
        <h1 className="text-center font-medium text-white m-10 md:m-20 md:mt-10 md:mb-10 text-xl md:text-4xl ">Declan's Cheeky Pups Dog Grooming & Doggie Daycare</h1>
       
      </header>
      <main className="w-full bg-pinkBackground text-neutral-800">
        <div className="md:mx-28 lg:mx-40 desktop:mx-80">
          <div className="m-5 bg-white p-7 md:rounded">
          <h3 className="text-center font-medium text-lg">WHAT DO WE DO?</h3>
            <p className="mt-5">Declan’s Cheeky Pups Dog Grooming is a calm and controlled environment. We know that time is of value for the busy working mom & dad so I try and work around times that suit you. Just give us a call and we can work around you. </p>
          </div>
          <div className="m-5 bg-white p-7 md:rounded">
            <h3 className="text-center font-medium text-lg">WHAT DO WE OFFER?</h3>
            <p className="mt-5">We pride ourselves in offering your pooch the best grooming experience possible! We offer a range of services for your furry friend. We cater to Small, Medium & Large dogs.</p>
            <p className="mt-2">THE WORKS SESSION INCLUDES: Hair cut, Wash & Dry PLUS Nails & Ears at no extra cost.</p>
          </div>
          <div className="m-5 bg-white p-7 md:rounded">
            <h3 className="text-center font-medium text-lg">GET IN TOUCH</h3>
            <p className="mt-5">
              To organise your next doggy pampering session, give us a call on <span className="font-bold">083 487 1320</span> or send us a email <span className="font-bold">info@cheekypups.com</span>.
            </p>
            <p className="mt-2">
              You can find us on Facebook <a href="https://www.facebook.com/CheekyDogsDogGrooming/?fref=ts" className="font-bold">here</a>.
            </p>
          </div>
        </div>
      </main>
      <footer className="bg-pinkBackground">
        <div className="my-4 flex justify-center">
            <a
              href="https://www.facebook.com/CheekyDogsDogGrooming/?fref=ts"
              type="button"
              className="m-1 h-9 w-9 rounded-full border-2 border-white uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
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
              className="m-1 h-9 w-9 rounded-full border-2 border-white uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
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
              className="m-1 h-9 w-9 rounded-full border-2 border-white uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
              data-te-ripple-init
              data-te-ripple-color="light">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mx-auto h-full w-4" viewBox="0 0 16 16"> <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/> </svg>
            </a>
        </div>
        <hr className="mx-10"/>
        <p className="text-white text-center m-4">Copyright © 2023 Declan`s Cheeky Pups</p>
      </footer>
    </div>
  )
}