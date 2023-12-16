<template>
  <div class="main-container">
    <!-- Left Section -->
    <div class="left-section">
      <h1 class="foodly-title">Manque d'inspiration ?</h1>
      <div class="search-container">
        <label for="search">Rechercher une recette :</label>
        <input v-model="searchQuery" id="search" @input="filterRecipes" class="search-input" />
      </div>
      <h2 class="foodly-subtitle">Voici une liste de recettes proposée par de grands chefs</h2>

      <!-- Category dropdown -->
      <div class="category-dropdown">
        <label for="category">Choisissez une catégorie :</label>
        <select v-model="selectedCategory" id="category" @change="filterRecipes" class="styled-select">
          <option value="">Toutes les catégories</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <!-- Display recipes in a grid -->
      <div v-if="filteredRecipes.length > 0" class="recipe-grid">
        <div v-for="(recipe, index) in filteredRecipes" :key="index" class="recipe-item">
          <!-- Photo (replace with your actual photo URL or component) -->
          <img :src="recipe.photoUrl" alt="Recipe Photo" class="recipe-photo">

          <!-- Recipe name -->
          <p class="recipe-name">{{ recipe.name }}</p>

          <!-- Recipe category -->
          <p class="recipe-category">{{ recipe.category }}</p>

          <!-- Button to display detailed list with icon -->
          <button @click="showDetailedList(recipe)">
            <i class="fas fa-info-circle"></i> Détails
          </button>
        </div>

        <!-- Display detailed recipe as a notification -->
        <div v-if="selectedRecipe" class="notification">
          <img :src="selectedRecipe.photoUrl" alt="Recipe Photo" class="recipe-photo">
          <h2>{{ selectedRecipe.name }}</h2>
          <p><strong>Catégorie :</strong> {{ selectedRecipe.category }}</p>
          <p><strong>Description :</strong> {{ selectedRecipe.description }}</p>
          <p><strong>Ingrédients :</strong></p>
          <ul>
            <li v-for="(ingredient, index) in selectedRecipe.ingredients" :key="index">{{ ingredient }}</li>
          </ul>
          <p><strong>Instructions :</strong></p>
          <ol>
            <li v-for="(instruction, index) in selectedRecipe.instructions" :key="index">{{ instruction }}</li>
          </ol>
          <button @click="goBack">Retour</button>
        </div>
      </div>

      <!-- Display a message if there are no recipes -->
      <p v-else class="no-recipes-message">Aucune recette disponible pour le moment.</p>
    </div>

    <div class="right-section">
   
      <div class="sidebar-item favorite-recipes-section">
        <h2 class="sidebar-title">Votre Top 3 Recettes Préférées</h2>

        <!-- Recipe 1 -->
        <div class="favorite-recipe">
          <img src="https://source.unsplash.com/800x600/?french-food" alt="Recette 1">
          <h3>Champignons à la crème </h3>
          <i class="fas fa-star"></i>
        </div>

        <!-- Recipe 2 -->
        <div class="favorite-recipe">
          <img src="https://source.unsplash.com/800x600/?food,appetizer" alt="Recette 2">
          <h3>Filet au boeuf</h3>
          <i class="fas fa-star"></i>
        </div>

        <!-- Recipe 3 -->
        <div class="favorite-recipe">
          <img src="https://source.unsplash.com/800x600/?food,recipe" alt="Recette 3">
          <h3>Nouilles japonaises </h3>
          <i class="fas fa-star"></i>
        </div>
      </div>
    </div>
  </div>
</template>
  
  
  <script>
  export default {
    data() {
      return {
 
        recipes: [
            {
          name: 'Recette1',
          category: 'Entrée',
          photoUrl: 'https://source.unsplash.com/800x600/?food,recipe',
          description: 'Une délicieuse entrée pour commencer votre repas.',
          ingredients: ['Ingrédient 1', 'Ingrédient 2', 'Ingrédient 3'],
          instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
        },
        {
          name: 'Recette2',
          category: 'Plat principal',
          photoUrl: 'https://source.unsplash.com/800x600/?food,main-dish',
          description: 'Description de la recette 2.',
          ingredients: ['Ingrédient A', 'Ingrédient B', 'Ingrédient C'],
          instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
        },
        {
          name: 'Recette3',
          category: 'Dessert',
          photoUrl: 'https://source.unsplash.com/800x600/?food,dessert',
          description: 'Description de la recette 3.',
          ingredients: ['Ingrédient X', 'Ingrédient Y', 'Ingrédient Z'],
          instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
        },
        {
          name: 'Recette4',
          category: 'Entrée',
          photoUrl: 'https://source.unsplash.com/800x600/?food,appetizer',
          description: 'Description de la recette 4.',
          ingredients: ['Ingrédient P', 'Ingrédient Q', 'Ingrédient R'],
          instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
        },
        {
          name: 'Recette5',
          category: 'Plat principal',
          photoUrl: 'https://source.unsplash.com/800x600/?food,dish',
          description: 'Description de la recette 5.',
          ingredients: ['Ingrédient M', 'Ingrédient N', 'Ingrédient O'],
          instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
        },
        {
  name: 'Recette6',
  category: 'Entrée',
  photoUrl: 'https://source.unsplash.com/800x600/?food,appetizer',
  description: 'Description de la recette 6.',
  ingredients: ['Ingrédient X', 'Ingrédient Y', 'Ingrédient Z'],
  instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
},
{
  name: 'Recette7',
  category: 'Plat principal',
  photoUrl: 'https://source.unsplash.com/800x600/?food,dish',
  description: 'Description de la recette 7.',
  ingredients: ['Ingrédient A', 'Ingrédient B', 'Ingrédient C'],
  instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
},
{
  name: 'Recette8',
  category: 'Dessert',
  photoUrl: 'https://source.unsplash.com/800x600/?food,dessert',
  description: 'Description de la recette 8.',
  ingredients: ['Ingrédient P', 'Ingrédient Q', 'Ingrédient R'],
  instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
},
{
  name: 'Recette9',
  category: 'Entrée',
  photoUrl: 'https://source.unsplash.com/800x600/?food,appetizer',
  description: 'Description de la recette 9.',
  ingredients: ['Ingrédient M', 'Ingrédient N', 'Ingrédient O'],
  instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
},
{
  name: 'Recette10',
  category: 'Plat principal',
  photoUrl: 'https://source.unsplash.com/800x600/?food,dish',
  description: 'Description de la recette 10.',
  ingredients: ['Ingrédient X', 'Ingrédient Y', 'Ingrédient Z'],
  instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
},
{
  name: 'Recette11',
  category: 'Dessert',
  photoUrl: 'https://source.unsplash.com/800x600/?food,dessert',
  description: 'Description de la recette 11.',
  ingredients: ['Ingrédient A', 'Ingrédient B', 'Ingrédient C'],
  instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
},
{
  name: 'Recette12',
  category: 'Entrée',
  photoUrl: 'https://source.unsplash.com/800x600/?food,appetizer',
  description: 'Description de la recette 12.',
  ingredients: ['Ingrédient P', 'Ingrédient Q', 'Ingrédient R'],
  instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
},
{
  name: 'Recette13',
  category: 'Plat principal',
  photoUrl: 'https://source.unsplash.com/800x600/?food,dish',
  description: 'Description de la recette 13.',
  ingredients: ['Ingrédient M', 'Ingrédient N', 'Ingrédient O'],
  instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
},
{
  name: 'Recette14',
  category: 'Dessert',
  photoUrl: 'https://source.unsplash.com/800x600/?food,dessert',
  description: 'Description de la recette 14.',
  ingredients: ['Ingrédient X', 'Ingrédient Y', 'Ingrédient Z'],
  instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
},
{
  name: 'Recette15',
  category: 'Entrée',
  photoUrl: 'https://source.unsplash.com/800x600/?food,appetizer',
  description: 'Description de la recette 15.',
  ingredients: ['Ingrédient A', 'Ingrédient B', 'Ingrédient C'],
  instructions: ['Étape 1: Faire ceci', 'Étape 2: Faire cela', 'Étape 3: Terminer'],
},
        ],
        selectedCategory: '',
        selectedRecipe: null, 
        searchQuery: '',
      };
    },
    computed: {
      uniqueCategories() {
      
        return [...new Set(this.recipes.map((recipe) => recipe.category))];
      },
      filteredRecipes() {
      let filtered = this.recipes;

      if (this.selectedCategory) {
        filtered = filtered.filter((recipe) => recipe.category === this.selectedCategory);
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (recipe) =>
            recipe.name.toLowerCase().includes(query) ||
            recipe.category.toLowerCase().includes(query) ||
            recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
        );
      }

      return filtered;
    },
    },
    methods: {
      
      showDetailedList(recipe) {
        this.selectedRecipe = recipe;
        console.log(`Displaying detailed list for ${recipe.name}`);
      },
      goBack() {
   
      this.selectedRecipe = null;
    },
      filterRecipes() {
   
        this.filteredRecipes;
      },
      
    },
  };
  </script>
  <style scoped>

.foodly-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.foodly-title {
  font-size: 36px;
  color: #333;
  font-family: 'Comic Neue', cursive;
  text-align: center;
  margin-right: 20px;
}

.foodly-subtitle {
  font-size: 24px;
  color: #333;
  font-family: 'Comic Neue', cursive;
  margin-bottom: 20px;
  text-align: center;
}

.category-dropdown {
  margin-bottom: 20px;
  
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
}

select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
}


.recipe-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.recipe-item {
  width: calc(20% - 20px);
  text-align: center;
  margin-bottom: 20px;
  background-color: #ffe4e4;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}
.recipe-item:hover {
  transform: scale(1.05);
}

.recipe-photo {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.recipe-name {
  font-size: 18px;
  margin-top: 10px;
  color: #333;
}

.recipe-category {
  font-size: 14px;
  color: #999;
  
}

button {
  padding: 8px 12px;
  background-color: #f86363;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: #ab2f2f;
}

.notification {
  /* Styling for the notification */
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease-in-out;
}

.notification .recipe-photo {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.notification h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.notification p {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.notification ul,
.notification ol {
  margin-left: 20px;
}

.notification li {
  font-size: 14px;
  color: #999;
}

.notification button {
  padding: 8px 12px;
  background-color: #f86363;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  margin-top: 10px;
}

.notification button:hover {
  background-color: #ab2f2f;
}
.category-dropdown label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
  
}
.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #fff;
  color: #333;
  margin-top: 8px;
}
.search-input:hover{
  border-color: #f86363;
  box-shadow: 0 0 8px rgba(248, 99, 99, 0.3);
}
.styled-select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #fff;
  color: #333;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23333" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z" /><path d="M0 0h24v24H0z" fill="none" /></svg>'); /* Ajoutez une icône de flèche personnalisée à droite */
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.styled-select:hover, .styled-select:focus {
  border-color: #f86363;
  box-shadow: 0 0 8px rgba(248, 99, 99, 0.3);
}

/* Style pour les options dans le menu déroulant */
.styled-select option {
  background-color: #fff;
  color: #333;
}

.styled-select:after {
  content: '';
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #333;
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
}

.styled-select:hover:after, .styled-select:focus:after {
  border-top-color: #f86363;
}
.styled-select select {
  position: relative;
  padding: 12px;
  z-index: 2;
  cursor: pointer;
}
.styled-select select:focus {
  border-color: #f86363;
  box-shadow: 0 0 8px rgba(248, 99, 99, 0.3);
}

.styled-select select:focus + ul {
  opacity: 1;
  pointer-events: auto;
}

.styled-select select + ul {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
}

.styled-select select + ul li {
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.styled-select select + ul li:hover {
  background-color: #f86363;
  color: #fff;
}


.styled-select select:focus + ul:after {
  content: '';
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 8px solid #fff;
  position: absolute;
  top: -8px;
  right: 12px;
  pointer-events: none;
}

.styled-select select:hover + ul:after, .styled-select select:focus + ul:after {
  border-bottom-color: #f86363;
}
.sidebar {
  width: 30%; 
  margin-left: auto;
  padding: 20px;
  background-color: #f7f7f7; 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Ajoutez de l'ombre à la barre latérale */
}

.sidebar-item {
  margin-bottom: 20px;
}

.sidebar-item h3 {
  font-size: 18px;
  color: #333;
}

.sidebar-item img {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
}

.sidebar-item p {
  font-size: 14px;
  color: #666;
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
  width: 80%;
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

</style>