// multer make parcing for file upload

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
export const upload = (fileType,folder) =>{
    // diskStorage
    const storage = diskStorage({
        destination:(req, file, cb) => { 
            const folderPath = path.resolve("." , `${folder}/${req.user._id}` )

            if(fs.existsSync(folderPath)){
                return cb(null,folderPath);
            }else{
                fs.mkdirSync(folderPath,{recursive:true});
                const filename =`${folder}/${req.user._id}`;
                cb(null,filename);
            }
        },

        filename: (req, file, cb) => {
            cb(null,nanoid() +"___"+ file.originalname)
        }
})

const fileFilter = (req, file, cb) => {
    if ( !fileType.includes(file.mimetype) ) 
        return cb(new Error("invalid file type! "), false);

    return cb(null, true);
  };

const multerUpload = multer({storage, fileFilter});

return multerUpload;


}