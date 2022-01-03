<template>
    <div v-for="(card, index) in cards" >
        <div :id="index" class="card-wrapper" v-if="fav[index] && (card.url_admin ==='' || $store.state.adminState)">
            <CardsContent :card="card" :index="index" />
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
            fav: [],
        };
    },
    mounted() {
        this.fav = this.$store.state.prefsInfo.prefs;

        // requête pour envoyer en props les infos des services (celon langues)
        const axios = require('axios').default;
        axios
        .get("./I18n.json")
        .then((response) => {
            this.cards = response.data[this.$store.state.lang].services;
            
        })
        .catch((error) => console.log(error));  
    },
};

</script>

<style lang="scss">
@import "../style/style.module.scss";
@import "../style/typo.scss";

</style>