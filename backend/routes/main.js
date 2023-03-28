const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get('/api/user', authController.getUser);
router.put("/api/editUser", upload.single("file"), authController.editUser);
router.put("/api/followUser/:id", authController.followUser);
router.get("/api/profile/:id", ensureAuth, postsController.getProfile);
router.get("/api/notifications", ensureAuth, authController.getNotifications);
router.patch("/api/notifications/read/:id", authController.readNotifications);
router.patch("/api/notifications/readAll", authController.readAllNotifications);
router.delete("/api/notifications/delete/:id", authController.deleteNotification);
router.delete("/api/notifications/deleteAll", authController.deleteAllNotifications);
router.get("/api/feed", ensureAuth, postsController.getFeed);
router.get("/api/saved", ensureAuth, postsController.getSaved);
router.get("/api/search/:searchText", ensureAuth, postsController.getSearch);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.post("/signup", authController.postSignup);

module.exports = router;