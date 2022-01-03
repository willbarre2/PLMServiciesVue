<template>

    
    <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showMoveAccount }">
        <div class="cont-password cont-password-chge">
            <div class="cont-title-password">
                <p class="title-password" id="titlePassword">{{texts.title}}</p>
                <fa :icon="['fas', 'times']" @click="closeMoveAccount" />
            </div>
            <p class="text-password text-move-account">{{texts.text}}</p>
            <p class="text-delete-mail">{{user.givenName}} {{user.familyName}}</p>
            <p class="text-password text-move-account">{{texts.text2}}</p>
            <select name="move-unit-choice" id="move-unit-choice" v-model="unitSelected">
                <option disabled value="">{{texts.placeholder}}</option>
                <option v-for="(entity, index) in entities" :value="index">{{entity.entity}}</option>
            </select>
            <button id="btn-move" class="btn" :disabled="unitSelected == ''" @click="moveAccount">{{texts.move}}</button>
        </div>
    </div>


</template>

<script>

export default {
    props:[
        'user',
        'entities'
    ],
    data(){
        return{
            texts:{
                title: null,
                placeholder: null,
                text: null,
                text2: null,
                move: null,
            },
            langstore: 0,
            unitSelected: "",
        };
    },
    mounted(){
        
        // requête pour textes celon langue
        this.getTexts();
        
    },
    computed: {
        showMoveAccount(){
            return this.$store.state.showMoveAccountStore;
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
        closeMoveAccount(){
            this.unitSelected = "";
            this.$store.commit('SETSHOWMOVEACCOUNTSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.texts = response.data[this.$store.state.lang].moveaccount;
            })
            .catch((error) => console.log(error));
        },

        moveAccount(){
            console.log(this.unitSelected);
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .post(`http://localhost:3000/api/moveuser` , {login: this.user.login, unit: this.unitSelected})
                .then((response) => {
                    this.$store.commit('SETSHOWMOVEACCOUNTSTORE', false)
                    this.$store.commit('SETNEWPERSONKEY')
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .post(`/api/users/${this.unitSelected}/primary`, {uid: this.user.login})
                .then((response) => {
                    this.$store.commit('SETSHOWMOVEACCOUNTSTORE', false)
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


.text-move-account{
    margin: 1rem 2rem;
    text-align: center;
    font-weight: bold;
}

#move-unit-choice{
    width: 80%;
    @extend %inputs;
    display: block;
    margin: 1rem auto 0;
}

#btn-move{
    @extend %button;
    width: 100px;
    display: block;
    margin: 2rem auto;
}

</style>