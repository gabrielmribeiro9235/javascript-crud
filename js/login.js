const submitLogin = () => {
  document.getElementById("loginForm").addEventListener("submit", event => {
    event.preventDefault();
    const userName = document.getElementById("userName").value;
    const password = document.getElementById("password").value;
    sessionStorage.setItem("user", JSON.stringify({ userName, password }));
    window.location.href = "./main.html";
  });
}
