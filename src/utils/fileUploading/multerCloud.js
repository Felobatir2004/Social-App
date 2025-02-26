import multer , {diskStorage} from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
export const fileValidation = {
    images:["image/jpeg", "image/jpg", "image/png"],
    files:["application/pdf"],
    videos:["video/mp4"],
    audios:["audio/mpeg"],
}
export const uploadCloud = () =>{
    // diskStorage
    const storage = diskStorage({})


const multerUpload = multer({storage});

return multerUpload;


}