<template>
    <div class="banner">
        <div class="toggle" v-if="!connectState">
            <BtnsONOFF :index="index" :card="card" :key="stateKey"/>
        </div>
        <div class="stars">
            <Stars :index="index" />
            <a :href="card.article_help" target="_blank" title="déscription détaillée du service | help"><fa icon="question-circle"/></a>
        </div>
    </div>
    <div class="logo-card">
        <fa :icon="card.icon" />
    </div>
    <div class="card-content">
        <a v-if="index != 'initpass'" :href="card.url_service">
            <div class="title-card" :id="index">{{card.long_name}}<fa icon="external-link-alt" /></div>
            <div class="info-card" v-if="card.link.URL != '' && !connectState">{{card.description}} <a :href="card.link.URL" id="a-vpn">{{card.link.text}}</a></div>
            <div class="info-card" v-else>{{card.description}}</div>
        </a>
        <div v-else @click="showModalPassChge">
            <div class="title-card" :id="index">{{card.long_name}}</div>
            <div class="info-card">{{card.description}}</div>
        </div>
    </div>
</template>

<script>
import Stars from '@/components/Stars.vue';
import BtnsONOFF from '@/components/BtnsONOFF.vue';

export default {
    props:[
        'card',
        'index'
    ],
    computed:{
        stateKey(){
            return this.$store.state.stateKey;
        },
    },
    components: {
        Stars,
        BtnsONOFF,
    },
    computed: {
        showPassChge(){
            return this.$store.state.showPassChgeStore;
        },

        // au changement de la varible de l'etat de connexion (ds le store) certains boutons apparaissent
        connectState(){
            return this.$store.state.connectState;
        },
    },
    methods: {
        // affichage modale changement password au click de la tuile initpass
        showModalPassChge() {
            this.$store.commit('SETSHOWPASSCHGESTORE', true)
        },
    },
};

</script>

<style lang="scss">
@import "../style/style.module.scss";
@import "../style/typo.scss";

.card-wrapper{
    font-family: "source", Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 450px;
    height: 220px;
    position: relative;
    overflow: hidden;
    border: 1px solid $bleuM;
    border-radius: 5px;
    margin: 2rem 1rem 0 1rem;
    @extend %shadowL;
    @extend %animate;
    &:hover{
        transform: scale(1.04);
    }
}

.banner{
    height: 15%;
    background-color: $bleuM;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .stars{
        display: flex;
    }

    .toggle{

        display: flex;
        justify-content: flex-end;

    }

    svg{
        margin-left: 0.3rem;
        font-size: 1.5rem;
        color: white;
        @extend %animate;
        @extend %hover;
    }
}

.logo-card{
    background-color: $vertM;
    border-radius: 40px;
    border: 4px solid white;
    width: 25px;
    padding: 10px;
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 15%;
    transform: translate(-50%, -50%);

    svg{
        font-size: 1.5rem;
        color: white;
    }
}

.card-content{
    height: 78%;
    
    @extend %animate;
    @extend %hoverL;
    &:hover a .title-card, &:hover div .title-card{
        color: $vertM;
    }

    a, div{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

   a .title-card, div .title-card{
        display: inline;
        font-family: "source", Avenir, Helvetica, Arial, sans-serif;
        font-weight: bold;
        color: $bleuM;
        font-size: 1.7rem;
        margin: 1.5rem 1rem 0 1rem;

        svg{
            font-size: 0.8rem;
            margin-left: 0.3rem;
        }
    }

    a .info-card, div .info-card{
        color: $black;
        margin:0 1.5rem 1rem 1.5rem;
        display: inline;
    }

    #a-vpn{
        text-decoration: underline;
    }
}

@media #{$xl}{
    .card-wrapper{
        width: 350px;
    }

    .logo-card{
        width: 25px;
        svg{
            font-size: 1.5rem;
        }
    }

    .card-content{
        a .title-card, div .title-card{
            font-size: 1.5rem;
        } 
    }
}

@media #{$xs}{

    .card-wrapper{
        width: 300px;
        margin: 1rem 0 0 0;
    }

    .card-content{

        a .title-card, div .title-card{
            font-size: 1.3rem;

        }

        a .info-card, div .info-card{
            font-size: .9rem;

        }
    }
}

@media #{$xxs}{
    .card-wrapper{
        width: 250px;
        margin: 1rem 0 0 0;
    }
}
</style>