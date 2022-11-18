<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light mb-4">
      <img id="pokeball" src="@/assets/pokeball.svg" alt="Pokéball">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/fr" id="titleIMG"><img src="@/assets/title.png"
                                                                      alt="Le Meilleur des Pokédex !">
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link :to="'/'+lang" class="nav-link active" aria-current="page">{{ homeText }}</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="'/'+lang+'/pokemon/random'" class="nav-link">{{ randomText }}</router-link>
            </li>
          </ul>
          <div class="nav-item d-flex align-items-center justify-content-center p-2">
            <router-link :to="/fr/ + this.$route.path.slice(4)" class="nav-link p-1">FR</router-link>
            <span> | </span>
            <router-link :to="/en/ + this.$route.path.slice(4)" class="nav-link p-1">EN</router-link>
          </div>
          <form class="d-flex">
            <input class="form-control me-2" type="text" :placeholder=placeholderText aria-label="search"
                   ref="search" v-on:keyup="displayPokemons" v-on:focusin="displayPokemons"
                   v-on:focusout="hidePokemons" v-on:keydown="doSearch($event)">
            <div v-show="displayResults" class="position-absolute ">
              <div id="result" ref="result"
                   class="position-absolute mt-lg-5 bg-light d-flex flex-column rounded p-2 border-dark">
                <router-link :to="'/'+lang+'/pokemon/' + pokemon.id" class="p-sm-1"
                             v-for="(pokemon) in pokemonArray" v-bind:key="pokemon">{{
                    pokemon.name
                  }}
                </router-link>
              </div>
            </div>
            <input type="button" class="btn btn-outline-light" v-on:click="searchPokemon" :value="searchText">
          </form>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import languageFR from "@/assets/languageFR.json";
import languageEN from "@/assets/languageEN.json";

export default {
  name: "HeaderComponent",
  data() {
    return {
      pokemonArray: [],
      displayResults: false,
      pokemonsFR: this.$pokemonsFR,
      pokemonsEN: this.$pokemonsEN,
      homeText: "",
      randomText: "",
      placeholderText: "",
      searchText: "",
      lang: "en"
    }
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
        this.lang = "fr"
      } else {
        language = languageEN;
        this.lang = "en"
      }
      document.documentElement.setAttribute("lang", this.lang);
      this.homeText = language.header.home;
      this.randomText = language.header.random;
      this.placeholderText = language.header.placeholder;
      this.searchText = language.header.search;
    },

    /**
     * Filter pokemon's list according to this.$refs['search'] value and return 10 results
     * @returns {Promise<void>}
     */
    displayPokemons() {
      //if this.$refs['search'] is empty, hide results
      if (this.$refs['search'].value === "" || this.$refs['search'].value == null) this.displayResults = false;
      else {
        let pokeArray;

        //select pokemons name according to language
        if (this.lang === "fr") pokeArray = this.pokemonsFR;
        else pokeArray = this.pokemonsEN;
        let search = this.$refs['search'].value

        //lowercase, normalize and replace every special letter by ascii ones for each pokeArray.name and result
        pokeArray.forEach(x => {
          x.nameNormalized = x.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "")
        })
        search = search.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "")

        //filter by normalized name OR pokemon id
        pokeArray = pokeArray.filter(x => x.nameNormalized.includes(search) || x.pokemon_species_id.includes(search)).splice(0, 10);

        //set pokeArray data to page data
        this.pokemonArray = []
        for (let i = 0; i < pokeArray.length; i++) {
          let pokemon = [];
          pokemon['id'] = pokeArray[i].pokemon_species_id;
          pokemon['name'] = pokeArray[i].name + " | #" + pokeArray[i].pokemon_species_id;
          this.pokemonArray.push(pokemon)
        }

        //set result width to search div and displays it
        this.$refs['result'].style.width = this.$refs['search'].offsetWidth + "px";
        this.displayResults = true;
      }
    },

    /**
     * hide result div after a few milliseconds
     */
    hidePokemons() {
      setTimeout(() => {
        this.displayResults = false;
      }, 250);
    },

    /**
     * prevent key event on searchbox and redirect to search page
     * @param event
     */
    doSearch(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.searchPokemon()
      }
    },

    /**
     * redirect to search page on search button click
     */
    searchPokemon() {
      if (this.$refs['search'].value !== "" && this.$refs['search'].value !== null) {
        this.$router.push({path: "/" + this.lang + "/search/" + this.$refs.search.value})
      }
    }
  },
  mounted() {
    //change lang and watch url change
    this.changeLang(this.$route);
    this.$watch(() => this.$route, (toParams) => {
      this.changeLang(toParams)
    })
  }
}
</script>

<style scoped>
nav {
  background-color: #FF1C1C;
  border-bottom: solid black 5px;
}

#pokeball {
  position: absolute;
  width: 75px;
  bottom: -40px;
  margin-left: calc(50vw - 37.5px);
  z-index: 5;
}

#result {
  z-index: 5;
  margin-top: 2rem;
  border-style: solid;
  border-width: 2px;
}

#result * {
  text-decoration: none;
}

#titleIMG {
  width: 25%;
}

#titleIMG img {
  width: 100%;
}

@media (max-width: 991.5px) {
  #titleIMG {
    width: 50%;
  }

  #pokeball {
    width: 50px;
    bottom: -27.5px;
    margin-left: calc(50vw - 25px);
  }
}
</style>
