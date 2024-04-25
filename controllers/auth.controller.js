import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Register endpoint
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // HASH the password

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user and save to DB
        const newUser = await prisma.user.create(
            {
                data: {
                    username,
                    email,
                    password: hashedPassword
                },
            }
        );

        console.log(newUser);
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).json("Failed to create user!");
    }

}

// login endpoint
export const login = async (req, res) => {
    const { username, password } = req.body;


    try {
        // VALIDATE INPUT FIELDS
        if (!username || !password) {
            return res.status(404).json("please all fields must be filled")
        }
        // CHECK IF USER EXISTS
        const user = await prisma.user.findUnique({
            where: { username }
        });
        if (!user) {
            return res.status(401).json("Invalid Credentials")
        }
        //CHECK IF USER PASSWORD IS CORRECT
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json("Invalid credentials");
        }
        //GENERATE COOKIE TOKEN AND SEND IT TO THE USER
        const age = 1000 * 60 * 60 * 24 * 7
        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_KEY, {expiresIn: age})

        
        res
        .cookie("token", token, {
            httpOnly: true,
            //secure: true,
            maxAge: age
        })
        .status(200).json("Login successful")


    } catch (err) {
        console.log(err);
        res.status(500).json(("Failed to log in"))
    }
}

// ENDPOINT FOR LOGOUT
export const logout = (req, res) => {
res.clearCookie("token").status(200).json({message: "Logged out successfully"})
}