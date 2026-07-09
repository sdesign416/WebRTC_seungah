
// id 중복확인 변수
let idCheck = false

// id바꾸면 중복확인 초기화
window.onload = function () {
    const userid = document.getElementById("userid")
    const duplBtn = document.getElementById("duplBtn")

    // 아이디 입력값 변경 시 초기화
    userid.addEventListener("input", () => {
        idCheck = false

        duplBtn.disabled = false
        duplBtn.value = "중복확인"
        duplBtn.style.backgroundColor = ""
        duplBtn.style.color = ""
        userid.style.border = ""
    })
    
    // 폼 이동 막음
    document.getElementById("signupForm").addEventListener("submit", async(e) => {
        // 폼이 원래 하던 페이지 이동.제출 막고
        e.preventDefault()
        // 만든 로그인 함수 실행
        await sendit()
    })
}

// 중복확인 버튼 함수
async function duplCheck() {
    const userid = document.getElementById("userid")
    const exuserid = /^[A-Za-z0-9]{4,20}$/

    if (userid.value === "") {
        alert("아이디를 입력하세요.")
        userid.focus()
        return
    }

    if (!exuserid.test(userid.value)) {
        alert("아이디는 4글자 이상 20자 이하의 영문 또는 숫자로 입력하세요.")
        userid.focus()
        return
    }
    
    try {
        const response = await fetch(`/auth/checkId?userid=${encodeURIComponent(userid.value)}`)
        const result = await response.json()

        // controller checkId()에서 메시지 받아옴
        alert(result.message)

        // 중복확인 상태에 따라 스타일 변경
        const duplBtn = document.getElementById("duplBtn")
        if (result.success) {
            // 확인 성공(중복 없음)
            idCheck = true
            duplBtn.disabled = true
            duplBtn.value = "확인완료"
            duplBtn.style.backgroundColor = "green"
            duplBtn.style.color = "white"
            userid.style.border = "2px solid green"
        } else {
            // 확인 실패(중복 발견)
            idCheck = false
            userid.style.border = "2px solid red"
            userid.focus()
        }
    } catch (err) {
        console.error(err)
        alert("중복확인 중 오류가 발생했습니다.")
    }
}

// 회원가입
async function sendit(){
    const userid = document.getElementById("userid")
    const userpw = document.getElementById("userpw")
    const userpw_re = document.getElementById("userpw_re")
    const nickname = document.getElementById("nickname")
    const username = document.getElementById("username")
    const email = document.getElementById("email")
    // 체크된 userType값만 가져옴
    const userType = document.querySelector("input[name='userType']:checked")

    // [입력값 패턴 지정]
    const exuserid = /^[A-Za-z0-9]{4,20}$/
    const exuserpw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/
    const exusername = /^[가-힣]+$/
    const exemail = /^[A-Za-z0-9\-\.]+@[A-Za-z0-9\-]+\.[A-Za-z]+$/


    // [입력값 검사]
    if (userid.value === "") {
        alert("아이디를 입력하세요.")
        userid.focus()
        return false
    }

    if (!exuserid.test(userid.value)) {
        alert("아이디는 4글자 이상 20자 이하의 영문 또는 숫자로 입력하세요.")
        userid.focus()
        return false
    }

    if (!idCheck) {
        alert("아이디 중복확인을 해주세요.")
        userid.focus()
        return false
    }

    if (!exuserpw.test(userpw.value)) {
        alert("비밀번호는 8자 이상 20자 이하의 영문자, 숫자, 특수문자를 한 자 이상 꼭 기입해야 합니다.")
        userpw.focus()
        return false
    }

    if (userpw.value !== userpw_re.value) {
        alert("비밀번호가 일치하지 않습니다.")
        userpw_re.focus()
        return false
    }

    if (nickname.value === "") {
        alert("닉네임을 입력하세요.")
        nickname.focus()
        return false
    }

    if (!exusername.test(username.value)) {
        alert("이름은 한글로 입력해야합니다.")
        username.focus()
        return false
    }

    if (!exemail.test(email.value)) {
        alert("이메일 형식을 다시 확인하세요.")
        email.focus()
        return false
    }

    if (!userType) {
        alert("선생님 또는 학생을 선택하세요.")
        return false
    }

    // GPT
    const res = await fetch("/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            userid: userid.value,
            userpw: userpw.value,
            nickname: nickname.value,
            username: username.value,
            email: email.value,
            userType: userType.value
        })
    })

    const data = await res.json()

    if (!res.ok) {
        alert(data.message || "회원가입에 실패하였습니다.")
        return false
    }

    alert("회원가입이 완료되었습니다.")
    window.location.href = "/login.html"
}
