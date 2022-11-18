<template>
  <header-component></header-component>
  <main class="flex-shrink-0" id="main">
    <div class="w-75 p-3 d-flex m-auto container">
      <div class="row row-cols-1 row-cols-md-1 g-4 m-auto" id="column">
        <div class="col">
          <div class="card w-100" v-if="loaded">
            <div class="card-header">
              <h4 class="position-absolute text-secondary">#{{ id }}</h4>
              <h4>{{ name }}</h4>
              <div class="d-flex justify-content-evenly">
                <h6>{{ nameTranslated }} ({{ nameTranslatedText }})</h6>
                <h6>{{ nameJP }} ({{ nameJPText }})</h6>
              </div>
            </div>
            <h5 class="card-header">{{ genus }}</h5>
            <h5 class="card-title pt-3">Type(s) :</h5>
            <div class="card-title d-flex flex-row justify-content-evenly">
              <div class="d-flex flex-column align-items-center" v-for="(type) in typeArray" v-bind:key="type.en">
                <img :src="require(`@/assets/types/${type.en}.svg`)" :alt="type.lang" class="small-image">
                <h5>{{ type.lang }}</h5>
              </div>
            </div>
            <div class="hex card-img-top m-auto">
              <div class="hex_shape">
                <div class="hex_shape">
                  <div class="hex_shape" :style="'background-color:' + background +';'">
                    <img class="rounded-0" :src="src" :alt="altText + alt">
                  </div>
                </div>
              </div>
            </div>
            <div v-if="legendary">
              <hr>
              <div class="m-auto">
                <h4>{{ legendary }}</h4>
              </div>
            </div>
            <hr>
            <div>
              <div v-if="evolve"><h4>{{ evolutionChainText }}:</h4>
                <div class="d-flex flex-column d-sm-flex flex-sm-row align-items-center m-auto"
                     style="width: min-content">
                  <div v-for="(evolution, index) in evolutionchain" v-bind:key="evolution.id"
                       class="d-flex flex-row d-sm-flex flex-sm-column align-items-center">
                    <div v-for="(evolution2) in evolution" v-bind:key="evolution2.id"
                         class="d-flex flex-column d-sm-flex flex-sm-row align-items-center">
                      <img v-if="index>0"
                           src="@/assets/arrow.svg"
                           alt="flèche directionnelle" class="rotate small-image m-2">
                      <router-link :to="'/fr/pokemon/' + evolution2.id"
                                   class="d-flex flex-column m-auto align-items-center">
                        <span>{{ evolution2.name }}</span>
                        <img :src=evolution2.src :alt="altText +evolution2.alt" class="small-image">
                      </router-link>

                    </div>
                  </div>
                </div>
              </div>
              <h4 v-else>{{ noEvolutionText }}</h4>
            </div>
            <div v-if="desc">
              <hr>
              <div class="card-body w-75 m-auto">
                <p>{{ desc }}</p>
              </div>
            </div>
            <div class="card-footer d-flex flex-column">
              <span>{{ heightText }}: {{ height }}m</span>
              <span>{{ weightText }}: {{ weight }}kg</span>
            </div>
          </div>
          <h2 class="text-center" v-else-if="error">{{ errorText }}</h2>
          <div class="text-center" v-else>
            <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
              <span class="sr-only"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <footer-component></footer-component>
</template>


<script>
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";
import languageFR from "@/assets/languageFR.json";
import languageEN from "@/assets/languageEN.json";

export default {
  name: 'DetailsView',
  components: {FooterComponent, HeaderComponent},
  data() {
    return {
      error: false,
      id: "",
      src: "",
      background: "",
      name: "",
      nameTranslated: "",
      nameJP: "",
      genus: "",
      legendary: false,
      lengendaryText: "",
      mythicalText: "",
      desc: "",
      alt: "",
      typeArray: [],
      weight: "",
      height: "",
      evolutionchain: [],
      rotate: "rotate",
      evolve: false,
      loaded: false,
      pokemonsFR: this.$pokemonsFR,
      pokemonsEN: this.$pokemonsEN,
      nameJPText: "",
      nameTranslatedText: "",
      altText: "",
      evolutionChainText: "",
      noEvolutionText: "",
      heightText: "",
      weightText: "",
      errorText: "",
      lang: "en",
      translatedLang: ""
    }
  },
  mounted() {
    this.changeLang(this.$route)
    this.$watch(() => this.$route, (toParams) => {
      this.changeLang(toParams)
    })

    if (this.$route.params.id === "random") {
      this.displayRandom();
    } else if (parseInt(this.$route.params.id)) {
      this.displayPokemon(parseInt(this.$route.params.id))
    } else this.displayError();
    this.$watch(() => this.$route.params, (toParams) => {
      if (toParams.id === "random") this.displayRandom();
      else if (parseInt(toParams.id)) this.displayPokemon(parseInt(toParams.id));
      else this.displayError();
    })
  },
  methods: {
    changeLang(fullroute) {
      let language;
      let route = fullroute.fullPath;
      if (route.includes("/fr")) {
        language = languageFR;
        this.lang = "fr";
        this.translatedLang = "en";
      } else {
        language = languageEN;
        this.lang = "en"
        this.translatedLang = "fr";
      }
      this.nameJPText = language.details.nameJP;
      this.nameTranslatedText = language.details.nameTranslated
      this.altText = language.details.alt;
      this.lengendaryText = language.details.legendary;
      this.mythicalText = language.details.mythical
      this.evolutionChainText = language.details.evolutionChain;
      this.noEvolutionText = language.details.noEvolution;
      this.heightText = language.details.height;
      this.weightText = language.details.weight;
      this.errorText = language.details.error;
    },

    displayRandom() {
      this.error = false;
      const random = Math.floor(Math.random() * 904 + 1)
      this.$router.replace({path: '/' + this.lang + '/pokemon/' + random})
    },

    displayError(err) {
      if (err !== "") this.errorText = err
      this.error = true;
      document.title = " Le Meilleur Des Pokédex ! | Error";
    },

    async displayPokemon(id) {
      const FastAverageColor = require('fast-average-color').FastAverageColor;
      const fac = new FastAverageColor();
      this.loaded = false;
      this.evolve = false;
      this.evolutionchain = [];
      this.typeArray = [];
      let jsonEvolution = [];
      let [jsonSpecies, jsonPokemon] = await Promise.all([
        fetch('https://pokeapi.co/api/v2/pokemon-species/' + id),
        fetch('https://pokeapi.co/api/v2/pokemon/' + id)
      ]).catch(err => this.displayError(err))

      jsonSpecies = await jsonSpecies.json();
      jsonPokemon = await jsonPokemon.json();

      let fetches = [];
      let evolutionsexists = true;
      if (jsonSpecies.evolution_chain == null) {
        fetches = [...jsonPokemon.types.map(type => type.type.url)]
        evolutionsexists = false
      } else {
        fetches = [jsonSpecies.evolution_chain.url, ...jsonPokemon.types.map(type => type.type.url)]
      }


      await Promise.all(fetches.map(url => fetch(url)))
          .catch(err => this.displayError(err))
          .then(responses => Promise.all(responses.map(res => res.text())))
          .then(json => {
            if (evolutionsexists) {
              let evolutionArray = [[]]
              let evolutionArray2 = []
              let evolutionArray3 = []
              jsonEvolution = JSON.parse(json[0])

              evolutionArray[0] = (this.storePokemonInArray(jsonEvolution.chain))
              this.evolutionchain.push(evolutionArray)

              for (const evolution2 of jsonEvolution.chain.evolves_to) {
                evolutionArray2.push(this.storePokemonInArray(evolution2))
                for (const evolution3 of evolution2.evolves_to) {
                  evolutionArray3.push(this.storePokemonInArray(evolution3))
                }
              }
              this.evolutionchain.push(evolutionArray2)
              this.evolutionchain.push(evolutionArray3)
              if (this.evolutionchain[1].length > 0) this.evolve = true;
              json.shift()
            }

            for (const jsonElement of json) {
              let type = []
              type["en"] = JSON.parse(jsonElement).names.filter(x => x.language.name === "en")[0].name.toLowerCase();
              type["lang"] = JSON.parse(jsonElement).names.filter(x => x.language.name === this.lang)[0].name
              this.typeArray.push(type)
            }
          })

      if (jsonSpecies.is_legendary) {
        this.legendary = this.lengendaryText;
      }
      if (jsonSpecies.is_mythical) {
        this.legendary = this.mythicalText;
      }

      this.id = id
      this.name = jsonSpecies.names.filter(x => x.language.name === this.lang)[0].name.toUpperCase();
      this.nameTranslated = jsonSpecies.names.filter(x => x.language.name === this.translatedLang)[0].name;
      this.nameJP = jsonSpecies.names.filter(x => x.language.name === "roomaji")[0].name;
      this.genus = jsonSpecies.genera.filter(x => x.language.name === this.lang)[0].genus
      this.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + id + ".png";

      let color = await fac.getColorAsync(this.src);

      this.alt = this.name;
      this.height = jsonPokemon.height / 10;
      this.weight = jsonPokemon.weight / 10;

      let flavor_text = jsonSpecies.flavor_text_entries.filter(x => x.language.name === this.lang);
      if (flavor_text.length !== 0) {
        let text = flavor_text.at(Math.random() * (flavor_text.length)).flavor_text;
        this.desc = text.replace(/(\r\n|\n|\r)/gm, " ");
      }


      this.background = color.rgb;
      document.title = " Le Meilleur Des Pokédex | " + this.name;
      this.loaded = true;
    },

    storePokemonInArray(array) {
      let evolutionArray = [];
      let evolutionID = array.species.url.split('/');
      evolutionID = evolutionID.pop() || evolutionID.pop();
      let name;
      if (this.lang === "fr") name = this.pokemonsFR.filter(x => x.pokemon_species_id === evolutionID)[0].name;
      else name = this.pokemonsEN.filter(x => x.pokemon_species_id === evolutionID)[0].name;
      evolutionArray['id'] = evolutionID;
      evolutionArray['name'] = name;
      evolutionArray['src'] = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + evolutionID + ".png";
      evolutionArray['alt'] = array.species.name;

      return evolutionArray;
    }
  }
}

</script>

<style scoped>
@media (max-width: 575.5px) {
  .rotate {
    transform: rotate(90deg);
  }
}

.small-image {
  width: 50px;
}

.card {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
}

.card:hover {
  transform: unset;
}

.hex {
  position: relative;
  width: 30vw;
  height: 35vw;
}

.hex img {
  left: 50%;
  position: relative;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.85, 0.85);
  width: 100%;
}

.hex_shape {
  position: absolute;
  backface-visibility: hidden;
  left: 0;
  height: 100%;
  overflow: hidden;
  top: 0;
  transform: rotate(120deg);
  width: 100%;
}

#main {
  flex-grow: 1;
}
</style>
