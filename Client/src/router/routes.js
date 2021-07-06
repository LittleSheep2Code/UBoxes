const routes = [
  {
    path: "/plugins",
    component: () => import("components/PluginsRenderer")
  },

  {
    path: "/settings",
    component: () => import("layouts/BasicLayout"),
    children: [
      { path: "", component: () => import("pages/Settings") }
    ]
  },

  {
    path: "/main",
    component: () => import("layouts/BasicLayout"),
    children: [
      { path: "", component: () => import("pages/Index") }
    ]
  },

  {
    path: "/",
    redirect: "/main",
  }
]

export default routes
