const contents = [];
let nextId = 1;
const createPost = (owner, content) => {
  contents.push({ id: nextId++, owner: owner, content: content });
};
