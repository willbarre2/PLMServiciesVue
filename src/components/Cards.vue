<template>
    <div v-for="(card, index) in cards" >
        <div class="card-wrapper" v-if="(card.url_admin ==='' || $store.state.adminState)">
            <CardsContent :card="card" :index="index" :key="langKey"/>
        </div>
    </div>
</template>

<script>
import CardsContent from '@/components/CardsContent.vue';

export default {
    components: {
        CardsContent,
    },
    data(){
        return{
            cards: [],
            langstore: null,
        };
    },
    mounted() {
        // requête pour envoyer en props les infos des services (celon langues)
        this.getPrefs();
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
            this.getPrefs()
            }
        },
    },
    methods: {
        //refait la requête pour envoyer en props les infos des services (celon langues) à la modification de celle-ci.
        getPrefs() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.cards = response.data[this.$store.state.lang].services;
            })
            .catch((error) => console.log(error));
            
        },
    },
};

</script>

<style lang="scss" >
@import "../style/style.module.scss";
@import "../style/typo.scss";

</style>