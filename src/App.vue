<template>
  <div>
    <!-- Lien vers la page de recettes -->
    
    <!-- Lien vers la page du menu de la semaine -->
    <router-link to="/menu-semaine">Generer menu semaine</router-link>

    <router-link to="/menu-input">Menu Input</router-link>
    <router-link to="/recipe-add">Recipe add</router-link>
    <router-link to="/recipe-list">Recipe List</router-link>
    <router-link to="/recipe-search">Recipe Search</router-link>
    <!-- Le routeur affichera les composants ici -->
    <router-view />
  </div>
</template>

<script>
/*
import MenuSemaine from './components/MenuSemaine.vue';
import Recettes from './components/Recettes.vue';

export default {
  components: {
    Recettes,
    MenuSemaine
  }
};
*/
</script>

<style></style>
