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
  const foundPost = contents.find(post => post.id === id);
  if(foundPost) {
    foundPost.content = update;
    console.log("Atualizado com sucesso!")
  } else {
    console.log("Post não encontrado!");
  }
};
