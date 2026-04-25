let items = [];
let history = [];

const COLS = 6;
const ROWS = 4;

/* ===== 数据（绝对不会错位） ===== */
items = [
  { name:"柴渣虫",type:["火系"],count:0,img:"./roco-image/chai.png" },
  { name:"双灯鱼",type:["水系"],count:0,img:"./roco-image/fish.png" },
  { name:"月牙雪熊",type:["冰系"],count:0,img:"./roco-image/bear.png" },
  { name:"粉粉星",type:["电系"],count:0,img:"./roco-image/star.png" },

  { name:"空空颅",type:["幽系"],count:0,img:"./roco-image/skull.png" },
  { name:"嗜光嗡嗡",type:["恶系"],count:0,img:"./roco-image/mosquito.png" },
  { name:"贝瑟",type:["机械系"],count:0,img:"./roco-image/pot.png" },
  { name:"粉星仔",type:["幻系"],count:0,img:"./roco-image/zai.png" },

  { name:"格兰种子",type:["草系"],count:0,img:"./roco-image/seed.png" },
  { name:"奇丽草",type:["草系"],count:0,img:"./roco-image/grass.png" },
  { name:"治愈兔",type:["火系"],count:0,img:"./roco-image/rabbit.png" },
  { name:"呼呼猪",type:["冰系"],count:0,img:"./roco-image/pig.png" },

  { name:"大耳帽兜",type:["冰系"],count:0,img:"./roco-image/dou.png" },
  { name:"拉特",type:["电系"],count:0,img:"./roco-image/rai.png" },
  { name:"恶魔狼",type:["恶系"],count:0,img:"./roco-image/wolf.png" },
  { name:"机械方方",type:["机械系"],count:0,img:"./roco-image/cube.png" },

  { name:"绒绒",type:["绒绒"],count:0,img:"./roco-image/rong.png" },
  { name:"犀角鸟",type:["犀角鸟"],count:0,img:"./roco-image/mop.png" },
  { name:"火红尾",type:["火系"],count:0,img:"./roco-image/horse.png" },

  { name:"果冻",type:["水系"],count:0,img:"./roco-image/jelly.png" },
  { name:"星尘虫",type:["虫系"],count:0,img:"./roco-image/ladybug.png" },
  { name:"影狸",type:["幽系"],count:0,img:"./roco-image/fox.png" }
];

/* ===== 初始化 ===== */
window.addEventListener("DOMContentLoaded", () => {
  load();
  render();

  document.querySelector(".reset-btn").addEventListener("click", resetAll);
  document.querySelector(".undo-btn").addEventListener("click", undo);
});

/* ===== 渲染（核心修复点） ===== */
function render() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  let grid = Array(COLS * ROWS).fill(null);

  let idx = 0;

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {

      const i = col * ROWS + row;

      const empty =
        (col === 4 && row === 3) ||
        (col === 5 && row === 3);

      if (empty) {
        grid[i] = { empty:true };
      } else {

        // ✅ 防越界（关键修复）
        if (idx < items.length) {
          grid[i] = {
            ...items[idx],
            realIndex: idx
          };
        } else {
          grid[i] = { empty:true };
        }

        idx++;
      }
    }
  }

  grid.forEach(item => {
    container.appendChild(createItem(item));
  });

  updateStats();
}

/* ===== 创建卡片 ===== */
function createItem(item) {
  const div = document.createElement("div");

  if (!item || item.empty || !item.img) {
    div.className = "item empty";
    return div;
  }

  div.className = "item";

  div.innerHTML = `
    <img src="${item.img}">
    <div>${item.name}</div>
    <div class="count ${item.count ? "active" : ""}">
      ${item.count}
    </div>
  `;

  bind(div, item.realIndex);
  return div;
}

const resetBtn = document.querySelector(".reset-btn");

let startX = 0;
let startY = 0;

window.addEventListener("DOMContentLoaded", () => {

  const resetBtn = document.querySelector(".reset-btn");

  if (!resetBtn) {
    console.log("resetBtn没找到");
    return;
  }

  resetBtn.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  });

  resetBtn.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];

    let dx = t.clientX - startX;
    let dy = Math.abs(t.clientY - startY);

    console.log("swipe:", dx, dy);

    // 👉 右滑
    if (dx > 40 && dx > dy) {
      showResetMenu(t.clientX, t.clientY);
      return;
    }

    // 👉 点击重置
    resetAll();
  });
});

function showResetMenu(x, y) {
  const menu = document.getElementById("resetMenu");
  const typeBox = document.getElementById("typeList");
  const petBox = document.getElementById("petList");

  menu.style.display = "flex";
  menu.style.left = "50%";
  menu.style.top = "80px";

  // 清空
  typeBox.innerHTML = "";
  petBox.innerHTML = "";

  // ===== 属性 =====
  let types = new Set();
  items.forEach(i => (i.type || []).forEach(t => types.add(t)));

  types.forEach(t => {
    let div = document.createElement("div");
    div.className = "menu-item";
    div.innerText = t;

    div.onclick = () => {
      items.forEach(i => {
        if ((i.type || []).includes(t)) i.count = 0;
      });
      save();
      render();
      hideMenu();
    };

    typeBox.appendChild(div);
  });

  // ===== 宠物 =====
  items.forEach((i, index) => {
    let div = document.createElement("div");
    div.className = "menu-item";
    div.innerText = i.name;

    div.onclick = () => {
      i.count = 0;
      save();
      render();
      hideMenu();
    };

    petBox.appendChild(div);
  });
}

function hideMenu() {
  document.getElementById("resetMenu").style.display = "none";
}

document.addEventListener("touchstart", hideMenu);

function getAllTypes() {
  let set = new Set();

  items.forEach(i => {
    (i.type || []).forEach(t => set.add(t));
  });

  return [...set];
}

function getAllTypes() {
  let set = new Set();

  items.forEach(i => {
    (i.type || []).forEach(t => set.add(t));
  });

  return [...set];
}

function hideMenu(){
  document.getElementById("resetMenu").style.display = "none";
}

document.addEventListener("click", hideMenu);

function resetByType(type){
  items.forEach(i => {
    if ((i.type || []).includes(type)) {
      i.count = 0;
    }
  });

  save();
  render();
}

/* ===== 手势 ===== */
function bind(el, index) {
  let startX = 0;
  let startY = 0;
  let timer;

  el.addEventListener("touchstart", e => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;

    timer = setTimeout(() => {
      const v = prompt("输入数量");
      if (v !== null) {
        items[index].count = +v || 0;
        save();
        render();
      }
    }, 500);
  });

  el.addEventListener("touchend", e => {
    clearTimeout(timer);

    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = Math.abs(t.clientY - startY);

    if (dx > 40 && dx > dy) {
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
function resetAll(){
  items.forEach(i=>i.count=0);
  save();
  render();
}

/* ===== 撤回 ===== */
function undo(){
  const last = history.pop();
  if(!last) return;
  items = JSON.parse(last);
  render();
}

/* ===== 存储 ===== */
function save(){
  history.push(JSON.stringify(items));
  localStorage.setItem("items",JSON.stringify(items));
}

function load(){
  const data = localStorage.getItem("items");
  if(data) items = JSON.parse(data);
}

/* ===== 统计（稳定版） ===== */
function updateStats(){
  let stats = {};

  items.forEach(item=>{
    (item.type || []).forEach(t=>{
      stats[t] = (stats[t] || 0) + (item.count || 0);
    });
  });

  delete stats["虫系"];

  document.getElementById("stats").innerText =
    Object.entries(stats)
      .map(([k,v])=>`${k}:${v}`)
      .join(" ") || "暂无数据";
}
