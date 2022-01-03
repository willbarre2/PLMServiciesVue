<template>

    
    <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showStatusAccount }">
        <div class="cont-password cont-password-chge">
            <div class="cont-title-password">
                <p class="title-password" id="titlePassword">{{texts.title}}</p>
                <fa :icon="['fas', 'times']" @click="closeStatusAccount" />
            </div>
            <p class="text-password">{{texts.text1}} <b>{{user.givenName}} {{user.familyName}}</b> {{texts.text2}}</p>
            <p class="text-password">{{texts.text3}}</p>
            <p class="text-password">{{texts.text4}}</p>
            <p class="text-password">{{texts.text5}}</p>
            <div id="btn-delete" class="btn" @click="chgeStatusAccount">{{texts.chge}}</div>
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
                text1: null,
                text2: null,
                text3: null,
                chge: null,
            },
            langstore: 0,
        
        };
    },
    mounted(){
        
        // requête pour textes celon langue
        this.getTexts();
        
    },
    computed: {
        showStatusAccount(){
            return this.$store.state.showStatusAccountStore;
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
        closeStatusAccount(){
            this.$store.commit('SETSHOWSTATUSACCOUNTSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.texts = response.data[this.$store.state.lang].chgestatusaccount;
            })
            .catch((error) => console.log(error));
        },

        chgeStatusAccount(){
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                if (this.user.primaryAffectation.id == this.unit) {
                    const axios = require('axios').default;
                    axios
                    .patch(`http://localhost:3000/api/users/${this.unit}/secondary` , {login: this.user.login})
                    .then((response) => {
                        this.$store.commit('SETSHOWSTATUSACCOUNTSTORE', false)
                        this.$store.commit('SETNEWPERSONKEY')
                    })
                    .catch((error) => console.log(error));
                }else{
                    const axios = require('axios').default;
                    axios
                    .patch(`http://localhost:3000/api/users/${this.unit}/primary` , {login: this.user.login})
                    .then((response) => {
                        this.$store.commit('SETSHOWSTATUSACCOUNTSTORE', false)
                        this.$store.commit('SETNEWPERSONKEY')
                    })
                    .catch((error) => console.log(error)); 
                }
            } else{
                if (this.user.primaryAffectation.id == this.unit) {
                    const axios = require('axios').default;
                    axios
                    .patch(`/api/users/${this.unit}/secondary` , {uid: this.user.login})
                    .then((response) => {
                        this.$store.commit('SETSHOWSTATUSACCOUNTSTORE', false)
                        this.$store.commit('SETNEWPERSONKEY')
                    })
                    .catch((error) => console.log(error));
                }else{
                   const axios = require('axios').default;
                    axios
                    .put(`/api/users/${this.unit}/primary` , {uid: this.user.login})
                    .then((response) => {
                        this.$store.commit('SETSHOWSTATUSACCOUNTSTORE', false)
                        this.$store.commit('SETNEWPERSONKEY')
                    })
                    .catch((error) => console.log(error)); 
                }
                
            }
        },

    },
};

</script>



<style lang="scss">

@import "../style/style.module.scss";
@import "../style/typo.scss";

.text-delete-mail{
    margin: 1rem;
    text-align: center;
}

#btn-delete{
    @extend %button;
    width: 100px;
    margin: 2rem auto;
}

</style>