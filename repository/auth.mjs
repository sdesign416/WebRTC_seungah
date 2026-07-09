import MongoDB from "mongodb"
import {getUsers} from "../db/database.mjs"

const ObjectId = MongoDB.ObjectId

// id 중복확인
export async function findByUserid(userid) {
    return getUsers().find({userid}).next().then(mapOptionalUser)
}

// 회원가입 시 호출 할 함수
export async function createUser(user) {
    return getUsers().insertOne(user).then((result) => result.insertedId.toString())
}

// ObjectId 받아옴
export async function findById(id) {
    return getUsers().find({_id: new ObjectId(id)}).next().then(mapOptionalUser)
}

// userid가 있으면 객체형식으로 반환, 없으면 null
function mapOptionalUser(user){
    return user ? {...user, id:user._id.toString()} : user
}