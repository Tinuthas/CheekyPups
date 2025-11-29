import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";

interface EditNotesProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  ownerDog: { id: number, notes: string, job: string },

}

export const EditNotes = ({
  open,
  onClose,
  onSubmit,
  ownerDog
}: EditNotesProps) => {

  const [notes, setNotes] = useState(ownerDog.notes)
  const [job, setJob] = useState(ownerDog.job)

  return (
    <>
      <CreateNewModal
        key={"EditingNotesModal"}
        title="Edit Notes"
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
            accessorKey: 'job',
            label: '',
            name: '',
            type: "radio",
            value: job,            
            radioListValues: [
              { key: "fullGroom", value: "FG", label: "Full Groom" },
              { key: "washDry", value: "WD", label: "Wash/Dry" },
              { key: "tidyUp", value: "TU", label: "Tidy Up" },
              { key: "nails", value: "N", label: "Nails" },
            ],
            setValue: (value) => setJob(value),
            gridXS: 12, gridMS: 12,
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