import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    component: () => import("../views/Index.vue")
  }
]

const router = new VueRouter({
  linkActiveClass: "active",
  base: process.env.BASE_URL,
  routes
})

export default router
