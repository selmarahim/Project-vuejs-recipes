<template>
  <div class="main-container">
    <div class="left-section">
    <h1 class="title">.</h1>
    <h2 class="title2">Trouvez les recettes que vous avez stockées ici  <i class="fas fa-arrow-down down-arrow-icon"></i></h2>

    <div class="search-container">
      <input type="text" v-model="searchText" placeholder="Rechercher des recettes" @input="filterRecipes" />
      <div class="custom-select">
        <select v-model="selectedCategory" @change="filterRecipesByCategory" class="select-menu">
          <option value="">Toutes les catégories</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
    </div>
    <ul>
      <li v-for="(recipe, index) in filteredRecipes" :key="index">
        <div class="recipe-card">
          <h2>{{ recipe.name }}</h2>
          <div class="recipe-container">
            <img v-if="recipe.photo" :src="recipe.photo" alt="Recipe Photo" class="recipe-photo" />
            <div class="buttons-container">
              <button @click="toggleDetails(recipe)">
                Voir les détails <i class="fas fa-info-circle"></i>
              </button>
              <button @click="supprimerRecette(recipe.id)">
                 <i class="fas fa-trash-alt"></i>
              </button>
              <button @click="addToFavorites(recipe)">
 <i class="fas fa-heart"></i>
</button>
            </div>
          </div>

          <div v-if="recipe.showDetails" class="details-container">
            <h3>Détails de la recette</h3>
            <p><strong>Ingrédients:</strong></p>
            <ul>
              <li v-for="(ingredient, i) in recipe.ingredients" :key="i">
                {{ ingredient.quantity ? ingredient.quantity + ' ' : '' }}{{ ingredient.name }}
              </li>
            </ul>
            <p><strong>Instructions:</strong></p>
            <ul>
              <li v-for="(instruction, i) in recipe.instructions" :key="i">{{ instruction }}</li>
            </ul>
            <p><strong>Calories:</strong> {{ recipe.calories }}</p>
            <p><strong>Nombre de personnes:</strong> {{ recipe.portions }}</p>
            <button @click="toggleDetails(recipe)">Fermer les détails <i class="fas fa-times"></i></button>
          </div>
        </div>
        <hr class="divider" />
      </li>
    </ul>
  </div>
    <div class="right-section">
   
   <div class="sidebar-item favorite-recipes-section">
     <h2 class="sidebar-title">Coup De <i class="fas fa-heart heart-beat" style="color: #fb8989;"></i></h2>

    
     <div class="favorite-recipe">
      <ul>
    <li v-for="(recipe, index) in favoriteRecipes.slice(0, 3)" :key="index" class="favorite-recipe">
      <img :src="recipe.photo" alt="Recipe Photo" />
      <h3>{{ recipe.name }}</h3>
      <button @click="removeFromFavorites(recipe)">
        <i class="fas fa-heart-broken" style="color: white;"></i>
      </button>
    </li>
  </ul>
     </div>
   </div>
 </div>
  </div>
</template>



<script>
import { openDB } from 'idb';

export default {
  data() {
    return {
      db: null,
      userRecipes: [],
      searchText: '', 
      selectedCategory: '',
      favoriteRecipes: [],
    };
  },
  computed: {
    // Liste des catégories uniques dans les recettes
    uniqueCategories() {
      return [...new Set(this.userRecipes.map(recipe => recipe.category))];
    },
   
    filteredRecipes() {
      const lowerSearchText = this.searchText.toLowerCase();
      return this.userRecipes.filter(recipe => (
        (recipe.name.toLowerCase().includes(lowerSearchText) || lowerSearchText === '') &&
        (recipe.category === this.selectedCategory || this.selectedCategory === '')
      ));
    },
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
          }
        });
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
      }
    },

    async getUser() {
      const userId = localStorage.getItem('userId');

      if (userId && userId.trim() !== '') {
        return this.db.transaction('utilisateurs')
          .objectStore('utilisateurs')
          .get(parseInt(userId));
      } else {
        console.error('La clé userId dans le localStorage n\'est pas valide.');
        return null;
      }
    },

    async chargerRecettes() {
  try {
    const user = await this.getUser();
    if (!user) {
      console.error('Utilisateur non connecté');
      return;
    }

    const tx = this.db.transaction('recettes', 'readonly');
    const store = tx.objectStore('recettes');

    const allRecipes = await store.getAll();

    this.userRecipes = allRecipes.filter(recipe => recipe.userId === user.id);

 
    this.favoriteRecipes = JSON.parse(user.favoriteRecipes || '[]');
  } catch (error) {
    console.error('Erreur lors du chargement des recettes:', error);
  }
}
,
    async supprimerRecette(id) {
  const tx = this.db.transaction('recettes', 'readwrite');
  const recettesStore = tx.objectStore('recettes');

  await recettesStore.delete(id);

  await tx.complete;
  
 
  this.userRecipes = this.userRecipes.filter(recipe => recipe.id !== id);
},
async addToFavorites(recipe) {
  const isAlreadyFavorite = this.favoriteRecipes.some(favorite => favorite.id === recipe.id);

  if (isAlreadyFavorite) {
    // Recipe is already a favorite, remove it
    this.favoriteRecipes = this.favoriteRecipes.filter(favorite => favorite.id !== recipe.id);
  } else {
    // Recipe is not a favorite, add it
    this.favoriteRecipes.push(recipe);
  }


  await this.updateFavoriteRecipesInDB();
},

async updateFavoriteRecipesInDB() {
  const user = await this.getUser();

  if (user) {
    const tx = this.db.transaction('utilisateurs', 'readwrite');
    const utilisateursStore = tx.objectStore('utilisateurs');


    const existingUserData = await utilisateursStore.get(user.id);

    const favoriteRecipesString = JSON.stringify(this.favoriteRecipes);

    
    existingUserData.favoriteRecipes = favoriteRecipesString;

    
    await utilisateursStore.put(existingUserData);

    await tx.complete;
  }
}

,
async removeFromFavorites(recipe) {
   
    this.favoriteRecipes = this.favoriteRecipes.filter(favorite => favorite.id !== recipe.id);

   
    await this.updateFavoriteRecipesInDB();

   
    this.userRecipes.push(recipe);
  },

    

toggleDetails(recipe) {
      
      recipe.showDetails = !recipe.showDetails;
    },
    voirDetails(recette) {
    
      console.log('Détails de la recette:', recette);
    },
  
  },
  filterRecipesByCategory() {
 
  this.filteredRecipes = this.userRecipes.filter(recipe => {
    const lowerSearchText = this.searchText.toLowerCase();
    const lowerCategory = recipe.category ? recipe.category.toLowerCase() : '';

    return (
      (recipe.name.toLowerCase().includes(lowerSearchText) || lowerSearchText === '') &&
      (lowerCategory.includes(this.selectedCategory.toLowerCase()) || this.selectedCategory === '')
    );
  });
},

  async created() {
    await this.initDB();
    await this.chargerRecettes();
  },
};
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  .title {
    color: #ffffff;
    font-size: 24px;
    margin-bottom: 20px;
    
  }
.title2{
  color: #ff4848;
  font-size: 24px; /* Taille de la police */
    font-weight: bold; /* Gras */
    margin-bottom: 20px; /* Marge en bas */
    text-align: center; 
    font-family: 'Fredoka One', cursive;
}

  .search-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    
  }
  .search-container:hover{
  border-color: #f86363;
  box-shadow: 0 0 8px rgba(248, 99, 99, 0.3);
}
  input,
  select {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #333;
    border-radius: 5px;
    font-family: 'Pacifico', cursive;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 20px;
  }

  .recipe-card {
    border: 1px solid #333;
    padding: 15px;
    border-radius: 5px;
    padding: 8px 12px;
    font-family: 'Pacifico', cursive;  
  }

  .recipe-container {
    display: flex;
    align-items: center;
    
  }

  .recipe-photo {
    max-width: 20%;
    height: auto;
    margin-right: 20px;
    border-radius: 10px;
    
    
  }

  .buttons-container {
    margin-left: auto;
  }

  button {
    background-color: #ff5c5c;
    color: #fff;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #ab2f2f;
  }

  .details-container {
    margin-top: 20px;
  }

  h2 {
    color: #333;
    font-size: 20px;
    margin-bottom: 10px;
  }

  h3 {
    color: #333;
    font-size: 18px;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 10px;
  }

  ul {
    margin-top: 0;
  }

  .divider {
    border: 0;
    border-top: 1px solid #ddd;
    margin: 20px 0;
  }
  .custom-select {
    position: relative;
    width: 100%;
    max-width: 200px; 
  }

  .select-menu {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #333;
    border-radius: 5px;
  }

  

  .select-menu option {
    font-size: 15px;
    background-color: #fff;
    color: #f66264;
    border-bottom: 1px solid #ddd;
    padding: 8px;
    transition: background-color 0.3s ease-in-out;
    font-family: 'Pacifico', cursive;
  }
  .main-container {
  display: flex;
}
.left-section {
  flex: 1;
  margin-right: 20px;
}

.right-section {
  flex-basis: 30%; 
}
.favorite-recipe {
  margin-top: 20px;
  text-align: center;
  transition: transform 0.3s ease-in-out;
}

.favorite-recipe img {
  width: 60%;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.favorite-recipe h3 {
  font-size: 18px;
  color: #333;
  margin: 10px 0;
}

.favorite-recipe i {
  color: #f8c630;
  font-size: 24px;
  transition: color 0.3s ease-in-out;
}

.favorite-recipe:hover {
  transform: scale(1.05);
}

.favorite-recipe:hover i {
  color: #ff6f00;
}

.sidebar-title {
  font-size: 24px;
  color: #333;
  font-family: 'Comic Neue', cursive;
  margin-bottom: 20px;
  text-align: center;
}
.favorite-recipes-section {
  background-color: #ffefef; /* */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.heart-beat {
  animation: heartBeat 1s infinite;
}
</style>