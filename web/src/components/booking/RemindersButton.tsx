
import React from 'react';
import { RemindersModal } from './RemindersModal';

interface RemindersButtonProps {
  children: JSX.Element | JSX.Element[];
  onClose: () => void;
  id: number,
  bookingId: number
}

export default function RemindersButton({children, id, bookingId, onClose}: RemindersButtonProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

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
        onDoubleClick={handleToggle}
        className='select-text'
      >
        {children}
      </button>

      {
        open ? 
          <RemindersModal
            key={id}
            open={open}
            onClose={(e: Event | React.SyntheticEvent<Element, Event>) => {
              handleClose(e)
            }}
            infoData={{ ownerId: id, bookingId: bookingId }}
          />: null
      }
    </div>
  );
}