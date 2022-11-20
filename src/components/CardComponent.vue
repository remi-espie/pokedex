<template>
  <div class="col">
    <router-link :to="'/'+lang+'/pokemon/' + id" class="card">
      <div class="card-header">
        <h4 class="position-absolute card-title">#{{ id }}</h4>
        <h4>{{ name }}</h4>
      </div>
      <img class="card-img-top"
           :src="src"
           :alt="alt">
      <div class="card-body">
        <p>{{ desc }}</p>
      </div>
      <div class="card-footer d-flex flex-column">
        <span>{{ heightText }}: {{ height }}m</span>
        <span>{{ weightText }}: {{ weight }}kg</span>
      </div>
    </router-link>
  </div>
</template>

<script>
import languageFR from '@/assets/languageFR.json'
import languageEN from '@/assets/languageEN.json'

export default {
  name: "CardComponent",
  //data needed for the card
  props: {
    id: Number,
    src: String,
    name: String,
    desc: String,
    alt: String,
    height: Number,
    weight: Number,
    lang: String
  },
  data() {
    return {
      heightText: "",
      weightText: "",
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
      this.heightText = language.card.height
      this.weightText = language.card.weight
    }
  }
}
</script>

<style>
.card-title{
  right: 10px;
}
.card{
  text-decoration: none;
  color: unset;
  transition: 0.25s;
}

.card:hover{
  text-decoration: none;
  color: unset;

  box-shadow: 0 0 15px rgba(0,0,0,0.5);
  transform: translateY(-5px);
  transition: 0.25s;
}
</style>
