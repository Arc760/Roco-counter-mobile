let items = [];
let resetBtn = null;
let undoBtn = null;

/* ===== 数据 ===== */
items = [
  { name: "柴渣虫", type: ["火系"], count: 0, img: "./roco-image/chai.png" },
  { name: "双灯鱼", type: ["水系"], count: 0, img: "./roco-image/fish.png" },
  { name: "月牙雪熊", type: ["冰系"], count: 0, img: "./roco-image/bear.png" },
  { name: "粉粉星", type: ["电系"], count: 0, img: "./roco-image/star.png" },

  { name: "空空颅", type: ["幽系"], count: 0, img: "./roco-image/skull.png" },
  { name: "嗜光嗡嗡", type: ["恶系"], count: 0, img: "./roco-image/mosquito.png" },
  { name: "贝瑟", type: ["机械系"], count: 0, img: "./roco-image/pot.png" },
  { name: "粉星仔", type: ["幻系"], count: 0, img: "./roco-image/zai.png" },

  { name: "格兰种子", type: ["草系"], count: 0, img: "./roco-image/seed.png" },
  { name: "奇丽草", type: ["草系"], count: 0, img: "./roco-image/grass.png" },
  { name: "治愈兔", type: ["火系"], count: 0, img: "./roco-image/rabbit.png" },
  { name: "呼呼猪", type: ["冰系"], count: 0, img: "./roco-image/pig.png" },

  { name: "大耳帽兜", type: ["冰系"], count: 0, img: "./roco-image/dou.png" },
  { name: "拉特", type: ["电系"], count: 0, img: "./roco-image/rai.png" },
  { name: "恶魔狼", type: ["恶系"], count: 0, img: "./roco-image/wolf.png" },
  { name: "机械方方", type: ["机械系"], count: 0, img: "./roco-image/cube.png" },

  { name: "绒绒", type: ["绒绒"], count: 0, img: "./roco-image/rong.png" },
  { name: "犀角鸟", type: ["犀角鸟"], count: 0, img: "./roco-image/mop.png" },
  { name: "火红尾", type: ["火系"], count: 0, img: "./roco-image/horse.png" },

  { name: "果冻", type: ["水系"], count: 0, img: "./roco-image/jelly.png" },
  { name: "星尘虫", type: ["虫系"], count: 0, img: "./roco-image/ladybug.png" },
  { name: "影狸", type: ["幽系"], count: 0, img: "./roco-image/fox.png" }
];

/* ===== 初始化 ===== */
window.addEventListener("DOMContentLoaded", () => {
  console.log("JS 已加载");

  loadData();
  render();

  resetBtn = document.querySelector(".reset-btn");
  undoBtn = document.querySelector(".undo-btn");

  console.log("resetBtn:", resetBtn);
  console.log("undoBtn:", undoBtn);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      console.log("重置点击");
      resetAll();
    });
  }

  if (undoBtn) {
    undoBtn.addEventListener("click", () => {
      console.log("撤回点击");
      undo();
    });
  }
});

/* ===== 渲染核心 ===== */
function render() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  const COLS = 6;
  const ROWS = 4;

  let grid = Array(COLS * ROWS).fill(null);

  let itemIndex = 0;

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {

      const i = col * ROWS + row;

      // 空格规则
      const isEmpty =
        (col === 4 && row === 3) ||
        (col === 5 && row === 3);

      if (isEmpty) {
        grid[i] = { empty: true };
      } else {
        grid[i] = {
          ...items[itemIndex],
          index: itemIndex
        };
        itemIndex++;
      }
    }
  }

  grid.forEach(item => {
    container.appendChild(createItem(item));
  });

  updateStats();
}

/* ===== 创建格子 ===== */
function createItem(item) {
  const div = document.createElement("div");

  if (item.empty || !item.name) {
    div.className = "item empty";
    return div;
  }

  div.className = "item";

  div.innerHTML = `
    <img src="${item.img}">
    <div>${item.name}</div>
    <div class="count ${item.count > 0 ? "active" : ""}">
      ${item.count}
    </div>
  `;

  bindGesture(div, item.index);
  return div;
}

/* ===== 手势 ===== */
function bindGesture(el, index) {
  let startX = 0;
  let startY = 0;
  let timer = null;
  let isLong = false;

  el.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    isLong = false;

    timer = setTimeout(() => {
      isLong = true;
      let v = prompt("输入数量");
      if (v !== null) {
        items[index].count = parseInt(v) || 0;
        save();
        render();
      }
    }, 600);
  });

  el.addEventListener("pointerup", (e) => {
    clearTimeout(timer);
    if (isLong) return;

    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy) && dx > 40) {
      items[index].count--;
      save();
      render();
      return;
    }

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      items[index].count++;
      save();
      render();
    }
  });
}

/* ===== 重置 ===== */
function resetAll() {
  items.forEach(i => i.count = 0);
  save();
  render();
}

/* ===== 撤销 ===== */
let history = [];

function save() {
  history.push(JSON.stringify(items));
  localStorage.setItem("items", JSON.stringify(items));
}

function loadData() {
  const data = localStorage.getItem("items");
  if (data) items = JSON.parse(data);
}

function undo() {
  if (!history.length) return;
  items = JSON.parse(history.pop());
  render();
}

/* ===== 统计 ===== */
function updateStats() {
  let stats = {};

  items.forEach(item => {
    (item.type || []).forEach(t => {
      stats[t] = (stats[t] || 0) + item.count;
    });
  });

  delete stats["虫系"];

  document.getElementById("stats").innerText =
    Object.entries(stats)
      .map(([k, v]) => `${k}:${v}`)
      .join(" ") || "暂无数据";
}
