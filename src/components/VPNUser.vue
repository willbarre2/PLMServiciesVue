<template>

    
    <div :key="refreshVPNUser">
        <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showVPNUser }">
            <div class="cont-password cont-password-chge">
                <div class="cont-title-password">
                    <p class="title-password" id="titlePassword">{{texts.title}}</p>
                    <fa :icon="['fas', 'times']" @click="closeVPNUser" />
                </div>
                <div class="cont-xl">
                    <div class="cont-vpns" v-for="vpn in vpns">
                        <input type="text" class="newip" :value="vpn.ip" disabled>
                        <input type="text" class="newdescri" :value="vpn.description" disabled>
                        <button class="btn-minus" @click="removeIP(vpn.ip)"><fa :icon="['fas', 'times-circle']"/></button>
                        <button class="btn-edit" @click="chgeVPN(vpn.ip, vpn.description)"><fa :icon="['fas', 'edit']"/></button>
    
                    </div>
                    <div id="cont-new-vpn">
                        <input type="text" class="newip" v-model="newIP" placeholder="255.255.255.255" :class="{ inputerrorvpn : !newIPIsValid }">
                        <input type="text" class="newdescri" v-model="newDescri" placeholder="abcdef" :class="{ inputerrorvpn : !newDescriIsValid }">
                        <button class="btn-plus" :disabled="!formIsValid || (newIP=='' && newDescri=='')" @click="addIP"><fa :icon="['fas', 'plus-circle']"/></button>
                    </div>
                </div>
                <button id="btn-save-vpn-unit" class="btn" :disabled="!chgeKey" @click="saveVPNUnit">{{texts.save}}</button>
            </div>
        </div>
    
        <div id="wrapper-chge-vpn-user" class="hidden" :key="langKey">
            <div id="cont-chge-vpn">
                <div class="cont-title-password">
                    <p class="title-password" id="titlePassword">{{texts.titlechge}}</p>
                    <fa :icon="['fas', 'times']" @click="closeVPNchge" />
                </div>
                <div id="cont-new-vpn">
                    <input type="text" class="newip" v-model="chgeIPUser" :class="{ inputerrorvpn : !chgeIPIsValid }">
                    <input type="text" class="newdescri" v-model="chgeDescriUser" :class="{ inputerrorvpn : !chgeDescriIsValid }">
                    <button class="btn-plus" :disabled="!formChgeIsValid" @click="validChgeVPN"><fa :icon="['fas', 'check-circle']"/></button>
                </div>
            </div>
        </div>
    </div>


</template>

<script>

export default {
    props:[
        'user',
    ],
    data(){
        return{
            texts:{
                title: null,
                titlechge: null,
                save: null,
            },
            langstore: 0,
            userSelectedKey: false,
            chgeKey: 0,
            vpns: [],
            newIP: "",
            newDescri: "",
            chgeIPUser: "",
            chgeOldIPUser: "",
            chgeDescriUser: "",
        
        };
    },
    mounted(){
        
        // requête pour textes celon langue
        this.getTexts();
        
        this.getVPNsUser();
        
    },
    computed: {
        showVPNUser(){
            return this.$store.state.showVPNUserStore;
        },

        // recharge composant à chaque reouverture
        refreshVPNUser(){
            this.userSelectedKey = this.$store.state.showVPNUserStore;
        },
 
        // recharge composant à chaque changement de langue
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

        // "!!" convertie en boolean pour tester si champ est rempli
        newIPIsValid(){
            return ( !(!!this.newIP) || /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.newIP))
        },
        
        newDescriIsValid(){
            if(( !(!!this.newIP) && !(!!this.newDescri)) || (this.newIPIsValid && (!!this.newDescri))){
                return true
            }else{
                return false
            }
        },
        
        formIsValid(){
            return this.newIPIsValid && this.newDescriIsValid 
        },

        chgeIPIsValid(){
            return ( !(!!this.chgeIPUser) || /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.chgeIPUser))
        },
        
        chgeDescriIsValid(){
            if(( !(!!this.chgeIPUser) && !(!!this.chgeDescriUser)) || (this.chgeIPIsValid && (!!this.chgeDescriUser))){
                return true
            }else{
                return false
            }
        },
        
        formChgeIsValid(){
            return this.chgeIPIsValid && this.chgeDescriIsValid 
        },
        
    },
    watch: {
        //  chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        langstore(newLangstore, oldLangstore) {
            if (newLangstore > oldLangstore) {
            this.getTexts()
            }
        },

        //  chaque fois que langStore change, la requête pour la langue des textes s'exécute.
        userSelectedKey(newUnitSelectedKey, oldUnitSelectedKey) {
            if (newUnitSelectedKey > oldUnitSelectedKey) {
            this.getVPNsUser()
            }
        },
    },
    methods: {

        getVPNsUser(){
            this.vpns = this.user.vpn;
        },

        closeVPNUser(){
            this.chgeKey = 0;
            this.newIP = "";
            this.newDescri = "";
            this.vpns = [];
            this.$store.commit('SETSHOWVPNUSERSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.texts = response.data[this.$store.state.lang].savevpnuser;
            })
            .catch((error) => console.log(error));
        },

        addIP(){
            this.chgeKey += 1;
            let newIPdata = {};
            newIPdata.ip = this.newIP;
            newIPdata.description = this.newDescri;
            newIPdata.fqdn = "";
            this.vpns.push(newIPdata);
            this.newIP = "";
            this.newDescri = "";
        },

        removeIP(ip){
            this.chgeKey += 1;
            this.vpns.splice(this.vpns.indexOf(this.vpns.find(vpn => vpn.ip === ip)), 1);
        },

        chgeVPN(ip, descri){
            document.getElementById("wrapper-chge-vpn-user").classList.remove("hidden")
            this.chgeIPUser = ip;
            this.chgeOldIPUser = ip;
            this.chgeDescriUser = descri;
        },

        closeVPNchge(){
            document.getElementById("wrapper-chge-vpn-user").classList.add("hidden")
        },

        validChgeVPN(){
            this.chgeKey += 1;
            // j'efface l'ancien VPN
            this.vpns.splice(this.vpns.indexOf(this.vpns.find(vpn => vpn.ip === this.chgeOldIPUser)), 1);
            // et je j'ajoute le nouveau (modification de l'ancien)
            let newVPNdata = {};
            newVPNdata.ip = this.chgeIPUser;
            newVPNdata.description = this.chgeDescriUser;
            newVPNdata.fqdn = "";
            this.vpns.push(newVPNdata);
            this.chgeIPUser = "";
            this.chgeDescriUser = "";

            document.getElementById("wrapper-chge-vpn-user").classList.add("hidden");
        },

        saveVPNUnit(){
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
                // lancer dabord le server express local (Portail_Mathrice_Mock_API)
                const axios = require('axios').default;
                axios
                .patch(`http://localhost:3000/api/users/vpn/${this.user.login}` , {vpns: this.vpns})
                .then((response) => {
                    if (this.$store.state.lang === "fr") {
                        this.$store.commit('SETMSGALERTSTORE', "VPNs mis à jours")
                        this.$store.commit('SETSHOWVPNUSERSTORE', false)
                        this.$store.commit('SETSHOWALERTSTORE', true)
                    }else{
                        this.$store.commit('SETMSGALERTSTORE', "VPNs updated")
                        this.$store.commit('SETSHOWVPNUSERSTORE', false)
                        this.$store.commit('SETSHOWALERTSTORE', true)
                    }
                    this.chgeKey = 0;
                    this.newIP = "";
                    this.newDescri = "";
                    this.vpns = [];
                })
                .catch((error) => console.log(error)); 
            } else{
                const axios = require('axios').default;
                axios
                .patch(`/api/users/${this.user.login}/vpn`, {vpns: this.vpns})
                .then((response) => {
                    this.$store.commit('SETMSGALERTSTORE', response)
                    this.$store.commit('SETSHOWVPNUSERSTORE', false)
                    this.$store.commit('SETSHOWALERTSTORE', true)
                    this.chgeKey = 0;
                    this.newIP = "";
                    this.newDescri = "";
                    this.vpns = [];
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

.cont-xl{
    max-height: 350px;
    overflow: auto;
}

.cont-vpns, #cont-new-vpn{
    margin: 1rem auto 0;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;

    input{
        @extend %inputs;
        margin: 0 1rem 0 0;
    }

    .inputerrorvpn{
        border: 1px solid $rouge !important;
    }

    input.inputerrorvpn:focus { 
        outline-color: rgb(255, 58, 58);   
    }

    .newip{
        text-align: center;
        width: 100px;
    }

    .newdescri{
        width: 60px;
    }

    
}

.cont-vpns{
    input:disabled{
        cursor: not-allowed;
    }
    .btn-minus{
        border: none;
        background-color: white;
        svg{
            font-size: 1.5rem;
            color: $rougeL;
            @extend %hover;
            &:hover{
                color: $rouge;
            }
        }

        &:disabled{
            cursor: not-allowed;
            svg:hover{
                color: $rougeL;
                cursor: not-allowed;
            }
        }
    }

    .btn-edit{
        border: none;
        background-color: white;
        margin-left: 1rem;
        svg{
            font-size: 1.2rem;
            color: $bleuMl;
            @extend %hover;
            &:hover{
                color: $bleuM;
            }
        }
    }
}

#cont-new-vpn{
    margin-right: 2.55rem;
    svg{
        font-size: 1.5rem;
        color: $vertML;
        @extend %hover;
        &:hover{
            color: $vertM;
        }
    }

    .btn-plus{
        border: none;
        background-color: white;

        &:disabled{
            cursor: not-allowed;
            svg:hover{
                color: $vertML;
                cursor: not-allowed;
            }
        }
    }
}

#btn-save-vpn-unit{
    @extend %button;
    width: 120px;
    display: block;
    margin: 2rem auto;
}

#wrapper-chge-vpn-user{
    position: absolute;
    z-index: 1000;
    top: 18rem;
    width: 100%;
    #cont-chge-vpn{
        margin: 0 auto;
        width: 400px;
        font-family: "source", Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        border: 1px solid $bleuM;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        -ms-border-radius: 5px;
        -o-border-radius: 5px;
        background-color: white;
        @extend %shadowL;

        .cont-title-password{
            padding: .5rem;
        }

        #cont-new-vpn{
            margin:1rem auto 1rem;
        }
    }
    
}

@media #{$sm}{
    #wrapper-chge-vpn-user{
        top: 6rem;
        #cont-chge-vpn{
            width: 85%;
        }
    }
}

@media #{$xs}{
    .cont-vpns, #cont-new-vpn{

        width: 95%;

        input{
            padding: .5rem .5rem;
            font-size: .8rem;
            margin: 0 .5rem 0 0;
        }

        .newip{
            width: 95px;
        }

        .newdescri{
            width: 55px;
        }
    }

    .cont-vpns{
        .btn-edit{
            margin-left: .5rem;
        }
    }
    #cont-new-vpn{
        width: 90%;
    }
}

@media #{$xxs}{
    .cont-vpns, #cont-new-vpn{

        input{
            padding: .4rem .3rem;
            font-size: .7rem;
            margin: 0 .4rem 0 0;
        }

        .newip{
            width: 90px;
        }

        .newdescri{
            width: 45px;
        }
    }

    .cont-vpn{
       width: 98%; 
    }
}

</style>