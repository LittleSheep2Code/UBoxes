const routes = [
  {
    path: "/plugins",
    component: () => import("components/PluginsRenderer")
  },

  {
    path: "/main",
    component: () => import("layouts/BasicLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") }
    ]
  },

  {
    path: "/",
    redirect: "/main",
  }
]

export default routes
