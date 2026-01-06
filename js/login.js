const createAccount = (user, pass) => {
    localStorage.setItem(user, JSON.stringify({ userName: user, password: pass }));
    sessionStorage.setItem("user", JSON.stringify({ userName: user }));
    window.location.href = "./main.html";
}

const getUser = (user, pass) => {
    const storage = localStorage.getItem(user);
    if(storage) {
        const parsed = JSON.parse(storage);
        if(parsed.password === pass) {
            return parsed;
        } else {
            const inputBox = document.getElementById("userName");
            inputBox.removeAttribute("style");
            const oldMsgs = document.querySelectorAll(".error");
            oldMsgs.forEach(msg => msg.remove());
            invalidPassword();
            return false;
        }
    } else {
        invalidUser();
        return false;
    }
}; 

const invalidUser = () => {
    const inputBox = document.getElementById("userName");
    inputBox.style.borderColor = "red";
    const oldMsgs = document.querySelectorAll(".error");
    oldMsgs.forEach(msg => msg.remove());
    const msg = document.createElement("sub");
    msg.classList.add("error");
    msg.textContent = "Usuário inválido";
    msg.style.color = "red";
    msg.style.marginTop = "-20px"
    msg.style.textIndent = "10px";
    inputBox.after(msg);
    invalidPassword();
};

const invalidPassword = () => {
    const inputBox = document.getElementById("password");
    inputBox.style.borderColor = "red";
    const oldMsgs = document.querySelectorAll(".error-pass");
    oldMsgs.forEach(msg => msg.remove());
    const msg = document.createElement("sub");
    msg.classList.add("error-pass");
    msg.textContent = "Senha inválida";
    msg.style.color = "red";
    msg.style.marginTop = "-20px"
    msg.style.textIndent = "10px";
    inputBox.after(msg);
};


document.getElementById("loginForm").addEventListener("submit", event => {
    event.preventDefault();
    const userName = document.getElementById("userName").value;
    const password = document.getElementById("password").value;
    if(document.querySelector(".enterBtn").value === "Entrar") {
        const user = getUser(userName, password);
        if(user) {
            sessionStorage.setItem("user", JSON.stringify({ userName: userName }));
            window.location.href = "./main.html";
        }
    } else {
        createAccount(userName, password);
    }
});
