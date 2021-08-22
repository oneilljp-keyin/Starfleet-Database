const router = require("express").Router();
const treeify = require("treeify");
const { checkForDuplicates, AVLTree } = require("../modules/avl");

// Start Page
router.get("/", (req, res) => {
  res.render("index");
});

router.post("/", (req, res) => {
  let errors = [];
  let numbers = req.body.numbers.split(",");
  let display_type = req.body.display_type;
  if (!checkForDuplicates(numbers)) {
    let newTree = new AVLTree();
    for (let i = 0; i < numbers.length; i++) {
      numbers[i] = parseInt(numbers[i]);
      newTree.add(numbers[i]);
    }
    // console.log(tree);
    let newTreeDisplay =
      req.body.display_type === "treeify"
        ? treeify.asTree(newTree, true)
        : JSON.stringify(newTree, null, "\t");
    let label = req.body.display_type === "treeify" ? "Treeify" : "JSON Format";
    res.render("results", {
      treeResult: newTreeDisplay,
      label: label,
    });
  } else {
    errors.push({ msg: "Please Do Not Include Any Duplicate Numbers" });
    res.render("index", {
      errors,
      numbers,
      label,
    });
  }
});

module.exports = router;
