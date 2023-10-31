// Inspiração: https://parametrichouse.com/fractal-tree1/
// https://www.youtube.com/watch?v=0jjeOYMjmDU
// TODO: MUDAR AS CORES PARA CADA NÍVEL DA ÁRVORE
// TODO: MINI GUI PARA MUDAR VARIAVEIS

class Tree {
  constructor(root_node) {
    this.root_node = root_node;
  }

  update_tree() {
    this.update_recursively(this.root_node);
  }

  update_recursively(node) {
    if (node != null) {
      if (node.left_child) {
        this.update_recursively(node.left_child);
      }
      if (node.right_child) {
        this.update_recursively(node.right_child);
      }

      if (!node.fully_grown) {
        if (
          node.length <
          MAX_BRANCH_LENGTH * PROPORTIONAL_REDUCTION ** (node.level + 1)
        ) {
          node.length += GROWTH_STEP;
        } else {
          node.fully_grown = true;

          const anguloRadianos = node.alfa * (Math.PI / 180);
          const new_x = node.x + Math.cos(anguloRadianos) * node.length;
          const new_y = node.y - Math.sin(anguloRadianos) * node.length;

          if (node.level < MAX_LEVEL && node.length > MIN_BRANCH_LENGTH) {
            node.left_child = new TreeNode(
              new_x,
              new_y,
              node.alfa + LEFT_BRANCH_ANGLE,
              node.level + 1
            );
            node.right_child = new TreeNode(
              new_x,
              new_y,
              node.alfa - RIGHT_BRANCH_ANGLE,
              node.level + 1
            );
          }
        }
      }
    }
  }

  draw_tree() {
    this.draw_recursively(this.root_node);
  }

  draw_recursively(node) {
    if (node != null) {
      // Define a cor da linha
      ctx.strokeStyle = "black";

      // Define a largura da linha
      ctx.lineWidth = THICKNESS / (node.level + 1);

      const anguloRadianos = node.alfa * (Math.PI / 180);
      const new_x = node.x + Math.cos(anguloRadianos) * node.length;
      const new_y = node.y - Math.sin(anguloRadianos) * node.length;

      // Desenha a linha
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(new_x, new_y);
      ctx.stroke();

      this.draw_recursively(node.left_child);
      this.draw_recursively(node.right_child);
    }
  }
}

class TreeNode {
  constructor(x, y, alfa, level) {
    this.x = x;
    this.y = y;
    this.alfa = alfa;
    this.level = level;
    this.length = 0;
    this.fully_grown = false;

    this.left_child = null;
    this.right_child = null;
  }
}

function drawCanvas() {
  my_tree.update_tree();
  my_tree.draw_tree();

  requestAnimationFrame(drawCanvas);
}

//Canvas configs
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var THICKNESS = 20;
var MAX_LEVEL = 12;
var GROWTH_STEP = 6;
var BRANCH_ANGLE = 30;
var MAX_BRANCH_LENGTH = HEIGHT * 0.5;
var MIN_BRANCH_LENGTH = 5;
var PROPORTIONAL_REDUCTION = 0.65;
var LEFT_BRANCH_ANGLE = 30;
var RIGHT_BRANCH_ANGLE = 30;

// Black and white (binary) or colored (colors)
var colorMode = "binary";
//var colorMode = 'colors';

const root_node = new TreeNode(WIDTH / 2, HEIGHT, 90, 0);
const my_tree = new Tree(root_node);

drawCanvas();

function toggle_pageMode() {
  if (colorMode == "binary") {
    set_darkMode();
  } else {
    set_lightMode();
  }

  drawCanvas();
}

function set_lightMode() {
  var a = document.getElementsByTagName("a");
  var handle = document.getElementById("mode_toggler");

  document.body.classList.remove("dark");
  for (var i = 0; i < a.length; i++) a[i].classList.remove("dark-icon");

  handle.classList.remove("fa-sun-o");
  handle.classList.add("fa-moon-o");

  colorMode = "binary";
}

function set_darkMode(a, handle) {
  var a = document.getElementsByTagName("a");
  var handle = document.getElementById("mode_toggler");

  document.body.classList.add("dark");
  for (var i = 0; i < a.length; i++) a[i].classList.add("dark-icon");

  handle.classList.remove("fa-moon-o");
  handle.classList.add("fa-sun-o");

  colorMode = "colors";
}
