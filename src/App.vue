<template>
  <div id="app">
    <section class="content-section">
      <header class="header">
        <div class="left-items">
          <div
            v-for="(item, index) in leftItems"
            :key="index"
            :class="{ 'navbar-item': true, active: currentPage === index }"
          >
            <div class="menu-item-wrapper" @click="handleMenuClick(index)">
              <router-link :to="item.link" class="nav-link">
                {{ item.text }}
              </router-link>
              <div
                v-if="currentPage === index"
                class="active-indicator"
              ></div>
            </div>
          </div>
        </div>
        <router-link to="/foodly" class="nav-link">
            <div class="logo">Foodly</div>
          </router-link>
        <div class="right-items">
          <div
            v-for="(item, index) in rightItems"
            :key="index"
            :class="{ 'navbar-item': true, active: currentPage === index }"
          >
            <div class="menu-item-wrapper" @click="handleMenuClick(index)">
              <router-link :to="item.link" class="nav-link">
                {{ item.text }}
              </router-link>
              <div
                v-if="currentPage === index"
                class="active-indicator"
              ></div>
            </div>
          </div>
        </div>
      </header>
      
      <router-view />
      

    </section>
     <!-- Ajout du pied de page -->
     <footer class="footer">
        <div class="left-footer">
          <!-- Deux titres pour la partie gauche du footer -->
          <div class="footer-title">Foodly</div>
          <br>
          <div class="footer-title">Vos courses et repas <br>
de la semaine en 1 minute</div>
        </div>
        <div class="right-footer">
          <!-- Trois colonnes pour la partie droite du footer -->
          <div class="footer-column">
            <h4>À Propos <i class="fas fa-info-circle"></i></h4>
             <p>  Foodly, votre source d'inspiration <br> pour des recettes délicieuses.</p>
            
          </div>
          <div class="footer-column">
            <h4>Contact <i class="fas fa-envelope"></i></h4>
            <p>Contactez-nous pour toute  <br> question ou suggestion.</p>
            <p>foodly@gmail.com</p>
          </div>
          <div class="footer-column">
            <h4>Suivez-nous</h4>
            <p>Restez connecté avec nous <br> sur les réseaux sociaux.</p>
            <div>
              <i class="fab fa-facebook"></i>
              
              <i class="fab fa-twitter"></i>
             
              <i class="fab fa-instagram"></i>
              
              
            </div>
          </div>
        </div>
      </footer>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      currentPage: null,
      leftItems: [
        
        { text: 'Recipes', link: '/recipe-list' },
        { text: 'Menu', link: '/menu-input' },
      ],
      rightItems: [
        //{ text: 'Generation', link: '/menu-semaine' },
        
        { text: 'Home', link: '/Home' },
        { text: 'Connexion', link: '/authentification' },
        
      ],
    };
  },
  methods: {
    handleMenuClick(index) {
      this.currentPage = index;
    },
  },
};
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
.content-section {
  margin-top: 80px;
  overflow-y: auto;
  height: 100%;
  background-color: rgb(253, 249, 249);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  color: #fb6969;
  padding: 16px;
  font-family: 'Poppins', sans-serif;
  z-index: 1000;
}

.logo {
  font-family: 'Fredoka One', cursive;
  font-size: 24px;
  font-weight: bold;
}

.left-items,
.right-items {
  display: flex;
  align-items: center;
}

.navbar-item {
  margin-right: 20px;
}

.menu-item-wrapper {
  position: relative;
  cursor: pointer;
}

.nav-link {
  text-decoration: none;
  color: #f86363;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: bold;
}

.active-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #ffebeb;
;
  transform-origin: bottom;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.navbar-item.active .active-indicator {
  transform: scaleX(1);
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  color: #fb6969;
  font-family: 'Poppins', sans-serif;
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.left-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.right-footer {
  display: flex;
}

.footer-column {
  margin-right: 50px;
  font-size: 14px;
  color: #f86363;
}

.footer-title {
  font-family: 'Fredoka One', cursive;
  font-size: 18px;
  font-weight: bold;
}

</style>
