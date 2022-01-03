<template>
  <header id="nav" :key="langKey">
    <router-link to="/"><img alt="logo Mathrice avec retour à l'accueil" src="./assets/mathrice-logo.png"></router-link>
    <h1>{{texts.title}}</h1>
    <div  id="cont-logos-user">
      <a v-if="connectState" href="/auth/plm" class="btn" id="cta" title="bouton de connexion">{{texts.login}}</a>
      <BtnFav v-if="!connectState && prefsIsSet && ($route.path == '/')" />
      <!--  -->
      <div id="lang-btns-cont">
        <img src="./assets/icons/globe_icon.svg" alt="logo langues" id="globe">
        <input type="checkbox" id="touch">
        <div id="dropdown-content">
          <img src="./assets/icons/french_flag.svg" alt="drapeau français" @click="langFr" :class="{ surrounded : lang === 'fr' }">
          <img src="./assets/icons/uk_flag.svg" alt="drapeau anglais" @click="langEn" :class="{ surrounded : lang === 'en' }"> 
        </div>
        
      </div>
      <router-link v-if="!connectState && ($route.path == '/edit_profile')" to="/"><fa icon="user-cog" /></router-link>
      <router-link v-if="!connectState && ($route.path != '/edit_profile')" to="/edit_profile"><fa icon="user-cog" /></router-link>
      <a v-if="!connectState" :href="connect.url"><fa icon="sign-out-alt" /></a>
    </div>
  </header>
  <div id="rectify-nav"></div>
  
  <div id="loader" v-if="loading">
    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    <p>Loading</p>
  </div>
  

  <router-view v-if="!loading"/>
  
  
  <Footer />
</template>

<script>import { registerRuntimeCompiler } from '@vue/runtime-core';
import BtnFav from '@/components/BtnFav.vue';
import Footer from '@/components/Footer.vue';


export default {
  components: {
    BtnFav,
    Footer,
  },
  data(){
    return{
      texts: {
        title: null,
        login: null,
      },
      langstore: 0,
      connect: [],
      loading: true,
    };
  },
  created(){
    // requête pour envoyer ds le store les infos prefs des tuiles et langue
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
      this.loading = true;
      // lancer dabord le server express local (Portail_Mathrice_Mock_API)
      const axios = require('axios').default;
      axios
      .get("http://localhost:3000/prefs")
      .then((response) => {
        this.$store.commit('SETPREFSINFOSTORE', response.data)
        this.$store.commit('SETLANGSTORE', response.data.lang)
        this.loading =  false;
      })
      .catch((error) => console.log(error)); 
    } else{
      this.loading = true;
      const axios = require('axios').default;
      axios
      .get("/api/prefs")
      .then((response) => {
        this.$store.commit('SETPREFSINFOSTORE', response.data)
        this.$store.commit('SETLANGSTORE', response.data.lang)
        this.loading =  false;
      })
      .catch((error) => console.log(error));
    }
  },
  mounted() {
    this.location = window.location.pathname;

    // requête connexion (sauve etat de connexion dans les store)
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
        const axios = require('axios').default;
        axios
        .get("http://localhost:3000/dataprofile")
        .then((response) => {
          this.connect = response.data
          this.$store.commit('SETCONNECTSTATESTORE', response.data.anonymous)
          this.$store.commit('SETADMINSTATESTORE', response.data.admin)
        })
        .catch((error) => console.log(error)); 
    } else{
        const axios = require('axios').default;
        axios
        .get("/api/profile")
        .then((response) => {
          this.connect = response.data
          this.$store.commit('SETCONNECTSTATESTORE', response.data.anonymous)
          this.$store.commit('SETADMINSTATESTORE', response.data.admin)
        })
        .catch((error) => console.log(error));
    }

    // requête pour textes celon langue
    const axios = require('axios').default;
    axios
    .get("./I18n.json")
    .then((response) => {
        this.texts = response.data[this.$store.state.lang].navbar;
        
    })
    .catch((error) => console.log(error));
      
  },
  computed:{

    // au changement de la varible de l'etat de connexion certains boutons apparaissent 
    connectState(){
        return this.$store.state.connectState;
    },

    lang(){
        return this.$store.state.lang;  
    },

    // recharge composant à chaque changement de langue
    langKey(){
        this.langstore = this.$store.state.langKey;
    },

    prefsIsSet(){
      if (this.$store.state.prefsInfo.prefs  != undefined){
        for (const pref in this.$store.state.prefsInfo.prefs) {
        if ( this.$store.state.prefsInfo.prefs[pref] == true) return true;
      }
    }
    this.$store.state.favActivated = false;
     return false;
    },
  },
  watch: {
    // chaque fois que langStore change la requête pour la langue des textes s'exécute.
    langstore(newLangstore, oldLangstore) {
      if (newLangstore > oldLangstore) {
        this.getTexts()
      }
    }
  },
  methods:{
    langFr(){
      
      this.$store.commit('SETLANGSTORE', 'fr');

      if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
        // lancer dabord le server express local (Portail_Mathrice_Mock_API)
        const axios = require('axios').default;
        axios
        .patch("http://localhost:3000/prefs/lang" , { lang : "fr"})
        .then((response) => {
          console.log("langue changée");
          this.$store.commit('SETLANGKEY');
          document.getElementById("touch").checked = false;
        })
        .catch((error) => console.log(error)); 
      } else{
        const axios = require('axios').default;
        axios
        .patch("/api/prefs" ,{ lang : "fr"})
        .then((response) => {
          console.log("langue changée");
          this.$store.commit('SETLANGKEY');
          document.getElementById("touch").checked = false;
        })
        .catch((error) => console.log(error));
      }
    },

    langEn(){
      
      this.$store.commit('SETLANGSTORE', 'en');

      if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
        // lancer dabord le server express local (Portail_Mathrice_Mock_API)
        const axios = require('axios').default;
        axios
        .patch("http://localhost:3000/prefs/lang" , { lang : "en"})
        .then((response) => {
          console.log("language changed");
          this.$store.commit('SETLANGKEY');
          document.getElementById("touch").checked = false;
        })
        .catch((error) => console.log(error)); 
      } else{
        const axios = require('axios').default;
        axios
        .patch("/api/prefs" ,{ lang : "en"})
        .then((response) => {
          console.log("language changed");
          this.$store.commit('SETLANGKEY');
          document.getElementById("touch").checked = false;
        })
        .catch((error) => console.log(error));
      }
    },

    //refait la requête pour les textes au changement de langue
    getTexts() {
      const axios = require('axios').default;
      axios
      .get("./I18n.json")
      .then((response) => {
        this.texts = response.data[this.$store.state.lang].navbar;
        
      })
      .catch((error) => console.log(error));

      // requête pour envoyer ds le store les infos prefs des tuiles et langue
      if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
        this.loading = true;
        // lancer dabord le server express local (Portail_Mathrice_Mock_API)
        const axios = require('axios').default;
        axios
        .get("http://localhost:3000/prefs")
        .then((response) => {
          this.$store.commit('SETPREFSINFOSTORE', response.data)
          this.$store.commit('SETLANGSTORE', response.data.lang)
          this.loading =  false;
        })
        .catch((error) => console.log(error)); 
      } else{
        this.loading = true;
        const axios = require('axios').default;
        axios
        .get("/api/prefs")
        .then((response) => {
          this.$store.commit('SETPREFSINFOSTORE', response.data)
          this.$store.commit('SETLANGSTORE', response.data.lang)
          this.loading =  false;
          console.log(response.data);
        })
        .catch((error) => console.log(error));
      }
    }
  },
};



</script>



<style lang="scss" scoped>
@import "./style/style.module.scss";
@import "./style/typoapp.scss";


#nav {
  position: fixed;
  z-index: 10;
  width: 100vw;
  background-color: white;
  padding: 20px;
  @extend %shadow;
  display: flex;
  justify-content: space-between;
  align-items: center;

  img{
      width: 110px;
      @extend%animate;
      @extend%hover;
  }

  h1{
    font-family: "source", Avenir, Helvetica, Arial, sans-serif;
    font-weight: bolder;
    margin: 0 2rem
  }

  #cta{
    margin: 0 2rem 0 0;
    padding: 5px;
    font-family: "source", Avenir, Helvetica, Arial, sans-serif;
    font-weight: bold;
    font-size: 1.5rem;
  }

  #cont-logos-user{
    margin: 0 4rem 0 0;
    font-size: 2rem;
    display: flex;
    align-items: center;
    
    
    svg{
      margin: 0 1rem;
      color: $black;
      @extend%animate;
      @extend%hover;
    }

    #lang-btns-cont{
      position: relative;
      display: inline-block;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 5rem;
      height: 4rem;
      @extend %animate;
      @extend %hover;
      
      img{
        width: 30px;
        display: block;
        margin: .5rem;
        position: relative;
        @extend %animate;
        @extend %hover;
      }

      #globe{
        width: 50px;
        @extend %hover;
      }

      #touch {
        position: absolute; 
        margin: 5px;
        opacity: 0;
        @extend %hover; 
        height: 35px;
        width: 45px;
      }
      #dropdown-content {
        display: none;
        position: absolute;
        margin-top: 7rem;
        background-color: white;
        min-width: 60px;
        @extend %shadowL;
        padding: 5px 5px;
        z-index: 100;
        border-radius: 10px;
      }
    
      #touch:checked + #dropdown-content {
        display: flex;
      }

      .surrounded{
        left: 0px !important;
        border: 3px solid $vertM;
        border-radius: 100%;
        -webkit-border-radius: 100%;
        -moz-border-radius: 100%;
        -ms-border-radius: 100%;
        -o-border-radius: 100%;
      }
    }
  }
}

#loader{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p{
    color: $vertM;
    font-weight: bold;
    font-size: 2rem;
  }
}

#rectify-nav{
  width: 100%;
  height: 132px;
}


@media #{$lg}{
  #nav{
    padding: 0 20px;
    img{
      width: 75px;
    }

    h1{
      font-size: 1.5rem;
    }

    #cta{
      font-size: 1.2rem;
      width: 120px;
    }
  }

  #rectify-nav{
    height: 64px;
  }
}

@media #{$md}{
  #nav{
    img{
      width: 75px;
    }

    h1{
      font-size: 1.2rem;
    }

    #cta{
      font-size: 1rem;
      margin: 0 1rem 0 0;
    }

    #cont-logos-user{
      margin: 0 3rem 0 0;
      svg{
        margin: 0 .5rem;
      }
    }
  }
}

@media #{$sm}{
  #nav{
    flex-direction: column;
    padding: 0;
    img{
      margin-top: 10px;
      width: 50px;
    }

    h1{
      margin: 10px 1rem 0 1rem
    }

    #cta{
      margin: 10px 1rem;
      font-size: 0.8rem;
      padding: 2px;
      width: 80px;
    }

    #cont-logos-user{
      font-size: 1.5rem;
      margin: 0 10px;

      svg{
        margin: 0 1rem;
      }

      #lang-btns-cont{
        margin: 0 1rem;
        #globe{
          width: 35px;
        }
        img{
          width: 25px;
        }
      }
    }
  }

  #rectify-nav{
    height: 148px;
  }
}

@media #{$xxs}{
  #nav{
    h1{
      font-size: 1rem;
    }

    #cont-logos-user{

      #lang-btns-cont{
        margin: 0;
      }
    }
  }

}
</style>
