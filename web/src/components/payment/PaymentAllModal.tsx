import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {api, getToken} from "../../lib/axios";
import { AxiosError } from "axios";

interface PaymentAllModalProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  ownerDog: {owner: string, dogs: string, id: number, sales: number},

}

export const PaymentAllModal = ({
  open,
  onClose,
  onSubmit,
  ownerDog
}: PaymentAllModalProps) => {

  const [ownerName, setOwnerName] = useState(ownerDog.owner)
  const [dogsOwner, setDogsOwner] = useState(ownerDog.dogs)
  const [ownerId, setOwnerId] = useState(ownerDog.id)
  const [sales, setSales] = useState(ownerDog.sales)
  const [valuePaid, setValuePaid] = useState(ownerDog.sales)


  return (
    <>
      <CreateNewModal
        key={"FinishingCreateModal"}
        columns={[
          {
            accessorKey: 'ownerId',
            label: 'OwnerID',
            name: '',
            type: "number",
            value: ownerId,
            noEdit: true,
            noShow: true,
            gridXS: 12, gridMS: 6,
          },
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
            accessorKey: 'dogs',
            label: 'Dogs',
            name: '',
            type: "text",
            value: ownerName,
            noEdit: true,
            setValue: (value) => setOwnerName(value),
            gridXS: 12, gridMS: 6,
          },
          {
          accessorKey: 'typePaid',
          label: 'Payment',
          name: 'Choose Payment Type',
          type: "select",
          required: true,
          getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
            var listData: any[] = [{ value: 'CASH', label: 'Cash' }, { value: 'CARD', label: 'Card' }, { value: 'REV', label: 'Revolut' }]
            resolve(listData)
          }),
          gridXS: 12, gridMS: 12,
        },
        {
          accessorKey: 'salesValue',
          label: 'Sales',
          name: '',
          type: "number",
          required: true,
          value: sales,
          gridXS: 12, gridMS: 6,
        },
        {
          accessorKey: 'paidValue',
          label: 'Value Paid',
          name: '',
          type: "number",
          value: valuePaid,
          required: true,
          setValue: (value) => setValuePaid(value),
          gridXS: 12, gridMS: 6
        },
      ]}
        open={open}
        onClose={() => onClose()}
        onSubmit={(values) => onSubmit(values)}
        grid={true}
        title="Pay Items"
      />
    </>
  )
}