const checkForDuplicates = (array) => {
  return new Set(array).size !== array.length;
};

class Node {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}
// binary search tree
class AVLTree {
  constructor(root = null) {
    this.root = root;
  }
  add(value) {
    const recurse = (node) => {
      if (node === null) {
        return new Node(value);
      } else if (value < node.value) {
        node.left = recurse(node.left);
      } else {
        node.right = recurse(node.right);
      }

      if (nodeBalance(node) > 1) {
        return nodeRotateLeft(node);
      } else if (nodeBalance < -1) {
        return nodeRotateRight(node);
      } else {
        return node;
      }
    };
    this.root = recurse(this.root);
  }
  search(value) {
    const recurse = (node) => {
      if (node === null) {
        return false;
      } else if (value < node.value) {
        return recurse(node.left);
      } else if (value > node.value) {
        return recurse(node.right);
      } else {
        return true;
      }
    };
    return recurse(this.root);
  }
}
function nodeHeight(node) {
  if (node === null) {
    return -1;
  } else if (node.left === null && node.right === null) {
    return 0;
  } else {
    return 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right));
  }
}
function nodeBalance(node) {
  return nodeHeight(node.right) - nodeHeight(node.left);
}
function nodeRotateLeft(node) {
  if (node === null || node.right === null) {
    return node;
  }
  const newRoot = node.right;
  node.right = newRoot.left;
  newRoot.left = node;
  return newRoot;
}
function nodeRotateRight(node) {
  if (node === null || node.left === null) {
    return node;
  }
  const newRoot = node.left;
  node.left = newRoot.right;
  newRoot.right = node;
  return newRoot;
}
module.exports = {
  checkForDuplicates,
  Node,
  AVLTree,
};
