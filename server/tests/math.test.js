const { calculateTip, add } = require("../math");

test("Should calculate total with tip", () => {
  const total = calculateTip(10, 0.3);
  expect(total).toBe(13);
});

test("Should calculate total with default tip", () => {
  const total = calculateTip(10);
  expect(total).toBe(11.5);
});

// test("Async test demo", (done) => {
//   setTimeout(() => {
//     expect(1).toBe(2);
//     done();
//   }, 1000);
// });

test("Should add two numbers via promise", (done) => {
  add(2, 3).then((sum) => {
    expect(sum).toBe(5);
    done();
  });
});

test("Should add two numbers via async/await", async () => {
  const sum = await add(10, 22);
  expect(sum).toBe(32);
});

// test("Howdy Partner", () => {});

// test("This Should Fail", () => {
//   throw new Error("Negative!");
// });

// Why Test??
//
// - saves time
// - creates reliable software
// - gives flexibility to developers
//   - Refractoring
//   - Collaborating
//   - Profiling
// - Peace Of Mind
