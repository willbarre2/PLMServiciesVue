<template>
    <div id="wrapper-password-chge" :key="langKey" :class="{ hidden : !showHelpAccount }">
        <div class="cont-password cont-password-chge">
            <div class="cont-title-password">
                <p class="title-password" id="titlePassword">{{title}}</p>
                <fa :icon="['fas', 'times']" @click="closeHelpAccount" />
            </div>
            <p v-if="lang == 'fr'" class="text-password">
                <ul>
                    <li>Pour intégrer une personne dans votre unité :
                        <ul>
                            <li>cliquez sur Intégrer une personne</li>
                            <li>recherchez son nom et validez</li>
                            <li>la personne sera intégrée en tant qu'invitée (pas de droits d'accès aux revues)</li>
                            <li>pour une présence temporaire dans l'unité, précisez la date de départ (et d'arrivée), elle sera retirée automatiquement</li>
                            <li>si elle doit devenir membre de l'unité, changez son statut</li>
                            <li>il faudra alors la validation de l'unité d'appartenance de cette personne si elle n'est pas extérieure</li>
                        </ul>
                    </li>
                    <li>Vous pouvez déplacer un membre de votre unité vers tout autre unité</li>
                    <li>Vous pouvez transformer un membre en personne extérieure, ou simplement la supprimer de votre unité</li>
                    <li>Une personne est dite extérieure si elle n'est membre d'aucune unité</li>
                    <li>Un compte ne se supprime pas, il suffit de le retirer de votre unité, le compte persiste avec des droits réduits</li>
                    <li>Les comptes extérieurs non revalidés depuis plus d'un an sont supprimés</li>
                    <li>Une personne ne peut être membre que d'une unité et invitée dans plusieurs</li>
                    <li>Les créations de comptes se font soit par les personnes elles-même si leur email d'établissementest correctement renseigné dans l'annuaire des Personnes (même avec un mailAternateAddress) soit par <a href="https://portail.math.cnrs.fr/service/Guest">l'onglet Invitations</a></li>
                </ul>
                <p>Pour tout problème : mail à <a href="mailto:support_@_math.cnrs.fr">support_@_math.cnrs.fr</a> </p>
            </p>
            <p v-else class="text-password">
                <ul>
                    <li>To integrate a person in your unit :
                        <ul>
                            <li>click on Integrate a person</li>
                            <li>search for his name and validate</li>
                            <li>the person will be integrated as a guest (no access rights to journals)</li>
                            <li>for a temporary presence in the unit, specify the date of departure (and arrival), it will be automatically removed</li>
                            <li>if she has to become a member of the unit, change her status</li>
                            <li>you will need the validation of the unit to which this person belongs if he is not external</li>
                        </ul>
                    </li>
                    <li>You can move a member of your unit to any other unit</li>
                    <li>You can transform a member into an external person, or simply delete him from your unit</li>
                    <li>A person is said to be external if he is not a member of any unit</li>
                    <li>An account is not deleted, it's enough to remove it from your unit, the account persists with reduced rights</li>
                    <li>External accounts that have not been revalidated for more than a year are deleted</li>
                    <li>A person can only be a member of one unit and invited to several</li>
                    <li>The creation of accounts is done either by the persons themselves if their establishment email is correctly filled in the People directory (even with a mailAternateAddress) or by <a href="https://portail.math.cnrs.fr/service/Guest">the tab Invitations</a></li>
                </ul>
                <p>For any problem : mail to <a href="mailto:support_@_math.cnrs.fr">support_@_math.cnrs.fr</a> </p>
            </p>
        </div>
    </div>
</template>

<script>

export default {
    data(){
        return{
            title: null,
            langstore: 0,  
        };
    },
    mounted(){
        // requête pour textes celon langue
        this.getTexts();
    },
    computed: {
        showHelpAccount(){
            return this.$store.state.showHelpAccountStore;
        },

        // recharge composant à chaque changement de langue
        langKey(){
            this.langstore = this.$store.state.langKey;
        },

        lang(){
            return this.$store.state.lang;
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
        closeHelpAccount(){
            this.$store.commit('SETSHOWHELPACCOUNTSTORE', false)
        },

        //refait la requête pour les textes au changement de langue
        getTexts() {
            const axios = require('axios').default;
            axios
            .get("./I18n.json")
            .then((response) => {
                this.title = response.data[this.$store.state.lang].manageaccounts.help;
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
    height: 250%;
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
    width: 650px;
    border: 1px solid $bleuM;
    border-radius: 5px;
    background-color: white;
    margin: 2rem auto;
    @extend %shadowL;
}

.cont-password-chge{
    margin: 5rem auto;
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
    padding: 0 2rem 2rem 2rem;
    font-weight: normal;
    text-align: start;

    li {
        margin: 1rem 0;
        list-style: disc;
    }

    li li {
        margin: .2rem 0;
        list-style: circle;
        list-style-position: inside;
    }
}

@media #{$md}{
    .cont-password{
        width: 90%;

    }
}

@media #{$sm}{
    .cont-password{
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
}
</style>