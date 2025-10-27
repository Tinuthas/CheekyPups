import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";

interface EditPaymentProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  payInfo: { id: number, description: string, sales: string, valuePaid?: string, paid: boolean, type?: string },

}

export const EditPayment = ({
  open,
  onClose,
  onSubmit,
  payInfo
}: EditPaymentProps) => {

  const [description, setDescription] = useState(payInfo.description)
  const [sales, setSales] = useState(payInfo.sales)
  const [valuePaid, setValuePaid] = useState(payInfo.valuePaid)
  const [paidField, setPaidField] = useState(payInfo.paid)

  return (
    <>
      <CreateNewModal
        key={"EditingPaymentModal"}
        title="Edit Payment"
        columns={[
          {
            accessorKey: 'id',
            label: '',
            name: '',
            type: "number",
            value: payInfo.id,
            noEdit: true,
            noShow: true,
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'sales',
            label: 'Sales',
            name: '',
            type: "number",
            value: sales,
            setValue: (value) => setSales(value),
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
            accessorKey: 'description',
            label: 'Description',
            name: '',
            type: "text",
            value: description,
            setValue: (value) => setDescription(value),
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