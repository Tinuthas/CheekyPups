import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { api, getToken } from "../../lib/axios";
import { AxiosError } from "axios";

interface CreateFinishProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  ownerDog: { owner: string, phone: string, time: string, id: number, dogName: string, breed: string, date:string, notes: string },

}

export const CreateFinish = ({
  open,
  onClose,
  onSubmit,
  ownerDog
}: CreateFinishProps) => {

  const [ownerName, setOwnerName] = useState(ownerDog.owner)
  const [phoneOwner, setPhoneOwner] = useState(ownerDog.phone)
  const [dog, setDog] = useState<{ time: {} | null, bookingId: number, dogName: string, breed: string }>({ time: ownerDog.time, bookingId: ownerDog.id, dogName: ownerDog.dogName, breed: ownerDog.breed })

  const [notes, setNotes] = useState(ownerDog.notes)
  const [description, setDescription] = useState("GROOMING "+dayjs(ownerDog.date).format('DD/MM/YYYY hh:mm A'))
  const [sales, setSales] = useState("")
  const [valuePaid, setValuePaid] = useState("")
  const [paidField, setPaidField] = useState(false)


  return (
    <>
      <CreateNewModal
        key={"FinishingCreateModal"}
        title="Finishing Booking"
        columns={[
          {
            accessorKey: 'owner',
            label: 'Owner',
            name: '',
            type: "text",
            value: ownerName,
            noEdit: true,
            setValue: (value) => setOwnerName(value),
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'phone',
            label: 'Phone',
            name: '',
            type: "text",
            value: phoneOwner,
            noEdit: true,
            setValue: (value) => setPhoneOwner(value),
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'dogTime',
            label: 'Time',
            name: 'Choose Time',
            type: "text",
            value: dog.time,
            noEdit: true,
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'bookingId',
            label: 'Time',
            name: 'Time Id',
            type: "number",
            value: dog.bookingId,
            noEdit: true,
            noShow: true,
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'dogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            value: dog.dogName,
            noEdit: true,
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'dogBreed',
            label: 'Dog Breed',
            name: '',
            type: "text",
            value: dog.breed,
            noEdit: true,
            gridXS: 12, gridMS: 4,
          },

          {
            accessorKey: 'salesValue',
            label: 'Sales',
            name: '',
            type: "number",
            required: true,
            value: sales,
            setValue: (value) => {
              setSales(value)
              setValuePaid(value)
            },
            gridXS: 12, gridMS: 3,
          },
          {
            accessorKey: 'paid',
            label: 'Paid',
            name: 'Paid',
            type: "checkbox",
            value: paidField,
            setValue: (value) => setPaidField(value),
            gridXS: 12, gridMS: !paidField ? 9 : 2,
            marginGridTop: '20px'
          },
          {
            accessorKey: 'typePaid',
            label: 'Payment',
            name: 'Choose Payment Type',
            type: "select",
            required: true,
            noShow: !paidField,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              var listData: any[] = [{ value: 'CASH', label: 'Cash' }, { value: 'CARD', label: 'Card' }, { value: 'REV', label: 'Revolut' }]
              resolve(listData)
            }),
            gridXS: 12, gridMS: 3.5,
          },
          {
            accessorKey: 'paidValue',
            label: 'Value Paid',
            name: '',
            type: "number",
            value: valuePaid,
            noShow: !paidField,
            setValue: (value) => setValuePaid(value),
            gridXS: 12, gridMS: 3
          },
          {
            accessorKey: 'notes',
            label: 'Notes',
            name: '',
            type: "text",
            value: notes,
            setValue: (value) => setNotes(value),
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'description',
            label: 'Description',
            name: '',
            type: "text",
            value: description,
            setValue: (value) => setDescription(value),
            gridXS: 12, gridMS: 6,
          },]}
        open={open}
        onClose={() => onClose()}
        onSubmit={(values) => onSubmit(values)}
        grid={true}
      />
    </>
  )
}