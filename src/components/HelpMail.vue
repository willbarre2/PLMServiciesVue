<template>
    <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showHelpMail }">
        <div class="cont-password cont-password-chge">
            <div class="cont-title-password">
                <p class="title-password" id="titlePassword">{{texts.title}}</p>
                <fa :icon="['fas', 'times']" @click="closeHelpMail" />
            </div>
            <p class="text-password">{{texts.text}}</p>
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
            },
            langstore: 0,  
        };
    },
    mounted(){
        // requête pour textes celon langue
        this.getTexts();
    },
    computed: {
        showHelpMail(){
            return this.$store.state.showHelpMailStore;
        },

        // recharge composant à chaque changement de langue
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
        }
    },
    methods: {
        closeHelpMail(){
            this.$store.commit('SETSHOWHELPMAILSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.texts = response.data[this.$store.state.lang].helpmail;
            })
            .catch((error) => console.log(error));
        }
    },
};

</script>



<style lang="scss" scoped>

@import "../style/style.module.scss";
@import "../style/typo.scss";

#wrapper-password-chge{
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
    font-weight: normal;
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