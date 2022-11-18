import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'languageRedirect',
    component:() => import('../components/languageRedirect')
  },
  {
    path: '/fr/',
    name: 'homeFR',
    component: () => import('../views/HomeView')
  },
  {
    path: '/en/',
    name: 'homeEN',
    component: () => import('../views/HomeView')
  },
  {
    path: '/fr/pokemon/:id',
    name: 'detailsFR',
    component: () => import('../views/DetailsView')
  },
  {
    path: '/en/pokemon/:id',
    name: 'detailsEN',
    component: () => import('../views/DetailsView')
  },
  {
    path: '/en/search/:search',
    name: 'searchEN',
    component: () => import('../views/SearchView')
  },
  {
    path: '/fr/search/:search',
    name: 'searchFR',
    component: () => import('../views/SearchView')
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error404",
    component:() => import('../views/error404')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
