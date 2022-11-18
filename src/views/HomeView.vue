<template>
  <header-component></header-component>
  <main class="flex-shrink-0" id="main">
    <div class="w-75 p-3 d-flex m-auto container flex-column">
      <div class="row row-cols-1 row-cols-md-3 g-4" ref="column">
      </div>
      <div class="text-center m-auto" v-if="!loaded">
        <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
          <span class="sr-only"></span>
        </div>
      </div>
    </div>
  </main>
  <footer-component></footer-component>
</template>


<script>
import {createApp} from 'vue';
import CardComponent from "@/components/CardComponent";
import router from "@/router";
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";

export default {
  name: 'HomeView',
  components: {FooterComponent, HeaderComponent},
  data() {
    return {
      loaded: false,
      count: 1,
      countSup: 13,
      countMax: 905,
      flag: true,
      actualcount: 1,
      lang: "en"
    }
  },
  mounted() {
    this.changeLang(this.$route);
    this.$watch(() => this.$route, (toParams) => {
      this.changeLang(toParams);
    })

    fetch("https://pokeapi.co/api/v2/pokemon-species?limit=100000&offset=0")
        .catch(err => console.log(err))
        .then(resp => resp.text())
        .then((json) => {
          json = JSON.parse(json)
          this.countMax = json.count;
        })

    this.displayPokemons()
    document.title = "Le Meilleur Des Pokédex !"

    window.addEventListener('scroll', this.addPokemons
    )
  },
  methods: {
    changeLang(fullroute) {
      let route = fullroute.fullPath;
      if (route.includes("/fr")) {
        this.lang = "fr"
      } else {
        this.lang = "en"
      }
      this.count = 1;
      this.countSup = 13;
      this.flag = true;
      this.actualcount = 1;
      if (this.$refs['column'] !== null) this.$refs['column'].innerHTML = ""
      this.displayPokemons()
    },

    async displayPokemons() {
      this.loaded = false;
      for (let i = this.count; i < this.countSup; i++) {
        if (this.actualcount !== this.count) return
        this.count++;
        let [json1, json2] = await Promise.all([
          fetch('https://pokeapi.co/api/v2/pokemon-species/' + i),
          fetch('https://pokeapi.co/api/v2/pokemon/' + i)
        ]).catch(err => this.displayError(err))

        json1 = await json1.json();
        json2 = await json2.json();

        const div = document.createElement("div");

        const name = json1.names.filter(x => x.language.name === this.lang)[0].name;
        const flavor_text = json1.flavor_text_entries.filter(x => x.language.name === this.lang);
        let desc;
        if (flavor_text.length !== 0) {
          let text = flavor_text.at(Math.random() * (flavor_text.length)).flavor_text;
          desc = text.replace(/(\r\n|\n|\r)/gm, " ");
        }

        let cardComponent = createApp({extends: CardComponent}, {
          id: i,
          name: name,
          desc: desc,
          src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + i + ".png",
          alt: "Artwork officiel de " + name,
          weight: json2.weight / 10,
          height: json2.height / 10,
          lang: this.lang
        })

        cardComponent.use(router).mount(div)

        if (this.$refs['column'] !== null) this.$refs['column'].appendChild(div)
        this.actualcount++;
      }
      this.loaded = true;
      if (this.countSup <= this.countMax-12) this.countSup += 12;
    }
    ,

    addPokemons() {
      if ((window.innerHeight + window.scrollY) >= document.getElementById("main").offsetHeight) {
        if (this.flag) {
          this.flag = false;
          setTimeout(() => this.flag = true, 500)
          this.displayPokemons()
        }
      }
    }
  }
  ,
  unmounted() {
    window.removeEventListener("scroll", this.addPokemons);
  }
}
</script>

<style scoped>
#main {
  flex-grow: 1;
}
</style>
