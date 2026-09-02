import { useEffect, useState } from "react"
import Banner from "../assets/cheekypupsbannerfront.png"
import { ButtonGroupList } from "../components/ButtonGroupList"
import { api, getToken } from '../lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Loading } from "../components/Loading";
import { SummaryPayment } from "../components/SummaryPayment";

export function CustomerInfo(){

  const [searchButton, setSearchButton] = useState('P')
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<any>(null)

  useEffect(() => {
    searchCustomerInfo()
  }, [])

  function selectOrders(value: any) {
    setSearchButton(value)
  }

  function searchCustomerInfo() {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
          api.get('info/customer', {
            params: {
              //id: 19
              //code: "DmiQZRbCKR1C51iQ.ArjiowkafJGzbxpLAt3b2w.gS4jK4LnXGMJfMoE9ii1E5A"
              code: 'Z0Y-6dG8LOPallWM.Sv4cj0oSyo38ZfMVR6iFNA.Lf6Slned8UdnbUcWrYKL3qQ0'
            },
            headers: {
              Authorization: getToken()
            }
          }).then(response => {
            var data = response.data
            var listData = JSON.parse(JSON.stringify(data));
            console.log(listData)
            setInfo(listData)
            setLoading(false)
          }).catch((err: AxiosError) => {
            console.log(err)
              const data = err.response?.data as { message: string }
              toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
              setLoading(false)
              throw new Error(`${data.message || err.response?.data || err.message}`);
            })
          })
    return promise
  }

  return (
    <div className="w-full h-screen">
      {loading || info == null ? <div className="w-full flex justify-center"><Loading /> </div> : <>
      <header id="logo-img">
        <div className="flex justify-center">
          <img src={Banner} className=" max-h-[200px] md:rounded-xl"/>
        </div>
      </header>
      <main className="flex justify-center w-full">
       <div>
         <h3 className="text-3xl text-white font-borsok text-center mb-3">Customer Info</h3>
          <div className="bg-white rounded-xl text-stone-700 p-4 md:px-10 lg:px-20">
            <div id="OwnerInfo" className="">
              <div id="ownerName" className="flex justify-center">
                <span></span>
                <span className="font-medium text-xl">{info != null && info.owner != null ? info.owner.name : null}</span>
              </div>
              {info != null && info.owner != null && info.owner.dogs != null ? 
                <>
                  {info.owner.dogs.map((dog:any) => (
                  <div className="flex justify-center">
                    <span></span>
                    <span className="font-medium text-md">{dog.name} - {dog.breed}</span>
                  </div>
                  ))}
                </>
              : null}
            </div>
            <div className="w-92">
              <SummaryPayment info={info} />
            </div>
           
            <div className="md:flex w-fit rounded m-1 bg-white">
              <ButtonGroupList listButtons={[{ key: "P", name: "Payments" }, { key: "G", name: "Grooming" }, { key: "D", name: "Daycare" }]} selectButton={(value) => selectOrders(value)} selectedButton={searchButton} />
            </div>
            {searchButton == 'P' ?
              <div id="Payments">
                <h4 className="font-medium text-xl text-center font-borsok text-pinkBackground p-2">Payments</h4>
                <div></div>
              </div>
            : searchButton == 'G' ?
              <div id="Grooming">
                <h4 className="font-medium text-xl text-center font-borsok text-pinkBackground p-2">Grooming</h4>
              </div>
            : searchButton == 'D' ? 
              <div id="Daycare">
                <h4 className="font-medium text-xl text-center font-borsok text-pinkBackground p-2">Daycare</h4>
              </div>
          : null}
            
            
            
          </div>
       </div>
      </main>
    </> }
    </div>
  
  )
}