import { generatePalette } from "./palette-generator.js";
import { copyText } from "./clipboard.js";

const paletteEl = document.getElementById("palette");
const baseColor = document.getElementById("baseColor");
const saturation = document.getElementById("saturation");
const lightness = document.getElementById("lightness");
const harmony = document.getElementById("harmony");

let state = {
  palette: []
};

function renderPalette(colors) {
  paletteEl.innerHTML = "";

  colors.forEach(color => {
    const div = document.createElement("div");
    div.className = "swatch";
    div.style.background = color;

    div.onclick = async () => {
      await copyText(color);
    };

    paletteEl.appendChild(div);
  });
}

function update() {
  state.palette = generatePalette({
    base: baseColor.value || null,
    saturation: +saturation.value,
    lightness: +lightness.value,
    harmony: harmony.value
  });

  renderPalette(state.palette);
}

document.getElementById("shuffleBtn").onclick = () => update();

document.getElementById("copyBtn").onclick = async () => {
  await copyText(JSON.stringify(state.palette, null, 2));
};

document.getElementById("themeBtn").onclick = () => {
  document.body.classList.toggle("dark");
};

baseColor.oninput = update;
saturation.oninput = update;
lightness.oninput = update;
harmony.onchange = update;

update();