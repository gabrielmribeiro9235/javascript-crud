const contents = [];
const userName = JSON.parse(sessionStorage.getItem("user")).userName;
let nextId = Number(localStorage.getItem(`${userName}NextId`)) || 1;
const span = document.createElement("span");
span.textContent = userName;
span.classList.add("userName");
document.getElementById("userInfo").append(span);


const createPost = (id = null, owner, title, content, rawContent) => {
  const postId = id ?? nextId++
  contents.push({ id: postId, owner: owner, title: title, content: content, rawContent: rawContent });
  sessionStorage.setItem("nextId", nextId.toString());
  saveContens();
};

const updatePost = (id, title, update, newContent) => {
  const foundPost = contents.find((post) => post.id === id);
  if (foundPost) {
    foundPost.title = title;
    foundPost.content = update;
    foundPost.rawContent = newContent
    saveContens();
    addQrCodeToPage();
  }
};

const deletePost = async (id) => {
  const index = contents.findIndex((post) => post.id === id);
  const option = await showConfirm("Tem certeza que quer excluir o post?");
  if (index !== -1 && option) {
    contents.splice(index, 1);
    saveContens();
    addQrCodeToPage();
  }
};

const showConfirm = (message) => {
  return new Promise((resolve) => {
    const dialog = document.getElementById("confirm");
    const p = document.getElementById("confirmText");
    p.textContent = message;
    dialog.showModal();
    document.getElementById("confirm-yes").addEventListener("click", () => {
      dialog.close();
      resolve(true);
    }, { once: true });
    document.getElementById("confirm-no").addEventListener("click", () => {
      dialog.close();
      resolve(false);
    }, { once: true })
  })
};

const showPrompt = (oldTitle, oldContent) => {
  return new Promise((resolve) => {
    const dialog = document.getElementById("prompt");
    const titleInput = document.getElementById("titleInput");
    const contentInput = document.getElementById("contentInput");
    dialog.showModal();
    titleInput.value = oldTitle;
    contentInput.value = oldContent;
    document.getElementById("prompt-submit").addEventListener("click", (e) => {
      e.preventDefault();
      dialog.close();
      if(!titleInput.value && !contentInput.value) {
        resolve(false);
      }
      resolve({ newTitle: titleInput.value, newContent: contentInput.value });
    });
    document.getElementById("prompt-cancel").addEventListener("click", () => {
      dialog.close();
      resolve(false);
    })
  })
};


const addQrCodeToPage = () => {
  if(contents.length !== 0) {
    document.querySelector("main").innerHTML = "";
    contents.sort((a, b) => a.id - b.id);
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
      updateButton.id = "updateButton";
      deleteButton.innerHTML = `
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" stroke="white" stroke-width="0.8" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>
      </span>
      <span>Excluir</span>`;
      updateButton.innerHTML = `
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" stroke="white" stroke-width="0.8" class="bi bi-repeat" viewBox="0 0 16 16">
          <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/>
        </svg>
      </span>
      <span>Alterar</span>`;
      deleteButton.addEventListener("click", () => {
        const postDiv = deleteButton.closest(".postInPage")
        deletePost(Number(postDiv.id));
      });
      updateButton.addEventListener("click", async () => {
        const postDiv = updateButton.closest(".postInPage");
        const foundPost = contents.find(post => post.id === Number(postDiv.id));
        let newTitle, newContent;
        const oldTitle = foundPost.title, oldContent = foundPost.rawContent;
        const promptResponse = await showPrompt(oldTitle, oldContent);
        if(promptResponse) {
          newTitle = promptResponse.newTitle;
          newContent = promptResponse.newContent;
          if(newContent === oldContent) {
            if(newTitle !== oldTitle) {
              const h2 = postDiv.querySelector("h2");
              h2.textContent = newTitle;
              foundPost.title = newTitle;
              saveContents();
            }
          } else {
            const newQrCode = await getApi(newContent, newTitle, true);
            updatePost(Number(postDiv.id), newTitle, newQrCode, newContent);  
          }
        }
      });
      const buttons = document.createElement("div");
      buttons.id = "buttons";
      buttons.append(updateButton, deleteButton);
      const img = document.createElement("img");
      img.src = post.content;
      titleAndButtonsDiv.innerHTML = `<h2>${post.title}</h2>`;
      titleAndButtonsDiv.append(buttons);
      imageDiv.append(img);
      div.append(imageDiv, titleAndButtonsDiv);
      document.querySelector("main").append(div); 
      });
    } else {
      document.querySelector("main").innerHTML = '<h1 id="nothingWasPosted">Nada foi postado ainda</h1>';
    }
};

const getApi = async (post, title, update = false, id = null) => {
  const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${post}`);
  const blob = await response.blob();
  const imgUrl = URL.createObjectURL(blob);
  if(update) {
    return imgUrl;
  } else {
    createPost(id, userName, title, imgUrl, post);
    addQrCodeToPage();
  }  
};

const saveContens = () => {
  sessionStorage.setItem("contents", JSON.stringify(contents));
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

document.getElementById("addPost").addEventListener("click", () => {
  const main = document.querySelector("main");
  main.innerHTML = "";
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

window.addEventListener("popstate", (event) => {
  location.reload();
  history.pushState("main", "", "main.html");
});

window.addEventListener("load", () => {
  let saved = localStorage.getItem(`${userName}Contents`);
  if(saved === "[]") {
    saved = sessionStorage.getItem("contents");
  }
  if(saved) {
    const parsed = JSON.parse(saved);
    if(parsed.length !== 0) {
      contents.length = 0;
      parsed.forEach(post => {
        getApi(post.rawContent, post.title, false, post.id)
      });
    } else {
      document.querySelector("main").innerHTML = '<h1 id="nothingWasPosted">Nada foi postado ainda</h1>'; 
    }
  } else {
    document.querySelector("main").innerHTML = '<h1 id="nothingWasPosted">Nada foi postado ainda</h1>';
  }
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem(`${userName}Contents`, JSON.stringify(contents));
  localStorage.setItem(`${userName}NextId`, nextId.toString());
});
