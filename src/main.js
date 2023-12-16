import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';


import App from './App.vue';
import Home from './components/Home.vue';
import Authentification from './components/Authentification.vue';
import MenuSemaine from './components/MenuSemaine.vue';
import MenuInput from './components/MenuInput.vue';
import RecipeAdd from './components/RecipeAdd.vue';
import RecipeList from './components/RecipeList.vue';
import RecipeSearch from './components/RecipeSearch.vue';
import foodly from './components/foodly.vue';
const routes = [
  { path: '/', component: Home }, 
  { path: '/home', component: Home },
  { path: '/menu-semaine', component: MenuSemaine },
  {path: '/menu-input',component: MenuInput,}, 
  {path: '/recipe-add',component: RecipeAdd,}, 
  {path: '/recipe-list',component: RecipeList,}, 
  {path: '/recipe-search',component: RecipeSearch,}, 
  {path: '/authentification', component: Authentification},
  {path: '/foodly', component: foodly}
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app');
