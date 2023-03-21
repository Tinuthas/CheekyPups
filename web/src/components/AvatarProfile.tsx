import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider } from "@mui/material"
import { useState } from "react";
import { theme } from "../lib/theme";
import Resizer from "react-image-file-resizer";
import { storage } from "../lib/firebase";
import { toast } from 'react-toastify';
import { api, getToken } from '../lib/axios';
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { Loading } from "./Loading";
import { imageResize } from "../utils/Resizer"


interface AvatarModalProps {
  onClose: () => void;
  onSubmit?: (value: any) => void;
  open: boolean;
  nameFile?: string;
  avatarUrl: string | null;
  name: string;
  id?: number;
}

const resizeFile = (file:File)=>
  new Promise(resolve => {
    Resizer.imageFileResizer(file, 300, 300, "JPEG", 75, 0, uri => {
      resolve(uri)
    }, "file", 100, 100);
});

export const downloadAvatar = (fileName: string) => {
  var url = `gs://cheekypups-42685.appspot.com/profile/${fileName}.jpg`
  const gsReference = ref(storage, url);
  return new Promise(resolve => {
    getDownloadURL(gsReference).then(url => {
      console.log(url)
      resolve(url)
      // Insert url into an <img> tag to "download"
    }).catch(error => {
      throw new Error(`Error download avatar image`);
    })
  })
}

export const AvatarModal = ({
  open,
  onClose,
  onSubmit,
  nameFile,
  avatarUrl,
  name,
  id,
}: AvatarModalProps) => {

  const [image, setImage] = useState<any | null>(null)
  const [url, setUrl] = useState<any | null>(avatarUrl)
  const [loading, setLoading] = useState(false)

  function handleClose() {
    setLoading(false)
    onClose()
  }

  function handleChange(selectorFiles: FileList | null){
    if(selectorFiles != null) {
      setUrl(URL.createObjectURL(selectorFiles[0]))

      imageResize(selectorFiles[0]).then(resolve => {
        setImage(resolve)
      }).catch(error => {
        console.log(error)
        toast.error(`Error resize image`, { position: "top-center", autoClose: 5000, })
      })
      /*resizeFile(selectorFiles[0]).then(resolve => {
        setImage(resolve)
      }).catch(error => {
        console.log(error)
        toast.error(`Error resize image`, { position: "top-center", autoClose: 5000, })
      })*/
    }
  }

  function handleSubmit() {
    setLoading(true)
    const storageRef = ref(storage, `profile/${nameFile}.jpg`);
    const metadata = {
      contentType: 'image/jpeg',
    };
    if(nameFile == undefined || onSubmit == undefined || id == undefined) {
      handleClose()
      return
    }
    const uploadTask = uploadBytes(storageRef, image, metadata).then(resolve => {
      downloadAvatar(nameFile).then(resolveDownload => {
        var avatar = { avatarUrl: resolveDownload }
        api.put('dogs/profile', avatar, {
          params: {
            id: Number(id)
          },
          headers: {
            Authorization: getToken()
          }
        }).then(resolve => {
          setLoading(false)
          onSubmit(avatar)
          toast.success(`Updated image: ${nameFile}.jpg`, { position: "top-center", autoClose: 1000, })
        }).catch(error => {
          toast.error(`Error in save avatar profile`, { position: "top-center", autoClose: 5000, })
          handleClose()
        })
      }).catch(error => {
        toast.error(`Error in upload image`, { position: "top-center", autoClose: 5000, })
        handleClose()
      })
    }).catch(error => {
      toast.error(`Error in upload image`, { position: "top-center", autoClose: 5000, })
      handleClose()
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
        {`${name}`}
      </DialogTitle>
      <DialogContent>
          <Box className="flex w-full flex-col items-center">
            <Avatar sx={{ width: 250, height: 250 }} src={`${url}`}/>
            {onSubmit != undefined ?
              <input className="relative m-0 mt-5 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding py-[0.32rem] px-3 text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none" 
              type="file" accept="image/*" onChange={ (e) => handleChange(e.target.files) }/>
            :null}
          </Box>
      </DialogContent>
    <DialogActions>
      { loading ? <div className="w-full flex justify-center"><Loading pink={true} /> </div> :
      onSubmit != undefined ?
        <>
          <Button autoFocus onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} autoFocus>
            Change Profile
          </Button>
        </>
      :<>
        <Button autoFocus onClick={onClose}>
          Back
        </Button>
      </>}
      
    </DialogActions>
  </Dialog>
  </ThemeProvider>
  )
}