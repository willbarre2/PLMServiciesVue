<template>
    <div id="cont-manager" :key="langKey">
        <div id="unit">
            <div id="unit-cont">
                <label for="unit-choice">{{texts.unit}} :</label>
                <div id="loader-unit" class="lds-ring" v-if="loadingUnit"><div></div><div></div><div></div><div></div></div>
                <select v-if="!loadingUnit" name="unit-choice" id="unit-choice" v-model="unitSelected">
                    <option disabled value="">{{texts.select}}</option>
                    <option v-for="(entity, index) in entities" :value="index">{{entity.description}}</option>
                </select>
                <button id="btn-vpn-unit" :disabled="!unitSelected" @click="showVPNUnit">VPNs</button>
            </div>
            <router-link to="/" id="close-manager"><fa :icon="['fas', 'times']"/></router-link>
        </div>
        <div id="wrapper-users">
            <div id="cont-users">
                <div id="cont-btns-users">
                    <div id="wrapper-btns-users">
                        <div>
                            <button id="btn-new" @click="showNewAccount" :disabled="unitSelected == ''">{{texts.new.title}}</button>
                            <button id="btn-edit-cont" @click="showEditAccount"  :disabled="userSelectedKey">{{texts.edit.edit}} <fa icon="sort-down" />
                                <section id="dropdown-content-edit" v-if="!userSelectedKey">
                                    <div class="btns-edit" :title="texts.edit.delete.title" @click="showDeleteAccount">{{texts.edit.delete.text}}</div>
                                    <button class="btns-edit" id="btn-move"  :disabled="userSelected.primaryAffectation.id != unitSelected" @click="showMoveAccount">{{texts.edit.move}}</button>
                                    <div class="btns-edit" :title="texts.edit.status.title" @click="showStatusAccount">{{texts.edit.status.text}}</div>
                                    <button class="btns-edit" id="btn-pending" :title="texts.edit.pending.title" :disabled="!userSelected.primaryAffectation.to || (userSelected.primaryAffectation.to && unitSelected != userSelected.primaryAffectation.to && unitSelected != userSelected.primaryAffectation.id)" @click="showPendingAccount">{{texts.edit.pending.text}}</button>
                                </section>
                            </button>
                        </div>
                        <div>
                            <button id="btn-envelope" :disabled="userSelectedKey" :title="texts.mailpass" @click="mailPassword">
                                <svg id="envelope" version="1.1" baseProfile="full" width="30" height="30" viewBox="0 -40 600 600" xmlns="http://www.w3.org/2000/svg"><g><path d="M584.1,230c-26,20.2-60.3,45.9-178.6,131.8c-23.5,17.2-65.6,55.5-107,55.2c-41.2,0.2-82.4-37.3-106.9-55.2
                                        C73.3,276,38.8,250.3,12.8,230.1c-4.6-3.6-11.2-0.3-11.2,5.4v237c0,30.7,24.9,55.7,55.7,55.7h482.4c30.7,0,55.7-24.9,55.7-55.7
                                        V235.5C595.4,229.8,588.6,226.4,584.1,230z"/>
                                    <circle cx="434.6" cy="187.6" r="21"/>
                                    <path d="M539.6,83H57.3c-30.7,0-55.7,24.9-55.7,55.7v22c0,8.6,3.9,16.6,10.7,21.9c35.5,27.7,47.2,37.6,201.1,149.2
                                        c19.5,14.1,58.2,48.5,85.1,48c26.9,0.5,65.6-33.9,85.1-48c153.9-111.7,165.6-121.4,201.1-149.2c6.7-5.2,10.7-13.3,10.7-21.9v-22
                                        C595.4,107.9,570.5,83,539.6,83z M386.3,267.6c-33.2,0-61.6-20.2-73.7-48.9l-10.8-0.2l-10.1,0.2h-10.6L262.7,207l-11.4,11.7h-14
                                        l-13.6-15.1l-21.5,15.1h-13.1l-11.4-8.1l-13.1,8.1h-21.2L108,189.1l35.5-29.6h168c11.4-30.4,40.6-51.9,74.9-51.9
                                        c44.2,0,80,35.8,80,80S430.5,267.6,386.3,267.6z"/></g>
                                </svg>
                            </button>
                            <button id="help-users" @click="showHelpAccount" >{{texts.help}} </button>
                        </div>
                    </div>
                    <div id="filter">
                        <label for="filter">{{texts.filter}} :</label>
                        <input type="text" name="filter" id="filter" v-model="usersFiltered" :placeholder="texts.new.placeholder" :disabled="unitSelected == ''">
                    </div>
                </div>


                <div id="cont-table" :key="newUserKey" >
                    <div class="loader" v-if="loadingUsers">
                        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        <p>Loading</p>
                    </div>
                    <table v-if="!loadingUsers">
                        <thead>
                            <tr>
                                <th>{{texts.lastname}}</th>
                                <th>{{texts.firstname}}</th>
                                <th>{{texts.login}}</th>
                                <th>{{texts.member.text}}</th>
                                <th>{{texts.state.text}}</th>
                            </tr>
                        </thead>
                        <tbody id="table-body">
                            <tr v-for="user in users" @click="getUser(user.login)" :id="user.login">
                                <td>{{user.familyName}}</td>
                                <td>{{user.givenName}}</td>
                                <td>{{user.login}}</td>
                                <td>
                                    <p v-if="!user.primaryAffectation.to && user.primaryAffectation.id == unitSelected">{{texts.member.member}}</p>
                                    <p v-if="(!user.primaryAffectation.to && user.primaryAffectation.id != unitSelected) || (user.primaryAffectation.to && (unitSelected != user.primaryAffectation.to && unitSelected != user.primaryAffectation.id))">{{texts.member.guest}}</p>
                                    <p v-if="user.primaryAffectation.to && (unitSelected == user.primaryAffectation.to || unitSelected == user.primaryAffectation.id)">{{texts.member.pending}}</p>
                                </td>
                                <td><p v-if="user.expired">{{texts.state.inactive}}</p>
                                    <p v-if="!user.expired">{{texts.state.active}}</p>
                                </td>
                            </tr>  
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="loader-user" class="loader" v-if="loadingUser">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                <p>Loading</p>
            </div>

            <div id="cont-user" v-if="!loadingUser">
                <div class="tiles-user">{{texts.user}} :</div>
                <div><p class="tiles-user">{{texts.lastname}} :</p> <input type="text" name="familyNameInput" id="familyNameInput" v-model="familyNameInput" @keyup="chgesInfos" @keydown="chgeFamilyKey = true" v-if="!userSelectedKey" :disabled="userSelected.primaryAffectation.id != unitSelected"></div>
                <div><p class="tiles-user">{{texts.firstname}} :</p> <input type="text" name="givenNameInput" id="givenNameInput" v-model="givenNameInput" @keyup="chgesInfos" @keydown="chgeNameKey = true" v-if="!userSelectedKey" :disabled="userSelected.primaryAffectation.id != unitSelected"></div>
                <div><p class="tiles-user">{{texts.login}} :</p> <input type="text" name="loginInput" id="loginInput" v-model="loginInput" @keyup="chgesInfos" @keydown="chgeLoginKey = true" v-if="!userSelectedKey" :disabled="userSelected.primaryAffectation.id != unitSelected"></div>
                <div><p class="tiles-user">{{texts.mail}} :</p> <input type="text" name="contactInput" id="contactInput" v-model="contactInput" @keyup="chgesInfos" @keydown="chgeContactKey = true" v-if="!userSelectedKey" :disabled="userSelected.primaryAffectation.id != unitSelected"></div>
                <div><p class="tiles-user">{{texts.mailplm}} :</p> <input type="text" name="plmailInput" id="plmailInput" v-model="plmailInput" v-if="!userSelectedKey" disabled></div>
                <div><p class="tiles-user">{{texts.shell}} :</p> <input type="text" name="shellInput" id="shellInput" v-model="shellInput" v-if="!userSelectedKey" disabled></div>
                <div><p class="tiles-user">{{texts.arrival}} :</p> <input type="date" name="beginsAtInput" id="beginsAtInput" :value="dateToYYYYMMDD(beginsAtInput)" @input="beginsAtInputKey = $event.target.valueAsDate" @change="chgesInfos" v-if="!userSelectedKey"></div>
                <div><p class="tiles-user">{{texts.departure}} :</p> <input type="date" name="endsAtInput" id="endsAtInput" :value="dateToYYYYMMDD(endsAtInput)" @input="endsAtInputKey = $event.target.valueAsDate" @change="chgesInfos" v-if="!userSelectedKey"></div>
                <div><p class="tiles-user">{{texts.comments}} :</p> <input type="text" name="commentInput" id="commentInput" v-model="commentInput" @keyup="chgesInfos" @keydown="chgeCommentKey = true" v-if="!userSelectedKey"></div>
                <div><p class="tiles-user">{{texts.other}} :</p><section id="other-affectations"><p v-for="affectation in otherAffectations">{{affectation}}</p></section></div>
                <div v-if="userSelected.primaryAffectation && (unitSelected == userSelected.primaryAffectation.id)" id="cont-user-vpns">
                    <p class="tiles-user">{{texts.vpns}} :</p>
                    <button class="btn-edit-user-vpn" @click="showVPNUser"><fa :icon="['fas', 'edit']"/></button>
                    <section id="user-vpns"><p v-for="vpn in userVpns">{{vpn.ip}} | {{vpn.description}}</p></section>
                </div>

                <button id="btn-user-update" :disabled="chgesInfosKey" @click="userUpdate(userSelected.login)">{{texts.btnuser}}</button>
            </div>
        </div>
    </div>

    <HelpAccount />
    <NewPerson :unit="unitSelected" />
    <DeleteAccount :unit="unitSelected" :user="userSelected"/>
    <ChgeStatusAccount :unit="unitSelected" :user="userSelected"/>
    <MoveAccount :user="userSelected" :entities="entitiesNames"/>
    <PendingAccount v-if="!userSelectedKey && userSelected.primaryAffectation.to" :unit="unitSelected" :user="userSelected" :to="userSelected.primaryAffectation.to" :entities="entitiesNames"/>
    <VPNUnit v-if="unitSelected" :unit="unitSelected"/>
    <VPNUser v-if="userSelected" :user="userSelected"/>
    <Alert/>
</template>

<script>
import HelpAccount from '@/components/HelpAccount.vue';
import NewPerson from '@/components/NewPerson.vue';
import DeleteAccount from '@/components/DeleteAccount.vue';
import ChgeStatusAccount from '@/components/ChangeStatusAccount.vue';
import MoveAccount from '@/components/MoveAccount.vue';
import PendingAccount from '@/components/PendingAccount.vue';
import VPNUnit from '@/components/VPNUnit.vue';
import VPNUser from '../components/VPNUser.vue';
import Alert from '@/components/Alert.vue';

export default{
    components: {
        HelpAccount,
        NewPerson,
        DeleteAccount,
        ChgeStatusAccount,
        MoveAccount,
        PendingAccount,
        VPNUnit,
        VPNUser,
        Alert,
    },
    data(){
        return{
            texts:{
                "unit": null,
                "new": {
                    "title": null,
                    "placeholder": null,
                },
                "edit": {
                    "edit": null,
                    "delete": {
                        "title": null,
                        "text": null
                    },
                    "move": null,
                    "status": {
                        "title": null,
                        "text": null
                    },
                    "pending": {
                        "title": null,
                        "text": null
                    },
                },
                "help": null,
                "filter": null,
                "lastname": null,
                "firstname": null,
                "login": null,
                "member": {
                    "text": null,
                    "member": null,
                    "guest": null
                },
                "user": null,
                "state": {
                    "text": null,
                    "active": null,
                    "inactive": null
                },
                "mail": null,
                "mailpass": null,
                "mailplm": null,
                "shell": null,
                "arrival": null,
                "departure": null,
                "comments": null,
                "other": null,
                "vpns": null,
                "select": null,
                "btnuser": null,
                "alertmodif": null,
            },
            langstore: null,
            loadingUnit: false,
            loadingUsers: false,
            loadingUser: false,
            entities: {},
            entitiesNames: {},
            unitSelected: "",
            users: [],
            userSelected: {},
            otherAffectations: [],
            userVpns: [],
            userSelectedKey: true,
            newPersonKey: null,
            usersFiltered: "",
            familyNameInput: "",
            chgeFamilyKey: false,
            givenNameInput: "",
            chgeNameKey: false,
            loginInput: "",
            chgeLoginKey: false,
            contactInput: "",
            chgeContactKey: false,
            plmailInput: "",
            shellInput: "",
            beginsAtInput: "",
            beginsAtInputKey: "",
            chgeBeginsKey: false,
            endsAtInput: "",
            endsAtInputKey: "",
            chgeEndsKey: false,
            commentInput: "",
            chgeCommentKey: false,
            chgesInfosKey: true,
        };
    },
    mounted(){
        // requête pour textes celon langue
        this.getTexts();
        

        //requête GET profile pour récupére les unités gérées
        this.loadingUnit = true;
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
            // lancer dabord le server express local (Portail_Mathrice_Mock_API)
            const axios = require('axios').default;
            axios
            .get("http://localhost:3000/dataprofile")
            .then((response) => {
                this.entities = response.data.entities;
                this.loadingUnit = false;
            })
            .catch((error) => console.log(error)); 
        } else{
            const axios = require('axios').default;
            axios
            .get("/api/profile")
            .then((response) => {
                this.entities = response.data.entities;
                this.loadingUnit = false;
            })
            .catch((error) => console.log(error));
        }

        //requête GET entities pour récupére nom de toutes les unités
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
            // lancer dabord le server express local (Portail_Mathrice_Mock_API)
            const axios = require('axios').default;
            axios
            .get(`http://localhost:3000/api/entities`)
            .then((response) => {
                this.entitiesNames = response.data;
            })
            .catch((error) => console.log(error)); 
        } else{
            const axios = require('axios').default;
            axios
            .get(`/api/entities`)
            .then((response) => {
                this.entitiesNames = response.data;
            })
            .catch((error) => console.log(error));
        }

    },
    computed:{
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

        newUserSelected(){
            return this.userSelected;
        },

        newUserKey(){
            this.newPersonKey = this.$store.state.newPersonKey;
        },

    },
    watch: {
        // chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        langstore(newLangstore, oldLangstore) {
            if (newLangstore > oldLangstore) {
                this.getTexts()
            }
        },

        // chaque fois que unitSelected change, la requête pour les users d'une unité s'exécute.
        unitSelected(newUnitSelected, oldUnitSelected) {
            if (newUnitSelected != oldUnitSelected) {
                this.getUsers();
                // efface le champ filtre
                this.usersFiltered = "";
            }
        },

        // chaque fois qu'une nouvelle personne est ajouté on refait la requête pour rafraichir les utilisateurs
        newPersonKey(newNewPersonKey, oldNewPersonKey) {
            if (newNewPersonKey != oldNewPersonKey) {
                this.userSelectedKey = true;
                this.userSelected = {};
                this.getUsers();
                this.usersFiltered = "";
            }
        },

        // chaque fois qu'un filtre est ajouté on refait la requête pour rafraichir les utilisateurs
        usersFiltered(newUsersFiltered, oldUsersFiltered) {
            // disabled le le btn pour appliquer les changement 
            this.chgesInfosKey = true;

            // je vide les champs de détails de compte
            this.userSelected = {};
            this.otherAffectations = [];
            this.userVpns = [];
            this.familyNameInput = "";
            this.givenNameInput = "";
            this.loginInput = "";
            this.contactInput = "";
            this.plmailInput = "";
            this.shellInput = "";
            this.beginsAtInput = "";
            this.endsAtInput = "";
            this.commentInput = "";

            if (newUsersFiltered != oldUsersFiltered && newUsersFiltered.length > 2) {
                setTimeout(() => {
                    this.getUsersFiltered(newUsersFiltered)
                }, 500)
            }else if(newUsersFiltered != oldUsersFiltered && newUsersFiltered.length <= 2){
                this.getUsers()
            }
        },

        // je remet au format YYYY/MM/DD la date pour qu'elle puisse repasser dans la methode dateToYYYYMMDD (car l'input me renvoie un format: Frid Nov 26 ... )
        beginsAtInputKey(newBeginsAtInputKey, oldBeginsAtInputKey) {
            if (newBeginsAtInputKey != oldBeginsAtInputKey) {
                try {
                    let dateIso = this.beginsAtInputKey.toISOString().substring(0, 10);
                    let dateParts = dateIso.split("-");
                    this.beginsAtInput = dateParts[2]+"/"+dateParts[1]+"/"+dateParts[0];
                    this.chgeBeginsKey = true;
                } catch (error) {
                    console.log(error);
                }
            }
        },

        endsAtInputKey(newEndsAtInputKey, oldEndsAtInputKey) {
            if (newEndsAtInputKey != oldEndsAtInputKey) {
                try {
                    let dateIso = this.endsAtInputKey.toISOString().substring(0, 10);
                    let dateParts = dateIso.split("-");
                    this.endsAtInput = dateParts[2]+"/"+dateParts[1]+"/"+dateParts[0];
                    this.chgeEndsKey = true; 
                } catch (error) {
                    console.log(error);
                }
                
            }
        },

    },
    methods:{
        showHelpAccount(){
            this.$store.commit('SETSHOWHELPACCOUNTSTORE', true)
        },

        showNewAccount(){
            this.$store.commit('SETSHOWNEWACCOUNTSTORE', true)
        },

        showEditAccount(){
            document.getElementById("dropdown-content-edit").classList.toggle("isOpen");
        },

        showDeleteAccount(){
            this.$store.commit('SETSHOWDELETEACCOUNTSTORE', true)
        },

        showStatusAccount(){
            this.$store.commit('SETSHOWSTATUSACCOUNTSTORE', true)
        },

        showMoveAccount(){
            this.$store.commit('SETSHOWMOVEACCOUNTSTORE', true)
        },

        showPendingAccount(){
            this.$store.commit('SETSHOWPENDINGACCOUNTSTORE', true)
        },

        showVPNUnit(){
            this.$store.commit('SETSHOWVPNUNITSTORE', true)
        },

        showVPNUser(){
            this.$store.commit('SETSHOWVPNUSERSTORE', true)
        },

        chgesInfos(){
            this.chgesInfosKey = false;
        },

        //refait la requête pour les textes au changement de langue, les otherMails et shell à la modification de ceux-ci
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
            this.texts = response.data[this.$store.state.lang].manageaccounts;
            
            })
            .catch((error) => console.log(error));
        },

        //refait la requête pour les infos des users d'une unité
        getUsers() {

            this.otherAffectations = [];
            this.loadingUsers = true;
            this.loadingUnit = true;
            // enlève un background vert à l'ancienne ligne selectionné
            let selected = document.querySelector(".selected");
            
            if(selected !== null && selected !== ""){
                selected.classList.remove("selected");
            }

            // rend disable le btn pour modifier le compte utilisateur
            this.userSelectedKey = true;

            // vide le champ utilisateurs
            this.users = [];
            // vide le champ utilisateur
            this.userSelected = {};

            // disabled le le btn pour appliquer les changement 
            this.chgesInfosKey = true;

            //requête GET users pour récupére les utilisateurs d'une unité gérée
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .get(`http://localhost:3000/api/users?entity=${this.unitSelected}`)
                .then((response) => {
                    this.users = response.data;
                    this.loadingUsers = false;
                    this.loadingUnit = false;
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .get(`/api/users?entity=${this.unitSelected}`)
                .then((response) => {
                    this.users = response.data.data;
                    this.loadingUsers = false;
                    this.loadingUnit = false;
                })
                .catch((error) => console.log(error));
            }
        },

        //refait la requête pour les infos des users d'une unité (avec filtre)
        getUsersFiltered(filter) {
            this.loadingUsers = true;
            this.loadingUnit = true;
            // enlève un background vert à l'ancienne ligne selectionné
            let selected = document.querySelector(".selected");

            // disabled le le btn pour appliquer les changement 
            this.chgesInfosKey = true;
            
            if(selected !== null && selected !== ""){
                selected.classList.remove("selected");
            }

            // rend disable le btn pour modifier le compte utilisateur
            this.userSelectedKey = true;

            // vide le champ utilisateurs
            this.users = [];
            // vide le champ utilisateur
            this.userSelected = {};

            //requête GET users pour récupére les utilisateurs d'une unité gérée
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .get(`http://localhost:3000/api/users?entity=${this.unitSelected}`)
                .then((response) => {
                    let answer = {"data":[]};
                    response.data.forEach(function(userdata){
                        for (const property in userdata){
                            if( typeof userdata[property] === 'string' || userdata[property] instanceof String){
                                let val = userdata[property].toLowerCase();
                                if(val.indexOf(filter) !== -1){
                                    answer.data.push(userdata)
                                    break;
                                };
                            }
                        }
                    });
                    this.users = answer.data;
                    this.loadingUsers = false;
                    this.loadingUnit = false;
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .get(`/api/users?entity=${this.unitSelected}`)
                .then((response) => {
                    let answer = {"data":[]};
                    response.data.data.forEach(function(userdata){
                        for (const property in userdata){
                            if( typeof userdata[property] === 'string' || userdata[property] instanceof String){
                                let val = userdata[property].toLowerCase();
                                if(val.indexOf(filter) !== -1){
                                    answer.data.push(userdata)
                                    break;
                                };
                            }
                        }
                    });
                    this.users = answer.data;
                    this.loadingUsers = false;
                    this.loadingUnit = false;
                })
                .catch((error) => console.log(error));
            }
        },

        // je met une date au format YYYYMMDD pour qu'elle soit utilisable par les inputs type=date
        dateToYYYYMMDD(d) {
            let dateString = d;
            let dateParts = dateString.split("/");
            return dateParts[2]+"-"+dateParts[1]+"-"+dateParts[0];
        },

        //
        getUser(login){
            this.loadingUser = true;
            if (document.getElementById("dropdown-content-edit")) {
                
                document.getElementById("dropdown-content-edit").classList.remove("isOpen");
            }

            this.otherAffectations = [];
            this.userVpns = [];

            // rajoute un background vert à la ligne selectionné
            let selected = document.querySelector(".selected");
            
            if(selected !== null && selected !== ""){
                selected.classList.remove("selected");
            }

            // disabled le le btn pour appliquer les changement 
            this.chgesInfosKey = true;
            
            document.getElementById(login).classList.add("selected");

            //requête GET users+login pour récupére infos d'un utilisateur
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .get(`http://localhost:3000/api/users/${login}`)
                .then((response) => {
                    this.userSelected = response.data;
                    for (const unity in this.entitiesNames){
                        this.userSelected.affectations.forEach(affectation =>{
                            if(unity == affectation){
                                console.log();
                                if (unity != this.unitSelected) {
                                    this.otherAffectations.push(this.entitiesNames[unity].entity)
                                }
                            }
                        });
                    }
                    // j'affiche les infos du user dans les inputs
                    this.familyNameInput = this.userSelected.familyName;
                    this.givenNameInput = this.userSelected.givenName;
                    this.loginInput = this.userSelected.login;
                    this.contactInput = this.userSelected.contactEmail;
                    this.plmailInput = this.userSelected.plmEmail;
                    this.shellInput = this.userSelected.shell;
                    if (this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id == this.unitSelected) {
                        this.beginsAtInput = this.userSelected.primaryAffectation.beginsAt;
                    }else if(this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id != this.unitSelected){
                        this.userSelected.secondaryAffectations.forEach(affect =>{
                            if(affect.id == this.unitSelected){
                                this.beginsAtInput = affect.beginsAt;
                            }
                        })
                    }
                    if (this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id == this.unitSelected) {
                        this.endsAtInput = this.userSelected.primaryAffectation.endsAt;
                    }else if(this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id != this.unitSelected){
                        this.userSelected.secondaryAffectations.forEach(affect =>{
                            if(affect.id == this.unitSelected){
                                this.endsAtInput = affect.endsAt;
                            }
                        })
                    }
                    if (this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id == this.unitSelected) {
                        this.commentInput = this.userSelected.primaryAffectation.comment;
                    }else if(this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id != this.unitSelected){
                        this.userSelected.secondaryAffectations.forEach(affect =>{
                            if(affect.id == this.unitSelected){
                                this.commentInput = affect.comment;
                            }
                        })
                    }
                    this.userVpns = this.userSelected.vpn;
                    this.userSelectedKey = false;
                    this.loadingUser = false;
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .get(`/api/users/${login}`)
                .then((response) => {
                    this.userSelected = response.data;
                    for (const unity in this.entitiesNames){
                        this.userSelected.affectations.forEach(affectation =>{
                            if(unity == affectation){
                                console.log();
                                if (unity != this.unitSelected) {
                                    this.otherAffectations.push(this.entitiesNames[unity].entity)
                                }
                            }
                        });
                    }
                    // j'affiche les infos du user dans les inputs
                    this.familyNameInput = this.userSelected.familyName;
                    this.givenNameInput = this.userSelected.givenName;
                    this.loginInput = this.userSelected.login;
                    this.contactInput = this.userSelected.contactEmail;
                    this.plmailInput = this.userSelected.plmEmail;
                    this.shellInput = this.userSelected.shell;
                    if (this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id == this.unitSelected) {
                        this.beginsAtInput = this.userSelected.primaryAffectation.beginsAt;
                    }else if(this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id != this.unitSelected){
                        this.userSelected.secondaryAffectations.forEach(affect =>{
                            if(affect.id == this.unitSelected){
                                this.beginsAtInput = affect.beginsAt;
                            }
                        })
                    }
                    if (this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id == this.unitSelected) {
                        this.endsAtInput = this.userSelected.primaryAffectation.endsAt;
                    }else if(this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id != this.unitSelected){
                        this.userSelected.secondaryAffectations.forEach(affect =>{
                            if(affect.id == this.unitSelected){
                                this.endsAtInput = affect.endsAt;
                            }
                        })
                    }
                    if (this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id == this.unitSelected) {
                        this.commentInput = this.userSelected.primaryAffectation.comment;
                    }else if(this.userSelected.primaryAffectation != undefined && this.userSelected.primaryAffectation.id != this.unitSelected){
                        this.userSelected.secondaryAffectations.forEach(affect =>{
                            if(affect.id == this.unitSelected){
                                this.commentInput = affect.comment;
                            }
                        })
                    }
                    this.userVpns = this.userSelected.vpn;
                    this.userSelectedKey = false;
                    this.loadingUser = false;
                })
                .catch((error) => console.log(error));
            } 
        },

        userUpdate(login){
            let params = {}
            if(this.chgeFamilyKey){
                params["familyName"] = this.familyNameInput;
            }
            if (this.chgeNameKey) {
                params["givenName"] = this.givenNameInput;
            }
            if (this.chgeLoginKey) {
                params["login"] = this.loginInput;
            }
            if (this.chgeContactKey) {
                params["contactEmail"] = this.contactInput;
            }
            if (this.unitSelected != this.userSelected.primaryAffectation.id && (this.chgeBeginsKey || this.chgeEndsKey || this.chgeCommentKey)) {
                params["unit"] = this.unitSelected;
            }
            if (this.chgeBeginsKey) {
                params["beginsAt"] = this.beginsAtInput;
            }
            if (this.chgeEndsKey) {
                params["endsAt"] = this.endsAtInput;
            }
            if (this.chgeCommentKey) {
                params["comment"] = this.commentInput;
            }

            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .patch(`http://localhost:3000/api/chgeinfos/${login}`, {params})
                .then((response) => {
                    this.$store.commit('SETMSGALERTSTORE', this.texts.alertmodif)
                    this.$store.commit('SETSHOWALERTSTORE', true)
                    this.$store.commit('SETNEWPERSONKEY');
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .patch(`/api/users/${login}`, {params})
                .then((response) => {
                    this.$store.commit('SETMSGALERTSTORE', response)
                    this.$store.commit('SETSHOWALERTSTORE', true)
                    this.$store.commit('SETNEWPERSONKEY');
                })
                .catch((error) => console.log(error));
            }
        },

        mailPassword(){
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .post(`http://localhost:3000/api/users/resetpassword`, {login: this.userSelected.login})
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .post(`/api/users/resetpassword`, {uid: this.userSelected.login})
                .then((response) => {
                    console.log("mail envoyé");
                })
                .catch((error) => console.log(error));
            }
        },
    },
}

</script>

<style lang="scss" scoped>
@import "../style/style.module.scss";
@import "../style/typo.scss";

#cont-manager{
    width: calc(100%-2rem);
    margin: .5rem 1rem;
    @extend %border;
    border-radius: 5px;
    @extend %shadowL;
}

#unit{
    padding:  0.3rem .5rem;
    @extend %border;
    background-color: $bleuM;
    color: white;
    font-family: "sourceB", Avenir, Helvetica, Arial, sans-serif;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    #unit-cont {
        min-height: 35px;
        display: flex;
        label{
            align-self: center;
        }
        #loader-unit{
            position: absolute;
            margin-left: 12rem;
            padding-top: .5rem;
        }
        width: 100%;
        select{
            @extend %inputs;
            margin: 0 0 0 .5rem;
            width: 50%;
        }

        #btn-vpn-unit{
            font-size: .8rem;
            font-weight: bold;
            border: 3px solid black;
            border-color: $borderBleu;
            @extend %button;
            margin-left: .5rem;
            color: white !important;

            &:disabled{
                color: rgb(223, 223, 223) !important;;
            }
        }
    }

    #close-manager{
        color: white;
        margin-right: .5rem;
    }
}

#wrapper-users{
    display: flex;

    #cont-users{
        @extend %border;
        width: 66%;

        .loader{
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            p{
                color: $vertM;
                font-weight: bold;
                font-size: 1.5rem;
            }
        }

        #cont-btns-users{
            display: flex;
            justify-content: space-between;
            @extend %border;
            border-top: none;
            border-left: none;
            border-right: none;
            padding: .5rem;

            #wrapper-btns-users{
                display: flex;
                align-items: center;
                div{
                    display: flex;
                }
                button, button section div{
                    text-align: center;
                    border: 3px solid;
                    border-color: #84d4f7 #1276a1 #1276a1 #84d4f7;
                    @extend %button;
                    margin-right: .5rem;
                    color: white; 
                }

                button section div{
                    display: flex;
                    justify-content: center;
                }

                #btn-envelope{
                    padding: 0 0.5rem 0 0.45rem;
                    #envelope{
                        fill: currentColor;
                    }
                }


                #btn-edit-cont{
                    display: flex;
                    
                    svg{
                        margin-left: 0.5rem;
                    }

                    #dropdown-content-edit {
                        height: 0;
                        position: absolute;
                        margin-top: 2rem;
                        margin-left: -.6rem;
                        border-radius: 5px;
                        -webkit-border-radius: 5px;
                        -moz-border-radius: 5px;
                        -ms-border-radius: 5px;
                        -o-border-radius: 5px;
                        overflow: hidden;
                        z-index: 100;
                        width: 167px;
                        @extend %animate;
                        @extend %shadowL;

                        .btns-edit{
                            box-sizing: border-box;
                            padding: 0.3rem;
                            @extend %shadowL;
                            margin:  0;
                            @extend %animate;
                            &:hover{
                                transform: scale(1);
                            }
                        }
                        
                        #btn-move, #btn-pending{
                            width: 100%;
                            box-shadow: none;
                        }
                    }

                    #dropdown-content-edit.isOpen {
                        height: 142px;
                    }
                }
                    
            }

            #filter{
                align-self: center;

                input{
                    @extend %inputs;
                    margin: 0 0 0 .5rem;
                }
            }
        }

        #cont-table{
            @extend %border;
            border-bottom: none;
            border-left: none;
            border-right: none; 
            height: 70vh;
            overflow: auto;

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
                border-bottom: 2px solid $bleuM;
                padding: 0.3rem;
            }

            td{
                padding: 0.3rem;
            }
        }
    }

    #loader-user{
        color: $vertM;
        @extend %border;
        width: 34%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #cont-user{
        @extend %border;
        width: 34%;
        overflow: auto;
        display: flex;
        flex-direction: column;
        .tiles-user{
            font-weight: bold;
        }
        
        div:first-child{
                padding: .5rem;
                border-bottom: 2px solid $bleuM;
        }

        div{
            display: flex;
            justify-content: start;
            p:first-child{
                width: 30%;
            }
            
            p, input{
                border: none;
                color: $black;
                font-size: .9rem;
                padding: .5rem;
                width: 50%;
                white-space: nowrap;
            }

            input{
                font-size: .8rem;
                background-color: transparent;

                &:hover{
                    background-color: $vertML;
                }

                &:disabled{
                    cursor: not-allowed;
                }
            }

            p:nth-child(2):hover{
                cursor: pointer;
                background-color: $vertML;
            } 
            
            section p:nth-child(2):hover{
                cursor: text;
                background-color: transparent;
            }


            #other-affectations, #user-vpns{
                width: 67%;
                p{
                    font-size: .9rem;
                    width: calc(100% - 1rem);
                    &:hover{
                        cursor: not-allowed;
                        background-color: $vertML;
                    }
                }
                p:nth-child(even) {
                    background-color: $bleuML;
                        &:hover{
                            cursor: not-allowed;
                            background-color: $vertML;
                        }
                }
            }

            #user-vpns{
                p:nth-child(odd) {
                    background-color: transparent;
                        &:hover{
                            cursor: not-allowed;
                            background-color: $vertML;
                        }
                }
                p:nth-child(even) {
                    background-color: white;
                        &:hover{
                            cursor: not-allowed;
                            background-color: $vertML;
                        }
                } 
            }
        }

        div:nth-child(even) {
                background-color: $bleuML;
        }

        #cont-user-vpns{
            button{
                position: absolute;
                margin: 2rem 0 0 .5rem;
                @extend %button;
                color: white;
            }
        }

        #btn-user-update{
            @extend %button;
            color: white !important;
            border-width: 3px;
            width: 100px;
            align-self: end;
            margin: auto .5rem .5rem .5rem;

            &:disabled{
                color: $gray !important;
                background-color: $bleuMl;
                border-color: $borderBleuL;
            }
        }
    }
}

.selected{
    background-color: $vertM !important;
}

@media #{$xl}{
    #wrapper-users{
        #cont-users{
            #cont-btns-users{
                display: block;
                #filter{
                    input{
                        margin-top: .5rem;
                        width: 250px;
                    }
                }
            }
        }
        #cont-user{
            #btn-user-update{
                top: 56rem;
                right: 1.7rem;
            }
        }
    }        
}

@media #{$lg}{
    #unit{
        font-size: 1rem;
    }
    #wrapper-users{
        font-size: .8rem;
        
        #cont-user{
            div{
                p{
                    font-size: .8rem;
                }
                input{
                    font-size: .7rem;
                }
            }

            #btn-user-update{
                top: 51.8rem;
            }
        }
    }        
}

@media #{$md}{
    #unit{
        #unit-cont {
            select{
                width: 65%;
            }
        }
    }
    #wrapper-users{
        display: block;
        #cont-users{
            width: 100%;
            #cont-btns-users{
                #wrapper-btns-users{
                    align-items: stretch;
                }
            }

            #cont-table{
                height: 40vh;
            }
        }
        #cont-user{
            width: 100%;
            #btn-user-update{
                top: 60rem;
                right: 1rem;
            }
        }
    }        
}

@media #{$sm}{
    #unit{
        #unit-cont {
            #loader-unit{
                margin-left: 6rem;
            }
            select{
                width: 75%;
                margin-left: 0;
            }
            label{
                display: none;
            }
        }
    }
    #wrapper-users{
        #cont-users{
            #cont-btns-users{
                #wrapper-btns-users{
                    display: block;
                    button, button div{
                        margin:0 .5rem .5rem 0; 
                    }
                }
                #filter{
                    input{
                        margin-top: 0;
                    }
                }
            }

            #cont-table{
                height: 31vh;
            }
        }
        #cont-user{
            #btn-user-update{
                top: 63rem;
            }
        }
    }
}

@media #{$xs}{

    #cont-manager{
        width: calc(100%-.2rem);
        margin: .5rem .1rem;
    }

    #unit{
        #unit-cont {
            select{
                width: 70%;
                padding: .5rem;
            }
        }
    }

    #wrapper-users{
        #cont-users{
            #cont-btns-users{
                #wrapper-btns-users{

                    #btn-edit-cont{

                        #dropdown-content-edit {

                            margin-top: 2rem;

                            width: 115px;
                        }
                    }   
                }
                #filter{
                    input{
                        width: 90%;
                        margin-left: 0;
                    }
                }
            }

            #cont-table{
                height: 26vh;
            }
        }
        #cont-user{
            width: 100%;
            #btn-user-update{
                top: 62.2rem;
                right: .2rem;
            }
        }
    }        
}

@media only screen and (max-width: 393px) {
    #wrapper-users{
        #cont-users{
            #cont-btns-users{
                #wrapper-btns-users{
                    #btn-edit-cont{
                        #dropdown-content-edit {
                            margin-top: 3.2rem;
                        }
                    }   
                }
            }
        }
    }
}

@media #{$xxs}{
    #unit{
        #unit-cont {
            select{
                width: 65%;
            }
        }
    }

    #wrapper-users{
        #cont-users{
            #cont-btns-users{
                #wrapper-btns-users{
                    button{
                        margin-right: .2rem;
                    }
                }
                #filter{
                    input{
                        width: 85%;
                    }
                }
            }
        }
    }        
}

</style>