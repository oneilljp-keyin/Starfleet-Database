const calculateTip = (total, tipPercent = 0.15) => total + total * tipPercent;

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        return reject("numbers must be non-negative");
      }
      resolve(a + b);
    });
  });
};

if (module) {
  module.exports = { calculateTip, add };
}
