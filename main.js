const contents = [];
let nextId = 1;
const createPost = (owner, content) => {
  contents.push({ id: nextId++, owner: owner, content: content });
};

const getPostById = (id) => {
  const foundPost = contents.find((post) => post.id === id);
  return foundPost || "Não encontrado!";
};
