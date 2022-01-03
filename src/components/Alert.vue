<template>

    <div class="wrapper-alert" :class="{ hidden : !showAlert }">
        <div class="cont-alert" >
            <p class="text-alert">{{msgAlert}}</p>
            <div id="btn-val-alert" class="btn" @click="validAlert()">OK</div>
        </div>
    </div>

</template>

<script>

export default {
    computed: {
        showAlert(){
            return this.$store.state.showAlertStore;
        },
        
        msgAlert(){
            return this.$store.state.msgAlert;
        }
    },
    methods: {
        validAlert(){         
            this.$store.commit('SETSHOWALERTSTORE', false)
        },
    },
};

</script>



<style lang="scss">

@import "../style/style.module.scss";
@import "../style/typo.scss";

.wrapper-alert{
    width: 100%;
    height: 200%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    transition: opacity 0.3s ease-in-out;
}

.cont-alert{
    font-family: "source", Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 450px;
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

.text-alert{
    font-weight: normal;
    text-align: center;
    margin: 2rem 2rem 0 2rem;
}

#btn-val-alert{
    @extend %button;
    width: 50px;
    margin: 2rem auto;
}

</style>