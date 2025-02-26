import mongoose,  {Schema , Types, model} from "mongoose";
import { hash } from "../../utils/hashing/hash.js";

export const genderType= {
    male: "male",
    female: "female"
}

export const roleType= {
    superAdmin: "superAdmin",
    User: "User",
    Admin: "Admin"
}

export const providersTypes = {
    Google:"Google",
    System:"System"
}

export const defaultImage = "upload\\defaultProfileImage.jpeg"  //diskstorage

export const defaultImageCloud = 
"https://res.cloudinary.com/dyjdubtia/image/upload/v1740098683/defaultProfileImage_uh9soq.jpg"

export const defaultPublicIdCloud = "defaultProfileImage_uh9soq"

const userSchema = new Schema({
    userName: {
        type:String,
        required:true,
        minLength:[3,"User name must be at least 3 characters long"],
        maxLength:[20,"User name must be at most 20 characters long"],
        trim : true,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique : [true,"email must be unique"],
        lowercase:true,
        trim:true,
    },
    password : {
        type:String,
    },
    providers :{
        type: String,
        enum: Object.values(providersTypes),
        default:providersTypes.System
    },
    phone:String,
    address:String,
    DOB: Date,

    // work on cloud
    image: {
        secure_url: {
            type: String,
            default: defaultImageCloud
        },
        public_id: {
            type: String,
            default: defaultPublicIdCloud
        }
    },

    //work on diskstorage
   // image: {
   //     type: String,
   //     default: defaultImage
   // },
   // coverImage:[String],
    gender: {
        type: String,
        enum: Object.values(genderType),
        default:genderType.male,
    },
    role: {
        type: String,
        enum: Object.values(roleType),
        default:roleType.User,
    },
    confirmEmail:{
        type : Boolean,
        default: false
    },
    isDeleted:{
        type : Boolean,
        default: false
    },
    changeCredentials: Date,
    forgetPaswordOTP: String,
    confirmEmailOTP:String,
    viewers :[
        {
            userId: {type: Types.ObjectId , ref:"User"},
            time:Date,
        }
    ],

    tempEmail: String,
    tempEmailOTP: String,
},{timestamps:true})

userSchema.pre("save",function(next){

    if(this.isModified("password")) 
    {
        this.password = hash({plainText:this.password})
    }
    return next()
})
export const UserModel = mongoose.models.User || model("User",userSchema)