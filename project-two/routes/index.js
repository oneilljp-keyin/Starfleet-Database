const router = require("express").Router();
const BTS = require("../modules/bst");

// Start Page
router.get("/", (req, res) => {
  res.render("index");
});

router.post("/", (req, res) => {
  res.render("results");
  let numbers = req.body.numbers.split(",");

  let avl = new BTS();
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] = parseInt(numbers[i]);
    avl.add(numbers[i]);
  }
  // console.log(numbers);

  // numbers.forEach((number) => {
  //   avl.insert(number);
  // });

  console.log("levelOrder: " + avl.levelOrder());
});

module.exports = router;
