<template>
    <div class="cont-password" :key="langKey">
        <div class="cont-title-password">
            <p class="title-password">{{texts.title}}</p>
        </div>
        <form class="form-password" @submit.prevent="newPass">
            <div>
                <label for="name">{{texts.name}}</label>
                <input type="text" name="name" id="name" v-model="lastname" disabled>
            </div>
            <div>
                <label for="firstname">{{texts.firstname}}</label>
                <input type="text" name="firstname" id="firstname" v-model="firstname" disabled>
            </div>
            <div>
                <label for="mailVal">{{texts.mail}}</label>
                <input type="mail" name="mailVal" id="mailVal" v-model="contactEmail" disabled>
            </div>
            <div>
                <label for="loginVal">{{texts.login}}</label>
                <input type="text" name="loginVal" id="loginVal" v-model="login" disabled>
            </div>
            <p class="text-password-val">{{texts.text}}</p>
            <div>
                <label for="password">{{texts.password}}</label>
                <div>
                    <fa id="pass-eye" class="eyes" :icon="['fas', 'eye']" @click="showPass"/>
                    <fa id="pass-eye-slash" class="eyes display-none" :icon="['fas', 'eye-slash']" @click="dontShowPass"/>
                    <input type="password" name="password" id="password" v-bind:placeholder="texts.password" v-model="password" :class="{ inputerror : !newPassIsValid }">
                </div>
            </div>
            <div>
                <label for="verify">{{texts.verify}}</label>
                <div>
                    <fa id="verify-eye" class="eyes" :icon="['fas', 'eye']" @click="showVerify"/>
                    <fa id="verify-eye-slash" class="eyes display-none" :icon="['fas', 'eye-slash']" @click="dontShowVerify"/>
                    <input type="password" name="verify" id="verify" v-bind:placeholder="texts.password" v-model="verify" :class="{ inputerror : !verifyIsValid }">
                </div>
            </div>
            <button type="submit" :disabled="!formIsValid">{{texts.submit}}</button>
        </form>
    </div>
</template>

<script>

export default {
    data(){
        
        return{
            texts:{
                title: null,
                name: null,
                firstname: null,
                mail: null,
                login: null,
                text: null,
                password: null,
                verify: null,
                submit: null,
            },
            langstore: 0,
            password: "",
            verify: "",
            firstname: "",
            lastname: "",
            contactEmail: "",
            login: "",
        };
    },
    mounted(){

        // requête pour textes celon langue
        this.getTexts();

        // vérif token en query
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .post(`http://localhost:3000/api/validtoken`, {token : this.$route.query.token})
                .then((response) => {
                    this.lastname = response.data.familyName;
                    this.firstname = response.data.givenName;
                    this.contactEmail = response.data.contactEmail
                    this.login = response.data.login;
                })
                .catch( 
                    (error) => window.alert("Token invalid. Veuillez refaire une demande de changement de mot de passe")
                ); 
            } else{
                const axios = require('axios').default;
                axios
                .post(`/api/validtoken`, {token : this.$route.query.token})
                .then((response) => {
                    this.lastname = response.data.familyName;
                    this.firstname = response.data.givenName;
                    this.contactEmail = response.data.contactEmail
                    this.login = response.data.login;
                })
                .catch(
                    (error) => window.alert("Token invalid. Veuillez refaire une demande de changement de mot de passe")
                );
        }
    },
    computed: {
        // recharge composant à chaque changement de langue
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

        // "!!" convertie en boolean pour tester si champ est rempli
        newPassIsValid(){
            return !!this.password && (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,}$/.test(this.password))
        },
        
        verifyIsValid(){
            return !!this.verify && (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,}$/.test(this.verify)) && this.verify === this.password;
        },
        
        formIsValid(){
            return this.newPassIsValid && this.verifyIsValid 
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

        showPass(){
            document.getElementById("password").setAttribute("type","text");
            document.getElementById("pass-eye").classList.add("display-none");
            document.getElementById("pass-eye-slash").classList.remove("display-none");
        },

        dontShowPass(){
            document.getElementById("password").setAttribute("type","password");
            document.getElementById("pass-eye-slash").classList.add("display-none");
            document.getElementById("pass-eye").classList.remove("display-none");
        },

        showVerify(){
            document.getElementById("verify").setAttribute("type","text");
            document.getElementById("verify-eye").classList.add("display-none");
            document.getElementById("verify-eye-slash").classList.remove("display-none");
        },

        dontShowVerify(){
            document.getElementById("verify").setAttribute("type","password");
            document.getElementById("verify-eye-slash").classList.add("display-none");
            document.getElementById("verify-eye").classList.remove("display-none");
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.texts = response.data[this.$store.state.lang].valpass;
            })
            .catch((error) => console.log(error));
        },

        newPass(){
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .put(`http://localhost:3000/api/validpassword`)
                .then((response) => {
                    if (this.$store.state.lang === "fr") {
                        window.alert("Mot de passe changé");
                    }else{
                        window.alert("Password changed");
                    }
                    this.$router.push("/");
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                const token = Buffer.from(`${this.login}:${this.verify}`, 'utf8').toString('base64')
                axios
                .put(`/api/password`, {token: this.$route.query.token}, {headers: {
                    'Authorization': `Basic ${token}`}, 
                })
                .then((response) => {
                    window.alert(response);
                    this.$router.push("/");
                })
                .catch((error) => console.log(error));
            }
        },
    },
};

</script>



<style lang="scss" >

@import "../style/style.module.scss";
@import "../style/typo.scss";

.text-password-val{
    margin: 1rem 0;
}
#password::placeholder, #verify::placeholder{
    color: rgb(216, 216, 216);
}

.display-none{
    display: none;
}

.eyes{
    align-self: center;
    margin-right: .5rem;
    @extend %hover;
    
    &:hover{
        color: $vertM;
    }
}

input.inputerror:focus { 
    outline-color: rgb(255, 58, 58);   
}

</style>