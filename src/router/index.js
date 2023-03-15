import { createRouter, createWebHistory } from "vue-router";
import EnterView from "@/views/EnterView.vue";
import BlogView from "@/views/BlogView";
import MapView from "@/views/MapView";
import AuthView from "@/views/BlogView";
import AdminView from "@/views/AdminView";

const routes = [
  {
    path: "/",
    name: "enter",
    component: EnterView,
  },
  {
    path: "/blog",
    name: "blog",
    component: BlogView,
  },
  {
    path: "/map",
    name: "map",
    component: MapView,
  },
  {
    path: "/auth",
    name: "auth",
    component: AuthView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import("../views/404View.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
