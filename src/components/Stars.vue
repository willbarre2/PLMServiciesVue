<template>
    
    <div class="lds-ring" v-if="loading"><div></div><div></div><div></div><div></div></div>
    
    <div v-if="!loading" :key="starKey">
        <fa v-if="!connectState && !fav" :icon="['far', 'star']" title="ranger dans les favoris | bookmark it" @click="chgeFav(index)" />
        <fa v-if="!connectState && (fav != undefined && fav)" icon="star" title="enlever des favoris | unbookmark it" @click="chgeFav(index)" />
    </div>

</template>

<script>

export default {
    props:[
        'index'
    ],
    data(){
        return{
            loading: false,
            fav: false,
            starKey: 0,
            showfav: false,
        };
    },
    mounted(){
        this.fav = this.$store.state.prefsInfo.prefs[this.index];
            
        // permet de savoir si on est en mode fav

        this.showfav = this.$store.state.favActivated;
    },
    computed: {
        // au changement de la varible de l'etat de connexion (ds le store) certains boutons apparaissent
        connectState(){
            return this.$store.state.connectState;
        },

    },
    methods: {
        // change l'état "pref" par son inverse  
        chgeFav(indexService){
            
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .patch("http://localhost:3000/prefs/pref" , { indexServ : indexService})
                .then((response) => {
                    console.log("état du service changé");
                    // requête pour envoyer ds le store les infos prefs des tuiles et langue
                    if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                        this.loading = true;
                        // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                        const axios = require('axios').default;
                        axios
                        .get("http://localhost:3000/prefs")
                        .then((response) => {
                        this.$store.commit('SETPREFSINFOSTORE', response.data)
                        this.fav = response.data.prefs[indexService];
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
                        this.fav = response.data.prefs[indexService];
                        this.loading =  false;
                        })
                        .catch((error) => console.log(error));
                    }
                    //recharge le composant pour afficher modif tuile favorite
                    this.starKey += 1;

                    if(this.showfav){
                        document.getElementById(this.index).remove();
                    }
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .patch("/api/prefs" , { fav : indexService})
                .then((response) => {
                    console.log("état du service changé");
                    // requête pour envoyer ds le store les infos prefs des tuiles et langue
                    if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                        this.loading = true;
                        // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                        const axios = require('axios').default;
                        axios
                        .get("http://localhost:3000/prefs")
                        .then((response) => {
                        this.$store.commit('SETPREFSINFOSTORE', response.data)
                        this.fav = response.data.prefs[indexService];
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
                        this.fav = response.data.prefs[indexService];
                        this.loading =  false;
                        })
                        .catch((error) => console.log(error));
                    }
                    //recharge le composant pour afficher modif tuile favorite
                    this.starKey += 1;

                    if(this.showfav){
                        document.getElementById(this.index).remove();
                    }
                })
                .catch((error) => console.log(error));
            }

        }
    },
};

</script>

<style lang="scss" scoped>
@import "../style/style.module.scss";
@import "../style/typo.scss";

svg{
    margin-left: 0.3rem;
    font-size: 1.5rem;
    color: white;
    @extend %animate;
    @extend %hover;
}

</style>