let items = [];
let historyStack = [];

/* ===== 数据 ===== */
items = [
  { name: "嗜光嗡嗡", type: ["恶系"], count: 0, img: "roco-image/mosquito.png" },
  { name: "贝瑟", type: ["机械系"], count: 0, img: "roco-image/pot.png" },
  { name: "粉星仔", type: ["幻系"], count: 0, img: "roco-image/zai.png" },
  { name: "格兰种子", type: ["草系"], count: 0, img: "roco-image/seed.png" },
  { name: "奇丽草", type: ["草系"], count: 0, img: "roco-image/grass.png" },
  { name: "治愈兔", type: ["火系"], count: 0, img: "roco-image/rabbit.png" },
  { name: "呼呼猪", type: ["冰系"], count: 0, img: "roco-image/pig.png" },
  { name: "大耳帽兜", type: ["冰系"], count: 0, img: "roco-image/dou.png" },
  { name: "拉特", type: ["电系"], count: 0, img: "roco-image/rai.png" },
  { name: "恶魔狼", type: ["恶系"], count: 0, img: "roco-image/wolf.png" },
  { name: "机械方方", type: ["机械系"], count: 0, img: "roco-image/cube.png" },
  { name: "绒绒", type: ["绒绒"], count: 0, img: "roco-image/rong.png" },
  { name: "犀角鸟", type: ["犀角鸟"], count: 0, img: "roco-image/mop.png" },
  { name: "火红尾", type: ["火系"], count: 0, img: "roco-image/horse.png" },
  { name: "果冻", type: ["水系"], count: 0, img: "roco-image/jelly.png" },
  { name: "星尘虫", type: ["虫系"], count: 0, img: "roco-image/ladybug.png" },
  { name: "影狸", type: ["幽系"], count: 0, img: "roco-image/fox.png" }
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
  <div class="count ${item.count > 0 ? "active" : ""}">
    ${item.count}
  </div>
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

    // ✅ 1. 先判断右滑
    if (dx > 30) {
      items[index].count--;
      save();
      render();
      return;
    }

    // ❗ 2. 再判断左滑（如果你以后要加）
    if (dx < -30) {
      items[index].count++;
      save();
      render();
      return;
    }

    // ✅ 3. 最后才是点击
    if (!moved) {
      items[index].count++;
      save();
      render();
    }
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
