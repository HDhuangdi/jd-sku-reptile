import { createApp } from "vue";
import { ElButton, ElInput } from "element-plus";
import App from "./App.vue";
import "./assets/base.css";

const app = createApp(App);

app.component(ElButton.name, ElButton);
app.component(ElInput.name, ElInput);

app.mount("#app");
