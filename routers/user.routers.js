import { Router } from "express";
import { getProfile, login, logout, register } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/me',isLoggedIn,getProfile)


export default router;