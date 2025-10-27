import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { api, getToken } from "../../lib/axios";
import { AxiosError } from "axios";


interface CreateNewOwnerDogProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
}

export const CreateNewOwnerDog = ({
  open,
  onClose,
  onSubmit,
}: CreateNewOwnerDogProps) => {

  const [dateBirthday, setDateBirthday] = useState(new Date())
  const [secondDateBirthday, setSecondDateBirthday] = useState(new Date())
  const [firstDog, setFirstDog] = useState(true)
  const [secondDog, setSecondDog] = useState(false)

  function cleanFields() {
    setDateBirthday(new Date())
    setSecondDateBirthday(new Date())
    setSecondDog(false)
  }


  return (
    <>
      <CreateNewModal
        title="Adding New Owner and Dogs"
        key={"OwnerDogsCreateModal"}
        columns={[
          {
            accessorKey: 'ownerName',
            label: 'Owner Name',
            name: 'Owner Name',
            type: "text",
            required: true,
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'phoneOne',
            label: 'Phone One',
            name: '08x xxx xxxx',
            type: "tel",
            required: true,
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'emailAddress',
            label: 'Email',
            name: 'Owner Email',
            type: "email",
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'secondOwner',
            label: 'Second Owner Name',
            name: 'Second Owner Name',
            type: "text",
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'phoneTwo',
            label: 'Phone Two',
            name: '08x xxx xxxx',
            type: "tel",
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'address',
            label: 'Address',
            name: 'Owner Address',
            type: "text",
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'notes',
            label: 'Notes',
            name: '',
            type: "text",
            gridXS: 12, gridMS: 12
          }, 
          {
            accessorKey: 'firstDog',
            label: 'First Dog',
            name: 'First Dog',
            type: "checkbox",
            value: firstDog,
            setValue: (value) => setFirstDog(true),
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'dogName',
            label: 'Dog Name',
            name: 'Dog Name',
            type: "text",
            required: true,
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'nickname',
            label: 'Dog Nickname',
            name: 'Nickname',
            type: "text",
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'birthdayDate',
            label: 'Birthday Date',
            name: '',
            type: "date",
            value: dateBirthday,
            setValue: (value: any) => setDateBirthday(value),
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'gender',
            label: 'Gender',
            name: 'Ex. Male, Female',
            type: "text",
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'colour',
            label: 'Colour',
            name: 'Colour',
            type: "text",
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'breed',
            label: 'Breed',
            name: 'Breed',
            type: "text",
            required: true,
            gridXS: 12, gridMS: 4
          }, 
          {
            accessorKey: 'secondDog',
            label: 'Second Dog',
            name: 'Second Dog',
            type: "checkbox",
            value: secondDog,
            setValue: (value) => setSecondDog(value),
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'secondDogName',
            label: 'Dog Name',
            name: 'Dog Name',
            type: "text",
            noShow: !secondDog,
            required: true,
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'secondNickname',
            label: 'Dog Nickname',
            name: 'Nickname',
            type: "text",
            noShow: !secondDog,
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'secondBirthdayDate',
            label: 'Birthday Date',
            name: '',
            type: "date",
            noShow: !secondDog,
            value: secondDateBirthday,
            setValue: (value: any) => setSecondDateBirthday(value),
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'secondGender',
            label: 'Gender',
            name: 'Ex. Male, Female',
            type: "text",
            noShow: !secondDog,
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'secondColour',
            label: 'Colour',
            name: 'Colour',
            type: "text",
            noShow: !secondDog,
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'secondBreed',
            label: 'Breed',
            name: 'Bread',
            type: "text",
            noShow: !secondDog,
            required: true,
            gridXS: 12, gridMS: 4
          }
        ]}
        open={open}
        onClose={() => {
          cleanFields()
          onClose()
        }
        }
        onSubmit={(values) => onSubmit(values)}
        grid={true}
      />
    </>
  )
}