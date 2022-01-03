<template>

    <div :key="stateKeyStore">
        <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showChgeState }">
            <div class="cont-password cont-password-chge">
                <div class="cont-title-password">
                    <p class="title-password" id="titlePassword">{{texts.title}}</p>
                    <fa :icon="['fas', 'times']" @click="closeChgeState" />
                </div>
                <p v-if="oldstate" class="text-password">{{text.textON}}</p>
                <p v-else class="text-password">{{text.textOFF}}</p>
                <div v-if="oldstate" id="btn-delete" class="btn" @click="serviceONOFF(newstate)">{{texts.ON}}</div>
                <div v-else id="btn-delete" class="btn" @click="serviceONOFF(newstate)">{{texts.OFF}}</div>
            </div>
        </div>
    </div>

</template>

<script>

export default {
    data(){
        return{
            oldstate: false,
            texts:{
                title: null,
                ON: null,
                OFF: null,
            },
            text:{
                textON: "",
                textOFF: "",
            },
            langstore: 0,
            newstate: "",
            statekey: null,
        };
    },
    mounted(){

        this.oldstate = this.$store.state.oldStateStore;
        
        // requête pour textes celon langue
        this.getTexts();
        
    },
    computed: {
        showChgeState(){
            return this.$store.state.showStateChgeStore;
        },
 
        // recharge composant à chaque changement de langue
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

        // recharge composant à chaque changement d'état
        stateKeyStore(){
            this.statekey = this.$store.state.newStateStore;
            this.oldstate = this.$store.state.oldStateStore;
        },
    },
    watch: {
        // chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        langstore(newLangstore, oldLangstore) {
            if (newLangstore > oldLangstore) {
            this.getTexts()
            }
        },
        // chaque fois que statekey change, on va rechercher la valeur du state dans le store.
        statekey(newstatekey, oldstatekey) {
            if (newstatekey != oldstatekey) {
            this.newstate = this.$store.state.newStateStore
            this.getTexts()
            }
        }

    },
    methods: {
        closeChgeState(){
            this.$store.commit('SETSHOWSTATECHGESTORE', false)
        },

        //refait la requête pour les textes au changement de langue ou d'état
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.texts = response.data[this.$store.state.lang].chgestate;
                if (this.newstate != ""){
                    this.text = response.data[this.$store.state.lang].services[this.newstate].properties; 
                }
            })
            .catch((error) => console.log(error));
        },

        // passe service à OFF si ON ou ON si OFF 
        serviceONOFF(indexService){
            
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .patch("http://localhost:3000/prefs/activation" , { indexServ : indexService})
                .then((response) => {
                    console.log("état du service changé");
                    
                    this.$store.commit('SETSHOWSTATECHGESTORE', false)
                    if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                        this.loading = true;
                        // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                        const axios = require('axios').default;
                        axios
                        .get("http://localhost:3000/prefs")
                        .then((response) => {
                        this.$store.commit('SETPREFSINFOSTORE', response.data)
                        //recharge le composant BtnsONOFF pour afficher modif état
                        this.$store.commit('SETSTATEKEY');
                        
                        })
                        .catch((error) => console.log(error)); 
                    } else{
                        this.loading = true;
                        const axios = require('axios').default;
                        axios
                        .get("/api/prefs")
                        .then((response) => {
                        this.$store.commit('SETPREFSINFOSTORE', response.data)
                        //recharge le composant BtnsONOFF pour afficher modif état
                        this.$store.commit('SETSTATEKEY');
                        
                        })
                        .catch((error) => console.log(error));
                    }
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .patch("/api/prefs" ,{ indexServ : indexService})
                .then((response) => {
                    console.log("état du service changé");
                    
                    this.$store.commit('SETSHOWSTATECHGESTORE', false)
                    if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                        this.loading = true;
                        // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                        const axios = require('axios').default;
                        axios
                        .get("http://localhost:3000/prefs")
                        .then((response) => {
                        this.$store.commit('SETPREFSINFOSTORE', response.data)
                        //recharge le composant BtnsONOFF pour afficher modif état
                        this.$store.commit('SETSTATEKEY');
                        
                        })
                        .catch((error) => console.log(error)); 
                    } else{
                        this.loading = true;
                        const axios = require('axios').default;
                        axios
                        .get("/api/prefs")
                        .then((response) => {
                        this.$store.commit('SETPREFSINFOSTORE', response.data)
                        //recharge le composant BtnsONOFF pour afficher modif état
                        this.$store.commit('SETSTATEKEY');
                        
                        })
                        .catch((error) => console.log(error));
                    }

                })
                .catch((error) => console.log(error));
            }

        },
    },
};

</script>



<style lang="scss">

@import "../style/style.module.scss";
@import "../style/typo.scss";


</style>