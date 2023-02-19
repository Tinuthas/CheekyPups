import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Button } from './Button'
import '../styles/alertstyles.css'

interface AlertProps {
  title: string;
  description: string;
  textButton: string;
  onClick: () => void;
}

export function AlertConfirm({title, description, textButton, onClick}:AlertProps) {
  return (
    <AlertDialog.Root >
    <AlertDialog.Trigger asChild>
      <Button text={textButton}  onClick={onClick}/>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="AlertDialogOverlay" />
      <AlertDialog.Content className="AlertDialogContent">
        <AlertDialog.Title className="AlertDialogTitle">{title}</AlertDialog.Title>
        <AlertDialog.Description className="AlertDialogDescription">
          {description}
        </AlertDialog.Description>
        <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
          <AlertDialog.Cancel asChild>
            <button className="Button mauve">Cancel</button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button className="Button red">Yes</button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
  )
}