<template>
  <div>
    <h1 class="title"><i class="fas fa-calendar icon-style"></i>Générateur de Menu</h1>
    <p class="planification-text">Pas le temps et pas d'idées ? Laissez-nous vous générer un bon menu de la semaine avec des recettes différentes à chaque repas 😋</p>
    

    <table v-if="menuGenerated && !shoppingListGenerated" class="menu-table">
      <thead>
        <tr>
          <th>Jour</th>
          <th>Petit Déjeuner</th>
          <th>Déjeuner</th>
          <th>Dîner</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(day, index) in days" :key="index">
          <td>{{ day }}</td>
          <td>{{ menu[index].breakfast.name }}</td>
          <td>{{ menu[index].lunch.name }}</td>
          <td>{{ menu[index].dinner.name }}</td>
        </tr>
      </tbody>
    </table>
    <br>
    
    <button @click="generateMenu" class="action-button">
      <i class="fas fa-utensils icon-style"></i> Générer le Menu
    </button>

    <button v-if="menuGenerated && !shoppingListGenerated" @click="generateShoppingList" class="action-button">
      <i class="fas fa-shopping-cart icon-style"></i> Générer la Liste des Courses
    </button>
    
    <div v-if="shoppingListGenerated" class="shopping-list alert-box">
      <h2><i class="fas fa-fw fa-shopping-cart icon-style"></i> Liste des Courses</h2>
      
      <ul class="shopping-list-items">
        <li v-for="(item, index) in shoppingList" :key="index">
          {{ item.name }}: {{ item.quantity }} {{ item.unit }}
        </li>
      </ul>
      <button @click="toggleShoppingList" class="action-button">
        <i class="fas fa-times icon-style"></i> Fermer
      </button>
    </div>
    <div v-if="!isUserConnected" class="notification">
      <p>Vous devez être connecté pour générer un menu !</p>
      <router-link to="/authentification" class="auth-link">Se connecter</router-link>
    </div>
  </div>
</template>

<script>
import { openDB } from 'idb';

export default {
  data() {
    return {
      db: null,
      user: null,
      days: ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi','Samedi'],
      menu: [
        { breakfast: {}, lunch: {}, dinner: {} }, // Dimanche
        { breakfast: {}, lunch: {}, dinner: {} }, // Lundi
        { breakfast: {}, lunch: {}, dinner: {} }, // Mardi
        { breakfast: {}, lunch: {}, dinner: {} }, // Mercredi
        { breakfast: {}, lunch: {}, dinner: {} }, // Jeudi
        { breakfast: {}, lunch: {}, dinner: {} }, // Vendredi
        { breakfast: {}, lunch: {}, dinner: {} }, // Samedi
      ],
      menuGenerated: false,
      recipes: [],
      shoppingListGenerated: false,
      shoppingList: [],
      isUserConnected: true,
    };
  },
  async created() {
    await this.initDB();
    this.user = await this.getUser();
    await this.loadRecipes();
  },
  methods: {
    async initDB() {
      try {
        this.db = await openDB('projet', 5, {
          upgrade(db, oldVersion) {
            if (oldVersion < 1) {
              db.deleteObjectStore('recettes');
            }

            const recettesStore = db.createObjectStore('recettes', { keyPath: 'id', autoIncrement: true });
            recettesStore.createIndex('userId', 'userId', { unique: false });

            if (!db.objectStoreNames.contains('utilisateurs')) {
              const utilisateursStore = db.createObjectStore('utilisateurs', { keyPath: 'id', autoIncrement: true });
              utilisateursStore.createIndex('username', 'username', { unique: true });
            }
          },
        });
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
      }
    },
    async getUser() {
      const userId = localStorage.getItem('userId');

      if (userId && userId.trim() !== '') {
        const tx = this.db.transaction('utilisateurs');
        const utilisateurStore = tx.objectStore('utilisateurs');
        return utilisateurStore.get(parseInt(userId));
      } else {
        console.error('La clé userId dans le localStorage n\'est pas valide.');
        return null;
      }
    },
    async loadRecipes() {
  const tx = this.db.transaction('recettes', 'readonly');
  const store = tx.objectStore('recettes');
  this.recipes = await store.getAll();
}
,
    async generateMenu() {
    try {
      const user = await this.getUser();
      if (!user) {
        console.error('Utilisateur non connecté');
        
          this.isUserConnected = false;
        return;
      }

      const tx = this.db.transaction('recettes', 'readonly');
      const store = tx.objectStore('recettes');

      this.menu.forEach(dayMenu => {
        // Petit déjeuner
        const breakfastRecipes = this.recipes
          .filter(recipe => recipe.userId === user.id && this.isBreakfastMatch(recipe));
        const randomBreakfastRecipeId = this.getRandomRecipeId(breakfastRecipes.map(recipe => recipe.id));
        const randomBreakfastRecipe = this.recipes.find(recipe => recipe.id === randomBreakfastRecipeId);
        dayMenu['breakfast'] = randomBreakfastRecipe || {};

        // Déjeuner
        const lunchRecipes = this.recipes
          .filter(recipe => recipe.userId === user.id && !this.isBreakfastMatch(recipe));
        const randomLunchRecipeId = this.getRandomRecipeId(lunchRecipes.map(recipe => recipe.id));
        const randomLunchRecipe = this.recipes.find(recipe => recipe.id === randomLunchRecipeId);
        dayMenu['lunch'] = randomLunchRecipe || {};

        // Dîner
        const dinnerRecipes = this.recipes
          .filter(recipe => recipe.userId === user.id && !this.isBreakfastMatch(recipe));
        const randomDinnerRecipeId = this.getRandomRecipeId(dinnerRecipes.map(recipe => recipe.id));
        const randomDinnerRecipe = this.recipes.find(recipe => recipe.id === randomDinnerRecipeId);
        dayMenu['dinner'] = randomDinnerRecipe || {};
      });

      this.menuGenerated = true;
    } catch (error) {
      console.error('Erreur lors de la génération du menu:', error);
    }
  },
  isMealTypeMatch(recipe, mealType, dayMenu) {
    
    switch (mealType) {
      case 'lunch':
       
        return true;
      case 'dinner':
        
        return true;
      default:
        return true;
    }
  },
  isBreakfastMatch(recipe) {
    
    return recipe.category === 'petitdej';
  },
  
    getRandomRecipeId(recipeIds) {
      const randomIndex = Math.floor(Math.random() * recipeIds.length);
      return recipeIds[randomIndex];
    },
    generateShoppingList() {
      const shoppingList = {};

      this.menu.forEach(dayMenu => {
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
          const recipeId = dayMenu[mealType].id;
          if (recipeId) {
            const recipe = this.recipes.find(recipe => recipe.id === recipeId);

            if (recipe && recipe.ingredients) {
              recipe.ingredients.forEach(ingredient => {
                const { name, quantity, unit } = ingredient;
                const key = name.toLowerCase();

                if (!shoppingList[key]) {
                  shoppingList[key] = { name, quantity, unit };
                } else {
                  shoppingList[key].quantity = `${shoppingList[key].quantity} + ${quantity}`;
                  if (unit && shoppingList[key].unit !== unit) {
                    shoppingList[key].unit = '';
                  }
                }
              });
            }
          }
        });
      });

      Object.values(shoppingList).forEach(item => {
        if (typeof item.quantity === 'string') {
          const quantities = item.quantity.split('+').map(q => parseFloat(q.trim()) || 0);
          item.quantity = quantities.reduce((total, q) => total + q, 0);
        }
      });

      this.shoppingList = Object.values(shoppingList);
      this.shoppingListGenerated = true;
    },
    toggleShoppingList() {
      this.shoppingListGenerated = !this.shoppingListGenerated;
    },
  },
};
</script>
<style scoped>

  .title {
    text-align: center;
    margin-bottom: 20px;
    color: #000000; /* Couleur du texte */
    font-family: 'Montserrat', sans-serif; /* Police de caractères */
  }
  .planification-text {
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    color: #333; /* Couleur de texte */
    margin-top: 10px; /* Espacement en haut */
  }
  .action-button {
    background-color: #ff5c5c;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s; 
    border-radius: 10px;
  }

  .action-button:hover {
    background-color: #ab2f2f;
  }

  .icon-style {
    margin-right: 8px;
  }

  .menu-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .menu-table th,
  .menu-table td {
    border: 1px solid #ddd; /* Couleur de la bordure */
    padding: 12px;
    text-align: center;
    font-family: 'Pacifico', cursive;
  }

  .menu-table th {
    background-color: #ff5c5c; /* Couleur de fond de l'en-tête */
    color: white; /* Couleur du texte de l'en-tête */
  }

  .menu-table td {
    background-color: #f8f8f8; /* Couleur de fond des cellules */
  }

  .menu-table tbody tr:hover {
    background-color: #f0f0f0; /* Couleur de fond au survol de la ligne */
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  tbody tr {
    animation: fadeIn 0.5s ease-in-out; /* Animation de fade-in pour les lignes du tableau */
  }
  .action-button + .action-button {
    margin-left: 10px; /* Espace entre les boutons */
  }
  .shopping-list {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: #fff9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 80%;
    text-align: left;
    font-family: 'Montserrat', sans-serif;
    animation: fadeIn 0.5s ease-in-out;
  }

  .shopping-list h2 {
    margin-bottom: 15px;
    font-size: 24px;
  }

  .shopping-list-items {
    list-style-type: none;
    padding: 0;
  }

  .shopping-list-items li {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .shopping-list button {
    margin-top: 15px;
  }
    .notification {
    background-color: #ffcccc;
    color: #ff0000;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    font-family: sans-serif; 
  }
  .auth-link {
    display: inline-block;
    margin-top: 10px;
    padding: 8px 15px;
    background-color: #f66262;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    font-family:  sans-serif;
  }

  .auth-link:hover {
    background-color: #000;
  }
</style>