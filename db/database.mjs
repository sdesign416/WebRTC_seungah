import MongDB from "mongodb"
import {config} from "../config.mjs"

let db

// 서버연결, 사용 데이터베이스 선택
export async function connectDB() {
    return MongDB.MongoClient.connect(config.db.host).then((client) => {
            db = client.db("webrtcdb")
    })
    
}

// DB 저장된 users 컬렉션 접근 객체 반환
export function getUsers() {
    return db.collection("users")
}
