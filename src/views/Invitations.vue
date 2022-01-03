
<template>

    <div id="wrapper-invitations">
        <div id="cont-title-invit">
            <p id="title-invit">{{texts.title}}</p>
            <div id="btn-help-invit" class="btn" @click="showHelpInvit"><fa :icon="['fas', 'question']"/></div>
        </div>
        <div id="cont-form">
            <form id="form-invitations" @submit.prevent="">
                <div>
                    <label for="name">{{texts.lastname}}</label>
                    <input type="text" name="name" id="name" v-model="lastname">
                </div>
                <div>
                    <label for="firstname">{{texts.firstname}}</label>
                    <input type="text" name="firstname" id="firstname" v-model="firstname">
                </div>
                <div>
                    <label for="mailVal">{{texts.mail}}</label>
                    <input type="mail" name="mail" id="mail" placeholder="abcde@fghij.klm" v-model="mail">
                </div>
                <button id="btn-invit" disabled>{{texts.confirm}}</button>
            </form>
            <div>
                <h4>{{texts.titletext}}</h4>
                <p>{{texts.text1}}</p>
                <p>{{texts.text2}}</p>
                <p>{{texts.text3}}</p>
            </div>
        </div>

        <div class="wrapper-tab-invit">
            <div id="cont-titles-tabs">
                <div class="title-tab-accounts" id="title-tab-acc" @click="selectTabAccount">{{texts.titletabs[0]}}</div>
                <div class="title-tab-accounts unselected" id="title-tab-guests" @click="selectTabGuests">{{texts.titletabs[1]}}</div>
            </div>

            <!-- onglet Comptes existants -->
            <div class="cont-table-invit" id="exist-accounts" :key="newUserKey" >
                <table >
                    <thead>
                        <tr>
                            <th>{{texts.login}}</th>
                            <th>{{texts.lastname}}</th>
                            <th>{{texts.firstname}}</th>
                            <th>{{texts.mail}}</th>
                        </tr>
                    </thead>
                    <tbody id="table-body" v-if="!loadingUsers">
                        <tr v-for="user in users" @click="getUser(user.login)" :id="user.login">
                            <td>{{user.login}}</td>
                            <td>{{user.familyName}}</td>
                            <td>{{user.givenName}}</td>
                            <td>{{user.contactEmail}}</td>
                        </tr>  
                    </tbody>
                </table>
                <div class="loader" v-if="loadingUsers">
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    <p>Loading</p>
                </div>
            </div>

            <!-- onglet Mes invités -->
            <div class="cont-table-invit display-none" id="guests" :key="newUserKey" >
                <table >
                    <thead>
                        <tr>
                            <th></th>
                            <th>invitation</th>
                            <th>{{texts.login}}</th>
                            <th>{{texts.lastname}}</th>
                            <th>{{texts.firstname}}</th>
                            <th>{{texts.mail}}</th>
                        </tr>
                    </thead>
                    <tbody id="table-body" v-if="!loadingUsers">
                        <tr v-for="user in users" @click="getUser(user.login)" :id="user.login">
                            <td class="delete-cell"><fa icon="times-circle" @click="deleteInvitations(user.login)"/></td>
                            <td>test test</td>
                            <td>{{user.login}}</td>
                            <td>{{user.familyName}}</td>
                            <td>{{user.givenName}}</td>
                            <td>{{user.contactEmail}}</td>
                        </tr>  
                    </tbody>
                </table>
                <div class="loader" v-if="loadingUsers">
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    <p>Loading</p>
                </div>
            </div>
        </div>

    </div>

    <InvitHelp/>
    
</template>


<script>
import InvitHelp from '../components/InvitHelp.vue';

export default {
    components: { InvitHelp },
    data() {
        return {
            texts: {
                title: null,
                lastname: null,
                firstname: null,
                mail: null,
                confirm: null,
                titletext: null,
                text1: null,
                text2: null,
                text3: null,
                titletabs: [],
            },
            langstore: 0,
            lastname: "",
            firstname: "",
            mail: "",
            loadingUsers: true,
            newUserKey: 0,
            users: [],
        };
    },
    mounted() {
        // requête pour textes celon langue
        this.getTexts();

        // !! requête provisoir pour remplir les tableaux !!
        const axios = require('axios').default;
        axios
        .get(`http://localhost:3000/api/users?entity=112`)
        .then((response) => {
            this.users = response.data;
            this.loadingUsers = false;
        })
        .catch((error) => console.log(error));
    },
    computed: {
        // recharge composant à chaque changement de langue
        langKey() {
            this.langstore = this.$store.state.langKey;
        },
    },
    watch: {
        //  chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        langstore(newLangstore, oldLangstore) {
            if (newLangstore > oldLangstore) {
                this.getTexts();
            }
        },
    },
    methods: {
        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require("axios").default;
            axios
                .get("./I18n.json")
                .then((response) => {
                this.texts = response.data[this.$store.state.lang].invitations;
            })
                .catch((error) => console.log(error));
        },

        showHelpInvit(){
            this.$store.commit('SETSHOWINVITHELPSTORE', true)
        },

        selectTabAccount(){
            let titleTabAcc = document.getElementById('title-tab-acc');
            let titleTabGue = document.getElementById('title-tab-guests');
            let tabAcc = document.getElementById('exist-accounts');
            let tabGue = document.getElementById('guests');

            if (titleTabAcc.classList.contains('unselected')) {
                titleTabAcc.classList.remove('unselected')
            }
            if (!titleTabGue.classList.contains('unselected')) {
                titleTabGue.classList.add('unselected')
            }

            if (tabAcc.classList.contains('display-none')) {
                tabAcc.classList.remove('display-none')
            }
            if (!tabGue.classList.contains('display-none')) {
                tabGue.classList.add('display-none')
            }
        },

        selectTabGuests(){
            let titleTabAcc = document.getElementById('title-tab-acc');
            let titleTabGue = document.getElementById('title-tab-guests');
            let tabAcc = document.getElementById('exist-accounts');
            let tabGue = document.getElementById('guests');

            if (!titleTabAcc.classList.contains('unselected')) {
                titleTabAcc.classList.add('unselected')
            }
            if (titleTabGue.classList.contains('unselected')) {
                titleTabGue.classList.remove('unselected')
            }

            if (!tabAcc.classList.contains('display-none')) {
                tabAcc.classList.add('display-none')
            }
            if (tabGue.classList.contains('display-none')) {
                tabGue.classList.remove('display-none')
            }
        },

        deleteInvitations(login){

        },
    },
    
};

</script>


<style lang="scss" scoped>

@import "../style/style.module.scss";
@import "../style/typo.scss";

#wrapper-invitations{
    font-family: "source", Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 1200px;
    border: 1px solid $bleuM;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    background-color: white;
    margin: 1rem auto;
    @extend %shadowL;

    #cont-title-invit{
        background-color: $bleuM;
        padding: 0.8rem;
        font-size: 1.4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        #title-invit{
            font-family: "sourceB", Avenir, Helvetica, Arial, sans-serif;
            margin: 0;
            color: white;
        }
        
        #btn-help-invit{
            font-size: 1rem;
            width: 20px;
            padding: 0.2rem;
            margin: 0;
            svg{
                margin-left: .2rem;
            }
        }
    }
    #cont-form{
        display: flex;
        justify-content: space-between;

        div{
            width: 60%;
            margin: 1rem;
            
            p{
                margin-top: 1rem;
            }

            p:nth-child(4){
                margin-top: 0;
            }
        }

        #form-invitations{
            margin: 1rem 1rem;
            width: 35%;
            border: 1px solid $bleuM;
            border-radius: 5px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            -ms-border-radius: 5px;
            -o-border-radius: 5px;
            background-color: white;
            @extend %shadowL;
            display: flex;
            flex-direction: column;
    
            div{
                width: 93%;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            label, input, button{
                margin: .5rem 1rem ;
            }
            
            label{
                font-family: "sourceB", Avenir, Helvetica, Arial, sans-serif;
            }
    
            input{
                @extend %inputs;
            }
    
            input.inputerror:focus { 
                outline-color: rgb(255, 58, 58);   
            }
    
            #btn-invit{
                color: white;
                align-self: center;
                width: 35%;
                @extend %button;
                margin-top: 2rem;
                margin-bottom: 2rem;
            }
        }
    }

    .wrapper-tab-invit{
        width: 97%;
        margin: 0 auto 1rem;

        #cont-titles-tabs{
            display: flex;
            .title-tab-accounts{
                width: 50%;
                background-color: $bleuM;
                padding: 0.3rem;
                font-size: 1.2rem;
                font-family: "sourceB", Avenir, Helvetica, Arial, sans-serif;
                color: white;
                border-radius: 10px 10px 0 0;
                text-align: center;
                

                &:hover{
                    cursor: pointer;
                    color: $black;
                }
            }

            .unselected{
                background-color: $bleuMl;
                color: $gray;
            }
        }

        .display-none{
            display: none;
        }
        .cont-table-invit{
            border-top: 2px solid $bleuM;
            border-bottom: 1px solid $bleuM;
            border-left: 1px solid $bleuM;
            border-right: 1px solid $bleuM;
            border-radius: 0 0 5px 5px; 
            -webkit-border-radius: 0 0 5px 5px;
            -moz-border-radius: 0 0 5px 5px;
            -ms-border-radius: 0 0 5px 5px;
            -o-border-radius: 0 0 5px 5px;
            min-height: 200px;
            max-height: 50vh;
            overflow: auto;
            @extend %shadowL;
            .loader{
                color: $vertM;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
    
            table{
                width: 100%;

            }
    
            tr{
                &:nth-child(even) {
                    background-color: $bleuML;
                }
                
                &:hover{
                    cursor: pointer;
                    background-color: $vertML;
                }
    
                &:active{
                    background-color: $vertM;
                } 
            }
    
            th{
                white-space: nowrap;
                border-bottom: 2px solid $bleuM;
                padding: 0.3rem;
            }
    
            td{
                padding: 0.3rem;
                svg{
                    font-size: 1.3rem;
                    color: $rougeL;
                    @extend %hover;

                    &:hover{
                        color: $rouge;
                    }
                }
            }

            .delete-cell{
                width: 20px;
            }
        }
    }


}

@media #{$xxl}{
    #wrapper-invitations{
        width: 990px;
        #cont-form{
            #form-invitations{
                width: 40%;
            }
        }
    }
}

@media #{$xl}{
    #wrapper-invitations{
        width: 750px;
        #cont-form{
            div{
                width: 45%;
            }
            #form-invitations{
                width: 55%;
            }
        }
    }
}

@media #{$md}{
    #wrapper-invitations{
        width: 95%;
        #cont-form{
            flex-direction: column-reverse;
            align-items: center;
            div{
                width: 95%;
                margin-bottom: 0;
            }
            #form-invitations{
                width: 95%;

                div{
                    width: 340px;
                    margin: 1rem auto 0;
                }

                #btn-invit{
                    width: 130px;
                }
            }
        }
    }
}

@media #{$xs}{
    #wrapper-invitations{
        #cont-form{
            #form-invitations{

                div{
                    width: 95%;
                    flex-direction: column;
                    label, input{
                        margin: 0;
                    }
                }

            }
        }
    }
}
</style>