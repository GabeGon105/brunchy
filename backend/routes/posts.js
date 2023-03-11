const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

// router.post("/createPost", upload.single("file"), postsController.createPost);
router.post("/createPost", upload.array("file", 5), postsController.createPost);

router.put("/likePost/:id", postsController.likePost);
router.put("/savePost/:id", postsController.savePost);

router.delete("/deletePost/:id", postsController.deletePost);
router.patch("/editPost/:id", postsController.editPost);

module.exports = router;
