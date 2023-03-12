import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider } from "@mui/material"
import { useState } from "react";
import { theme } from "../lib/theme";
import Resizer from "react-image-file-resizer";
import { storage } from "../lib/firebase";
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";


interface AvatarModalProps {
  onClose: () => void;
  onSubmit: (value: any) => void;
  open: boolean;
  nameFile: string;
}

const resizeFile = (file:File)=>
  new Promise(resolve => {
    Resizer.imageFileResizer(file, 300, 300, "JPEG", 100, 0, uri => {
      resolve(uri)
    });
});

export const downloadAvatar = (fileName: string) => {
  var url = `gs://cheekypups-42685.appspot.com/profile/${fileName}.jpg`
  const gsReference = ref(storage, url);
  getDownloadURL(gsReference).then(url => {
    console.log(url)
    return url
    // Insert url into an <img> tag to "download"
  }).catch(error => {
    console.log(error)
    return null
  })
}

export const AvatarModal = ({
  open,
  onClose,
  onSubmit,
  nameFile
}: AvatarModalProps) => {

  const [image, setImage] = useState<any | null>(null)
  const [url, setUrl] = useState<any | null>(null)

  function handleChange(selectorFiles: FileList | null){
    if(selectorFiles != null) {
      setUrl(URL.createObjectURL(selectorFiles[0]))
      setImage(selectorFiles[0])
      /*resizeFile(selectorFiles[0]).then(resolve => {
        setImage(resolve)
        setUrl(resolve)
      }).catch(error => {
        console.log(error)
      })*/
    }
  }

  function handleSubmit() {
    const storageRef = ref(storage, `profile/${nameFile}.jpg`);
    console.log(storageRef)
    const metadata = {
      contentType: 'image/jpeg',
    };
    // Upload the file and metadata
    const uploadTask = uploadBytes(storageRef, image, metadata).then(resolve => {
      console.log(resolve)
      setUrl(downloadAvatar(nameFile))
      toast.success(`Updated image: ${nameFile}.jpg`, { position: "top-center", autoClose: 1000, })
      
    }).catch(error => {
      console.log(error)
      toast.error(`Error in upload image`, { position: "top-center", autoClose: 5000, })
      onClose()
    })
  }

  return (
    <ThemeProvider theme={theme}>
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            margin: "auto",
            maxWidth: "500px",  // Set your width here
          },
        },
      }}>
      <DialogTitle id="responsive-dialog-title">
        {"Profile"}
      </DialogTitle>
      <DialogContent>
          <Box className="flex w-full flex-col items-center">
            <Avatar sx={{ width: 250, height: 250 }} src={`${url}`}/>
            <input type="file" className="mt-5" accept="image/*"
            onChange={ (e) => handleChange(e.target.files) }/>
          </Box>
      </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} autoFocus>
        Change Profile
      </Button>
    </DialogActions>
  </Dialog>
  </ThemeProvider>
  )
}