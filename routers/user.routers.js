import { Router } from "express";
import { changePassword, forgotPassword, getProfile, login, logout, register,resetPassword, updateUser } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router()

router.post('/register',upload.single("avatar"),register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/me',isLoggedIn,getProfile)
router.post('/forgotPassword',forgotPassword)
router.post('/resetPassword/:resetToken',resetPassword)
router.post('/changePassword',isLoggedIn,changePassword)
router.put('/update/:id',isLoggedIn,upload.single('avatar'),updateUser)

export default router;