
import prisma from "../lib/prisma.js";
import bcrpyt from "bcrypt";

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        const data = users.map(user => {
            const { password, ...usersData } = user;
            return usersData;
        })
        res.status(200).json(data)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get Users" })
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id }
        })

        const { password, ...userData } = user;
        res.status(200).json(userData)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get User" })
    }
};

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorised" })
    }

    let updatedPassword = null;
    try {
        if (password) {
            updatedPassword = await bcrpyt.hash(password, 10)
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && { avatar })
            }
        })
        const { password: userPassword, ...input } = updatedUser

        res.status(200).json(input)

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update User" })
    }
};

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorised" })
    }

    try {
        await prisma.user.delete({
            where: { id }
        })

        res.status(200).json({message: "User deleted successfully"})
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete User" })
    }
};