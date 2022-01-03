<template>
    <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showPassChge }">
        <div class="cont-password cont-password-chge">
            <div class="cont-title-password">
                <p class="title-password" id="titlePassword">{{texts.title}}</p>
                <fa :icon="['fas', 'times']" @click="closePassChge" />
            </div>
            <p class="text-password" id="t-pass"><b>{{texts.textS}}</b><br><br>{{texts.textL1}}<br>{{texts.textL2}}<br>{{texts.textL3}}</p>
            <form class="form-password" @submit.prevent="submitFormChgePass">
                <div>
                    <label for="login">{{texts.login}}</label>
                    <input v-if="connectState"  v-model="form.login" id="login" :class="{ inputerror : !loginIsValid }">
                    <input v-if="!connectState"  :value="profile.login" id="login" disabled>
                </div>
                <p v-if="connectState && !loginIsValid" class="error-msg">{{texts.logmsg}}</p>
                <div>
                    <label for="mail">{{texts.mail}}</label>
                    <input v-if="connectState" v-model="form.mail" id="mail" placeholder="abc@def.ghi" :class="{ inputerror : !mailIsValid }">
                    <input v-if="!connectState" :value="profile.contactEmail" id="mail" disabled>
                </div>
                <p v-if="connectState && !mailIsValid" class="error-msg">{{texts.mailmsg}}</p>
                <button v-if="connectState" :disabled="!formIsValid" id="submit-pass-chge">{{texts.submit}}</button>
                <button v-if="!connectState" id="submit-pass-chge">{{texts.submit}}</button>
            </form>
        </div>
    </div>
</template>

<script>

export default {
    data(){
        return{
            profile: [],
            texts: {
                title: null,
                textS: null,
                textL1: null,
                textL2: null,
                textL3: null,
                login: null,
                mail: null,
                submit: null,
                logmsg: null,
                mailmsg: null
            },
            langstore: 0,
            form: {
                login: null,
                mail: null,
            },
        };
    },
    mounted(){
        // requête pour textes celon langue
        this.getTexts();
        

        // requête info de profile
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
            const axios = require('axios').default;
            axios
            .get("http://localhost:3000/dataprofile")
            .then((response) => {
                this.profile = response.data;
            })
            .catch((error) => console.log(error)); 
        } else{
            const axios = require('axios').default;
            axios
            .get("/api/profile")
            .then((response) => {
                this.profile = response.data;
            })
            .catch((error) => console.log(error));
        }

    },
    computed: {
        // au changement de la varible de l'etat de connexion (ds le store) certains boutons apparaissent
        connectState(){
            return this.$store.state.connectState;
        },

        // recharge composant à chaque changement de langue
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

        showPassChge(){
            return this.$store.state.showPassChgeStore;
        },
        
        // "!!" convertie en boolean pour tester si champ est rempli
        loginIsValid(){
            return !!this.form.login
        },
        
        mailIsValid(){
            return !!this.form.mail && (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.form.mail))
        },
        
        formIsValid(){
            return this.loginIsValid && this.mailIsValid 
        },

    },
    watch: {
        // chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        langstore(newLangstore, oldLangstore) {
            if (newLangstore > oldLangstore) {
            this.getTexts()
            }
        }
    },
    methods: {
        closePassChge(){
            this.$store.commit('SETSHOWPASSCHGESTORE', false)
        },

        submitFormChgePass(){

            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                if (this.$store.state.lang === "fr") {
                    this.$store.commit('SETMSGALERTSTORE', "Un email vient de vous être envoyer sur l'adresse que vous venez de renseigner. Suivez le liens qui s'y trouve.")
                    this.$store.commit('SETSHOWALERTSTORE', true)
                }else{
                    this.$store.commit('SETMSGALERTSTORE', "An e-mail has just been sent to the address you entered. Follow the link below.")
                    this.$store.commit('SETSHOWALERTSTORE', true)
                }
                this.$store.commit('SETSHOWPASSCHGESTORE', false);
                // commentez la ligne suivante si vous voulez voire le message (setTimeout impossible avec "this")
                this.$router.push("/password?token=testokentestokentestoken");
            } else{
                if (!this.$store.state.connectState) {
                    const axios = require('axios').default;
                    axios
                    .post("/api/password", {uid: this.profile.login, mail: this.profile.contactEmail})
                    .then((response) => {
                        this.form.login = "";
                        this.form.mail = "";
                        this.$store.commit('SETSHOWPASSCHGESTORE', false);
                        this.$store.commit('SETMSGALERTSTORE', response)
                        this.$store.commit('SETSHOWALERTSTORE', true)
                    })
                    .catch((error) => console.log(error));
                }else{
                    const axios = require('axios').default;
                    axios
                    .post("/api/password", {uid: this.form.login, mail: this.form.mail})
                    .then((response) => {
                        this.form.login = "";
                        this.form.mail = "";
                        this.$store.commit('SETSHOWPASSCHGESTORE', false);
                        this.$store.commit('SETMSGALERTSTORE', response)
                        this.$store.commit('SETSHOWALERTSTORE', true)
                    })
                    .catch((error) => console.log(error));
                }
            }
            
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
            this.texts = response.data[this.$store.state.lang].changepassword;
            })
            .catch((error) => console.log(error));
        }
    },


};

</script>



<style lang="scss">

@import "../style/style.module.scss";
@import "../style/typo.scss";

#wrapper-password-chge{
    width: 100%;
    height: 200%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    transition: opacity 0.3s ease-in-out;
}

.hidden {
    transform: scale(0.001);
    opacity: 0;
}

.cont-password{
    font-family: "source", Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 450px;
    border: 1px solid $bleuM;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    background-color: white;
    margin: 2rem auto;
    @extend %shadowL;
}

.cont-password-chge{
    margin: 12rem auto;
}

.cont-title-password{
    background-color: $bleuM;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;

    .title-password{
        font-family: "sourceB", Avenir, Helvetica, Arial, sans-serif;
        margin: 0;
        color: white;
    }

    svg{
        color: white;
        font-size: 1.5rem;
        @extend %animate;
        @extend %hover;
    }
}



.text-password{
    margin: 1rem;
}

#t-pass{
    text-align: start;
}

.form-password{
    margin: 1rem;
    display: flex;
    flex-direction: column;
}

.form-password label, .form-password input, .form-password button{
    margin: 1rem 1rem 1rem 0;
}

.form-password div{
    display: flex;
    justify-content: space-between;
}

.form-password label{
    font-family: "sourceB", Avenir, Helvetica, Arial, sans-serif;
    align-self: center;
}

.form-password input{
    @extend %inputs;
}

.form-password button{
    align-self: end;
    width: 35%;
    @extend %button;
}

input.inputerror:focus { 
    outline-color: rgb(255, 58, 58);   
}

@media #{$sm}{
    .cont-password{
        width: 90%;
        margin: 1rem auto;
    }

    .cont-password-chge{
        margin: 1rem auto;
    }
}

@media #{$xs}{
    .cont-title-password{

        font-size: 1rem;
    }
    .form-password div{
        display: flex;
        flex-direction: column;
    }
    .form-password label, .form-password input, .form-password button{
        margin: .5rem 1rem .5rem 0;
    }
}
</style>