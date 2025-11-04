import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";

interface EditOwnerNotesProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  ownerDog: { owner: string, phone: string, id: number, bookingId: number, dogName: string, breed: string, notes: string },

}

export const EditOwnerNotes = ({
  open,
  onClose,
  onSubmit,
  ownerDog
}: EditOwnerNotesProps) => {

  const [ownerName, setOwnerName] = useState(ownerDog.owner)
  const [phoneOwner, setPhoneOwner] = useState(ownerDog.phone)
  const [dogName, setDogName] = useState(ownerDog.dogName)
  const [breed, setBreed] = useState(ownerDog.breed)
  const [secondContact, setSecondContact] = useState(false)
  const [secondOwnerName, setSecondOwnerName] = useState("")
  const [secondPhone, setSecondPhone] = useState("")
  const [notes, setNotes] = useState(ownerDog.notes)


  return (
    <>
      <CreateNewModal
        key={"EditingOwnerNotesModal"}
        title="Edit Owner Notes"
        columns={[
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
            accessorKey: 'dogId',
            label: '',
            name: '',
            type: "number",
            value: ownerDog.id,
            noEdit: true,
            noShow: true,
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'bookingId',
            label: '',
            name: '',
            type: "number",
            value: ownerDog.bookingId,
            noEdit: true,
            noShow: true,
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'dogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            value: dogName,
            setValue: (value) => setDogName(value),
            required: true,
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'dogBreed',
            label: 'Dog Breed',
            name: '',
            type: "text",
            value: breed,
            setValue: (value) => setBreed(value),
            required: true,
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'second',
            label: 'Second Owner',
            name: '',
            type: "checkbox",
            value: secondContact,
            setValue: (value) => setSecondContact(value),
            gridXS: 12, gridMS: 4,
            marginGridTop: '20px'
          },
          {
            accessorKey: 'secondOwner',
            label: 'Owner Name',
            name: '',
            type: "text",
            noShow: !secondContact,
            value: secondOwnerName,
            setValue: (value) => setSecondOwnerName(value),
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'secondPhone',
            label: 'Phone',
            name: '',
            type: "text",
            noShow: !secondContact,
            value: secondPhone,
            required: true,
            setValue: (value) => setSecondPhone(value),
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
          },
        ]}
        open={open}
        onClose={() => onClose()}
        onSubmit={(values) => onSubmit(values)}
        grid={true}
      />
    </>
  )
}