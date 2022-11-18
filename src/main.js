import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

let pokemons;
let pokemonsFR;
let pokemonsEN;
fetch('https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv')
    .then((response) => response.text())
    .then((csv) => {

        pokemons = csvToJSON(csv)
        pokemonsFR = pokemons.filter(x => (x.local_language_id == 5))
        pokemonsEN = pokemons.filter(x => x.local_language_id == 9)

    }).then(() => {
    let app = createApp(App);
    app.config.globalProperties.$pokemonsFR = pokemonsFR;
    app.config.globalProperties.$pokemonsEN = pokemonsEN;
    app.use(router).mount('#app');
});

function csvToJSON(csv) {
    let lines = csv.split("\n");
    let result = [];
    let title = lines[0].split(",");
    for (let i = 1; i < lines.length; i++) {
        let json = {};
        let currentline = lines[i].split(",");
        for (let j = 0; j < title.length; j++) {
            json[title[j]] = currentline[j];
        }
        result.push(json);
    }
    return result;
}
