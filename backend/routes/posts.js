const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createPost", upload.array("file", 5), postsController.createPost);

router.put("/likePost/:id", postsController.likePost);
router.put("/savePost/:id", postsController.savePost);

router.patch("/editPost/:id", postsController.editPost);

router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
