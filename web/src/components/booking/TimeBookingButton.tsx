
import React from 'react';
import { RemindersModal } from './RemindersModal';
import { TimeBookingModal } from './TimeBookingModal';

interface TimeBookingButtonProps {
  children: JSX.Element | JSX.Element[];
  onClose: () => void;
  bookingId: number,
  time: string,
  onSubmit: (values:any) => any
}

export default function TimeBookingButton({children, bookingId, time, onSubmit, onClose}: TimeBookingButtonProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    

    setOpen(false);
    onClose()
  };


  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <div >
      <button
        ref={anchorRef}
        id="reminder-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        className='select-text'
      >
        {children}
      </button>

      {
        open ? 
          <TimeBookingModal
            key={bookingId}
            open={open}
            onClose={() => {
              handleClose()
            }}
            bookingId={bookingId}
            time={time}
            onSubmit={(values) => onSubmit(values) }
          />: null
      }
    </div>
  );
}