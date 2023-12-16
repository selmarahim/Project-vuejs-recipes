<template>
  <div>
    <h1 class="title"><i class="fas fa-calendar icon-style"></i>Planification du Menu</h1>
    <p class="planification-text">Après avoir entré vos recettes, venez les sélectionner dans votre menu de la semaine et ensuite appuyez sur "Générer la Liste des Courses" 😊</p>

    <table class="menu-table">
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
          <td class="select-container">
  <select v-model="menu[index].breakfast" class="select-menu">
    <option value="">Sélectionner une recette</option>
    <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">
      {{ recipe.name }}
    </option>
  </select>
</td>

          <td>
            <select v-model="menu[index].lunch" class="select-menu">
              <option value="">Sélectionner une recette</option>
              <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">
                {{ recipe.name }}
              </option>
            </select>
          </td>
          <td>
            <select v-model="menu[index].dinner" class="select-menu">
              <option value="">Sélectionner une recette</option>
              <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">
                {{ recipe.name }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="saveMenu" class="action-button">
      <i class="fas fa-save icon-style"></i> Enregistrer le Menu
    </button>

    <button @click="generateShoppingList" class="action-button">
      <i class="fas fa-shopping-cart icon-style"></i> Générer la Liste des Courses
    </button>

     <!-- Liste des courses superposée -->
     <div v-if="shoppingList.length > 0" class="shopping-list-overlay">
      <div class="shopping-list alert-box">
        <h2><i class="fas fa-fw fa-shopping-cart"></i> Liste des Courses</h2>
        <ul>
          <li v-for="(item, index) in shoppingList" :key="index">
            {{ item.name }}: {{ item.quantity }} {{ item.unit }}
          </li>
        </ul>
        <!-- Bouton pour fermer la liste des courses -->
        <button @click="closeShoppingList" class="action-button">
          <i class="fas fa-times icon-style"></i> Fermer
        </button>
      </div>
      
    </div>
    
    
    <MenuSemaine />
  </div>
</template>

<script>
import MenuSemaine from './MenuSemaine.vue'; 
import { openDB } from 'idb';

export default {
  components: {
    MenuSemaine, 
  },
  data() {
    return {
      db: null,
      user: null,
      recipes: [], 
      days: ['Dimanche', 'Lundi', 'Mercredi', 'Jeudi', 'Vendredi'],
      menu: [
        { breakfast: '', lunch: '', dinner: '' }, // Lundi
        { breakfast: '', lunch: '', dinner: '' }, // Mardi
        { breakfast: '', lunch: '', dinner: '' }, // Mercredi
        { breakfast: '', lunch: '', dinner: '' }, // Jeudi
        { breakfast: '', lunch: '', dinner: '' }, // Vendredi
        
      ],
      shoppingList: [],
    };
  },
  async created() {
  await this.initDB();
  this.user = await this.getUser();
  await this.chargerRecettes();
  await this.loadMenu();
},
  methods: {
    async initDB() {
      try {
        this.db = await openDB('projet', 5, {
          upgrade(db, oldVersion) {
            
  if (oldVersion < 1) {
    db.deleteObjectStore('recettes');
  }

  if (!db.objectStoreNames.contains('menus')) {
  db.createObjectStore('menus', { keyPath: 'userId' });
}


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
      const tx = this.db.transaction('utilisateurs'); 
      const utilisateurStore = tx.objectStore('utilisateurs');
      return utilisateurStore.get(parseInt(userId));
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

        this.recipes = allRecipes.filter(recipe => recipe.userId === user.id);
      } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
      }
    },

    async saveMenu() {
  try {
    const user = await this.getUser();
    if (!user) {
      console.error('Utilisateur non connecté');
      return;
    }

    const tx = this.db.transaction('menus', 'readwrite');
    const menuStore = tx.objectStore('menus');

    const menuCopy = JSON.parse(JSON.stringify(this.menu)); 

    const existingMenu = await menuStore.get(user.id);
    if (!existingMenu) {
      
      const newMenu = { userId: user.id, menu: menuCopy };
      await menuStore.add(newMenu);
    } else {
      // Mettez à jour le menu existant
      existingMenu.menu = menuCopy;
      await menuStore.put(existingMenu);
    }

    await tx.complete; 

    console.log('Menu enregistré avec succès:', menuCopy);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du menu:', error);
  }
},

    async loadMenu() {
      try {
        const user = await this.getUser();
        if (!user) {
          console.error('Utilisateur non connecté');
          return;
        }

        const tx = this.db.transaction('menus', 'readonly');
        const menuStore = tx.objectStore('menus');

        const storedMenu = await menuStore.get(user.id);

        if (storedMenu) {
          this.menu = storedMenu.menu;
          console.log('Menu chargé avec succès:', this.menu);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
      }
    },
    addIngredients(ingredientList) {
  const result = {};

  ingredientList.forEach(ingredient => {
    const { name, quantity, unit } = ingredient;
    const key = name.toLowerCase();

    if (!result[key]) {
      result[key] = { name, quantity, unit };
    } else {
      
      result[key].quantity = `${result[key].quantity} + ${quantity}`;
     
      if (unit && result[key].unit !== unit) {
        // Ajouter l'unité uniquement si elle est définie et différente
        result[key].unit = ''; // Réinitialiser à une chaîne vide pour éviter 'undefined'
      }
    }
  });

  return Object.values(result);
},



generateShoppingList() {
  const shoppingList = {};

  // Parcourir le menu
  this.menu.forEach(dayMenu => {
    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const recipeId = dayMenu[mealType];
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
                // Ajouter l'unité uniquement si elle est définie et différente
                shoppingList[key].unit = ''; // Réinitialiser à une chaîne vide pour éviter 'undefined'
              }
            }
          });
        }
      }
    });
  });

  // Calculer le total des quantités
  Object.values(shoppingList).forEach(item => {
    if (typeof item.quantity === 'string') {
      const quantities = item.quantity.split('+').map(q => parseFloat(q.trim()) || 0);
      item.quantity = quantities.reduce((total, q) => total + q, 0);
    }
  });

  // Afficher la liste des courses
  this.shoppingList = Object.values(shoppingList);
},




closeShoppingList() {
      this.shoppingList = []; // Efface la liste des courses
    },




  },
};
</script>
<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css');

  body {
    font-family: 'Montserrat', sans-serif;
    background-color: #000;
    color: #fff;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px; 
    font-family: 'Montserrat', sans-serif;
    color: rgb(50, 50, 50);
  }
  .planification-text {
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    color: #333; /* Couleur de texte */
    margin-top: 10px; /* Espacement en haut */
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

  

  .action-button {
    background-color: #ff5c5c;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    margin-bottom: 10px;
    border-radius: 10px;
    margin-left: 10px;
  }

  .action-button:hover {
    background-color: #ab2f2f;
  }

  .icon-style {
    margin-right: 8px;
  }

  .shopping-list {
    text-align: center;
    margin-top: 20px;
    box-shadow: 0 0 10px rgba(170, 82, 82, 0.1); 
  }

  .shopping-list h2 {
    font-size: 24px; 
  }

  .shopping-list .fa-fw {
    margin-right: 8px; 
  }

  .shopping-list ul {
    list-style-type: none;
    padding: 0;
  }
  .shopping-list-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0px;
    background-color: #ffc7c7;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 80%;
    text-align: left;
    font-family: 'Montserrat', sans-serif;
    animation: fadeIn 0.5s ease-in-out;
  }

  .shopping-list li {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .alert-box {
    background-color: #fff9f9; /* Couleur de fond  */
    color: #000000; /* Couleur du texte */
    padding: 20px; /* Remplissage interne */
    border: 1px solid #a4a4a4; /* Bordure  */
    border-radius: 5px; /* Coins arrondis */
    text-align: left; /* Alignement du texte à gauche */
    max-width: 400px; /* Largeur maximale */
    margin: 0 auto; /* Centre horizontalement */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .select-menu {
    width: 100%;
    padding: 10px; /* Augmentation de la taille pour une meilleure expérience utilisateur */
    margin: 5px 0;
    box-sizing: border-box;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    appearance: none; 
    background-color: #fff; /* Couleur de fond */
    background-image: url('data:image/svg+xml;utf8,<svg fill="%23333" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>'); /* Ajoutez une flèche personnalisée */
    background-repeat: no-repeat;
    background-position: right 10px center;
    cursor: pointer;
    font-family: 'Pacifico', cursive;
  }
  .select-container {
  display: flex;
  justify-content: space-around;
  list-style: none;
  padding: 0;
}


.select-menu:hover {
  background-color: #eee;
  color: #f98383;
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
  
</style>