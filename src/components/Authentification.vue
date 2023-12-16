<template>
  <div class="main-container">
    <!-- Section " Historique" à Gauche -->
    

    <!-- Section "Gagnez du temps" -->
    <div class="additional-section time-section">
      <h3 class="additional-section-title"><i class="icon fas fa-clock"></i> Gagnez du temps!</h3>
      <div class="reason">
  <p class="reason-text">
    La planification des repas offre une multitude de moyens pratiques pour économiser du temps au quotidien, notamment en :
  </p>
  <ul class="reason-list">
    <li><i class="fas fa-angle-right"></i> Réduisant le temps passé au supermarché, car vous savez exactement quoi acheter.</li>
    <li><i class="fas fa-angle-right"></i> Évitant les oublis et les détours de dernière minute à l'épicerie.</li>
    <li><i class="fas fa-angle-right"></i> Connaissant à l'avance la superette idéale pour vos courses.</li>
    <li><i class="fas fa-angle-right"></i> Atténuant le stress lié à la préparation des repas, surtout lorsque la faim se fait sentir dans la maison.</li>
    <li><i class="fas fa-angle-right"></i> Organisant efficacement votre emploi du temps en planifiant les repas à l'avance.</li>
  <li><i class="fas fa-angle-right"></i> Préparant des repas rapides et sains grâce à une meilleure anticipation des ingrédients nécessaires.</li>
 
  </ul>
</div>

    </div>

    <!-- Section "Faites des économies" -->
    <div class="additional-section money-section">
      <h3 class="additional-section-title"><i class="icon fas fa-money-bill"></i> Faites des économies!</h3>
      <div class="reason">
  <p class="reason-text">
    Organiser vos repas à l'avance offre une multitude d'avantages, y compris la réduction du gaspillage alimentaire et la gestion plus efficace de votre budget.
  </p>
  <p class="reason-text">
    La triste réalité est que beaucoup d'aliments finissent souvent directement du réfrigérateur à la poubelle. En planifiant vos repas en fonction des ingrédients que vous avez déjà, vous minimisez les pertes alimentaires, ce qui se traduit par des économies substantielles.
  </p>
  <p class="reason-text">
    De plus, la planification des menus vous permet de tirer parti des offres spéciales de la semaine, vous aidant ainsi à réduire le coût total de votre épicerie. En évitant les achats impulsifs coûteux, vous faites des choix plus judicieux pour votre portefeuille.
  </p>
</div>
    </div>
  <div class="container">
    <div class="serious-section">
      <h2 class="serious-title">Rejoignez-nous pour une meilleure expérience! 🚀</h2>
    </div>
    <form @submit.prevent="submitForm" class="form">
      <h2 v-if="isLoginForm" class="form-title">Connexion </h2>
      <h2 v-else class="form-title">Inscription </h2>

      <input v-model="formData.username" type="text" class="inputtext" placeholder="Nom d'utilisateur" />
      <input v-if="!isLoginForm" v-model="formData.email" type="email" class="inputtext" placeholder="Adresse e-mail" />

      <input v-model="formData.password" class="inputtext" type="password" placeholder="Mot de passe" />

      <button type="submit">
        {{ isLoginForm ? 'Se connecter' : 'S\'inscrire' }}
        <i v-if="isLoginForm" class="fas fa-sign-in-alt"></i>
        <i v-else class="fas fa-user-plus"></i>
      </button>

      <p @click="toggleForm" class="form-toggle">
        {{ isLoginForm ? 'Pas encore inscrit ?' : 'Déjà inscrit ?' }}
        <i class="fas fa-exchange-alt"></i>
      </p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button @click="deconnecterUtilisateur" >
      Se déconnecter <i class="fas fa-sign-out-alt"></i>
    </button>
    <p v-if="logoutMessage" class="success-message">{{ logoutMessage }}</p>
    
    </form>
    <div v-if="!isLoginForm" class="testimonials">
      <p class="testimonials-title">Ce que nos utilisateurs disent :</p>
      <blockquote class="testimonial-item">
        "Depuis que j'ai créé un compte, ma cuisine est devenue plus variée ! 🌟" - Alice
      </blockquote>
      <blockquote class="testimonial-item">
        "Je perds moins de temps, et j'économise beaucoup. Merci pour cette plateforme ! 👩‍🍳" - Bob
      </blockquote>
    </div>
    
     <div v-if="isLoginForm" class="login-promotion">
      <p class="promotion-title">Raisons de se connecter :</p>
      <ul class="promotion-list">
        <li class="promotion-item">
        Accédez à vos recettes personnelles. <i class="fas fa-star text-yellow"></i>
      </li>
      <li class="promotion-item">
        Générez une liste des courses de la semaine. <i class="fas fa-laugh text-green"></i>
      </li>
      <li class="promotion-item">
        Recevez des suggestions de recettes personnalisées. <i class="fas fa-thumbs-up text-blue"></i>
      </li>
      </ul>
    </div>
  </div>
  </div>
  
</template>

  
  <script>
  import { openDB } from 'idb';
  
  export default {
    data() {
      return {
        isLoginForm: true,
        formData: {
          username: '',
          email: '',
          password: ''
        },
        db: null,
        errorMessage: '' ,// Nouvelle propriété pour stocker le message d'erreur
        successMessage: '',
        utilisateurId: null,
        logoutMessage: '',
      };
    },
    methods: {
      async initDB() {
        this.db = await openDB('projet', 5, {
            upgrade(db, oldVersion) {
      // Remove the old object store if it exists
      if (oldVersion < 1) {
        db.deleteObjectStore('recettes');
      }
            if (!db.objectStoreNames.contains('utilisateurs')) {
              const store = db.createObjectStore('utilisateurs', { keyPath: 'id', autoIncrement: true });
              store.createIndex('username', 'username', { unique: true });
            }
          }
        });
      },
  
      async verifierUtilisateur() {
    const tx = this.db.transaction('utilisateurs', 'readonly');
    const store = tx.objectStore('utilisateurs');
    const index = store.index('username');

    const utilisateur = await index.get(this.formData.username);

    if (utilisateur && utilisateur.password === this.formData.password) {
      
      localStorage.setItem('userId', utilisateur.id);

      console.log('Utilisateur connecté:', utilisateur);
      // Afficher le message de connexion réussie
        this.successMessage = 'Connexion réussie. Redirection vers la page d\'accueil...';

        // Rediriger l'utilisateur vers la page d'accueil après une courte pause
        setTimeout(() => {
          this.$router.push('home');
        }, 2000); 
      } else {
      this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
    }
  },
  async ajouterUtilisateur() {
  const tx = this.db.transaction('utilisateurs', 'readwrite');
  const store = tx.objectStore('utilisateurs');

  const utilisateur = {
    username: this.formData.username,
    email: this.formData.email,
    password: this.formData.password
  };

  const request = await store.add(utilisateur);
  const userId = request.result; // Récupérer l'ID généré automatiquement

  console.log('Utilisateur ajouté avec ID:', userId);

  this.errorMessage = 'Inscription réussie. Vous pouvez maintenant vous connecter.';

  
  return { ...utilisateur, id: userId };
},


async submitForm() {
  await this.initDB();

  // Réinitialise le message d'erreur avant chaque tentative
  this.errorMessage = '';

  if (this.isLoginForm) {
    this.verifierUtilisateur();
  } else {
    const newUser = await this.ajouterUtilisateur();
    // Enregistrez l'ID de l'utilisateur après l'inscription
    localStorage.setItem('userId', newUser.id);
    // Réinitialiser le formulaire après l'inscription
    this.formData = { username: '', email: '', password: '' };
  }

  console.log('Form submitted:', this.formData);
},

getUser() {
        // Récupérer l'ID de l'utilisateur depuis le localStorage
        const userId = localStorage.getItem('userId');

        if (userId) {
          // Faites quelque chose avec l'ID de l'utilisateur, par exemple, le stocker dans utilisateurId
          this.utilisateurId = userId;
        } else {
          // L'utilisateur n'est pas connecté, gérer en conséquence
          this.utilisateurId = null;
        }
      },
deconnecterUtilisateur() {
  this.logoutMessage = 'Déconnexion réussie. Merci de votre visite!';
   
    localStorage.removeItem('userId');

    setTimeout(() => {
        this.$router.push('home');
      }, 2000);
    },

      toggleForm() {
        this.isLoginForm = !this.isLoginForm;
      },
    
    async init() {
        await this.initDB();
       
        this.getUser();
      },

    },
    created() {
  this.init();
},


    
  };
  </script>
  
  
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.error-message,
.success-message {
  font-weight: bold;
  margin-top: 10px;
}

.main-container {
  display: flex;
  justify-content: space-between;
  
}


.container {
  width: 65%;
  display: flex;
  flex-direction: column; 
  align-items: center; 
  border-radius: 8px;
  margin-top: 30px; 
}
.container:hover{
  border-color: #f86363;
  box-shadow: 0 0 8px rgba(248, 99, 99, 0.3);
}
.inputtext:hover{
  border-color: #ffffff;
  box-shadow: 0 0 8px rgba(143, 54, 54, 0.3);
}
.form {
  max-width: 900px;
  width: 70%;
  padding: 20px; 
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #f67d7d;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.8s ease-in-out; /* Animation de fondu à l'entrée */
  margin-top: 5px; 
  font-family: 'Pacifico', cursive;
  
}


.form-title {
  text-align: center;
  color: #000000; 
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid #000000;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  color: rgb(0, 0, 0);
}

button {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  background-color: #ffd6d6; 
  color: rgb(0, 0, 0);
  cursor: pointer;
  transition: background-color 0.3s ease-in-out; /* Animation de transition de couleur au survol */
}

button:hover {
  background-color: #ab2f2f;
}

.form-toggle {
  text-align: center;
  cursor: pointer;
  color: #ffffff; 
}

.form-toggle:hover {
  text-decoration: underline; /* Soulignement au survol */
}

/* Animation de fondu à l'entrée */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }

}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.testimonials {
  margin-top: 30px;
  text-align: center;
  animation: fadeIn 1s ease-in-out; /* Animation de fondu */
}

.testimonials-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #000000;
  font-family: 'Pacifico', cursive;
  animation: slideIn 1s ease-in-out; /* Animation de défilement */
}

.testimonial-item {
  font-size: 16px;
  margin-bottom: 15px;
  color: #000000;
  animation: slideIn 1s ease-in-out; /* Animation de défilement */
}
.login-promotion {
  margin-top: 30px;
  text-align: center;
  animation: fadeInUp 1s ease-in-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.login-promotion {
  margin-top: 20px; /* Espacement en haut */
  padding: 20px; /* Espacement intérieur */
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  text-align: center;
}

.promotion-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #000000;
  font-family: 'Pacifico', cursive;
}

.promotion-list {
  list-style-type: none;
  padding: 0;
}

.promotion-item {
  font-size: 16px;
  margin-bottom: 10px;
  color: #000000;
}

.text-yellow {
  color: yellow;
}

.text-green {
  color: green;
}

.text-blue {
  color: blue;
}
/* section gauche */


.additional-section:hover{
  border-color: #f86363;
  box-shadow: 0 0 8px rgba(248, 99, 99, 0.3);
}
.additional-section {
  background-color: rgba(246, 125, 125, 0.5);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-family: 'Roboto', sans-serif;
    width: 30%;
  padding: 20px;
  box-sizing: border-box;
  text-align: justify;
  margin: 10px;
  font-family: 'Pacifico', cursive;
  }
  
  .additional-section-title {
    font-size: 24px;
    color: #333;
    margin-bottom: 15px;
    font-weight: bold;
    font-family: 'Pacifico', cursive;
  }

  .additional-section-content {
    font-size: 16px;
    color: #000000;
    margin-bottom: 15px;
    line-height: 1.5;
  }


.reason {
  margin-top: 20px;
}

.icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.reason-text {
  margin-bottom: 10px;
}

.reason-list {
  list-style-type: none;
  padding: 0;
  margin-left: 20px;
}

.reason-list li {
  margin-bottom: 8px;
}


.time-section {
  
  background-color: #B4E2FF;
  color: #333;
  font-family: 'Pacifico', cursive;
}

.money-section {
  background-color: #FFD6D6;
  color: #333;
  font-family: 'Pacifico', cursive;
}
/* serious section */ 
.serious-section {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
 
  animation: fadeInUp 1s ease-in-out; /* Animation de fondu à l'entrée */
}

.serious-title {
  font-size: 24px;
  font-weight: bold;
  color: #ff5959; /* Couleur du texte */
}

/* Animation de fondu à l'entrée */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>