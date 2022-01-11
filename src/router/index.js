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
      path: "/details",
      component: () => import("@/views/details.vue"),
    },
  ],
});

export default router;
