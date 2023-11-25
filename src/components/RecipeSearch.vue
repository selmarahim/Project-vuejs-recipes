<template>
  <div>
    <label>Rechercher une recette:</label>
    <input v-model="rechercheRecette" type="text" @input="filtrerParNom" />
    <!-- Afficher les recettes filtrées par catégorie -->
    <div v-for="category in recettesFiltrees" :key="category.name">
      <h3>{{ category.name }}</h3>
      <div v-for="recette in category.recipes" :key="recette.id">
        {{ recette.nomRecette }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rechercheRecette: "",
      recettesOriginales: JSON.parse(localStorage.getItem("recettes")) || [],
      recettesFiltrees: [],
    };
  },
  methods: {
    filtrerParNom() {
      const recherche = this.rechercheRecette.toLowerCase();

      if (recherche.trim() !== "") {
        // Filtrer les recettes par nom
        const recettesFiltrees = this.recettesOriginales.filter((recette) => {
          const nomRecetteLowerCase = recette.nomRecette.toLowerCase();
          return nomRecetteLowerCase.includes(recherche);
        });

        // Regrouper les recettes filtrées par catégorie
        this.recettesFiltrees = this.groupRecettesByCategory(recettesFiltrees);
      } else {
        // Si la recherche est vide, afficher toutes les recettes originales groupées par catégorie
        this.recettesFiltrees = this.groupRecettesByCategory(this.recettesOriginales);
      }
    },
    groupRecettesByCategory(recettes) {
      // Group recettes by category
      const groupedRecipes = recettes.reduce((result, recette) => {
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

      // Convert the object into an array of categories
      return Object.values(groupedRecipes);
    },
  },
};
</script>

<style>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

label {
  font-weight: bold;
  margin-bottom: 10px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

h3 {
  color: #333;
  margin-bottom: 10px;
}

div[role="recipe"] {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 15px;
}

div[role="recipe"] div {
  margin-bottom: 5px;
}

/* Add more styles as needed */
</style>
