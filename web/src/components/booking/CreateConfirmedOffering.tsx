import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {api, getToken} from "../../lib/axios";
import { AxiosError } from "axios";

interface CreateConfirmedOfferingProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  ownerSearch: {search:string, owner: string, phone: string, time: string, id: number, notes: string},
  listTimes: [{}]
}

export const CreateConfirmedOffering = ({
  open,
  onClose,
  onSubmit,
  ownerSearch,
  listTimes,
}: CreateConfirmedOfferingProps) => {

  const [ownerSelectInput, setOwnerSelectInput] = useState(ownerSearch.search)
  const [ownerName, setOwnerName] = useState(ownerSearch.owner)
  const [phoneOwner, setPhoneOwner] = useState(ownerSearch.phone)
  const [firstDog, setFirstDog] = useState<{ time: {} | null, name: string, breed: string, id:string }>({ time: ownerSearch.time, name: "", breed: "", id: ""})
  const [valueListTimes, setValueListTimes] = useState<[{}]>(listTimes)
  const [notes, setNotes] = useState(ownerSearch.notes)


  return (
    <>
      <CreateNewModal
        title="Confirming Offer"
        key={"OfferingCreateModal"}
        columns={[
          {
            accessorKey: 'searchBooking',
            label: 'Search Owner/Phone/Dog',
            name: 'Search Owner/Phone/Dog',
            type: "select",
            value: ownerSelectInput,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              setOwnerSelectInput(inputValue)
              api.get('booking/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
                var data = response.data
                var listData: any[] = []
                listData.push({element: null, value: 0, label: `New Owner/Dog`})
                data.forEach((element: any) => {
                  listData.push({ element: element, value: element.id, label: `${element.Owner.name} - ${element.Owner.phoneOne} - ${element.name} - ${element.breed}${element.Owner.type != null && element.Owner.type.toUpperCase().includes('D') ? ' - DC':''}` })
                });
                resolve(listData)
              }).catch((err: AxiosError) => {
                const data = err.response?.data as { message: string }
                toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
                throw new Error(`${data.message || err.response?.data || err.message}`);
              })
            }),
            setValue: (value) => {
              setOwnerSelectInput(value.label)
              if(value.element == null) {
                setOwnerName("")
                setPhoneOwner("")
                setFirstDog({ time: firstDog.time, name: "", breed: "", id: ""})
              }else{
                setFirstDog({ time: firstDog.time, name: value.element.name, breed: value.element.breed, id: value.element.id})
                setOwnerName(value.element.Owner.name)
                setPhoneOwner(value.element.Owner.phoneOne)
                setFirstDog({ time: firstDog.time, name: value.element.name, breed: value.element.breed, id: value.element.id})
                
              }
            },
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'owner',
            label: 'Owner',
            name: '',
            type: "text",
            value: ownerName,
            required: true,
            setValue: (value) => setOwnerName(value),
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'phone',
            label: 'Phone',
            name: '',
            type: "text",
            value: phoneOwner,
            required: true,
            setValue: (value) => setPhoneOwner(value),
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'firstDogTime',
            label: 'Time',
            name: 'Choose Time',
            type: "text",
            noEdit: true,
            value: firstDog.time,
            gridXS: 12, gridMS: 4,
          },

          {
            accessorKey: 'bookingId',
            label: 'Booking Id',
            name: '',
            type: "text",
            value: ownerSearch.id,
            noShow: true,
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'dogId',
            label: 'Dog Id',
            name: '',
            type: "text",
            value: firstDog.id,
            noShow: true,
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'firstDogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            value: firstDog.name,
            required: true,
            setValue: (value) => setFirstDog({ time: firstDog.time, breed: firstDog.breed, name: value, id: firstDog.id}),
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'firstDogBreed',
            label: 'Dog Breed',
            name: '',
            type: "text",
            value: firstDog.breed,
            required: true,
            setValue: (value) => setFirstDog({ time: firstDog.time, breed: value, name: firstDog.name, id: firstDog.id }),
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'notes',
            label: 'Notes',
            name: '',
            type: "text",
            value: notes,
            setValue: (value) => setNotes(value),
            gridXS: 12, gridMS: 12,
          }]}
        open={open}
        onClose={() => onClose()}
        onSubmit={(values) => onSubmit(values)}
        grid={true}
      />
    </>
  )
}