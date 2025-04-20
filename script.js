let pokedexArr = [];
let pokedexIndexArr = [];
let currentIndex = 0;
let currentPokemon = 20;

function init() {
    fetchDataJson();
 }

async function fetchDataJson() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151&offset=0`);
    let responseAsJson = await response.json();
    pokedexArr = responseAsJson.results;
    renderPokemon(currentIndex, currentPokemon);
}

async function renderPokemon(startIndex, count) {
    let mainRef = document.getElementById('mainContainer');

    for (let i = startIndex; i < startIndex + count && i < pokedexArr.length; i++) {
        let pokeData = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
        pokedexIndexArr = await pokeData.json();
        let pokeImg = pokedexIndexArr.sprites.other.dream_world;
        let pokeType = pokedexIndexArr.types[0].type;
        let pokeTypes = pokedexIndexArr.types.map(type => type.type.name);
        mainRef.innerHTML += getPokedexTemplate(pokedexArr[i], i, pokeImg, pokeType, pokeTypes);
        getTypeElements(i, pokedexIndexArr);
    };
    currentIndex += count;
}

function getTypeElements(index, pokedexIndexArr) {
    let typeRef = document.getElementById(`elementContent${index}`);

    pokedexIndexArr.types.forEach(type => {
        typeRef.innerHTML += getPokeElementTemplate(type.type);
    });
}

async function loadMore() {
    openLoadingScreen();
    await renderPokemon(currentIndex, currentPokemon);
    closeLoadingScreen();
}

function openLoadingScreen() {
    let loadingScreenRef = document.getElementById('loadingScreen');
    loadingScreenRef.classList.add('load_screen');
    document.getElementById('bodyId').style.overflow = "hidden";
    loadingScreenRef.innerHTML = getLoadingscreen();

    let progressBar = document.getElementById('loadingProgressbar');
    renderProgressBar(progressBar);
}

function renderProgressBar(progressBar) {
    const targetWidth = 300;
    let width = 0;
    let interval = setInterval(() => {
        if (width >= targetWidth) {
            clearInterval(interval);
        } else {
            width++;
            progressBar.style.width = width + 'px';
        }
    }, 10);
}
function closeLoadingScreen() {
    let loadingScreenRef = document.getElementById('loadingScreen');
    loadingScreenRef.classList.remove('load_screen');
    document.getElementById('bodyId').style.overflow = "auto";
    loadingScreenRef.innerHTML = '';
}

async function getSearchValue(){
    let searchValue = document.getElementById('searchInput').value.toLowerCase();
    let errorContent = document.getElementById('errorContent');
 
    let filterValueArr = pokedexArr
    .map((pokemon, index) => ({ pokemon, originalIndex: index })) 
    .filter(item => item.pokemon.name.toLowerCase().startsWith(searchValue));
 
    if (handleEmptySearch(searchValue, errorContent)) {
       return;
    }
 
    if (filterValueArr.length === 0) {
       displayErrorMessage(errorContent, `"${searchValue}" not found`);
       return;
    }
 
    showFilteredResults(filterValueArr);  
 
    document.getElementById('searchInput').value = "";
 }
 async function showFilteredResults(filterValueArr) { 
    let mainRef = document.getElementById('mainContainer');
    let loadMoreBtn = document.getElementById('loadMoreBtn');
    let backBtn = document.getElementById('backBtn');
    mainRef.innerHTML= "";
    loadMoreBtn.classList.add('display_none');
    backBtn.classList.remove('display_none');
   
    for (let i = 0; i < filterValueArr.length; i++) {
       let valueIndex = filterValueArr[i].originalIndex;
       let pokeData= await fetch(`https://pokeapi.co/api/v2/pokemon/${valueIndex + 1}`);
       pokedexIndexArr = await pokeData.json();
       let pokeImg = pokedexIndexArr.sprites.other.dream_world;
       let pokeType = pokedexIndexArr.types[0].type;
       let pokeTypes = pokedexIndexArr.types.map(type => type.type.name);
       mainRef.innerHTML += getPokedexTemplate(pokedexArr[valueIndex], valueIndex, pokeImg, pokeType, pokeTypes);
       getTypeElements(valueIndex, pokedexIndexArr);
    };
 }
 
 function handleEmptySearch(searchValue, errorContent){
    if (!searchValue) {
       displayErrorMessage(errorContent, "Please enter a Pokémon name!");
       return true;
   }
   return false
 }
 
 function displayErrorMessage(errorContent, message){
    errorContent.innerText = message;
    setTimeout(() => {
    errorContent.innerHTML= "";
    }, 2000);
 }
 
 function backToContent(){
    let mainRef = document.getElementById('mainContainer');
    let loadMoreBtn = document.getElementById('loadMoreBtn');
    let backBtn = document.getElementById('backBtn');
    mainRef.innerHTML= "";
    loadMoreBtn.classList.remove('display_none');
    backBtn.classList.add('display_none');
    currentIndex= 0;
    init();
 }