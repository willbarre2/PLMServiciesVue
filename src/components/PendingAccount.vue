<template>

    
    <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showPendingAccount }">
        <div class="cont-password cont-password-chge">
            <div class="cont-title-password">
                <p class="title-password" id="titlePassword">{{texts.title}}</p>
                <fa :icon="['fas', 'times']" @click="closePendingAccount" />
            </div>
            <p class="text-password" id="text-pending-account">{{texts.textA}}</p>
            <p class="text-delete-mail">{{user.givenName}} {{user.familyName}}</p>
            <p class="text-password" id="textb-pending-account">{{texts.textB}}</p>
            <p class="text-delete-mail">{{unitName}}</p>
            <div id="btn-delete" class="btn" @click="pendingAccount">{{texts.btn}}</div>
        </div>
    </div>


</template>

<script>

export default {
    props:[
        'unit',
        'user',
        'to',
        'entities'
    ],
    data(){
        return{
            texts:{
                title: null,
                textA: null,
                textB: null,
                btn: null,
            },
            langstore: 0,
            unitName: "",
        };
    },
    mounted(){
        let unity = parseInt(this.to);
        let unitSelected = parseInt(this.unit)

        this.unitName = this.entities[unity].entity

        // requête pour textes celon langue
        this.getTexts();
        
    },
    computed: {
        showPendingAccount(){
            return this.$store.state.showPendingAccountStore;
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
        closePendingAccount(){
            this.$store.commit('SETSHOWPENDINGACCOUNTSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                let unit = parseInt(this.unit);
                if (this.to !== unit) {
                    this.texts.title = response.data[this.$store.state.lang].pendingaccount.title1;
                    this.texts.textA = response.data[this.$store.state.lang].pendingaccount.text1;
                    this.texts.textB = response.data[this.$store.state.lang].pendingaccount.text3;
                    this.texts.btn = response.data[this.$store.state.lang].pendingaccount.validate;
                }else if (this.to === unit) {
                    this.texts.title = response.data[this.$store.state.lang].pendingaccount.title2;
                    this.texts.textA = response.data[this.$store.state.lang].pendingaccount.text2;
                    this.texts.textB = response.data[this.$store.state.lang].pendingaccount.text3;
                    this.texts.btn = response.data[this.$store.state.lang].pendingaccount.revoke;
                }
            })
            .catch((error) => console.log(error));
        },

        pendingAccount(){
            let unity = parseInt(this.unit);
            if (this.to !== unity){
                if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                    // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                    const axios = require('axios').default;
                    axios
                    .patch(`http://localhost:3000/api/validatependinguser?entity=${this.unit}` , {login: this.user.login})
                    .then((response) => {
                        this.$store.commit('SETSHOWPENDINGACCOUNTSTORE', false)
                        this.$store.commit('SETNEWPERSONKEY')
                    })
                    .catch((error) => console.log(error)); 
                } else{
                    const axios = require('axios').default;
                    axios
                    .patch(`/api/users/${this.unit}/primary`, {uid: this.user.login})
                    .then((response) => {
                        this.$store.commit('SETSHOWPENDINGACCOUNTSTORE', false)
                        this.$store.commit('SETNEWPERSONKEY')
                    })
                    .catch((error) => console.log(error));
                }
            }else if (this.to === unity){
                if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                    // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                    const axios = require('axios').default;
                    axios
                    .patch(`http://localhost:3000/api/revokependinguser` , {login: this.user.login})
                    .then((response) => {
                        this.$store.commit('SETSHOWPENDINGACCOUNTSTORE', false)
                        this.$store.commit('SETNEWPERSONKEY')
                    })
                    .catch((error) => console.log(error)); 
                } else{
                    const axios = require('axios').default;
                    axios
                    .put(`/api/users/${this.unit}/primary`, {uid: this.user.login})
                    .then((response) => {
                        this.$store.commit('SETSHOWPENDINGACCOUNTSTORE', false)
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


#text-pending-account, #textb-pending-account{
    margin: 1rem 2rem;
    text-align: center;
    font-weight: bold;
}

</style>