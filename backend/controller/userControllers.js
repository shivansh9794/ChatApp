import asyncHandler from 'express-async-handler';
import User from '../model/userModel.js';
import generateToken from '../config/generateToken.js';

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
        })
    }
    else {
        throw new Error("Failed to Create the user");
    }
});

export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
})

// we are going to use queries 
export const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                // { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    console.log(keyword);


    const users = await User.find(keyword)
    // .find({ _id: { $ne: req.user._id } })  // add it when you want to 

    res.send(users)
});


export const deleteUser = asyncHandler(async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send({ message: "User deleted", user });
    } catch (error) {
        res.status(500).send({ message: "Error deleting user", error });
    }
    
});