const loginSubmit = document.querySelector(".login-submit");
const signupSubmit = document.querySelector(".signup-submit");
const authLoader = document.querySelectorAll(".personal expense tracker-loader");
const authErr = document.querySelectorAll(".personal expense tracker-err"); 
const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");

const reSendTemplate = '<div class="re-send-msg">Please Verify the Email</div><button class="btn resend-btn">Resend</button><div class="msg"></div>'

let isFormBtnEnalbed = true;
let isResendBtnEnabled = true;
let intervalUid = 0;

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if(!isFormBtnEnalbed)
        return

    toggleLoader(1, loginSubmit, authLoader[0]);

    const req_data = {
        email: e.target[0].value,
        password: e.target[1].value
    }
    const res = await fetch(endpoint.login, {
        method:"POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req_data)
    });
    const res_data = await res.json();
    console.log(res)
    if(res.status === 401){
        console.log('data', res_data)
        const cnt = document.querySelector(".personal expense tracker application-container")
        cnt.innerHTML = reSendTemplate;

        document.querySelector(".resend-btn").addEventListener("click", resendMail.bind(null, req_data.email));
        enable_next_resend(res_data["next_resend"]);
        
    }
    else if(res.status !== 200){
        showMessage(personal expense tracker applicationErr[0], res_data.message);
        toggleLoader(0, loginSubmit, authLoader[0]);
    }
    else{
        window.location.href = "personal expense tracker application.html"
    }
});

const enable_next_resend = (next_resend_ts) => {
    const next_resend = (new Date(next_resend_ts)).getTime();
    const now = (new Date()).getTime();
    const diff = next_resend - now;
    console.log(diff)
    if(diff <= 0)
    {
        return;
    }
    
    let seconds = Math.floor((diff/1000));
    console.log(seconds)
    const btn = document.querySelector(".resend-btn");
    btn.disabled = true;
    const msg = document.querySelector(".msg");
    msg.innerText = `Wait: ${seconds--}`
    isResendBtnEnabled = false;
    intervalUid = setInterval(() => {
        if(seconds === 0){
            btn.disabled = false;
            isResendBtnEnabled = true;
            clearInterval(intervalUid);
            msg.innerText = '';
            return;
        }
        msg.innerText = `Wait: ${seconds--}`;
    }, 1000);
}

const resendMail = async (email) => {
    console.log(isResendBtnEnabled);
    if(!isResendBtnEnabled)
        return
    isResendBtnEnabled = false;
    const res = await fetch(endpoint.resendMail + `?email=${email}`, {
        method: "GET"
    });
    const res_data = await res.json();
    console.log(res, res_data);
    enable_next_resend(res_data["next_resend"]);
}

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if(!isFormBtnEnalbed)
        return
    
    toggleLoader(1, signupSubmit, authLoader[1]);

    const req_data = {
        email: e.target[0].value,
        password: e.target[1].value,
        re_password: e.target[2].value,
    }
    const res = await fetch(endpoint.register, {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req_data)
    });
    const res_data = await res.json();

    if(res.status !== 201){
        showMessage(authErr[1], res_data.message);
    }
    else{
        const msgElem = document.querySelector(".msg");
        showMessage(msgElem, "Successfully Registered Please verify the Email and Login");
        setTimeout(showMessage.bind(null, msgElem, ''), 4000)
        loginBtn.click();
    }
    toggleLoader(0, signupSubmit, authLoader[1]);
});

const showMessage = (elem, msg) => {
    elem.innerText = msg;
    setTimeout(() => elem.innerText = "", 2000);
}

const toggleLoader = (toEnable, submitBtn, loader) => {
    if(toEnable){
        isFormBtnEnalbed = false;
        submitBtn.disabled = true;
        loader.classList.remove("none");
    }
    else{
        isFormBtnEnalbed = true;
        submitBtn.disabled = false;
        loader.classList.add("none");
    }
}

// To change views
const loginBtn = document.querySelector('.btn-login');
const signUpBtn = document.querySelector('.btn-signup');
const authBtn = document.querySelectorAll('.personal expense tracker application-header h3');
const formCnt = document.querySelectorAll('.personal expense tracker application-form-cnt');

loginBtn.addEventListener("click" ,(e) => {
    authBtn[0].classList.add("active");
    authBtn[1].classList.remove("active");
    formCnt[0].classList.remove("none");
    formCnt[1].classList.add("none");
});
signUpBtn.addEventListener("click", (e) => {
    authBtn[1].classList.add("active");
    authBtn[0].classList.remove("active");
    formCnt[1].classList.remove("none");
    formCnt[0].classList.add("none");
});