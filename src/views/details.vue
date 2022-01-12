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
        <el-button :disabled="buttonDisabled" type="primary" @click="query"
          >开始下崽</el-button
        >
      </form>
    </main>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import axios from "axios";

class Title {
  static default = "京东主图、详情爬虫工具";
  static enter = "京东主图、详情爬虫工具";
  static loading = "下崽ing...";
  static end = "京东主图、详情爬虫工具";
}

function useApp(setTitle) {
  let sku = ref("");

  let buttonDisabled = ref(true);

  watch(sku, (newVal) => {
    if (newVal.value !== "") {
      buttonDisabled.value = false;
    }
  });

  async function query() {
    let loadingInstance = ElLoading.service({ target: "form" });
    setTitle(Title.loading);
    try {
      const res = await axios({
        url: `/api/details/get?sku=${sku.value}`,
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

export default {
  setup() {
    const titleState = useTitle();

    return {
      ...useApp(titleState.setTitle),
      ...titleState,
    };
  },
};
</script>

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
