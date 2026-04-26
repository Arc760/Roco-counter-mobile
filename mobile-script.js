let items = [];
let historyStack = [];
let resetBtn = null;
let undoBtn = null;

/* ===== 数据 ===== */
items = [
  { name: "柴渣虫", type: ["火系"], count: 0, img: "roco-image/chai.png" },
  { name: "双灯鱼", type: ["水系"], count: 0, img: "roco-image/fish.png" },
  { name: "月牙雪熊", type: ["冰系"], count: 0, img: "roco-image/bear.png" },
  { name: "粉粉星", type: ["电系"], count: 0, img: "roco-image/star.png" },

  { name: "空空颅", type: ["幽系"], count: 0, img: "roco-image/skull.png" },
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
  { name: "影狸", type: ["幽系"], count: 0, img: "roco-image/fox.png" },

];

/* ===== 初始化 ===== */
window.addEventListener("DOMContentLoaded", () => {
  loadData();
  render();

  container.style.display = "grid";

  resetBtn = document.querySelector(".reset-btn");
  undoBtn = document.querySelector(".undo-btn");

  if (!resetBtn) {
    console.log("❌ reset-btn 没找到");
    return;
  }

  let startX = 0;
  let startY = 0;
  let moved = false;

  // ⭐ 关键：只用这一套手势
resetBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();   // ⭐ 阻止默认行为
  startX = e.clientX;
  startY = e.clientY;

  moved = false;
});

resetBtn.addEventListener("pointerup", (e) => {
  const dx = e.clientX - startX;
  const dy = Math.abs(e.clientY - startY);

  console.log("dx:", dx, "dy:", dy); // ⭐调试用

  // 👉 右滑打开菜单
  if (dx > 25 && dx > dy) {
    e.preventDefault();
    e.stopPropagation();
    showResetMenu(e.pageX, e.pageY);
    return;
  }

  // 👉 点击才重置
  resetAll();
});

  undoBtn.addEventListener("click", undo);
  if (undoBtn) {
  undoBtn.onclick = undo;
}
});

/* ===== 菜单 ===== */
function showResetMenu(x, y) {
  const menu = document.getElementById("resetMenu");
  const typeBox = document.getElementById("typeList");
  const nameBox = document.getElementById("nameList");

  menu.style.display = "block";

  const menuW = 240;
  const menuH = 300;

  const padding = 10;

  const maxX = window.innerWidth - menuW - padding;
  const maxY = window.innerHeight - menuH - padding;

  // ⭐限制在屏幕内
  const left = Math.min(Math.max(padding, x), maxX);
  const top = Math.min(Math.max(padding, y), maxY);

  menu.style.position = "fixed";
  menu.style.left = "50%";
  menu.style.top = "50%";
  menu.style.transform = "translate(-50%, -50%)";

  // ===== 属性 =====
  let typeMap = {};
  items.forEach(item => {
    (Array.isArray(item.type) ? item.type : [item.type]).forEach(t => {
      typeMap[t] = true;
    });
  });

  typeBox.innerHTML = "<b>属性</b>";
  Object.keys(typeMap).forEach(t => {
    let div = document.createElement("div");
    div.className = "menu-item";
    div.innerText = t;
    div.onclick = () => {
      resetByType(t);
      hideMenu();
    };
    typeBox.appendChild(div);
  });

  // ===== 宠物 =====
  nameBox.innerHTML = "<b>宠物</b>";
  items.forEach(item => {
    let div = document.createElement("div");
    div.className = "menu-item";
    div.innerText = item.name;
    div.onclick = () => {
      item.count = 0;
      save();
      render();
      hideMenu();
    };
    nameBox.appendChild(div);
  });
}

function hideMenu() {
  const menu = document.getElementById("resetMenu");
  if (menu) menu.style.display = "none";
}

document.addEventListener("click", hideMenu);

/* ===== 功能 ===== */
function resetByType(type) {
  items.forEach(item => {
    let types = Array.isArray(item.type) ? item.type : [item.type];
    if (types.includes(type)) item.count = 0;
  });
  save();
  render();
}

function resetAll() {
  items.forEach(i => i.count = 0);
  save();
  render();
}

function undo() {
  if (!historyStack.length) return;
  items = JSON.parse(historyStack.pop());
  save();
  render();
}

/* ===== 存档 ===== */
function save() {
  localStorage.setItem("items", JSON.stringify(items));
}

function loadData() {
  let data = localStorage.getItem("items");
  if (data) items = JSON.parse(data);
}

/* ===== 渲染 ===== */
function render() {
  const container = document.getElementById("container");
  if (!container) return;

  container.innerHTML = "";

  // ✅ 自动布局（不强制列数）
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fill, minmax(80px, 1fr))";
  container.style.gap = "6px";
  container.style.padding = "6px";

  // 避免统计栏被挤压
  container.style.alignItems = "start";

  items.forEach((item, index) => {
    const div = createItem(item, index);
    container.appendChild(div);
  });

  updateStats();
}

function createItem(item, index) {
  const div = document.createElement("div");

  const img = new Image(); // ⭐预加载
  img.src = item.img;
  img.loading = "eager";

  div.className = "item";

  div.appendChild(img);
  img.style.width = "80%";

  div.innerHTML += `
    <div>${item.name}</div>
    <div class="count ${item.count > 0 ? "active" : ""}">
      ${item.count}
    </div>
  `;

  bindGesture(div, index);
  return div;
}

function getSlot(index) {
  const row = Math.floor(index / 6);
  const col = index % 6;

  return { row, col };
}

/* ===== 点击/滑动 ===== */
function bindGesture(el, index) {
  let startX = 0;
  let startY = 0;
  let moved = false;
  let timer = null;

  const SWIPE = 25;

  el.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    moved = false;

    // ❗锁住手势
    el.setPointerCapture(e.pointerId);

    timer = setTimeout(() => {
      if (!moved) {
        let v = prompt("输入数量");
        if (v !== null) {
          items[index].count = parseInt(v) || 0;
          save();
          render();
        }
      }
    }, 600);
  });

  el.addEventListener("pointermove", (e) => {
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      moved = true;
      clearTimeout(timer);
    }
  });

  el.addEventListener("pointerup", (e) => {
    clearTimeout(timer);
    el.releasePointerCapture(e.pointerId);

    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    // ⭐⭐⭐ 核心：先判断滑动
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE) {

      if (dx > 0) {
        // 👉 右滑 -1
        items[index].count = Math.max(0, items[index].count - 1);
      } else {
        // 👉 左滑 +1（可选）
        items[index].count++;
      }

      save();
      render();
      return;
    }

    // 👉 点击 +1
    if (!moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) {
      items[index].count++;
      save();
      render();
    }
  });

  el.addEventListener("pointercancel", () => {
    clearTimeout(timer);
  });
}

/* ===== 统计 ===== */
function updateStats() {
  let stats = {};

  items.forEach(item => {
    (Array.isArray(item.type) ? item.type : [item.type]).forEach(t => {
      if (t === "虫系") return;
      stats[t] = (stats[t] || 0) + item.count;
    });
  });

  const box = document.getElementById("stats");
  box.innerHTML = "";

  Object.entries(stats).forEach(([k, v]) => {
    const div = document.createElement("div");
    div.className = "stat-item";

    div.textContent = `${k}: ${v}`;

    // ⭐只要不是0就变黑
    if (v > 0) {
      div.classList.add("active");
    }

    box.appendChild(div);
  });
}
