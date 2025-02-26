import asyncHandler from 'express-async-handler';
import User from '../model/userModel.js';

export const registerUser = asyncHandler( async () => {
    const {name, email, password, pic} = req.body

    if(!name || !email || !password){
        res.status(400);
        throw new Error("All fields are required");
    }
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if(user){
        res.status(201).json({
            _id:user._id,
            name: user.name,
            email:user.email,
            pic:user.pic,
        })
    }
    else{
        throw new Error("Failed to Create the user");
    }
});

