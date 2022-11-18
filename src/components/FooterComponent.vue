<template>
  <footer class="footer w-100">
    <p>{{ dataText }} <a href="https://pokeapi.co/" target="_blank">pokeapi.co</a>.
    </p>
    <p>{{ loveText }}</p>
  </footer>
</template>

<script>
import languageFR from "@/assets/languageFR.json";
import languageEN from "@/assets/languageEN.json";

export default {
  name: "FooterComponent",
  data() {
    return {
      dataText: "",
      loveText: ""
    }
  },
  mounted() {
    //change lang at mounting if needed
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
      this.dataText = language.footer.data;
      this.loveText = language.footer.love;
    }
  }
}
</script>

<style scoped>
footer {
  background-color: #FF1C1C;
  border-top: solid black 5px;
  padding: 1em;
}

footer p {
  margin: auto !important;
}
</style>
