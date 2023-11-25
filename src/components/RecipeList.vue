<template>
  <div>
    <!-- Section pour la liste des recettes ajoutées -->
    <div>
      <h2>Liste des recettes ajoutées :</h2>
      <div v-for="category in categories" :key="category.name">
        <h3>{{ category.name }}</h3>
        <div class="recipe-container">
          <div v-for="recette in category.recipes" :key="recette.id" class="recipe-card">
            <img v-if="recette.photo" :src="recette.photo" alt="Recipe Photo" />

            <h4>
              {{ recette.nomRecette }} <br />
              <button @click="voirDetails(recette)">Voir cette recette</button>
              <br />
              <button @click="modifierRecette(recette)">Modifier</button> <br />
              <button @click="supprimerRecette(recette.id)">Supprimer</button>
            </h4>

            <div v-if="recette === recetteAModifier">
              <label>Nom de la recette:</label>
              <input v-model="recette.nomRecette" type="text" />
              <label>Ingrédients:</label>
              <textarea v-model="recette.ingredients"></textarea>
              <label>Instructions:</label>
              <textarea v-model="recette.instructions"></textarea>
              <button @click="validerModification(recette)">
                Valider les modifications
              </button>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </div>

    <!-- Section pour les détails de la recette sélectionnée -->
    <div v-if="recetteSelectionnee" class="alert">
      <h2>Détails de la recette :</h2>
      <p><strong>Nom:</strong> {{ recetteSelectionnee.nomRecette }}</p>
      <p class="ingredients">
        <strong>Ingrédients:</strong> {{ recetteSelectionnee.ingredients }}
      </p>
      <p class="instructions">
        <strong>Instructions:</strong> {{ recetteSelectionnee.instructions }}
      </p>
      <p class="calories">
        <strong>Calories:</strong> {{ recetteSelectionnee.calories }}
      </p>
      <p class="portions">
        <strong>Portions:</strong> {{ recetteSelectionnee.portions }}
      </p>
      <button @click="fermerDetails">Fermer</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recetteAModifier: null,
      recetteSelectionnee: null,
      recettesOriginales: [],
      rechercheRecette: "",
      recettes: JSON.parse(localStorage.getItem("recettes")) || [],
    };
  },
  computed: {
    categories() {
      const groupedRecipes = this.recettes.reduce((result, recette) => {
        const category = recette.categorie;
        if (!result[category]) {
          result[category] = {
            name: category,
            recipes: [],
          };
        }
        result[category].recipes.push(recette);
        return result;
      }, {});
      return Object.values(groupedRecipes);
    },
  },

  methods: {
    modifierRecette(recette) {
      this.recetteAModifier = recette;
    },
    
    supprimerRecette(id) {
      this.recettes = this.recettes.filter((recette) => recette.id !== id);
      localStorage.setItem("recettes", JSON.stringify(this.recettes));
    },
    
    voirDetails(recette) {
      this.recetteSelectionnee = recette;
      this.showDetailsModal = true;
    },
    validerModification() {
     
      this.ingredients = [];
      this.instructions = [];

      localStorage.setItem("recettes", JSON.stringify(this.recettes));
      this.recetteAModifier = null;
    },
    fermerDetails() {
      this.recetteSelectionnee = null;
    },
  },
};
</script>

<style>
.list-container {
  max-width: 800px;
  margin: 20px auto;
}

/* Titre de la liste des recettes ajoutées */
.list-container h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Style des catégories */
.category {
  margin-bottom: 20px;
}

.category h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

/* Style des cartes de recettes */
.recipe-card {
  display: inline-block;
  width: calc(33.33% - 20px);
  margin: 0 10px 20px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  padding: 10px;
}

.recipe-card img {
  max-width: 100%;
  max-height: 150px;
  height: auto;
  margin-bottom: 10px;
}

.recipe-card h4 {
  font-size: 18px;
  margin-bottom: 10px;
}

/* Boutons d'action sur les cartes de recettes */
.recipe-card button {
  margin: 5px;
  padding: 8px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.recipe-card button:hover {
  background-color: #2980b9;
}

/* Section de modification de la recette */
.modify-section {
  display: none;
}

.modify-section label,
.modify-section input,
.modify-section textarea,
.modify-section button {
  margin-top: 10px;
}

/* Section de détails de la recette */
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
.alert .instructions,
.alert .calories,
.alert .portions {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ccc;
}
</style>