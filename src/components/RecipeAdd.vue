<template>
  <div class="recipe-form">
   
<div class="left-section">
  <h1>Ajouter une recette</h1>
  
  <h3><span class="exclamation">Veuillez vous connecter avant d'entrer une recette !</span></h3>
    <div class="form-group">
      <label for="recipeName">Nom de la recette:</label>
      <input id="recipeName" v-model="recipeData.name" type="text" />
    </div>

    <hr class="divider" />

    <div class="form-group">
      <label for="quantity">Quantité:</label>
      <input id="quantity" v-model="recipeData.quantityPerPerson" type="text" />
    </div>

    <div class="form-group">
      <label for="ingredients">Ingrédients:</label>
      <input id="ingredients" v-model="nouvelIngredient" type="text" />
      <button @click="ajouterIngredient">Ajouter Ingrédient <i class="fas fa-plus"></i></button>
      <ul>
        <li v-for="(ingredient, index) in recipeData.ingredients" :key="index">
          {{ ingredient.quantity ? ingredient.quantity + " " : "" }}{{ ingredient.name }}
        </li>
      </ul>
    </div>

     <hr class="divider" />

    <div class="form-group">
      <label for="instructions">Instructions:</label>
      <textarea id="instructions" v-model="nouvelleInstruction"></textarea>
      <button @click="ajouterInstruction">Ajouter Instruction <i class="fas fa-plus"></i></button>
      <ul>
        <li v-for="(instruction, index) in recipeData.instructions" :key="index">
          {{ instruction }}
        </li>
      </ul>
    </div>

    <hr class="divider" />

    <div class="form-group">
      <label for="calories">Calories:</label>
      <input id="calories" v-model="recipeData.calories" type="text" />
    </div>

    <hr class="divider" />

    <div class="form-group">
      <label for="portions">Portions:</label>
      <input id="portions" v-model="recipeData.portions" type="text" />
    </div>

    <div class="form-group">
      <label for="photo">Photo:</label>
      <input id="photo" type="file" @change="handlePhotoUpload" />
    </div>

    <hr class="divider" />

    <div class="form-group">
      <label for="categorie">Catégorie de la recette:</label>
      <select id="categorie" v-model="recipeData.category" @change="filtrerParCategorie">
        <option value="Healthy">Healthy</option>
        <option value="Traditionnel">Traditionnel</option>
        <option value="Nourissons">Nourissons</option>
        <option value="Végétarien">Végétarien</option>
        <option value="Vegan">Vegan</option>
        <option value="Cuisines du monde">Cuisines du monde</option>
        <option value="petitdej">Petit Déjeuner</option>
 
      </select>
    </div>

    <div class="form-group">
      <button @click="submitRecipeForm">Ajouter la recette <i class="fas fa-plus-circle"></i></button>
    </div>

    <div v-if="recetteAjoutee" class="added-recipe-details">
      <h2>Recette ajoutée :</h2>
      <div class="recipe-details"></div>
      <p><strong>Nom:</strong> {{ recetteAjoutee.name }}</p>
      <p><strong>Ingrédients:</strong>
        <ul>
          <li v-for="(ingredient, index) in recetteAjoutee.ingredients" :key="index">
            {{ ingredient.quantity ? ingredient.quantity + " " : "" }}{{ ingredient.name }}
          </li>
        </ul>
      </p>
      <p><strong>Instructions:</strong>
        <ul>
          <li v-for="(instruction, index) in recetteAjoutee.instructions" :key="index">
            {{ instruction }}
          </li>
        </ul>
      </p>
      <p><strong>Calories:</strong> {{ recetteAjoutee.calories }}</p>
      <p><strong>Portions:</strong> {{ recetteAjoutee.portions }}</p>
    </div>
    <div v-if="!isUserConnected" class="notification">
      <p>Vous devez être connecté pour ajouter une recette !</p>
      <router-link to="/authentification" class="auth-link">Se connecter</router-link>
    </div>
  </div>
    <div class="right-section">
   
   <div class="sidebar-item favorite-recipes-section">
     <h2 class="sidebar-title">Catégories de recettes</h2>

     <!-- Recipe 1 -->
     <div class="favorite-recipe">
  <img src="https://source.unsplash.com/800x600/?french-food,escargot" alt="Recette 1">
  <h3>Cuisine française</h3>
  <i class="fas fa-star"></i>
</div>

<!-- Recipe 2 -->
<div class="favorite-recipe">
  <img src="https://source.unsplash.com/800x600/?couscous,rechta,chorba" alt="Recette 2">
  <h3>Cuisine traditionnelle</h3>
  <i class="fas fa-star"></i>
</div>

<!-- Recipe 3 -->
<div class="favorite-recipe">
  <img src="https://source.unsplash.com/800x600/?sushi,rice" alt="Recette 3">
  <h3>Cuisine japonaise</h3>
  <i class="fas fa-star"></i>
</div>

<!-- Recipe 4 -->
<div class="favorite-recipe">
  <img src="https://source.unsplash.com/800x600/?healthy-food" alt="Recette 4">
  <h3>Cuisine Healthy</h3>
  <i class="fas fa-star"></i>
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
      recipeData: {
        name: '',
        description: '',
        ingredients: [],
        instructions: [],
        calories: 0,
        quantityPerPerson: 0,
        photo: '',
        category: ''
      },
      db: null,
      user: null,
      recetteAjoutee: null,
      nouvelIngredient: '',
      nouvelleInstruction: '',
      recipes: [],
      isUserConnected: true,
    };
    
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

    async saveUserToDB(user) {
      const tx = this.db.transaction('utilisateurs', 'readwrite');
      const store = tx.objectStore('utilisateurs');

      await store.put(user, user.id);
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

    resetRecipeForm() {
      this.recipeData = {
        name: '',
        description: '',
        ingredients: [],
        instructions: [],
        calories: 0,
        quantityPerPerson: 0,
        photo: '',
        category: ''
      };
      this.nouvelIngredient = '';
      this.nouvelleInstruction = '';
      
    },

    async ajouterRecette() {
      try {
        const user = await this.getUser();
        if (!user) {
          console.error('Utilisateur non connecté');
          this.isUserConnected = false;
          return;
        }

        const tx = this.db.transaction(['recettes', 'utilisateurs'], 'readwrite');
        const recettesStore = tx.objectStore('recettes');
        const utilisateursStore = tx.objectStore('utilisateurs');

        const existingUser = await utilisateursStore.get(user.id);
        if (!existingUser) {
          console.error('L\'utilisateur n\'existe pas dans la base de données.');
          return;
        }

        const serializedRecipeData = JSON.stringify({ ...this.recipeData, userId: user.id });
        const addedRecipeKey = await recettesStore.add(JSON.parse(serializedRecipeData));

        const addedRecipe = await recettesStore.get(addedRecipeKey);

        this.recetteAjoutee = addedRecipe;
        this.resetRecipeForm();

        await tx.complete;
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la recette:', error);
        throw error;
      }
    },

    ajouterIngredient() {
      if (this.nouvelIngredient.trim() !== "") {
        const nouvelIngredient = {
          name: this.nouvelIngredient.trim(),
          quantity: this.recipeData.quantityPerPerson.toString().trim(),
        };
        this.recipeData.ingredients.push(nouvelIngredient);
        this.nouvelIngredient = "";
        this.recipeData.quantityPerPerson = "";
      }
    },

    ajouterInstruction() {
      if (this.nouvelleInstruction.trim() !== "") {
        this.recipeData.instructions.push(this.nouvelleInstruction.trim());
        this.nouvelleInstruction = "";
      }
    },

    handlePhotoUpload(event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.recipeData.photo = reader.result;
        };
        reader.readAsDataURL(file);
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

        this.recipes = allRecipes.filter(recipe => recipe.userId === user.id);
      } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
      }
    },

    async submitRecipeForm() {
      try {
        await this.initDB();
        this.errorMessage = '';

        await this.ajouterRecette();
        await this.chargerRecettes();
      } catch (error) {
        this.errorMessage = 'Erreur lors de l\'ajout de la recette. Veuillez réessayer.';
        console.error('Erreur lors de la soumission du formulaire de recette:', error);
      }

      console.log('Recipe form submitted:', this.recipeData);
    }
  },

  async created() {
    await this.initDB();
    this.user = await this.getUser();
    this.chargerRecettes();
  },
};
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  .recipe-form {
    font-family: 'Roboto', sans-serif;
    color: #000000;
    background-color: rgb(253, 249, 249);
    padding: 20px;
    border-radius: 10px;
    font-family: 'Pacifico', cursive;
    display: flex;
  }
  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #333;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  button {
    background-color: #f66262;
    color: #fff;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #000;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 5px;
  }

  .divider {
    border: 0;
    border-top: 1px solid #000000;
    margin: 20px 0;
  }

  .added-recipe-details {
    margin-top: 20px;
  }
  .notification {
    background-color: #ffcccc;
    color: #ff0000;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
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
  }

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.exclamation {
  display: inline-block;
  font-size: 1em; /* Ajustez la taille selon vos besoins */
  color: red; /* Couleur du point d'exclamation */
  animation: bounce 1s infinite; /* Ajustez la durée de l'animation selon vos besoins */
}

  .auth-link:hover {
    background-color: #000;
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
