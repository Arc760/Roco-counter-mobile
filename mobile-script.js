function render() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  const COLS = 6;
  const ROWS = 4;

  let grid = Array(24).fill(null);

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {

      const i = col * ROWS + row;

      const isEmpty =
        (col === 4 && row === 3) ||
        (col === 5 && row === 3);

      grid[i] = isEmpty ? { empty: true } : null;
    }
  }

  let itemIndex = 0;

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === null) {
      grid[i] = items[itemIndex++] || { empty: true };
    }
  }

  grid.forEach((item, i) => {
    container.appendChild(createItem(item, i));
  });

  console.log("items:", items.length);
  console.log("used:", itemIndex);

  // ⭐⭐⭐ 就是缺这个
  updateStats();
}
