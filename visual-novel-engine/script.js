var menuOptions = [];

var startMenuOptions = [
  { id: 1, label: "Start" },
  { id: 2, label: "Options" },
];

var otherOptions = [
  { id: 1, label: "Object a" },
  { id: 2, label: "Object b" },
  { id: 3, label: "Object c" },
  { id: 4, label: "Object d" },
];

// Function to create a new div element
function createDiv(object) {
  var div = document.createElement("div");
  div.classList.add("option");

  div.textContent = object.label;
  div.addEventListener("click", function () {
    console.log(object);
    if (object.label === "Start") {
      toggleElements([".title", ".menu"], (show = false));
      toggleElements([".text_box", ".characters"], (show = true));
    }
  });
  return div;
}

// Function to add divs to the container
function updateOptions() {
  var container = document.querySelector(".menu");
  container.innerHTML = "";

  menuOptions.forEach(function (object) {
    var div = createDiv(object);
    container.appendChild(div);
  });
}

function toggleElements(elements, show = true) {
console.log(elements);
  display = show ? "flex" : "none";
  elements.forEach(function (selector) {
    console.log(document.querySelector(selector))
    document.querySelector(selector).style.display = display;
  });
}

// Function to toggle the visibility of sections based on the selected index
// function load(index) {
//   if (index === 1) {
//     menuOptions = startMenuOptions;
//   } else {
//     menuOptions = otherOptions;
//   }
//   updateOptions();
// }

toggleElements([".title", ".menu"], (show = true));
menuOptions = startMenuOptions;
updateOptions();
