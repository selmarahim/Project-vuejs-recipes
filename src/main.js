import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';


import App from './App.vue';

import MenuSemaine from './components/MenuSemaine.vue';
import MenuInput from './components/MenuInput.vue';
import RecipeAdd from './components/RecipeAdd.vue';
import RecipeList from './components/RecipeList.vue';
import RecipeSearch from './components/RecipeSearch.vue';
const routes = [
  { path: '/', component: App }, // Add this route for the root path
 
  { path: '/menu-semaine', component: MenuSemaine },
  {path: '/menu-input',component: MenuInput,}, 
  {path: '/recipe-add',component: RecipeAdd,}, 
  {path: '/recipe-list',component: RecipeList,}, 
  {path: '/recipe-search',component: RecipeSearch,}, 
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app');
