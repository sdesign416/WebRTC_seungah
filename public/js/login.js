// GPT: form 기본제출대신 JavaScript fech()로 서버 요청
window.onload = function() {
    document.getElementById("loginForm").addEventListener("submit", async(e) => {
        // 폼이 원래 하던 페이지 이동.제출 막고
        e.preventDefault()
        // 만든 로그인 함수 실행
        await sendit()
    })
}

async function sendit() {
    const userid = document.getElementById("userid")
    const userpw = document.getElementById("userpw")

    // 아이디를 입력하지 않은 경우
    if(userid.value === "") {
        alert("아이디를 입력하세요")
        userid.focus()
        return false
    }

    // 비밀번호를 입력하지 않은 경우
    if(userpw.value === "") {
        alert("비밀번호를 입력하세요")
        userpw.focus()
        return false
    }

    // 서버로 로그인 요청 전송
    try{
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userid: userid.value,
                userpw: userpw.value
            })
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.error || "아이디 또는 비밀번호가 일치하지 않습니다")
            return false
        }

        console.log("1")
        alert("로그인 성공")

        // 로그인 성공 후 토큰저장, 각 userType에 맞게 페이지 이동
        localStorage.setItem("token", data.token)
        localStorage.setItem("userType", data.userType)
        console.log("2")

        if (data.userType === "teacher") {
            window.location.href = "/teacherLobby.html"
        } else if (data.userType === "student") {
            window.location.href = "/studentLobby.html"
        } else {
            alert("사용자 유형을 확인할 수 없습니다.")
        }

        return false

    } catch (err) {
        console.error(err)
        alert("서버와 통신 중 오류가 발생했습니다")
        return false
    }
}