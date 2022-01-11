import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/comment",
    },
    {
      path: "/comment",
      component: () => import("@/views/comment.vue"),
    },
    {
      path: "/main-pic",
      component: () => import("@/views/main-pic.vue"),
    },
  ],
});

export default router;
