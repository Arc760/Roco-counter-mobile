// 数据
const items = [
  { name: "柴渣虫",type: ["火系"],count: 0,img: "./roco-image/chai.png"},

  { name: "双灯鱼", type: ["水系"],count: 0, img: "./roco-image/fish.png"},

  { name: "月牙雪熊", type: ["冰系"], count: 0, img: "./roco-image/bear.png"},

  { name: "粉粉星", type: ["电系"], count: 0, img: "./roco-image/star.png"},

  { name: "空空颅", type: "幽系", count: 0, img: "./roco-image/skull.png"},

  { name: "嗜光嗡嗡", type: ["恶系"], count: 0, img: "./roco-image/mosquito.png"},

  { name: "贝瑟", type: ["机械系"], count: 0, img: "./roco-image/pot.png"},

  { name: "粉星仔", type: "幻系", count: 0, img: "./roco-image/zai.png"},

  { name: "格兰种子", type: "草系", count: 0, img: "./roco-image/seed.png"},

  { name: "奇丽草", type: "草系", count: 0, img: "./roco-image/grass.png"},

  { name: "治愈兔", type: ["火系"], count: 0, img: "./roco-image/rabbit.png"},

  { name: "呼呼猪", type: ["冰系"], count: 0, img: "./roco-image/pig.png"},

  { name: "大耳帽兜", type: ["冰系"], count: 0, img: "./roco-image/dou.png"},

  { name: "拉特", type: "电系", count: 0, img: "./roco-image/rai.png"},

  { name: "恶魔狼", type: "恶系", count: 0, img: "./roco-image/wolf.png"},

  { name: "机械方方", type: "机械系", count: 0, img: "./roco-image/cube.png"},

  { name: "绒绒", type: "绒绒", count: 0, img: "./roco-image/rong.png"},

  { name: "犀角鸟", type: "犀角鸟", count: 0, img: "./roco-image/mop.png"},

  { name: "火红尾", type: "火系", count: 0, img: "./roco-image/horse.png"},

  { name: "果冻", type: "水系", count: 0, img: "./roco-image/jelly.png"},

  { name: "星尘虫", type: "虫系", count: 0, img: "./roco-image/ladybug.png"},

  { name: "影狸", type: "幽系", count: 0, img: "./roco-image/fox.png"},
];

// 渲染
function render() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  items.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <img src="${item.img}">
      <div>${item.name}</div>
      <div>${item.count}</div>
    `;

    bindGesture(div, i);
    container.appendChild(div);
  });
}

// 手势
function bindGesture(el, index) {
  let startX = 0;
  let moved = false;
  let pressTimer = null;
  let isLongPress = false;

  el.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    moved = false;
    isLongPress = false;

    pressTimer = setTimeout(() => {
      isLongPress = true;

      let value = prompt("输入数量");
      if (value !== null) {
        items[index].count = parseInt(value) || 0;
        render();
      }
    }, 600);
  });

  el.addEventListener("pointermove", (e) => {
    if (Math.abs(e.clientX - startX) > 10) {
      moved = true;
      clearTimeout(pressTimer);
    }
  });

  el.addEventListener("pointerup", (e) => {
    clearTimeout(pressTimer);

    if (isLongPress) return;

    let dx = e.clientX - startX;

    if (dx > 30) {
      items[index].count--;
    } else if (!moved) {
      items[index].count++;
    }

    render();
  });
}

// 启动
render();
