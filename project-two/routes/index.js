const router = require("express").Router();
const AVLTree = require("../modules/avl");

// Start Page
router.get("/", (req, res) => {
  res.render("index");
});

router.post("/", (req, res) => {
  res.render("results");
  let numbers = req.body.numbers.split(",");
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] = parseInt(numbers[i]);
  }
  console.log(numbers);

  let avl = new AVLTree();

  numbers.forEach((number) => {
    avl.insert(number);
  });

  console.log(avl);
});

module.exports = router;
