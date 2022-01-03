<template>

    <div :key="mailKeyStore">
        <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showDeleteEmail }">
            <div class="cont-password cont-password-chge">
                <div class="cont-title-password">
                    <p class="title-password" id="titlePassword">{{texts.title}}</p>
                    <fa :icon="['fas', 'times']" @click="closeDeleteEmail" />
                </div>
                <p class="text-password">{{texts.text}}</p>
                <p class="text-delete-mail">{{mailkey}}</p>
                <div id="btn-delete" class="btn" @click="deleteEmail(mailkey)">{{texts.delete}}</div>
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
                delete: null,
            },
            langstore: 0,
            mailkey: null,
        };
    },
    mounted(){
        
        // requête pour textes celon langue
        this.getTexts();
        
    },
    computed: {
        showDeleteEmail(){
            return this.$store.state.showDeleteEmailStore;
        },
 
        // recharge composant à chaque changement de langue
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

        // recharge composant à chaque changement de mail à supprimer
        mailKeyStore(){
            this.mailkey = this.$store.state.deleteMail;
            
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
        closeDeleteEmail(){
            this.$store.commit('SETSHOWDELETEMAILSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.texts = response.data[this.$store.state.lang].deletemail;
            })
            .catch((error) => console.log(error));
        },

        // effacement autres Emails en envoyant leurs index dans le body de la requête
        deleteEmail(email){         
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .patch("http://localhost:3000/dataprofile/othermail" , {deleteEmail: email})
                .then((response) => {
                    this.$store.commit('SETMSGALERTSTORE', "mail effacé")
                    this.$store.commit('SETSHOWDELETEMAILSTORE', false)
                    this.$store.commit('SETSHOWALERTSTORE', true)
                    // rafraichie le composant EditProfile pour réafficher les otherEmails correctement
                    this.$store.commit('SETLANGKEY');
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .patch("/api/profile" , {deleteEmail: email})
                .then((response) => {
                    this.$store.commit('SETMSGALERTSTORE', response)
                    this.$store.commit('SETSHOWDELETEMAILSTORE', false)
                    this.$store.commit('SETSHOWALERTSTORE', true)
                    // rafraichie le composant EditProfile pour réafficher les otherEmails correctement
                    this.$store.commit('SETLANGKEY');
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

.text-delete-mail{
    margin: 1rem;
    text-align: center;
}
.text-password{
    font-weight: bold;
    text-align: center;
}

#btn-delete{
    @extend %button;
    width: 100px;
    margin: 2rem auto;
}

</style>