<template>
    
    <div :key="stateKey">
        <img alt="icon ON" v-if="card.properties.activable && card.properties.deactivable && ((activated != undefined) && activated)" src="../assets/icons/toggle-on-solid.svg" @click="serviceON(index)">
        <img alt="icon ON grisé" v-else-if="card.properties.activable && !card.properties.deactivable && ((activated != undefined) && activated)" src="../assets/icons/toggle-on-trans.svg">
        <img alt="icon OFF" v-else-if="card.properties.activable && ((activated != undefined) && !activated)" src="../assets/icons/toggle-off.svg" @click="serviceOFF(index)">
    </div>

</template>

<script>

export default {
    props:[
        'card',
        'index'
    ],
    data(){
        return{
            activated: false,
            statekey: 0,
        };
    },
    computed:{
        stateKey(){
            this.statekey = this.$store.state.stateKey;
        },
    },
    watch: {
        // chaque fois que statekey change, je récupère la valeur d'activated dans le store
        statekey(newStatekey, oldStatekey) {
            if (newStatekey > oldStatekey) {
            this.activated = this.$store.state.prefsInfo.activated[this.index];
            }
        },
    },
    mounted(){
        this.activated = this.$store.state.prefsInfo.activated[this.index];     
    },
    methods: {
        serviceON(index){
            this.$store.commit('SETNEWSTATESTORE', index)
            this.$store.commit('SETOLDSTATESTORE', false)
            this.$store.commit('SETSHOWSTATECHGESTORE', true)
        },

        serviceOFF(index){
            this.$store.commit('SETNEWSTATESTORE', index)
            this.$store.commit('SETOLDSTATESTORE', true)
            this.$store.commit('SETSHOWSTATECHGESTORE', true)
        },
    },
};

</script>

<style lang="scss" scoped>
@import "../style/style.module.scss";
@import "../style/typo.scss";


img{
    width: 45px;
    @extend %animate;
    @extend %hover;
}

</style>