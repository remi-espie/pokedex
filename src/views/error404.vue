<template>
  <header-component></header-component>
  <main><h1>{{error}}</h1></main>
  <footer-component></footer-component>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";
import languageFR from "@/assets/languageFR.json";
import languageEN from "@/assets/languageEN.json";

export default {
  name: "ErrorCode404",
  components: {FooterComponent, HeaderComponent},
  data(){
    return{
      error:""
    }
  },
  mounted() {
    //change lang at mounting if needed
    //load pokemons in changeLang function
    this.changeLang(this.$route)
    this.$watch(() => this.$route, (toParams) => {
      this.changeLang(toParams)
    })
  },
  methods:{
    /**
     * Change lang of parameters according to URL.
     * @param fullroute
     */
    changeLang(fullroute){
      let language;
      let route = fullroute.fullPath;
      if (route.includes("/fr")) {
        language = languageFR;
      } else {
        language = languageEN;
      }
      this.error = language.error.error404
    }
  }
}
</script>

<style scoped>

</style>
