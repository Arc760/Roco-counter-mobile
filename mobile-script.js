let items = [];
let historyStack = [];

/* ===== 数据 ===== */
items = [
  { name: "柴渣虫", type: ["火系"], count: 0, img: "roco-image/chai.png" },
  { name: "双灯鱼", type: ["水系"], count: 0, img: "roco-image/fish.png" },
  { name: "月牙雪熊", type: ["冰系"], count: 0, img: "roco-image/bear.png" },
  { name: "粉粉星", type: ["电系"], count: 0, img: "roco-image/star.png" },
  { name: "空空颅", type: "幽系", count: 0, img: "roco-image/skull.png" }
];

/* ===== 启动 ===== */
window.onload = function () {
  loadData();
  render();

  const resetBtn = document.querySelector(".reset-btn");
  const undoBtn = document.querySelector(".undo-btn");

  if (resetBtn) resetBtn.addEventListener("click", resetAll);
  if (undoBtn) undoBtn.addEventListener("click", undo);
};

/* ===== 渲染 ===== */
function render() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  items.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <img src="${item.img}">
      <div>${item.name}</div>
      <div class="count">${item.count}</div>
    `;

    bindGesture(div, i);
    container.appendChild(div);
  });

  updateStats();
}

/* ===== 手势 ===== */
function bindGesture(el, index) {
  let startX = 0;
  let moved = false;
  let timer = null;
  let isLong = false;

  el.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    moved = false;
    isLong = false;

    timer = setTimeout(() => {
      isLong = true;

      let v = prompt("输入数量");
      if (v !== null) {
        pushHistory();
        items[index].count = parseInt(v) || 0;
        save();
        render();
      }
    }, 600);
  });

  el.addEventListener("pointermove", (e) => {
    if (Math.abs(e.clientX - startX) > 10) {
      moved = true;
      clearTimeout(timer);
    }
  });

  el.addEventListener("pointerup", (e) => {
    clearTimeout(timer);
    if (isLong) return;

    let dx = e.clientX - startX;

    pushHistory();

    if (dx > 30) {
      items[index].count--;
    } else if (!moved) {
      items[index].count++;
    }

    save();
    render();
  });
}

/* ===== 统计 ===== */
function updateStats() {
  let stats = {};

  items.forEach(item => {
    let types = Array.isArray(item.type)
      ? item.type
      : item.type.split(",");

    types.forEach(t => {
      t = t.trim();
      stats[t] = (stats[t] || 0) + item.count;
    });
  });

  let text = "";
  for (let t in stats) {
    text += `${t}：${stats[t]}  `;
  }

  document.getElementById("stats").innerText = text || "暂无数据";
}

/* ===== 存档 ===== */
function save() {
  localStorage.setItem("items", JSON.stringify(items));
}

function loadData() {
  let data = localStorage.getItem("items");
  if (data) items = JSON.parse(data);
}

/* ===== 历史 ===== */
function pushHistory() {
  historyStack.push(JSON.stringify(items));
  if (historyStack.length > 50) historyStack.shift();
}

/* ===== 操作 ===== */
function resetAll() {
  pushHistory();
  items.forEach(i => i.count = 0);
  save();
  render();
}

function undo() {
  if (historyStack.length === 0) return;

  items = JSON.parse(historyStack.pop());
  save();
  render();
}
