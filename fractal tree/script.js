// Inspiração: https://parametrichouse.com/fractal-tree1/
// https://www.youtube.com/watch?v=0jjeOYMjmDU

class Tree {
  constructor(root_node) {
    this.root_node = root_node;
    this.tree_fully_grown = false;
  }

  update_tree() {
    this.update_recursively(this.root_node);
  }

  update_recursively(node) {
    if (node) {
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
          } else {
            this.tree_fully_grown = true;
          }
        }
      }
    }
  }

  draw_tree() {
    this.draw_recursively(this.root_node);
  }

  draw_recursively(node) {
    if (node) {
      // Gradiente preto -> verde
      const colors = [
        "#000000",
        "#000F00",
        "#002200",
        "#003400",
        "#004600",
        "#005500",
        "#006500",
        "#006F00",
        "#008100",
        "#009A00",
        "#00B500",
        "#00CB00",
        "#00E300",
        "#00F100",
        "#00F500",
        "#00FF00",
      ];

      // Define a cor da linha
      ctx.strokeStyle = colors[node.level % colors.length];

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
  if (!my_tree.tree_fully_grown) {
    my_tree.update_tree();
    my_tree.draw_tree();
  }
  requestAnimationFrame(drawCanvas);
}

function update(elementName) {
  const input = document.querySelector(`#${elementName}_input`);
  if (input) {
    switch (elementName) {
      case "tickness":
        THICKNESS = parseInt(input.value);
        break;
      case "max_frac":
        MAX_LEVEL = parseInt(input.value);
        break;
      case "growth":
        GROWTH_STEP = parseInt(input.value);
        break;
      case "max_len":
        MAX_BRANCH_LENGTH = parseInt(input.value);
        break;
      case "min_len":
        MIN_BRANCH_LENGTH = parseInt(input.value);
        break;
      case "reduction":
        PROPORTIONAL_REDUCTION = parseInt(input.value) / 100;
        break;
      case "left_angle":
        LEFT_BRANCH_ANGLE = parseInt(input.value);
        break;
      case "right_angle":
        RIGHT_BRANCH_ANGLE = parseInt(input.value);
        break;
      default:
        break;
    }
  }
}

//Canvas configs
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var THICKNESS = 20;
var MAX_LEVEL = 10;
var GROWTH_STEP = 6;
var MAX_BRANCH_LENGTH = HEIGHT * 0.5;
var MIN_BRANCH_LENGTH = 5;
var PROPORTIONAL_REDUCTION = 0.65;
var LEFT_BRANCH_ANGLE = 30;
var RIGHT_BRANCH_ANGLE = 30;

setupElementValues();

var root_node = new TreeNode(WIDTH / 2, HEIGHT, 90, 0);
var my_tree = new Tree(root_node);

drawCanvas();

function reload_tree() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  root_node = new TreeNode(WIDTH / 2, HEIGHT, 90, 0);
  my_tree = new Tree(root_node);
}

function setupElementValues() {
  const elementNames = [
    "tickness",
    "max_frac",
    "growth",
    "max_len",
    "min_len",
    "reduction",
    "left_angle",
    "right_angle",
  ];
  elementNames.forEach((elementName) => {
    const input = document.querySelector(`#${elementName}_input`);
    const value = document.querySelector(`#${elementName}_val`);

    if (input && value) {
      value.textContent = input.value;
      input.addEventListener("input", () => (value.textContent = input.value));
    }
  });
}
