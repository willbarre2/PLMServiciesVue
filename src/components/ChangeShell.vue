<template>

    <div :key="shellKeyStore">
        <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showChgeShell }">
            <div class="cont-password cont-password-chge">
                <div class="cont-title-password">
                    <p class="title-password" id="titlePassword">{{texts.title}}</p>
                    <fa :icon="['fas', 'times']" @click="closeChgeShell" />
                </div>
                <p class="text-password"><b>{{texts.text}}</b></p>
                <p class="text-delete-mail">{{newshell}}</p>
                <div id="btn-delete" class="btn" @click="chgeShell(newshell)">{{texts.change}}</div>
            </div>
        </div>
    </div>

</template>

<script>

export default {
    data(){
        return{
            texts:{
                title: null,
                text: null,
                change: null,
            },
            langstore: 0,
            newshell: "",
            shellkey: null,
        };
    },
    mounted(){
        
        // requête pour textes celon langue
        this.getTexts();
        
    },
    computed: {
        showChgeShell(){
            return this.$store.state.showChgeShellStore;
        },
 
        // recharge composant à chaque changement de langue
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

        // recharge composant à chaque changement de shell
        shellKeyStore(){
            this.shellkey = this.$store.state.newShellStore;
            
        },
    },
    watch: {
        // chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        langstore(newLangstore, oldLangstore) {
            if (newLangstore > oldLangstore) {
            this.getTexts()
            }
        },
        // chaque fois que shellkey change, on va rechercher la valeur du shell dans le store.
        shellkey(newshellkey, oldshellkey) {
            if (newshellkey != oldshellkey) {
            this.newshell = this.$store.state.newShellStore
            }
        }

    },
    methods: {
        closeChgeShell(){
            this.$store.commit('SETSHOWCHGESHELLSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.texts = response.data[this.$store.state.lang].chgeshell;
            })
            .catch((error) => console.log(error));
        },

        // modifie le shell en envoyant leurs valeures dans le body de la requête
        chgeShell(newshell){         
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .patch("http://localhost:3000/dataprofile/shell" , {shell: newshell})
                .then((response) => {
                    this.$store.commit('SETMSGALERTSTORE', "shell modifié")
                    this.$store.commit('SETSHOWCHGESHELLSTORE', false)
                    this.$store.commit('SETSHOWALERTSTORE', true)
                    // rafraichie le composant EditProfile pour réafficher les otherEmails correctement
                    this.$store.commit('SETLANGKEY');
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .patch("/api/profile" , {shell: newshell})
                .then((response) => {
                    this.$store.commit('SETMSGALERTSTORE', response)
                    this.$store.commit('SETSHOWCHGESHELLSTORE', false)
                    this.$store.commit('SETSHOWALERTSTORE', true)
                    // rafraichie le composant EditProfile pour réafficher les otherEmails correctement
                    this.$store.commit('SETLANGKEY');
                })
                .catch((error) => console.log(error));
            }
            this.closeChgeShell();
        },
    },
};

</script>



<style lang="scss" scoped >

// @import "../style/style.module.scss";
// @import "../style/typo.scss";


</style>