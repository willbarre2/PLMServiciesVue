<template >
    
    <div :key="langKey">
        <div id="cont-profile">
            <div class="cont-title-password">
                <p class="title-password" id="titlePassword">{{texts.title}}</p>
                <router-link to="/"><fa :icon="['fas', 'times']" /></router-link>
            </div>
            <div class="text-password row">
                <p><b>{{texts.textL1}}</b></p>
                <div id="div-row1">
                    <p>{{profile.givenName}}</p>
                    <p>{{profile.familyName}}</p>
                </div>
            </div>
            <p class="text-password row"><b>{{texts.textL2}}</b> <div><span v-for="lab in profile.labs"><span v-if="lab.primary">{{lab.desc}}</span></span></div></p>
            <div class="text-password row" id="cont-contact-mail" v-if="profile.login">
                <label for="contact-mail" @click="showModaleHelp()">{{texts.textL3}}<fa icon="question-circle"/></label>
                <select name="contact-mail" id="contact-mail" @change="showModaleChgeContactMail($event)">
                    <option :value="profile.contactEmail">{{profile.contactEmail}}</option>
                    <!-- <option v-if="profile.plmEmail" :value="profile.plmEmail">{{profile.plmEmail}}</option> -->
                    <option v-for="other in profile.otherEmails" :value="other">{{other}}</option>
                </select>
            </div>
            <div class="text-password row" id="cont-contact-mail" v-if="!profile.login">
                <label for="contact-mail">{{texts.textL3}}</label>
                <p>{{profile.contactEmail}}</p>
            </div>
            
            <div id="cont-mails" >
                <p id="title-mails">{{texts.emails}}</p>
                <ul>
                    <li v-for=" (other, index) in profile.otherEmails" :id="index"><div v-if="other !== profile.contactEmail">{{other}}<fa v-if="profile.login" icon="times-circle" @click="showModalDeleteEmail(other)"/></div></li>  
                </ul>
            </div>
    
            <div id="cont-plm" v-if="profile.login">
                <p id="title-plm">{{texts.plmId}}</p>
                <p class="row text-password" id="login-plm-edit"><b>{{texts.textL4}}</b><div> {{profile.login}}</div></p>
                <div id="cta-chge-password" @click="showModalPassChge">{{texts.chgePass}}</div>
                <p class="row text-password" id="login-plm-edit" v-if="profile.plmEmail"><b>{{texts.textL5}}</b><div> {{profile.plmEmail}}</div></p>
                <form class="form-password" action="" method="post">
                    <div id="cont-shell">
                        <label for="shell">Shell:</label>
                        <select name="shell" id="shell" @change="showModaleChgeShell($event)">
                            <option :value="profile.shell">{{profile.shell}}</option>
                            <option v-for="shell in shells" :value="shell.loginShell" >{{shell.loginShell}}</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>

    </div>

    <HelpMail />
    <ChangePassword />
    <DeleteEmail />
    <ChangeContactMail />
    <ChangeShell />
    <Alert/>
    
</template>

<script>

import ChangePassword from '@/components/ChangePassword.vue';
import HelpMail from '@/components/HelpMail.vue';
import DeleteEmail from '@/components/DeleteEmail.vue';
import ChangeShell from '@/components/ChangeShell.vue';
import ChangeContactMail from '@/components/ChangeContactMail.vue';
import Alert from '@/components/Alert.vue';

export default {
    components: {
        ChangePassword,
        HelpMail,
        DeleteEmail,
        ChangeContactMail,
        ChangeShell,
        Alert,
    },
    data(){  
        return{
            profile: {},
            shells: [],
            texts:{
                title: null,
                textL1: null,
                textL2: null,
                textL3: null,
                textL4: null,
                textL5: null,
                emails: null,
                plmId: null,
                chgePass: null,
            },
            langstore: null,
        };
    },
    mounted() {

        //requête GET profile
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
            // lancer dabord le server express local (Portail_Mathrice_Mock_API)
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
        
        //requête GET shells
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
            // lancer dabord le server express local (Portail_Mathrice_Mock_API)
            const axios = require('axios').default;
            axios
            .get("http://localhost:3000/datashells")
            .then((response) => {
                this.shells = response.data;
            })
            .catch((error) => console.log(error)); 
        } else{
            const axios = require('axios').default;
            axios
            .get("/api/profile/shells")
            .then((response) => {
                this.shells = response.data;
            })
            .catch((error) => console.log(error));
        }
        
        // requête pour textes celon langue
        const axios = require('axios').default;
        axios
        .get("./I18n.json")
        .then((response) => {
            this.texts = response.data[this.$store.state.lang].editprofil;
        })
        .catch((error) => console.log(error));
    },
    computed:{
        langKey(){
            this.langstore = this.$store.state.langKey;
        },
    },
    watch: {
        // chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        langstore(newLangstore, oldLangstore) {
            if (newLangstore > oldLangstore) {
            this.getTexts()
            }
        },
    },
    methods: {
        // affichage modale changement password
        showModalPassChge() {
            this.$store.commit('SETSHOWPASSCHGESTORE', true)
        },

        // affichage modale aide mail contact
        showModaleHelp() {
            this.$store.commit('SETSHOWHELPMAILSTORE', true)
        },

        // affichage modale suppression mail
        showModalDeleteEmail(mail) {
            this.$store.commit('SETSHOWDELETEMAILSTORE', true)
            this.$store.commit('SETDELETEMAILSTORE', mail)
        },

        // affichage modale Changement mail de contact
        showModaleChgeContactMail(newContactMail) {
            this.$store.commit('SETSHOWCHGECONTACTMAILSTORE', true)
            this.$store.commit('SETNEWCONTACTMAILSTORE', newContactMail.target.value)
        },

        // affichage modale Changement Shell
        showModaleChgeShell(newShell) {
            this.$store.commit('SETSHOWCHGESHELLSTORE', true)
            this.$store.commit('SETNEWSHELLSTORE', newShell.target.value)
            // console.log(newShell.target.value);
            // console.log(this.$store.state.newShellStore);
        },

        //refait la requête pour les textes au changement de langue, les otherMails et shell à la modification de ceux-ci
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
            this.texts = response.data[this.$store.state.lang].editprofil;
            
            })
            .catch((error) => console.log(error));
            
            //requête GET profile pour rafraichire otherEmails quand on efface un mail
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
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

    },   
};

</script>



<style lang="scss">

@import "../style/style.module.scss";
@import "../style/typo.scss";

#cont-profile{
    font-family: "source", Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    max-width: 550px;
    border: 1px solid $bleuM;
    border-radius: 5px;
    background-color: white;
    margin: 1rem auto;
    @extend %shadowL;
}

.row{
    display: flex;
    justify-content: space-between;
    font-weight: initial;  
}

#div-row1{
    display: flex;
    p{
        margin-left: .5rem;
    }
}

#cont-contact-mail{
    label{
        font-family: "source", Avenir, Helvetica, Arial, sans-serif;
        font-weight: bold;
        align-self: center;
        
        svg{
            margin-left: .5rem;
            @extend %animate;
            @extend %hover;
        }
    }
    #contact-mail{
        display: block;
        padding: .5rem;
        margin: 0.5rem 0;
        border-radius: 5px;
        border: 1px solid $black;
    }
        
}

#cont-mails, #cont-plm {
    width: 95%;
    border: 1px solid $bleuM;
    border-radius: 5px;
    background-color: white;
    margin: 2rem auto;
    @extend %shadowL;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    ul li{
        div{
            padding: 0.8rem 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            svg{
                color: lighten($rouge, 25%);
                font-size: 1.5rem;
                @extend %animate;
                @extend %hover;
                &:hover{
                    color: $rouge;
                }
            }
        }

    }
    
    #title-mails, #title-plm {
        background-color: $bleuM;
        padding: 1rem;
        font-family: "sourceB", Avenir, Helvetica, Arial, sans-serif;
        margin: 0;
        color: white;
    }
}


#cta-chge-password{
    text-align: center;
    margin: 1rem;
    color: $bleuM;
    @extend %animate;
    @extend %hover;
    &:hover{
        color: $vertM;
        text-decoration: underline;
    }
}

#shell{
   margin: 0.5rem 0;
   border-radius: 5px;
   border: 1px solid $black; 
}

#btns-cont{
    display: flex;
    justify-content: space-evenly;

    #submit-edit-pro, #delete-edit-pro{
        color: $black;
        width: 100px;
        @extend %button;
        margin: 1rem 0;
    }

    #delete-edit-pro{
        width: 80px;
        text-align: center;
        border-width: 2px;
        border-style: solid;
    }
}

@media #{$sm}{
    #cont-profile{
        width: 95%;
    }

    .row{
        display: block;
        text-align: start;
        div{
          margin-top: .5rem;
          font-weight: initial;  
        }
        
        #contact-mail{
            width: 100%;
        }
    }

    #div-row1 p{
        margin-left: 0;
        margin-right: .5rem;
    }

    #cont-shell{
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        label{
            align-self: flex-start;
        }
    }

    #shell{
        margin: 0;
        padding: .5rem; 
    }

    #btns-cont{
        justify-content: center;

        #submit-edit-pro, #delete-edit-pro{
            margin: 2rem 2rem;
        }
    }
}


@media #{$xs}{
    #btns-cont{
        flex-direction: row;

        #submit-edit-pro, #delete-edit-pro{
            margin: 2rem .5rem;
        }
    }
}
</style>