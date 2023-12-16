 <!-- eslint-disable vue/multi-word-component-names -->

 <template >
  
  <div id="app"> 
    
     
      <div class="left-side" style="margin-top: 480px;">
  
  
        <router-link to="/recipe-add" class="share-button">
  <span class="share-text">Ajouter une recette</span>
</router-link>

</div>
      
<section class="content-section">
    <div class="milieu">
      <div class="Welcome-Text">
        <h1> Avec FOODLY planifiez votre menu de la semaine et préparez vos courses !</h1>
        <p>
          Bienvenue dans notre site de planification de recettes, où vous pouvez rentrer vos recettes, les ajouter à votre menu de la semaine, ou générer un menu automatiquement ; et ensuite avoir la liste des courses de la semaine à faire !
        </p>
      </div>
      
      


      <div class="BG-images">
        <img class="ellipse" :src="require('@/assets/ellipse.png')" />
        <img class="sushi" :src="require('@/assets/sushi_noBG.png')">
        <img class="goffre" :src="require('@/assets/Goffre-noBG.png')" />
        <img class="burger" :src="require('@/assets/Burger-noBG.png')" />
        <img class="ellipse2" :src="require('@/assets/ellipse-cropped.png')" />
      </div>
    </div>
    
    <router-view />
    <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> 
    <section class="new-section">
  <div class="section-content">
    <div class="section-image">
      <img src="https://source.unsplash.com/800x600/?food,dessert" alt="Cuisine/Dessert" />
    </div>
    <div class="section-text">
      <h2>Un planificateur de menus</h2>
      <p>   Rentrez vos recettes et laissez nous vous générer  un menu de<br> la semaine. <br>
Votre liste de course est automatiquement générée et peut être  <br> utilisée directement sur votre ordinateur. </p>
    </div>
  </div>
</section>


    </section>
    
  </div>
</template>


<script>
export default {
  mounted() {
    // Code to run after the component is mounted
    // You can add any additional logic related to the ChatBot here

    // Start of ChatBot (www.chatbot.com) code
    window.__be = window.__be || {};
    window.__be.id = "657dcea6676c240007b2fb17";
    (function() {
      var be = document.createElement('script');
      be.type = 'text/javascript';
      be.async = true;
      be.src =
        ('https:' == document.location.protocol ? 'https://' : 'http://') +
        'cdn.chatbot.com/widget/plugin.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(be, s);
    })();
    // End of ChatBot code
  },
};
</script>

<style scoped>
/* Fonts */
@import url('https://fonts.cdnfonts.com/css/mrs-sheppards');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
@import url('https://fonts.cdnfonts.com/css/poppins');
@import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display&display=swap');
@font-face {
  font-family: 'Mrs Sheppards';
  src: url('https://fonts.cdnfonts.com/css/mrs-sheppards');
}

@font-face {
  font-family: 'Poppins';
  font-weight: 700;
  src: url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
}

@font-face {
  font-family: 'Big Shoulders Display';
  src: url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display&display=swap');
}
:root {

  --gold-crayola: hsl(38, 61%, 73%);
   --quick-silver: hsla(0, 0%, 65%, 1);
   --davys-grey: hsla(30, 3%, 34%, 1);
   --smoky-black-1: hsla(40, 12%, 5%, 1);
   --smoky-black-2: hsla(30, 8%, 5%, 1);
   --smoky-black-3: hsla(0, 3%, 7%, 1);
   --eerie-black-1: hsla(210, 4%, 9%, 1);
   --eerie-black-2: hsla(210, 4%, 11%, 1);
   --eerie-black-3: hsla(180, 2%, 8%, 1);
   --eerie-black-4: hsla(0, 0%, 13%, 1);
   --white: hsla(0, 0%, 100%, 1);
   --white-alpha-20: hsla(0, 0%, 100%, 0.705);
   --white-alpha-10: hsla(0, 0%, 100%, 0.1);
   --black: hsla(0, 0%, 0%, 1);
   --black-alpha-80: hsla(0, 0%, 0%, 0.8);
   --black-alpha-15: hsla(0, 0%, 0%, 0.15);
  --fontFamily-dm_sans: 'Poppins', sans-serif;
  --fontSize-body-4: 16px;
  --weight-regular: 400;
  --lineHeight-5: 1.5;
  --transition-1: 250ms ease;
   --transition-2: 500ms ease;
   --transition-3: 1000ms ease;
  
}

* {
  margin: 0;
  padding: 0;
}
.content-section {
display: flex;
flex-direction: column;
height: 100vh;
overflow: hidden;
}


body {
  height: 100vh;
  overflow: hidden;
  
}

section {
  width: 100%;
  height: 100vh;
}
.left-side img {
        position: absolute;
        width: 45px;
        height: 45px;
        left: 30px;
        top: 30px;
      }

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: transparent;
}

li {
  float: left;
  border-right: 2px solid var(--gold-crayola);
}

li:last-child {
  border-right: none;
}

li a {
  display: block;
  color: var(--black);
  text-align: center;
  padding: 14px 80px;
  text-decoration: none;
  font-family: var(--fontFamily-dm_sans);
}
/* Arrow style */
.btn::before {
  content: "";
  position: absolute;
  top: 50%;
  right: 15px; 
  width: 8px;
  height: 8px;
  border-left: 3px solid var(--white);
  border-bottom: 3px solid var(--white);
  transform: translate(-50%, -50%) rotate(-135deg);
  transition: transform var(--transition-1);
  z-index: 1;
}
li a:hover:not(.active) {
    background-color: #000000;
    transition: background-color 0.2s ease-in-out; /* transition effect to the background-color property */
    transition-delay: 0.1s; /*delay to the transition effect */
    color: white;
  }
  
  .active {
    background-color: #000000;
    color: white;
    position: relative;
    text-transform: uppercase;
    padding: 12px 80px;
    overflow: hidden;
  }

.btn:hover::before,
.btn:focus::before {
  transform: translate(-50%, -50%) rotate(-45deg);
}

li a:hover:not(.active) {
  background-color: #000000;
  transition: background-color 0.2s ease-in-out;
  transition-delay: 0.1s;
  color: var(--white);
}

.active {
  background-color: #000000;
  color: var(--white);
  position: relative;
  text-transform: uppercase;
  padding: 12px 80px;
  overflow: hidden;
}
.active::before {
  transform: translate(-50%, -50%) rotate(-45deg);
}


.Welcome-Text {
  margin-top: 50px;
}


.Welcome-Text h1 {
  position: absolute;
  width: 781px;
  height: 142px;
  left: 80px;
  top: 180px;
  font-family: 'Mrs Sheppards';
  font-style: normal;
  font-weight: 400;
  font-size: 64px;
  line-height: 86px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ff5151;
}
.new-section {
  background-color: #fff1f1;
  padding: 20px;
  margin-top: 5px;
  text-align: center;
}

.section-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    overflow: hidden;
}

.section-image img {
  width: 550px; 
  height: auto; 
  border-radius: 10px; 
  margin-right: 300px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
}
.section-image img:hover {
    transform: scale(1.1);
  }


  .section-text {
    max-width: 600px;
    text-align: left;
  }

  .section-text h2 {
    font-family: 'Poppins', sans-serif;
    font-size: 28px;
    color: #333;
    margin-bottom: 20px;
  }

  .section-text p {
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 10px;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 1s forwards 0.5s;
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
.Welcome-Text p {
  position: absolute;
  width: 718px;
  height: 332px;
  left: 120px;
  top: 290px;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;
  display: flex;
  align-items: center;
}

.BG-images .ellipse {
  position: absolute;
  width: 77vh;
  left: 65%;
  top: 10%;
}

.BG-images .ellipse2 {
  position: absolute;
  width: 72vh;
  top: 92%;
  left: 30%;
  overflow: hidden;
}

.BG-images .sushi {
  position: absolute;
  width: 53vh;
  height: 53vh;
  left: 62%;
  top: 8%;
  animation: spin 15s linear infinite;
}

.BG-images .burger {
  position: absolute;
  width: 25.6vh;
  height: 25.6vh;
  left: 63%;
  top: 60%;
}

.BG-images .goffre {
  position: absolute;
  width: 70vh;
  left: 67%;
  top: 55%;
}
.share-button {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: white;
  background-color: rgb(244, 65, 65);
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  transition-delay: 0.1s;
  left: 320px;
  z-index: 1;
}

.share-button:hover {
  background-color: #b73232;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  header {
    position: relative;
  }
  ul {
    display: flex;
    flex-direction: row;
    position: absolute;
    left: 90%;
  }
  .left-side {
    height: 100%;
    position: relative;
  height: auto;
  }
  .custom-section {
  position: relative;
  width: 100%;
  height: 300px; 
  overflow: hidden;
  margin-top: 20px; 
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Ajustez l'opacité selon vos besoins */
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
  color: white;
}

.content input {
  padding: 10px;
  margin-right: 10px;
}

.content button {
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

}

</style>
