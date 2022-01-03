<template>

    <div id="wrapper-invit-help" :key="langKey" :class="{ hidden : !showInvitHelp }">
        <div id="cont-invit-help">
            <div class="cont-title-password">
                <p class="title-password" id="titlePassword">{{texts.title1}}</p>
                <fa :icon="['fas', 'times']" @click="closeInvitHelp" />
            </div>
            <div id="cont-texts-invit">
                <p class="titles-invit-help">{{texts.title2}}</p>
                <p class="texts-invit-help">{{texts.text1}}</p>
                <p class="texts-invit-help">{{texts.text2}}</p>
                <p class="titles-invit-help">{{texts.title3}}</p>
                <p class="li-invit-help">{{texts.li1}}</p>
                <p class="li-invit-help">{{texts.li2}}</p>
                <p class="li-invit-help">{{texts.li3}}</p>
                <p class="li-invit-help">{{texts.li4}}</p>
                <p class="texts-invit-help">{{texts.text3}}</p>
            </div>
        </div>
    </div>
    

</template>

<script>

export default {
    data(){
        return{
            texts:{
                title1: null,
                title2: null,
                title3: null,
                text1: null,
                text2: null,
                text3: null,
                li1: null,
                li2: null,
                li3: null,
                li4: null,
            },
            langstore: 0,
        };
    },
    mounted(){
        
        // requête pour textes celon langue
        this.getTexts();
        
    },
    computed: {
        showInvitHelp(){
            return this.$store.state.showInvitHelpStore;
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
        closeInvitHelp(){
            this.$store.commit('SETSHOWINVITHELPSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.texts = response.data[this.$store.state.lang].invithelp;
            })
            .catch((error) => console.log(error));
        },

    },
};

</script>



<style lang="scss">

@import "../style/style.module.scss";
@import "../style/typo.scss";

#wrapper-invit-help{
    width: 100%;
    height: 200%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    transition: opacity 0.3s ease-in-out;
}

#cont-texts-invit{
    margin: 1rem;
}

#cont-invit-help{
    font-family: "source", Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 600px;
    border: 1px solid $bleuM;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    background-color: white;
    margin: 10rem auto;
    @extend %shadowL;
}

.titles-invit-help{
    font-weight: bold;
    margin: 1rem 0;
}

.texts-invit-help{
    margin-top: 1rem;
    font-size: .9rem;
}

.li-invit-help{
    font-size: .9rem;
    margin-top: 1rem;
    margin-left: 1rem;

    &::before{
        content: "•";
        font-size: 1.5rem;
        color: $bleuM;
        margin: 0 .5rem 0 -1rem;
    }
}

@media #{$md}{
    #cont-invit-help{
        width: 90%;
        margin-top: 2rem;
    }
}

</style>