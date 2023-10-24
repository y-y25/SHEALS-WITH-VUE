import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home";
import Login from "../views/Login.vue";
import ItemDetails from "../views/ItemDetails.vue";
import StoreHome from "../views/StoreHome.vue";
import Dashboard from "../views/Dashboard.vue";
import AddDealStore from "../views/AddDealStore.vue";
import DealListStore from "../views/DealListStore.vue";
import UpdateDeal from "../views/UpdateDeal.vue"


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: "/item/:id", // Assuming you have a route parameter for the item ID
    name: "item-detail",
    component: ItemDetails,

  },

  {
    path: "/storehome",
    component: StoreHome,
    children: [
      {
        // Dashboard.vue will be rendered inside StoreHome's <router-view>
        // when /storehome is matched
        path: '',
        name:'Dashboard',
        component: Dashboard,
      },
      {
        path: 'dealaddstore',
        name:'AddDealStore',
        component: AddDealStore,
      },
      {
        path: 'dealliststore',
        name:'DealListStore',
        component: DealListStore,
      },
      {
        path: 'updatedeal/:id',
        name:'UpdateDeal',
        component: UpdateDeal,
      }
    ]

  },

]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router;
