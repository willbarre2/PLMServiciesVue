<template>

    
    <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showDeleteAccount }">
        <div class="cont-password cont-password-chge">
            <div class="cont-title-password">
                <p class="title-password" id="titlePassword">{{texts.title}}</p>
                <fa :icon="['fas', 'times']" @click="closeDeleteAccount" />
            </div>
            <p class="text-password" id="text-delete-account">{{texts.text}}</p>
            <p class="text-delete-mail">{{user.givenName}} {{user.familyName}}</p>
            <div id="btn-delete" class="btn" @click="deleteAccount">{{texts.delete}}</div>
        </div>
    </div>


</template>

<script>

export default {
    props:[
        'unit',
        'user'
    ],
    data(){
        return{
            texts:{
                title: null,
                text: null,
                delete: null,
            },
            langstore: 0,
        
        };
    },
    mounted(){
        
        // requête pour textes celon langue
        this.getTexts();
        
    },
    computed: {
        showDeleteAccount(){
            return this.$store.state.showDeleteAccountStore;
        },
 
        // recharge composant à chaque changement de langue
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

    },
    watch: {
        //  chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        langstore(newLangstore, oldLangstore) {
            if (newLangstore > oldLangstore) {
            this.getTexts()
            }
        },
    },
    methods: {
        closeDeleteAccount(){
            this.$store.commit('SETSHOWDELETEACCOUNTSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.texts = response.data[this.$store.state.lang].deleteaccount;
            })
            .catch((error) => console.log(error));
        },

        deleteAccount(){
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .patch(`http://localhost:3000/api/deleteuser?entity=${this.unit}` , {login: this.user.login})
                .then((response) => {
                    this.$store.commit('SETSHOWDELETEACCOUNTSTORE', false)
                    this.$store.commit('SETNEWPERSONKEY')
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .delete(`/api/users/${this.unit}/${this.user.login}`)
                .then((response) => {
                    this.$store.commit('SETSHOWDELETEACCOUNTSTORE', false)
                    this.$store.commit('SETNEWPERSONKEY')
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


#text-delete-account{
    margin: 1rem .8rem;
    text-align: center;
    font-weight: bold;
}

</style>