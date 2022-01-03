<template>
    <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showNewAccount }">
        <div class="cont-password cont-password-chge">
            <div class="cont-title-password">
                <p class="title-password" id="titlePassword">{{text.title}}</p>
                <fa :icon="['fas', 'times']" @click="closeNewAccount" />
            </div>
            <div class="text-password">
                <label for="search" id="search-label">{{text.search}} :</label>
                <input type="text" name="search" id="search" :placeholder="text.placeholder" v-model="search" :disabled="inputKey">
                <div id="loader-user-search" class="lds-ring" v-if="loadingUser"><div></div><div></div><div></div><div></div></div>
                <fa v-if="inputKey" :icon="['fas', 'times']" @click="deleteNewPersonSelected" />
                <div id="dropdown-new" class="hidden">
                    <div v-for="user in users" @click="newPersonSelected(user.login, user.givenName, user.familyName)">
                        <p>{{user.givenName}} {{user.familyName}}</p>
                        <p>{{user.contactEmail}}</p>
                    </div>
                </div>
                <input hidden type="text" name="new-person-login" id="new-person-login" value="">
            </div>
            <button v-if="inputKey" id="btn-delete" class="btn" @click="newPerson(unit)">{{text.confirm}}</button>
        </div>
    </div>
</template>

<script>

export default {
    props:[
        'unit',
    ],
    data(){
        return{
            text:{
                "title": null,
                "search": null,
                "integrate": null,
                "placeholder": null,
                "confirm": null
            },
            langstore: 0,
            search: "",
            users:[],
            loadingUser: false,
            inputKey: false,  
        };
    },
    mounted(){
        // requête pour textes celon langue
        this.getTexts();
    },
    computed: {
        showNewAccount(){
            return this.$store.state.showNewAccountStore;
        },

        // recharge composant à chaque changement de langue
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

        lang(){
            return this.$store.state.lang;
        },
    },
    watch: {
        // chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        langstore(newLangstore, oldLangstore) {
            if (newLangstore > oldLangstore) {
            this.getTexts()
            }
        },

        // chaque fois que le champs recherche change (+ de 3 caractères), la requête pour trouver des users qui correspondes s'exécute.
        search(newSearch, oldSearch) {
            const dropNew = document.getElementById("dropdown-new");
            
            if (newSearch != oldSearch && newSearch.length > 2) {
                setTimeout(() => {
                    //requête GET users pour récupére infos d'un utilisateur
                    this.loadingUser = true;
                    if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                        // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                        const axios = require('axios').default;
                        axios
                        .get(`http://localhost:3000/api/search?filter=${newSearch}`)
                        .then((response) => {
                            this.users = response.data.data;
                            if(this.users.length > 0){
                                dropNew.classList.remove("hidden");
                                this.loadingUser = false;  
                            }
                        })
                        .catch((error) => console.log(error)); 
                    } else{
                        const axios = require('axios').default;
                        axios
                        .get(`/api/users?filter=${newSearch}&limit=100`)
                        .then((response) => {
                            this.users = response.data.data;
                            dropNew.classList.remove("hidden");
                            if(this.users.length > 0){
                                dropNew.classList.remove("hidden");
                                this.loadingUser = false;  
                            }
                        })
                        .catch((error) => console.log(error));
                    }
                }, 500)
            }else if(newSearch.length <= 2){
                dropNew.classList.add("hidden");
                this.users = [];
            }
        }
    },
    methods: {
        closeNewAccount(){
            this.search = "";
            this.users = [];
            this.loadingUser = false;
            this.inputKey = false,
            document.getElementById("dropdown-new").classList.add("hidden")
            this.$store.commit('SETSHOWNEWACCOUNTSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.text = response.data[this.$store.state.lang].manageaccounts.new;
            })
            .catch((error) => console.log(error));
        },

        // Selection d'une nouvelle personne dans liste de recherche
        newPersonSelected(login, givenName, familyName){
            this.search = "" ;
            document.getElementById("search").placeholder = `${givenName} ${familyName}`;
            this.inputKey = true;
            document.getElementById("search-label").innerHTML = `${this.text.integrate} :`
            document.getElementById("new-person-login").value = login;
        },

        deleteNewPersonSelected(){
            document.getElementById("search").placeholder = this.text.placeholder;
            this.inputKey = false;
            document.getElementById("search-label").innerHTML = `${this.text.search} :`
            document.getElementById("new-person-login").value = "";
        },

        // POST de nouvelle personne dans unité selectionné
        newPerson(unit){
            let newPerson = document.getElementById("new-person-login").value;

            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .post(`http://localhost:3000/api/secondary/${unit}` , {login: newPerson})
                .then((response) => {
                    console.log("personne ajoutée");
                    this.deleteNewPersonSelected();
                    // rafraichie le composant EditProfile pour réafficher les otherEmails correctement
                    this.$store.commit('SETNEWPERSONKEY');
                    this.closeNewAccount();
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .post(`/api/users/${unit}/secondary` , {uid: newPerson})
                .then((response) => {
                    console.log("personne ajoutée");
                    this.deleteNewPersonSelected();
                    // rafraichie le composant EditProfile pour réafficher les otherEmails correctement
                    this.$store.commit('SETNEWPERSONKEY');
                    this.closeNewAccount();
                })
                .catch((error) => console.log(error));
            }
            
        }

    },
};

</script>



<style lang="scss" scoped>

@import "../style/style.module.scss";
@import "../style/typo.scss";

#wrapper-password-chge{
    width: 100%;
    height: 250%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    position: absolute;
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
    background-color: white;
    margin: 2rem auto;
    @extend %shadowL;
    text-align: center;
}

#btn-delete{
    width: 100px;
    margin:0 0 2rem 0;
}

.cont-password-chge{
    margin: 5rem auto;
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
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;

    label{
        font-weight: bold;
        margin-right: 1rem;
    }

    input{
        @extend %inputs;
    }

    svg{
        color: $rouge;
        @extend %hover;
    }

    #loader-user-search{
        
        position: absolute;
        margin-left: 22rem;
        margin-top: -1rem;
        padding-top: 0;
        div {
            border-color: $bleuM transparent transparent transparent;
        }
    }
}

#dropdown-new {
    opacity: 1;
    position: absolute;
    margin-top: 21rem;
    margin-left: 5rem;
    background-color: white;
    width: 300px;
    height: 300px;
    overflow: auto;
    @extend %shadowL;
    z-index: 100;
    border-radius: 10px;

    div{
        padding: .5rem 1rem;
        &:hover{
            cursor: pointer;
            background-color: $vertML;
        }

        &:nth-child(even) {
            background-color: $bleuML;
            &:hover{
                cursor: pointer;
                background-color: $vertML;
            }
        }

        p:nth-child(2){
            font-size: .75rem;
        }
    }
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

    .text-password{
        flex-direction: column;

        label{
            font-weight: bold;
            margin-right: 0;
        }

        input{
            margin-right: 0;
        }

        #loader-user-search{
            margin-left: 17rem;
            margin-top: 0.2rem;
        }
    }

    #dropdown-new {
        margin-top: 22rem;
        margin-left: 0;
        width: 85%;
    }
}
</style>