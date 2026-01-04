const contents = [];
let nextId = 1;

const createPost = (owner, title, content) => {
  contents.push({ id: nextId++, owner: owner, title: title, content: content });
};

const getPostById = (id) => {
  const foundPost = contents.find((post) => post.id === id);
  return foundPost || "Não encontrado!";
};

const updatePost = (id, update) => {
  const foundPost = contents.find((post) => post.id === id);
  if (foundPost) {
    foundPost.content = update;
    console.log("Atualizado com sucesso!");
  } else {
    console.log("Post não encontrado!");
  }
};

const deletePost = (id) => {
  const index = contents.findIndex((post) => post.id === id);
  if (index !== -1) {
    contents.splice(index, 1);
    console.log("Post deletado!");
  } else {
    console.log("Post não encontrado!");
  }
};

document.getElementById("addPostBtn").addEventListener("click", event => {
  const div = document.getElementById("popUpToAddPost");
  const main = document.querySelector("main");
  main.classList.add("popUpHidden")
  div.classList.remove("popUpHidden");
  div.classList.add("showPopUp");
  const header = document.querySelector("header");
  header.style.display = "none";
  history.pushState({ showPopUp: true }, "", "newPost");
});

window.addEventListener("popstate", (event) => {
  location.reload();
  history.pushState("main", "", "main.html");
});

const addQrCodeToPage = () => {
  if(contents.length !== 0) {
    document.querySelector("main").innerHTML = "";
    contents.forEach((post) => {
      const div = document.createElement("div");
      div.id = post.id;
      div.classList.add("postInPage")
      const imageDiv = document.createElement("div");
      imageDiv.id = "image";
      const titleAndButtonsDiv = document.createElement("div");
      titleAndButtonsDiv.id =  "titleAndButton";
      const deleteButton = document.createElement("button");
      const updateButton = document.createElement("button");
      deleteButton.id = "deleteButton";
      updateButton.id = "updateButon";
      deleteButton.textContent = "Excluir";
      updateButton.textContent = "Alterar";
      const img = document.createElement("img");
      img.src = post.content;
      titleAndButtonsDiv.innerHTML = `<h2>${post.title}</h2>`;
      titleAndButtonsDiv.append(updateButton, deleteButton);
      imageDiv.append(img);
      div.append(imageDiv, titleAndButtonsDiv);
      document.querySelector("main").append(div); 
      });
    } else {
      document.querySelector("main").innerHTML = '<h1 id="nothingWasPosted">Nada foi postado ainda</h1>';
    }
};

const getApi = async (post, title) => {
  const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${post}`);
  const blob = await response.blob();
  const imgUrl = URL.createObjectURL(blob);
  createPost(userName, title, imgUrl);
  console.log(contents);
  addQrCodeToPage();
};

document.getElementById("addPost").addEventListener("click", () => {
  const main = document.querySelector("main");
  main.innerHTML = ""; // Gambiarra
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value; 
  content && title ? getApi(content, title) : addQrCodeToPage();
  document.getElementById("postContent").value = "";
  document.getElementById("postTitle").value = "";
  const div = document.getElementById("popUpToAddPost");
  main.classList.remove("popUpHidden");
  div.classList.remove("showPopUp");
  div.classList.add("popUpHidden");
  const header = document.querySelector("header");
  header.style.display = "flex";
  history.pushState("main", "", "main.html");
});

window.addEventListener("load", () => {
  document.querySelector("main").innerHTML = '<h1 id="nothingWasPosted">Nada foi postado ainda</h1>';
});

const userName = JSON.parse(sessionStorage.getItem("user")).userName;
const span = document.createElement("span");
span.textContent = userName;
span.classList.add("userName");
document.getElementById("userInfo").append(span);
