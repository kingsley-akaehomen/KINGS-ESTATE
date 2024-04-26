import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
     //CHECK FOR TOKEN
    if (!token) return res.status(401).json({ message: "Not Authenticated" });

    //VERIFY THE TOKEN
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(403).json({ message: "token not valid" })
        req.userId = payload.id;

        next();
    })


};