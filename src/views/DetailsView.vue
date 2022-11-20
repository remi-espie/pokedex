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
            <div class=" card-img-top m-auto hex" :style="'background-color:' + background +';'">
              <img class="pkmsprite" :src="src" :alt="altText + alt">
            </div>
            <div v-if="legendary">
              <hr>
              <div class="m-auto">
                <h4>{{ legendary }}</h4>
              </div>
            </div>
            <div v-if="varieties.length>0">
              <hr>
              <h4>{{ varietyText }}</h4>
              <div class="d-flex flex-row justify-content-center card-body w-75 m-auto p-0">
                <div class="d-flex flex-column m-2" v-for="(variety) in varieties" v-bind:key="variety.url">
                  <span class="m-auto">{{ variety.name }}</span>
                  <img :src="variety.url" :alt="variety.name" class="medium-image m-auto">
                </div>
              </div>
            </div>
            <hr>
            <div>
              <div v-if="evolve">
                <h4>{{ evolutionChainText }}:</h4>
                <div class="d-flex flex-column d-sm-flex flex-sm-row align-items-center m-auto"
                     style="width: min-content">
                  <div v-for="(evolution, index) in evolutionChain" v-bind:key="evolution.id"
                       class="d-flex flex-row d-sm-flex flex-sm-column align-items-center">
                    <div v-for="(evolution2) in evolution" v-bind:key="evolution2.id"
                         class="d-flex flex-column d-sm-flex flex-sm-row align-items-center">
                      <img v-if="index>0"
                           src="@/assets/arrow.svg"
                           alt="flèche directionnelle" class="rotate small-image m-2">
                      <router-link :to="'/'+this.lang+'/pokemon/' + evolution2.id"
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
      evolutionChain: [],
      varieties: [],
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
      translatedLang: "",
      countMax: 905
    }
  },
  mounted() {
    //change lang at mounting if needed
    this.changeLang(this.$route)
    this.$watch(() => this.$route, (toParams) => {
      this.changeLang(toParams)
    })

    // asynchronously get the actual count of pokemons from the API and update this.countMax with the value
    fetch("https://pokeapi.co/api/v2/pokemon-species?limit=100000&offset=0")
        .catch(err => console.log(err))
        .then(resp => resp.text())
        .then((json) => {
          json = JSON.parse(json)
          this.countMax = json.count;
        })

    //if ID is random, dispay a random pokemon
    //if ID is parsable as an int < max ID, display the pokemon of this ID
    //else display error
    if (this.$route.params.id === "random") {
      this.displayRandom();
    } else if (parseInt(this.$route.params.id) <= this.countMax) {
      this.displayPokemon(parseInt(this.$route.params.id))
    } else if (parseInt(this.$route.params.id) > this.countMax) {
      this.displayError("Id inexistant")
    } else this.displayError();

    //watch route to check if random is selected or id is changed
    this.$watch(() => this.$route.params, (toParams) => {
      if (toParams.id === "random") this.displayRandom();
      else if (parseInt(toParams.id) <= 905) this.displayPokemon(parseInt(toParams.id));
      else this.displayError();
    })
  },
  methods: {
    /**
     * Change lang of parameters according to URL.
     * @param fullroute
     */
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
      this.varietyText = language.details.variety
    },

    /**
     * Get a random number between 1 and 905
     * Replace the route to the pokemon of random number's ID details
     */
    displayRandom() {
      this.error = false;
      const random = Math.floor(Math.random() * 904 + 1)
      this.$router.replace({path: '/' + this.lang + '/pokemon/' + random})
    },

    /**
     * Display an error
     * Display the error err if defined, else display an error 404
     * @param err
     */
    displayError(err) {
      if (err !== undefined) this.errorText = err
      this.error = true;
      document.title = " Le Meilleur Des Pokédex ! | Error";
    },

    /**
     * Displays a pokemon of given ID
     * Gets its details, evolutions and types
     * @param id
     * @returns {Promise<void>}
     */
    async displayPokemon(id) {
      const FastAverageColor = require('fast-average-color').FastAverageColor;
      const fac = new FastAverageColor();
      this.loaded = false;
      this.evolve = false;
      this.evolutionChain = [];
      this.typeArray = [];
      let jsonEvolution = [];
      let [jsonSpecies, jsonPokemon] = await Promise.all([
        fetch('https://pokeapi.co/api/v2/pokemon-species/' + id),
        fetch('https://pokeapi.co/api/v2/pokemon/' + id)
      ]).catch(err => this.displayError(err))

      jsonSpecies = await jsonSpecies.json();
      jsonPokemon = await jsonPokemon.json();

      //create and array of data to fetch:
      //evolution chain if they exists and add url to fetch array
      //else set evolutionsExists to false
      //types of the pokemon
      let fetches = [];
      let evolutionsExists = true;
      if (jsonSpecies.evolution_chain == null) {
        fetches = [...jsonPokemon.types.map(type => type.type.url)]
        evolutionsExists = false
      } else {
        fetches = [jsonSpecies.evolution_chain.url, ...jsonPokemon.types.map(type => type.type.url)]
      }

      //await promise of all evolution and types fetches
      await Promise.all(fetches.map(url => fetch(url)))
          .catch(err => this.displayError(err))
          .then(responses => Promise.all(responses.map(res => res.text())))
          .then(json => {
            //if evolution exists, store evolutions in evolutionChain array
            //does so in array of array to deal with multiple evolution possibilities
            //and shift json to remove the evolution chain from the processing chain
            if (evolutionsExists) {
              let evolutionArray = [[]]
              let evolutionArray2 = []
              let evolutionArray3 = []
              jsonEvolution = JSON.parse(json[0])

              evolutionArray[0] = (this.storePokemonInArray(jsonEvolution.chain))
              this.evolutionChain.push(evolutionArray)

              //deals with multiple evolution possibilities in a 2 way array
              for (const evolution2 of jsonEvolution.chain.evolves_to) {
                evolutionArray2.push(this.storePokemonInArray(evolution2))
                for (const evolution3 of evolution2.evolves_to) {
                  evolutionArray3.push(this.storePokemonInArray(evolution3))
                }
              }
              this.evolutionChain.push(evolutionArray2)
              this.evolutionChain.push(evolutionArray3)
              if (this.evolutionChain[1].length > 0) this.evolve = true;
              json.shift()
            }

            //set type["lang"] text in english or french according to language
            //set type["en"] in lowercased english to direct to the image name
            for (const jsonElement of json) {
              let type = []
              type["en"] = JSON.parse(jsonElement).names.filter(x => x.language.name === "en")[0].name.toLowerCase();
              type["lang"] = JSON.parse(jsonElement).names.filter(x => x.language.name === this.lang)[0].name
              this.typeArray.push(type)
            }
          })

      //set legendary text to legendary and/or mythical
      if (jsonSpecies.is_legendary) {
        this.legendary = this.lengendaryText;
      } else if (jsonSpecies.is_mythical) {
        this.legendary = this.mythicalText;
      } else {
        this.legendary = "";
      }

      //set pokemon data
      this.id = id
      this.name = jsonSpecies.names.filter(x => x.language.name === this.lang)[0].name.toUpperCase();
      this.nameTranslated = jsonSpecies.names.filter(x => x.language.name === this.translatedLang)[0].name;
      this.nameJP = jsonSpecies.names.filter(x => x.language.name === "roomaji")[0].name;
      this.genus = jsonSpecies.genera.filter(x => x.language.name === this.lang)[0].genus
      this.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + id + ".png";

      //get average color of pokemon
      let color = await fac.getColorAsync(this.src);

      //set pokemon's image data
      this.alt = this.name;
      this.height = jsonPokemon.height / 10;
      this.weight = jsonPokemon.weight / 10;

      //set a random flavor text according to language
      let flavor_text = jsonSpecies.flavor_text_entries.filter(x => x.language.name === this.lang);
      if (flavor_text.length !== 0) {
        let text = flavor_text.at(Math.random() * (flavor_text.length)).flavor_text;
        this.desc = text.replace(/(\r\n|\n|\r)/gm, " ");
      }

      //set background color to average color of pokemon
      this.background = color.rgb;
      //change page title to pokemon and set page loaded
      document.title = " Le Meilleur Des Pokédex | " + this.name;

      //add varieties if they exists
      this.varieties = [];
      if (jsonSpecies.varieties.length > 1) {
        //add all varieties url to formFetches array
        let formFetches = [];
        for (const variety of jsonSpecies.varieties) {
          let id = variety.pokemon.url.split('/');
          id = id.pop() || id.pop();
          formFetches.push("https://pokeapi.co/api/v2/pokemon/" + id)
        }
        //fetch all pokemons of each forms
        let formFetches2 = []
        await Promise.all(formFetches.map(url => fetch(url)))
            .catch(err => this.displayError(err))
            .then(responses => Promise.all(responses.map(res => res.text())))
            .then(json => {
              for (let form of json) {
                form = JSON.parse(form)
                formFetches2.push(form.forms[0].url)
              }
            })
        //fetches all form to get their names
        await Promise.all(formFetches2.map(url => fetch(url)))
            .catch(err => this.displayError(err))
            .then(responses => Promise.all(responses.map(res => res.text())))
            .then(json => {
              for (let form of json) {
                form = JSON.parse(form)
                let array = [];
                let id = form.sprites.front_default.split('/');
                id = id.pop() || id.pop();
                array["url"] = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + id;
                if (form.form_names.length > 0) {
                  if (form.form_names.filter(x => x.language.name === this.lang)[0]) {
                    array["name"] = form.form_names.filter(x => x.language.name === this.lang)[0].name;
                  } else {
                    array["name"] = form.form_names[0].name
                  }
                } else array["name"] = this.name.charAt(0) + this.name.slice(1).toLowerCase();
                this.varieties.push(array);
              }
            })
      }

      //all data loaded
      this.loaded = true;
    },

    /**
     * Store a pokemonArray details in another array and return the later
     * @param pokemonArray
     * @returns {*[]}
     */
    storePokemonInArray(pokemonArray) {
      let evolutionArray = [];
      //get ID of evolution by taking the end
      let evolutionID = pokemonArray.species.url.split('/');
      evolutionID = evolutionID.pop() || evolutionID.pop();
      let name;
      if (this.lang === "fr") name = this.pokemonsFR.filter(x => x.pokemon_species_id === evolutionID)[0].name;
      else name = this.pokemonsEN.filter(x => x.pokemon_species_id === evolutionID)[0].name;
      evolutionArray['id'] = evolutionID;
      evolutionArray['name'] = name;
      evolutionArray['src'] = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + evolutionID + ".png";
      evolutionArray['alt'] = pokemonArray.species.name;

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

.medium-image {
  width: 100px;
}

.card {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
}

.card:hover {
  transform: unset;
}

.hex {
  clip-path: polygon(0 25%, 50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%);
  width: 30vw;
  height: 35vw;
  display: flex;
}

.hex img {
  width: 25vw;
  height: 25vw;
  margin: auto
}

#main {
  flex-grow: 1;
}
</style>
