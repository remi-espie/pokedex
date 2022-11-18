<template>
  <h1>Language redirection...</h1>

</template>

<script>
export default {
  name: "languageRedirect",
  created() {
    if (window.navigator.language==="fr"){
      this.$router.replace({path:"/fr/"})
      document.documentElement.setAttribute("lang", 'fr');
    }
    else {
      this.$router.replace({path:"/en/"})
      document.documentElement.setAttribute("lang", 'en');
    }
  }
}
</script>

<style scoped>

</style>