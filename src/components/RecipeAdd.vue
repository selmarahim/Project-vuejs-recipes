<template>
  <div>
    
    <!-- Section for adding a recipe -->
    <h1 style="display: block">Ajouter une recette</h1>

    <div>
      <label>Nom de la recette:</label>
      <input v-model="nomRecette" type="text" />
    </div>

    <hr />

    <div>
      <label>Quantité:</label>
      <input v-model="nouvelleQuantite" type="text" />
    </div>

    <div>
      <label>Ingrédients:</label>
      <input v-model="nouvelIngredient" type="text" />
      <button @click="ajouterIngredient">
        Ajouter Ingrédient <i class="fas fa-plus"></i>
      </button>
      <ul>
        <li v-for="(ingredient, index) in ingredients" :key="index">
          {{ ingredient.quantite ? ingredient.quantite + " " : "" }}{{ ingredient.nom }}
        </li>
      </ul>
    </div>

    <hr />

    <div>
      <label>Instructions:</label>
      <textarea v-model="nouvelleInstruction"></textarea>
      <button @click="ajouterInstruction">Ajouter Instruction</button>
      <ul>
        <li v-for="(instruction, index) in instructions" :key="index">
          {{ instruction }}
        </li>
      </ul>
    </div>

    <hr />

    <div>
      <label>Calories:</label>
      <textarea v-model="calories"></textarea>
    </div>

    <hr />

    <div>
      <label>Portions:</label>
      <textarea v-model="portions"></textarea>
    </div>

    <div>
      <label>Photo:</label>
      <input type="file" @change="handlePhotoUpload" />
    </div>

    <hr />

    <div>
      <label for="categorie">Catégorie de la recette:</label>
      <select v-model="categorie" id="categorie" @change="filtrerParCategorie">
        <option value="Healthy">Healthy</option>
        <option value="Traditionnel">Traditionnel</option>
        <option value="Nourissons">Nourissons</option>
        <option value="Végétarien">Végétarien</option>
        <option value="Vegan">Vegan</option>
        <option value="Cuisines du monde">Cuisines du monde</option>
        <!-- Ajoutez d'autres catégories ici -->
      </select>
    </div>

    <button @click="ajouterRecette">Ajouter la recette</button>

    <div v-if="recetteAjoutee">
      <h2>Recette ajoutée :</h2>
      <div class="recipe-details"></div>
      <p><strong>Nom:</strong> {{ recetteAjoutee.nomRecette }}</p>
      <p><strong>Ingrédients:</strong> {{ recetteAjoutee.ingredients }}</p>
      <p><strong>Instructions:</strong> {{ recetteAjoutee.instructions }}</p>
      <p><strong>Calories:</strong> {{ recetteAjoutee.calories }}</p>
      <p><strong>Portions:</strong> {{ recetteAjoutee.portions }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nomRecette: "",
      ingredients: [],
      nouvelIngredient: "",
      instructions: [],
      nouvelleInstruction: "",
      categorie: "",
      recetteAjoutee: null,
      portions: "",
      calories: "",
      photo: null,
      nouvelleQuantite: "",
      recettes: JSON.parse(localStorage.getItem("recettes")) || [],
    };
  },
  methods: {
    ajouterIngredient() {
      if (this.nouvelIngredient.trim() !== "") {
        const nouvelIngredient = {
          nom: this.nouvelIngredient.trim(),
          quantite: this.nouvelleQuantite.trim(),
        };
        this.ingredients.push(nouvelIngredient);
        this.nouvelIngredient = "";
        this.nouvelleQuantite = "";
      }
    },
    ajouterInstruction() {
      if (this.nouvelleInstruction.trim() !== "") {
        this.instructions.push(this.nouvelleInstruction.trim());
        this.nouvelleInstruction = "";
      }
    },
    ajouterRecette() {
      const nouvelleRecette = {
        nomRecette: this.nomRecette,
        ingredients: this.ingredients,
        instructions: this.instructions,
        categorie: this.categorie,
        calories: this.calories,
        portions: this.portions,
        photo: this.photo,
      };

      // Emit an event to notify the parent component that a recipe has been added
      this.$emit("recipeAdded", nouvelleRecette);

      this.recettes.push(nouvelleRecette);
      localStorage.setItem("recettes", JSON.stringify(this.recettes));
      this.recetteAjoutee = nouvelleRecette;

      this.nomRecette = "";
      this.ingredients = [];
      this.instructions = [];
      this.calories = "";
      this.portions = "";
      this.photo = null;
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.photo = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
}

/* Sections et éléments de formulaire */
.container h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  margin-top: 5px;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

select {
  margin-bottom: 20px;
}

button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #2980b9;
}

/* Liste d'ingrédients et d'instructions */
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul li {
  margin-top: 5px;
}

/* Section des détails de la recette ajoutée */
.recipe-details {
  margin-top: 20px;
}

.recipe-details p {
  margin-bottom: 10px;
}

/* Section des détails de la recette sélectionnée */
.alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  width: 400px;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.alert h2 {
  color: #3498db;
}

.alert p {
  margin: 10px 0;
}

.alert .ingredients,
.alert .instructions {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ccc;
}
</style>
