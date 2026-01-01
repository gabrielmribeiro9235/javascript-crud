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
  div.classList.remove();
  div.classList.add("showPopUp");
  const header = document.querySelector("header");
  header.style.display = "none";
  history.pushState({ showPopUp: true }, "", "newPost");
});

window.addEventListener("popstate", (event) => {
  location.reload();
  history.pushState("main", "", "main.html");
});

const userName = JSON.parse(sessionStorage.getItem("user")).userName;
const span = document.createElement("span");
span.textContent = userName;
span.classList.add("userName");
document.getElementById("userInfo").append(span);
