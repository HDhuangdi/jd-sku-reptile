<template>
  <div id="app">
    <router-view></router-view>
  </div>
  <div id="cursor-text-container"></div>
</template>

<script>
const textList = [
  { value: "富强♥", color: "rgb(235, 109, 240)" },
  { value: "民主♥", color: "rgb(109, 209, 240)" },
  { value: "文明♥", color: "rgb(108, 202, 186)" },
  { value: "和谐♥", color: "rgb(150, 233, 95)" },
  { value: "自由♥", color: "rgb(233, 219, 95)" },
  { value: "平等♥", color: "rgb(62, 169, 240" },
  { value: "公正♥", color: "rgb(116, 102, 236)" },
  { value: "法治♥", color: "rgb(189, 121, 228)" },
  { value: "爱国♥", color: "rgb(228, 121, 196)" },
  { value: "敬业♥", color: "rgb(191, 226, 144)" },
  { value: "诚信♥", color: "rgb(99, 189, 139)" },
  { value: "友善♥", color: "rgb(224, 120, 88)" },
];
let cursorTextIndex = 0;
let clearTimer = 0;

function useMouseClick() {
  window.addEventListener("click", mouseClickHandler);

  function mouseClickHandler(e) {
    if (clearTimer) {
      clearTimeout(clearTimer);
    }

    if (cursorTextIndex >= textList.length) {
      cursorTextIndex = 0;
    }
    const text = document.createElement("div");
    const container = document.getElementById("cursor-text-container");
    text.className = "tag";
    text.style.color = textList[cursorTextIndex].color;
    text.style.position = "absolute";
    text.style.top = e.clientY + "px";
    text.style.left = e.clientX + "px";
    text.textContent = textList[cursorTextIndex].value;
    container.appendChild(text);
    clearTimer = setTimeout(() => {
      container.innerHTML = "";
    }, 5000);

    cursorTextIndex++;
  }
}
export default {
  setup() {
    return {
      ...useMouseClick(),
    };
  },
};
</script>

<style lang="less">
@keyframes textShow {
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
  100% {
    transform: translate(0%, -200%);
    opacity: 0;
    display: none;
  }
}

#cursor-text-container {
  color: #fff;
  .tag {
    user-select: none;
    animation: textShow 1s forwards;
  }
}
</style>
