<template>

    <div :key="contactMailKey">
        <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showChgeContactMail }">
            <div class="cont-password cont-password-chge">
                <div class="cont-title-password">
                    <p class="title-password" id="titlePassword">{{texts.title}}</p>
                    <fa :icon="['fas', 'times']" @click="closeChgeContactMail" />
                </div>
                <p class="text-password"><b>{{texts.text}}</b></p>
                <p class="text-delete-mail">{{newmail}}</p>
                <div id="btn-delete" class="btn" @click="chgeContactMail(newmail)">{{texts.change}}</div>
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
            newmail: "",
            mailkey: null,
        };
    },
    mounted(){
        
        // requête pour textes celon langue
        this.getTexts();
        
    },
    computed: {
        showChgeContactMail(){
            return this.$store.state.showChgeContactMailStore;
        },
 
        // recharge composant à chaque changement de langue
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

        // recharge composant à chaque changement de mail de contact
        contactMailKey(){
            this.mailkey = this.$store.state.newContactMailStore;
        },
    },
    watch: {
        // chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        langstore(newLangstore, oldLangstore) {
            if (newLangstore > oldLangstore) {
            this.getTexts()
            }
        },
        // chaque fois que contactMailkey change, on va rechercher la valeur du mail dans le store.
        mailkey(newmailkey, oldmailkey) {
            if (newmailkey != oldmailkey) {
            this.newmail = this.$store.state.newContactMailStore
            }
        }

    },
    methods: {
        closeChgeContactMail(){
            this.$store.commit('SETSHOWCHGECONTACTMAILSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
            this.texts = response.data[this.$store.state.lang].chgecontactmail;
            })
            .catch((error) => console.log(error));
        },

        // modifie le mail de contact en envoyant leur valeures dans le body de la requête
        chgeContactMail(newmail){         
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .patch("http://localhost:3000/dataprofile/contactemail" , {contactEmail: newmail})
                .then((response) => {
                    this.$store.commit('SETMSGALERTSTORE', "mail de contact modifié")
                    this.$store.commit('SETSHOWCHGECONTACTMAILSTORE', false)
                    this.$store.commit('SETSHOWALERTSTORE', true)
                    // rafraichie le composant EditProfile pour réafficher les otherEmails correctement
                    this.$store.commit('SETLANGKEY'); 
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .patch("/api/profile" , {contactEmail: newmail})
                .then((response) => {
                    this.$store.commit('SETMSGALERTSTORE', response)
                    this.$store.commit('SETSHOWCHGECONTACTMAILSTORE', false)
                    this.$store.commit('SETSHOWALERTSTORE', true)
                    // rafraichie le composant EditProfile pour réafficher les otherEmails correctement
                    this.$store.commit('SETLANGKEY'); 
                })
                .catch((error) => console.log(error));
            }
            this.closeChgeContactMail();
        },
    },
};

</script>



<style lang="scss" scoped >

// @import "../style/style.module.scss";
// @import "../style/typo.scss";


</style>