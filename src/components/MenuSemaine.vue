<template>
  <div class="menu-wrapper">
    <div v-if="showAlert" class="alerte-recette">
      <div class="content">
        <h2>Détails de la recette</h2>
        <h3>Nom</h3>
        <p>{{ alertData.nomRecette }}</p>
        <h3>Ingrédients</h3>
        <p>{{ alertData.ingredients }}</p>
        <h3>Instructions</h3>
        <p>{{ alertData.instructions }}</p>
        <h3>Calories</h3>
        <p>{{ alertData.calories }}</p>
        <h3>Portions</h3>
        <p>{{ alertData.portions }}</p>
      </div>
      <button @click="fermerAlerte">Fermer</button>
    </div>
    <button @click="genererMenuSemaine">Générer le menu de la semaine</button>
    <h2>Menu de la semaine</h2>
    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="moment in momentsJournee" :key="moment">{{ moment }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="jour in joursSemaine" :key="jour">
          <td>{{ jour }}</td>
          <td v-for="moment in momentsJournee" :key="moment">
            <ul>
              <li
                v-for="recette in getRecettesByJourEtMoment(jour, moment)"
                :key="recette.nomRecette"
              >
                <!-- Utilisez @click pour appeler la fonction afficherAlerteRecette -->
                <span @click="afficherAlerteRecette(recette)">{{
                  recette.nomRecette
                }}</span>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bouton pour générer la liste des courses -->
    <button @click="genererListeCourses" class="generer-liste-courses">
      Générer la liste des courses
    </button>

    <!-- Alerte pour la liste des courses -->
    <div v-if="showShoppingListAlert" class="alerte-liste-courses">
      <div class="content">
        <h2>Liste des courses à acheter</h2>
        <ul>
          <li v-for="item in listeCourses" :key="item.ingredient">
            <!-- Utilisez item.ingredient au lieu de simplement item -->
            {{ item.ingredient }}
          </li>
        </ul>
      </div>
      <button @click="fermerListeCoursesAlerte">Fermer</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      joursSemaine: [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche",
      ],
      momentsJournee: ["Petit dej", "Dej", "Diner"],
      recettesMenu: [],
      showAlert: false,
      alertData: {},
      listeCourses: [],
      showShoppingListAlert: false,
    };
  },
  created() {
    this.recupereRecettesMenu();
  },
  methods: {
    recupereRecettesMenu() {
      const menuRecettes = JSON.parse(localStorage.getItem("menuSemaine"));
      if (menuRecettes) {
        this.recettesMenu = menuRecettes;
      }
    },
    getRecettesByJourEtMoment(jour, moment) {
      return this.recettesMenu.filter(
        (item) => item.jourSemaine === jour && item.momentJournee === moment
      );
    },
    genererMenuSemaine() {
  const recettes = JSON.parse(localStorage.getItem("recettes")) || [];
  const menuSemaine = [];
  const ingredientsAjoutes = {}; // Utilisation d'un objet pour suivre les ingrédients déjà ajoutés

  this.joursSemaine.forEach((jour) => {
    this.momentsJournee.forEach((moment) => {
      const recettesDisponibles = recettes.filter(
        (recette) =>
          !menuSemaine.some(
            (item) =>
              item.jourSemaine === jour &&
              item.momentJournee === moment &&
              item.id === recette.id
          )
      );

      const recetteAleatoire =
        recettesDisponibles[Math.floor(Math.random() * recettesDisponibles.length)];

      if (recetteAleatoire) {
        menuSemaine.push({
          ...recetteAleatoire,
          jourSemaine: jour,
          momentJournee: moment,
        });

        // Ajouter les ingrédients à la liste des courses uniquement s'ils n'ont pas encore été ajoutés
        if (!ingredientsAjoutes[recetteAleatoire.id]) {
          recetteAleatoire.ingredients.forEach((ingredient) => {
            const existingItem = this.listeCourses.find(
              (item) => item.ingredient === ingredient
            );

            if (existingItem) {
              // Si l'ingrédient existe déjà, incrémente la quantité
              existingItem.quantite++;
            } else {
              // Sinon, ajoute un nouvel élément
              this.listeCourses.push({ ingredient, quantite: 1 });
            }
          });

          // Marquer les ingrédients comme ajoutés
          ingredientsAjoutes[recetteAleatoire.id] = true;
        }
      }
    });
  });

  localStorage.removeItem('menuSemaine');
  localStorage.setItem("menuSemaine", JSON.stringify(menuSemaine));
  this.recupereRecettesMenu();
},


    afficherAlerteRecette(recette) {
      this.alertData = recette;
      this.showAlert = true;
    },
    fermerAlerte() {
      this.showAlert = false;
    },
    genererListeCourses() {
  this.listeCourses = [];
  const ingredientsAjoutes = {}; // Utilisation d'un objet pour suivre les ingrédients déjà ajoutés

  this.recettesMenu.forEach((recette) => {
    // Ajouter les ingrédients à la liste des courses uniquement s'ils n'ont pas encore été ajoutés
    if (!ingredientsAjoutes[recette.id]) {
      if (recette.ingredients && Array.isArray(recette.ingredients)) {
        recette.ingredients.forEach((ingredient) => {
          const existingItem = this.listeCourses.find(
            (item) => item.ingredient === ingredient
          );

          if (existingItem) {
            // Si l'ingrédient existe déjà, incrémente la quantité
            existingItem.quantite++;
          } else {
            // Sinon, ajoute un nouvel élément
            this.listeCourses.push({ ingredient, quantite: 1 });
          }
        });
      } else {
        console.error(
          `Les ingrédients de la recette "${recette.nomRecette}" ne sont pas valides.`
        );
      }

      // Marquer les ingrédients comme ajoutés
      ingredientsAjoutes[recette.id] = true;
    }
  });

  this.showShoppingListAlert = true;
},

    fermerListeCoursesAlerte() {
      this.showShoppingListAlert = false;
    },
  },
};
</script>

<style scoped>
.menu-wrapper {
  max-width: 800px;
  margin: 0 auto;
  font-family: "Arial", sans-serif;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.alerte-recette {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  width: 400px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.alerte-recette .content {
  margin-bottom: 10px;
}

.alerte-recette h2 {
  text-align: center;
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.alerte-recette h3 {
  font-size: 18px;
  color: #555;
  margin-top: 10px;
}

.alerte-recette h4 {
  font-size: 16px;
  color: #777;
  margin-top: 10px;
}

.alerte-liste-courses {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  width: 400px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.alerte-liste-courses .content {
  margin-bottom: 10px;
}

.alerte-liste-courses h2 {
  text-align: center;
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.alerte-liste-courses ul {
  list-style-type: none;
  padding: 0;
}

.alerte-liste-courses li {
  font-size: 16px;
  color: #555;
  margin-top: 10px;
}

/* Style pour le bouton de génération de la liste des courses */
.generer-liste-courses {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

.generer-liste-courses:hover {
  background-color: #45a049;
}
</style>
