import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";

interface EditCancelProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  ownerDog: { id: number, notes: string },

}

export const EditCancel = ({
  open,
  onClose,
  onSubmit,
  ownerDog
}: EditCancelProps) => {

  const [notes, setNotes] = useState(ownerDog.notes)

  return (
    <>
      <CreateNewModal
        key={"EditingCancelModal"}
        title="Booking Cancellation"
        columns={[

          {
            accessorKey: 'id',
            label: '',
            name: '',
            type: "number",
            value: ownerDog.id,
            noEdit: true,
            noShow: true,
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'notes',
            label: 'Reason',
            name: '',
            type: "text",
            value: notes,
            required: true,
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