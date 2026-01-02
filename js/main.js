const contents = [];
let nextId = 1;

const createPost = (owner, content) => {
  contents.push({ id: nextId++, owner: owner, content: content });
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

const getApi = async (post) => {
  const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${post}`);
  const blob = await response.blob();
  const imgUrl = URL.createObjectURL(blob);
  createPost(userName, imgUrl);
  console.log(contents);
  const img = document.createElement("img");
  img.src = imgUrl;
  const main = document.querySelector("main");
  main.append(img);
};

document.getElementById("addPost").addEventListener("click", () => {
  const content = document.getElementById("postContent").value; 
  getApi(content);
  document.getElementById("postContent").value = "";
  document.getElementById("postTitle").value = "";
  const div = document.getElementById("popUpToAddPost");
  div.classList.remove("showPopUp");
  div.classList.add("popUpHidden");
  const header = document.querySelector("header");
  header.style.display = "flex";
  history.pushState("main", "", "main.html");
});

const userName = JSON.parse(sessionStorage.getItem("user")).userName;
const span = document.createElement("span");
span.textContent = userName;
span.classList.add("userName");
document.getElementById("userInfo").append(span);
