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

const submitLogin = () => {
  document.getElementById("loginForm").addEventListener("submit", event => {
    event.preventDefault();
    const userName = document.getElementById("userName").value;
    const password = document.getElementById("password").value;
    sessionStorage.setItem("user", JSON.stringify({ userName, password }));
    window.location.href = "./main.html";
  });
}

const showPopUp = () => {
  const div = document.getElementById("popUpToAddPost");
  div.style.display = "block";
}