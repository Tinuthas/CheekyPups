import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
//import '../styles/alertstyles.css';
import { Delete } from '@mui/icons-material';

const AlertDialogDelete = () => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <button className="">Delete account</button>
      <Delete />
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="AlertDialogOverlay" />
      <AlertDialog.Content className="AlertDialogContent">
        <AlertDialog.Title className="AlertDialogTitle">Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description className="AlertDialogDescription">
          This action cannot be undone. This will permanently delete your information and remove your
          data from our servers.
        </AlertDialog.Description>
        <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
          <AlertDialog.Cancel asChild>
            <button className="">Cancel</button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button className="">Yes, delete account</button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default AlertDialogDelete;