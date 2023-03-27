import { createRouter, createWebHistory } from "vue-router";
import EnterView from "@/views/EnterView.vue";
import BlogView from "@/views/BlogView";
import MapView from "@/views/MapView";
import AuthView from "@/views/AuthView";
import AdminView from "@/views/AdminView";
import CoordsView from "@/views/CoordsView";

const routes = [
  {
    path: "/",
    name: "enter",
    component: EnterView,
    meta: { userArea: "" },
  },
  {
    path: "/blog",
    name: "blog",
    component: BlogView,
    meta: { userArea: "map" },
  },
  {
    path: "/map",
    name: "map",
    component: MapView,
    meta: { userArea: "blog" },
  },
  {
    path: "/auth",
    name: "auth",
    component: AuthView,
    meta: { userArea: "" },
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: { userArea: "coords" },
  },
  {
    path: "/coords",
    name: "coords",
    component: CoordsView,
    meta: { userArea: "admin" },
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import("../views/404View.vue"),
    meta: { userArea: "" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
