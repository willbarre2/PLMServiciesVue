<template>
  <div id="cont-cards">
    <!--conditions pour affichage des tuiles favorites ou touts. La key permet de rafraichire le composant depuis un autre (ignorer l'erreur de la key dédoublé) -->
    <CardsFav v-if="showFav" />
    <Cards v-else />
  </div>
  <ChangePassword />
  <ChangeStateService />
  <Alert/>
</template>

<script>
// @ is an alias to /src
import ChangePassword from '@/components/ChangePassword.vue';
import ChangeStateService from '@/components/ChangeStateService.vue';
import CardsFav from '@/components/CardsFav.vue';
import Cards from '@/components/Cards.vue';
import Alert from '@/components/Alert.vue';

export default {
  name: 'Home',
  components: {
    ChangePassword,
    ChangeStateService,
    CardsFav,
    Cards,
    Alert,
  },
  data(){
    return{
      showfav: false,
    };
  },
  computed: {
    showFav(){
        return this.$store.state.favActivated;
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../style/style.module.scss";
@import "../style/typo.scss";

#cont-cards{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
}
</style>
