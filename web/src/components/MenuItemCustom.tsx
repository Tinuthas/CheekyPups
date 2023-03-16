import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PaidIcon from '@mui/icons-material/Paid';
import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DeleteModal } from './DeleteModal';
import { ColumnHeader, EditNewModal } from './EditModal';

interface MenuItemProps {
  children: JSX.Element | JSX.Element[];
  handleDelete: (id:number) => void,
  handleEdit: (id:number) => void,
  handlePaid: (id:number) => void,
  paid: boolean,
  id: number,
  getAttendance: (id:number) => void,
  editData: ColumnHeader[],
}

export default function MenuItemCustom({children, handleDelete, handleEdit, handlePaid, editData, id, paid, getAttendance}: MenuItemProps) {
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
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
  };

  const handleDeleteOpen = (event: Event | React.SyntheticEvent) => {
    setOpenDelete(true)
    handleClose(event)
  }

  const handlePaidOpen = (event: Event | React.SyntheticEvent) => {
    handlePaid(id)
    handleClose(event)
  }

  const handleDeleteClose = (event: Event | React.SyntheticEvent) => {
    setOpenDelete(false)
    handleDelete(id)
  }
  const handleEditOpen = (event: Event | React.SyntheticEvent) => {
    setOpenEdit(true)
    handleClose(event)
  }
  const handleEditClose = (event: Event | React.SyntheticEvent) => {
    setOpenDelete(false)
    handleEdit(id)
  }

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
      <Button
        className='w-[90px]'
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        {children}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        style={{zIndex: 100}}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  
                >
                  <MenuItem onClick={handleEditOpen}>
                    <ListItemIcon>
                    <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleDeleteOpen}>
                    <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handlePaidOpen}>
                    <ListItemIcon>
                      <PaidIcon fontSize="small" color={`${paid ? 'success' : 'inherit'}`} />
                    </ListItemIcon>
                    <ListItemText>Pay</ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      { openDelete ?
        <DeleteModal 
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onSubmit={handleDeleteClose}
        /> : null
      }
      {
        openEdit ? 
        <EditNewModal 
          columns={editData}
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          onSubmit={handleEditClose}
          callInit={() => getAttendance(id)}
        /> : null
      }
    </div>
  );
}