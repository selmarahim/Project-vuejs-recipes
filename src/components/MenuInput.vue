<template>
  <div class="tab">
    <h1>Menu de la semaine</h1>
    <table>
      <thead>
        <tr>
          <th>Jour</th>
          <th>Petit-déjeuner</th>
          <th>Déjeuner</th>
          <th>Dîner</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(day, index) in jours" :key="index">
          <td>{{ day }}</td>
          <td>
            <select v-model="menu[index].petitDejeuner" @change="saveMenuToLocalStorage">
              <option value="">Vide</option>
              <option v-for="recipe in recipes" :key="recipe.nomRecette" :value="recipe.nomRecette">{{ recipe.nomRecette }}</option>
            </select>
          </td>
          <td>
            <select v-model="menu[index].dejeuner" @change="saveMenuToLocalStorage">
              <option value="">Vide</option>
              <option v-for="recipe in recipes" :key="recipe.nomRecette" :value="recipe.nomRecette">{{ recipe.nomRecette }}</option>
            </select>
          </td>
          <td>
            <select v-model="menu[index].diner" @change="saveMenuToLocalStorage">
              <option value="">Vide</option>
              <option v-for="recipe in recipes" :key="recipe.nomRecette" :value="recipe.nomRecette">{{ recipe.nomRecette }}</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="generateShoppingList">Générer la liste des courses</button>
    <div v-if="showAlert" class="alert">
      <h2>Liste des courses</h2>
      <ul>
        <li v-for="(ingredient, index) in shoppingList" :key="index">{{ ingredient }}</li>
      </ul>
      <button @click="closeAlert">Fermer</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jours: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      menu: this.getMenuFromLocalStorage(),
      recipes: this.getRecipesFromLocalStorage(),
      shoppingList: [],
      showAlert: false,
    };
  },
  methods: {
    getMenuFromLocalStorage() {
      const storedMenu = JSON.parse(localStorage.getItem('menu')) || [];
      return storedMenu.length === 7 ? storedMenu : this.createDefaultMenu();
    },
    getRecipesFromLocalStorage() {
      return JSON.parse(localStorage.getItem('recettes')) || [];
    },
    saveMenuToLocalStorage() {
      localStorage.setItem('menu', JSON.stringify(this.menu));
    },
    generateShoppingList() {
      this.shoppingList = [];
      this.menu.forEach(day => {
        this.addToShoppingList(day.petitDejeuner);
        this.addToShoppingList(day.dejeuner);
        this.addToShoppingList(day.diner);
      });
      this.showAlert = true;
    },
    addToShoppingList(nomRecette) {
  const recipe = this.recipes.find(r => r.nomRecette === nomRecette);

  if (recipe && recipe.ingredients && Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach(ingredient => {
      const existingItem = this.shoppingList.find(item => item.ingredient === ingredient);

      if (existingItem) {
        // Si l'ingrédient existe déjà, incrémente la quantité
        existingItem.quantite++;
      } else {
        // Sinon, ajoute un nouvel élément
        this.shoppingList.push({ ingredient, quantite: 1 });
      }
    });
  }
},
    closeAlert() {
      this.showAlert = false;
    },
    createDefaultMenu() {
      return Array(7).fill({
        petitDejeuner: '',
        dejeuner: '',
        diner: '',
      });
    },
  },
  created() {
    this.menu = this.getMenuFromLocalStorage();
  },
};
</script>

<style scoped>
.tab {
  max-width: 1000px;
  margin: 0 auto;
  font-family: "Arial", sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 14px;
  max-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

th {
  background-color: #f2f2f2;
}

button {
  margin-top: 10px;
  padding: 10px;
  cursor: pointer;
  background-color: #45a049;
  color: white;
  border: none;
}

button:hover {
  background-color: #4CAF50;
}
.alert-container {
  margin-top: 20px;
}
.alert {
  background-color: #f8f8f8;
  color: #333;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.alert h2 {
  color: #45a049;
}

.alert button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.alert ul {
  list-style: none;
  padding: 0;
}

.alert li {
  margin-bottom: 8px;
  padding-left: 25px;
  position: relative;
}

.alert li::before {
  content: '\2022';
  color: #45a049;
  font-size: 16px;
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
}
</style>

