import express from "express"
import * as authController from "../controller/auth.mjs"
import {isAuth} from "../middleware/auth.mjs"

const router = express.Router()

// 아이디 중복 확인
router.get("/checkId", authController.checkId)

// 회원가입
router.post("/signup", authController.signup)

// 로그인
router.post("/login", authController.login)

// 로그인 유지체크
router.get("/me", isAuth, authController.me)

export default router