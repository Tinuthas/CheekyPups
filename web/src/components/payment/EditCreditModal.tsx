import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {api, getToken} from "../../lib/axios";
import { AxiosError } from "axios";

interface EditCreditModalProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  ownerDog: { id: number, credit: number},

}

export const EditCreditModal = ({
  open,
  onClose,
  onSubmit,
  ownerDog
}: EditCreditModalProps) => {

  const [id, setId] = useState(ownerDog.id)
  const [credit, setCredit] = useState(ownerDog.credit)


  return (
    <>
      <CreateNewModal
        key={"FinishingCreateModal"}
        columns={[
          {
            accessorKey: 'id',
            label: 'id',
            name: '',
            type: "number",
            value: id,
            noEdit: true,
            noShow: true,
            gridXS: 12, gridMS: 6,
          },
        {
          accessorKey: 'credit',
          label: 'Credit',
          name: '',
          type: "number",
          required: true,
          value: credit,
          setValue: (value) => setCredit(value),
          gridXS: 12, gridMS: 12,
        }
      ]}
        open={open}
        onClose={() => onClose()}
        onSubmit={(values) => onSubmit(values)}
        grid={true}
        title="Edit Credit"
      />
    </>
  )
}