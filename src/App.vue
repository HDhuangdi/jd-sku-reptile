<template>
  <div class="main">
    <header
      @mouseenter="titleMouseEnterHandler"
      @mouseleave="titleMouseLeaveHandler"
    >
      {{ title }}
    </header>
    <main>
      <form class="flex-box">
        <div class="form-item flex-box">
          <span>sku:</span>
          <el-input v-model="sku" placeholder="这里写sku"></el-input>
        </div>
        <div class="form-item flex-box">
          <span>页码:</span>
          <el-input
            v-model="page"
            placeholder="这里写评论的页码,页码从0开始"
          ></el-input>
        </div>
        <div class="form-item flex-box">
          <span>页容量:</span>
          <el-input
            v-model="pageSize"
            placeholder="打算一页放多少个评论呢?"
          ></el-input>
        </div>
        <el-button :disabled="buttonDisabled" type="primary" @click="query"
          >开始下载</el-button
        >
      </form>
    </main>
  </div>
  <div id="cursor-text-container"></div>
</template>

<script>
import { ref, watch } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import axios from "axios";

class Title {
  static default = "京东sku评论爬虫工具";
  static enter = "京东sku评论爬虫工具";
  static loading = "爬取数据ing...";
  static end = "京东sku评论爬虫工具";
}

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

function useApp(setTitle) {
  let sku = ref("");
  let page = ref("0");
  let pageSize = ref("10");
  let buttonDisabled = ref(true);

  watch(sku, (newVal) => {
    if (newVal.value !== "" && page.value !== "" && pageSize.value !== "") {
      buttonDisabled.value = false;
    }
  });
  watch(page, (newVal) => {
    if (newVal.value !== "" && sku.value !== "" && pageSize.value !== "") {
      buttonDisabled.value = false;
    }
  });
  watch(pageSize, (newVal) => {
    if (newVal.value !== "" && page.value !== "" && sku.value !== "") {
      buttonDisabled.value = false;
    }
  });

  async function query() {
    if (isNaN(Number(page.value))) {
      ElMessage.error("错了哦，请输入正确的页码");
    }
    if (isNaN(Number(pageSize.value))) {
      ElMessage.error("错了哦，请输入正确的页容量");
    }
    let loadingInstance = ElLoading.service({ target: "form" });
    setTitle(Title.loading);
    try {
      const res = await axios({
        url: `/daidaiapi?sku=${sku.value}&page=${page.value}&pageSize=${pageSize.value}`,
        method: "get",
        responseType: "blob",
      });
      const filename = res.headers["content-disposition"].match(
        /filename=(.*)/
      )[1];
      download(res.data, filename);
    } catch (e) {
      if (e.response && e.response.data) {
        ElMessage.error("出错了, 错误详情: " + e.response.data);
      } else {
        ElMessage.error("出错了, 错误详情: " + e.message);
      }
    } finally {
      loadingInstance.close();
      setTitle(Title.end);
    }
  }

  function download(blob, filename) {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = blobUrl;
    link.setAttribute("download", decodeURI(filename));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  return {
    sku,
    page,
    pageSize,
    buttonDisabled,
    query,
  };
}

function useTitle() {
  let title = ref(Title.default);

  function setTitle(newTitle) {
    title.value = newTitle;
  }

  function titleMouseEnterHandler() {
    if (title.value === Title.default) {
      setTitle(Title.enter);
    }
  }
  function titleMouseLeaveHandler() {
    if (title.value !== Title.default) {
      setTitle(Title.default);
    }
  }

  return { title, titleMouseEnterHandler, titleMouseLeaveHandler, setTitle };
}

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
    const titleState = useTitle();

    return {
      ...useApp(titleState.setTitle),
      ...titleState,
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
<style lang="less" scoped>
.main {
  width: 50%;
  height: 50%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

header {
  font-size: 50px;
  font-weight: lighter;
  color: gray;
  text-align: center;
  margin-bottom: 20px;
  cursor: grab;
  user-select: none;
}
form {
  flex-direction: column;
  .form-item {
    width: 100%;
    margin-bottom: 20px;
    span {
      flex: 1;
      display: block;
    }
    .el-input {
      flex: 5;
    }
  }
  .el-button {
    width: 80%;
  }
}
</style>
