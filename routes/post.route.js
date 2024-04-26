import express from "express";

const router = express.Router();

router.get("/", getPosts)
router.get("/:id", getPost)
router.post("/", addPost)
router.put("/", updatePost)
router.delete("/", deletePost)

export default router;