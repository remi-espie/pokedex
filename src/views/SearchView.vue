<template>
  <header-component></header-component>
  <main class="flex-shrink-0" id="main">
    <div class="w-75 p-3 d-flex m-auto container flex-column">
      <div class="row row-cols-1 row-cols-md-3 g-4" ref="column">
      </div>
      <h2 v-if="noPokemon" class="p-4 m-auto w-75">{{noPokemonText}}</h2>
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
import languageFR from "@/assets/languageFR.json";
import languageEN from "@/assets/languageEN.json";

export default {
  name: "SearchView",
  components: {FooterComponent, HeaderComponent},
  data() {
    return {
      loaded: false,
      lang: "en",
      pokemonsFR: this.$pokemonsFR,
      pokemonsEN: this.$pokemonsEN,
      noPokemonText : "",
      noPokemon : false
    }
  },
  methods: {
    changeLang(fullroute) {
      let language;
      let route = fullroute.fullPath;
      if (route.includes("/fr")) {
        language = languageFR;
        this.lang = "fr"
      } else {
        language = languageEN;
        this.lang = "en"
      }
      this.noPokemonText = language.error.noPokemon;
      document.documentElement.setAttribute("lang", this.lang);
    },
    async displayPokemons() {
      this.loaded = false;
      if (this.$refs['column'] !== null) this.$refs['column'].innerHTML="";
      let pokearray;
      if (this.lang === "fr") pokearray = this.pokemonsFR;
      else pokearray = this.pokemonsEN;
      pokearray = pokearray.filter(x => x.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").includes(this.$route.params.search.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "")) || x.pokemon_species_id.includes(this.$route.params.search)).splice(0, 24);

      this.noPokemon = pokearray.length === 0;

      if (pokearray.length===1) this.$router.push("/" + this.lang + "/pokemon/" + pokearray[0].pokemon_species_id)

      for (const pokemon of pokearray) {
        let [json1, json2] = await Promise.all([
          fetch('https://pokeapi.co/api/v2/pokemon-species/' + pokemon.pokemon_species_id),
          fetch('https://pokeapi.co/api/v2/pokemon/' + pokemon.pokemon_species_id)
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
          id: parseInt(pokemon.pokemon_species_id),
          name: name,
          desc: desc,
          src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + pokemon.pokemon_species_id + ".png",
          alt: "Artwork officiel de " + name,
          weight: json2.weight / 10,
          height: json2.height / 10,
          lang: this.lang
        })

        cardComponent.use(router).mount(div)

        if (this.$refs['column'] !== null) this.$refs['column'].appendChild(div);
      }
      this.loaded = true;
    }
  },
  mounted() {
    this.changeLang(this.$route);
    this.$watch(() => this.$route, (toParams) => {
      this.changeLang(toParams);
      this.displayPokemons()
    })
    this.displayPokemons()
  },

}
</script>

<style scoped>
#main{
  flex-grow: 1;
}
</style>
