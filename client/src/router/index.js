import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Import.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'import',
    component: Home
  },
  {
    path: '/export',
    name: 'export',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Export.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
