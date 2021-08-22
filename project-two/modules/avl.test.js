const { checkForDuplicates, AVLTree } = require("./avl");

describe("Function to check numbers in array", () => {
  it("return true if duplicates", () => {
    expect(checkForDuplicates([1, 2, 3, 4, 2])).toBe(true);
  });
  it("return false if no duplicates", () => {
    expect(checkForDuplicates([1, 2, 3, 4, 5])).toBe(false);
  });
});

describe("Check Tree Constructor", () => {
  const tree = new AVLTree();
  tree.add(1);
  tree.add(2);
  tree.add(3);
  tree.add(4);
  tree.add(5);
  it("see if any values were added to tree", () => {
    expect(tree.root).not.toBe(null);
  });
  it("see if values were added to correct nodes", () => {
    expect(tree.root.value).toBe(2);
    expect(tree.root.left.value).toBe(1);
    expect(tree.root.right.value).toBe(4);
    expect(tree.root.right.left.value).toBe(3);
    expect(tree.root.right.right.value).toBe(5);
  });
  it("see if correct values were added to tree", () => {
    expect(tree.search(1)).toBe(true);
    expect(tree.search(2)).toBe(true);
    expect(tree.search(3)).toBe(true);
    expect(tree.search(4)).toBe(true);
    expect(tree.search(5)).toBe(true);
  });
  it("see if identifies that value is not in the tree", () => {
    expect(tree.search(44)).toBe(false);
  });
});
