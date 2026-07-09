import express from "express"
import { config } from "../config.mjs"
import * as authRepository from "../repository/auth.mjs"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// 중복 확인
export async function checkId(req, res) {
    const userid = req.query.userid

    const found = await authRepository.findByUserid(userid)

    if (found) {
        return res.json({
            success: false,
            message: "이미 사용 중인 아이디입니다. 다시 입력해주세요."
        })
    }
    res.json({
        success: true,
        message: "사용 가능한 아이디입니다."
    })
}

// 회원가입
export async function signup(req, res) {
    const {userid, userpw, nickname, username, email, userType} = req.body

    // 중복 id 체크
    const found = await authRepository.findByUserid(userid)
    if(found){
        return res.status(409).json({message: `${userid}는 이미 존재하는 id입니다.`})
    }
    // 비밀번호 해쉬화
    const hashed = bcrypt.hashSync(userpw, config.bcrypt.saltRounds)

    // 회원가입
    const userInsertedId = await authRepository.createUser(
        { userid, userpw: hashed, nickname, username, email, userType, createdAt: new Date() }
    )

    // 가입완료 후
    const token = await createJwtToken(userInsertedId)

    // 출력용
    console.log("회원가입 성공 및 토큰 발급 완료")
    res.status(201).json({token, userInsertedId})
}

// 로그인
export async function login(req, res) {
    const {userid, userpw} = req.body
    const user = await authRepository.findByUserid(userid)
    if(!user){
        return res.status(401).json({message: "존재하지 않는 아이디 입니다. 다시 입력해주세요."})
    }
    
    const isValidPassword = await bcrypt.compare(userpw, user.userpw)
    if(!isValidPassword){
        return res.status(401).json({message: "비밀번호가 맞지 않습니다. 다시 입력해주세요."})
    }

    const token = await createJwtToken(user.id)
    
    res.status(200).json({
        token,
        userid: user.userid,
        nickname: user.nickname,
        userType: user.userType
    })
}

// 로그인 유지 체크
export async function me(req, res) {
    const user = await authRepository.findById(req.id)
    if(!user){
        return res.status(404).json({message: "일치하는 사용자가 없습니다."})
    }
    res.status(200).json({token: req.token, userid: user.userid})
}

// 토큰 생성
async function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresInSec
    })
}            