import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    pic:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
    }
},{timestamps:true});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
  };

userSchema.pre('save', async function (next){
    if(!this.modified){
        next()
    }
    this.password = bcryptjs.hashSync(this.password, 10);
})

const User = mongoose.model("User", userSchema)

export default User;