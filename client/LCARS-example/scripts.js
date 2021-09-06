const nav = document.getElementById("main_nav");
const menuBtn = document.getElementById("menu-btn");

// function toggleNav() {}

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
  if (menuBtn.innerText == "menu") {
    menuBtn.innerText = "close";
  } else {
    menuBtn.innerText = "menu";
  }
});

// function printTime() {
//   var d = new Date(),
//     ui_time = document.querySelector(".time_wrapper time"),
//     hour = d.getHours(),
//     minutes = d.getMinutes();

//   if (hour < 10 && minutes >= 10) {
//     ui_time.innerText = "0" + hour.toString() + ":" + minutes.toString();
//   } else if (hour >= 10 && minutes < 10) {
//     ui_time.innerText = hour.toString() + ":0" + minutes.toString();
//   } else if (hour < 10 && minutes < 10) {
//     ui_time.innerText = "0" + hour.toString() + ":0" + minutes.toString();
//   } else {
//     ui_time.innerText = hour.toString() + ":" + minutes.toString();
//   }
// }
// printTime();

document.addEventListener(
  "DOMContentLoaded",
  setInterval(() => {
    var d = new Date(),
      ui_time = document.querySelector(".time_wrapper time"),
      hour = d.getHours(),
      minutes = d.getMinutes();

    if (hour < 10 && minutes >= 10) {
      ui_time.innerText = "0" + hour.toString() + ":" + minutes.toString();
    } else if (hour >= 10 && minutes < 10) {
      ui_time.innerText = hour.toString() + ":0" + minutes.toString();
    } else if (hour < 10 && minutes < 10) {
      ui_time.innerText = "0" + hour.toString() + ":0" + minutes.toString();
    } else {
      ui_time.innerText = hour.toString() + ":" + minutes.toString();
    }
  }, 60000)
);

// function clock() {
//   let date = new Date();
//   let hrs = date.getHours();
//   let mins = date.getMinutes();
//   // let secs = date.getSeconds();
//   // let period = "AM";
//   // if (hrs == 0) {
//   //   hrs = 12;
//   // } else if (hrs >= 12) {
//   //   hrs = hrs - 12;
//   //   period = "PM";
//   // }
//   hrs = hrs < 10 ? "0" + hrs : hrs;
//   mins = mins < 10 ? "0" + mins : mins;
//   secs = secs < 10 ? "0" + secs : secs;

//   let time = `${hrs}:${mins}`;
//   document.querySelector("#clock").innerText = time;
//   setTimeout(clock, 1000);
// }

// document.addEventListener("DOMContentLoaded", clock());
