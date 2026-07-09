/*
    .env에 저장된 환경변수를 읽어서 프로젝트 전체에서 사용하기 편하게 정리하고, 필수 설정값이 제대로 있는지 검사하는 파일
*/

import dotenv from "dotenv"
dotenv.config()

// 검증함수
function required(key, defaultValue=undefined){
    const value = process.env[key] || defaultValue
    if(value == null){
        throw new Error(`키 ${key}는 undefined`)
    }
    return value
}

// 외부에서 사용가능한 객체생성
export const config = {
    jwt: {
        secretKey: required("JWT_SECRET"),
        expiresInSec: parseInt(required("JWT_EXPIRES_SEC"))
    },
    bcrypt: {
        saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 10)) // 기본값 10
    },
    host: {
        port: parseInt(required("HOST_PORT", 3000))
    },
    db: {
        host: required("DB_HOST")
    }
}