<template>
<div id="star" class="btn" @click="activatFav" :key="langKey" :title="texts.title"><fa icon="star"/></div>
</template>

<script>

export default {
    data(){
        return{
            texts:{
                title: null
            },
            langstore: null,   
        };
    },
    mounted(){
        // requête pour textes celon langue
        this.getTexts();
        
    },
    computed: {
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
    methods:{
        activatFav(){
            this.$store.commit('SETFAVACTIVATED');
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
            this.texts = response.data[this.$store.state.lang].btnfav;
          
            })
            .catch((error) => console.log(error));
        }
    },
};
</script>

<style lang="scss" scoped>
@import "../style/style.module.scss";
@import "../style/typo.scss";

#star{
    width: 20px;
    height: 20px;
    margin: 0 1rem;
    svg{
        color: white !important;
        margin: 0 !important;
        font-size: 1.2rem;
    } 
} 

@media #{$md}{
    #star{
        margin: 0 .5rem;
    } 
}

@media #{$sm}{
    #star{
        width: 17px;
        height: 17px;
        margin: 0 1rem; 
        padding: 3px;
        font-size: .8rem;      
        
        svg{
            font-size: .8rem;
        } 
    } 
}

</style>