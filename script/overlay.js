async function openCard(i) {
    cardIndex = i;
    document.getElementById('bodyId').style.overflow="hidden";
    let cardContentRef = document.getElementById('overlay');
    cardContentRef.classList.remove("display_none");
    cardContentRef.classList.add("poke_card_content");
 
    let pokeData= await fetch(`https://pokeapi.co/api/v2/pokemon/${i+1}`);
    pokeIndexArr = await pokeData.json();
    let pokeImg = pokeIndexArr.sprites.other.dream_world;
    let pokeType = pokeIndexArr.types[0].type;
 
    cardContentRef.innerHTML = getPokeCardTemplate(i, pokedexArr[i], pokeImg, pokeIndexArr, pokeType);
    let navElement =document.getElementById('aboutNav');
    navElement.classList.toggle('active_btn');
 
    getCardTypeElements(i);
    getAbilities(i);
 }
 
 
 function getCardTypeElements(index){
    let typeCardRef = document.getElementById(`elements_type${index}`);
    for (let i = 0; i < pokeIndexArr.types.length; i++) {
       let poketypeElements = pokeIndexArr.types;
       let type = poketypeElements[i].type;
       typeCardRef.innerHTML += getCardElementTemplate(type);
    }
 }
 
 function getAbilities(i){
    let spanRef = document.getElementById(`abilitiesSpan${i}`);
    for (let a = 0; a < pokeIndexArr.abilities.length; a++) {
       spanRef.innerHTML += `${pokeIndexArr.abilities[a].ability.name}, `
    }
 }
 
 function slideButton(direction){
    cardIndex += direction;
    if (cardIndex >= currentIndex) {
       cardIndex = 0;
     }
    if (cardIndex < 0) {
       cardIndex = currentIndex -1;
    }
    openCard(cardIndex);
 }
 
 function openBaseStatus(i){
    const { aboutRef, baseStatusRef, abilitiesRef, movesRef, aboutNav, baseNav ,abilitiesNav ,moveNav  } = navContentID();
    baseNav.classList.add('active_btn');
    aboutNav.classList.remove('active_btn');
    abilitiesNav.classList.remove('active_btn');
    moveNav.classList.remove('active_btn');
 
    aboutRef.classList.remove("content_box1");
    abilitiesRef.classList.remove("content_box3")
    aboutRef.classList.add("display_none");
    abilitiesRef.classList.add("display_none");
    baseStatusRef.classList.add("content_box2");
    movesRef.classList.remove("content_box4");
    movesRef.classList.add("display_none");
    renderBaseStatus();
 }
 
 function renderBaseStatus() {
    let baseName = document.getElementsByClassName("base_status_content")[0];
    let progressBar = document.getElementsByClassName("progressbar_box")[0];
    baseName.innerHTML ="";
    progressBar.innerHTML ="";
 
    pokeIndexArr.stats.forEach(stat => {
       baseName.innerHTML += getBaseNameTemplate(stat);
       progressBar.innerHTML += getBaseProgressbarTemplate(stat);
   });
 }
 
 async function openAbilities(i){
    const { aboutRef, baseStatusRef, abilitiesRef, movesRef, aboutNav, baseNav ,abilitiesNav ,moveNav  } = navContentID();
    baseNav.classList.remove('active_btn');
    aboutNav.classList.remove('active_btn');
    abilitiesNav.classList.add('active_btn');
    moveNav.classList.remove('active_btn');
 
    aboutRef.classList.remove("content_box1");
    aboutRef.classList.add("display_none");
    baseStatusRef.classList.remove("content_box2");
    baseStatusRef.classList.add("display_none");
    abilitiesRef.classList.add("content_box3");
    abilitiesRef.classList.remove("display_none");
    movesRef.classList.remove("content_box4");
    movesRef.classList.add("display_none");
 
    renderAbilities(abilitiesRef);
 }
 
 async function renderAbilities(content){
    content.innerHTML = "";
 for (let a = 0; a < pokeIndexArr.abilities.length; a++) {
    let ability = pokeIndexArr.abilities[a].ability.name;
    let effects = await fetchAbilitiesDataJson(pokeIndexArr.abilities[a]);
    content.innerHTML += getAbilitiesTemmplate(ability, effects);
 }}
 
 async function fetchAbilitiesDataJson(ability) {
       let response = await fetch(ability.ability.url);
       let responseAsJson = await response.json();
       return [responseAsJson.effect_entries[1].short_effect];   
 }
 
 function openMoves(i){
    const { aboutRef, baseStatusRef, abilitiesRef, movesRef, aboutNav, baseNav ,abilitiesNav ,moveNav } = navContentID();
    baseNav.classList.remove('active_btn');
    aboutNav.classList.remove('active_btn');
    abilitiesNav.classList.remove('active_btn');
    moveNav.classList.add('active_btn');
 
    aboutRef.classList.remove("content_box1");
    aboutRef.classList.add("display_none");
    baseStatusRef.classList.remove("content_box2");
    baseStatusRef.classList.add("display_none");
    abilitiesRef.classList.remove("content_box3");
    abilitiesRef.classList.add("display_none");
    movesRef.classList.add("content_box4");
    movesRef.classList.remove("display_none");
 
    renderOpenMoves();
 }
 
 function renderOpenMoves() {
    let movesBox = document.getElementById('moveBox');
 
    pokeIndexArr.moves.forEach(move=> {
       movesBox.innerHTML += getMovesTemplate(move);
       });
 }
 function renderOpenAbilities() {
   let contentBox3 = document.getElementById('content_box3');

   pokeIndexArr.abilities.forEach(abilities=> {
      contentBox3.innerHTML += getMovesTemplate(abilities);
      });
}
 
 function navContentID() {
    return {
        aboutRef: document.getElementById('navContent1'),
        baseStatusRef: document.getElementById('navContent2'),
        abilitiesRef: document.getElementById('navContent3'),
        movesRef: document.getElementById('navContent4'),
        aboutNav: document.getElementById('aboutNav'),
        baseNav: document.getElementById('baseNav'),
        abilitiesNav: document.getElementById('abilitiesNav'),
        moveNav: document.getElementById('moveNav'),
    };
 }
 
 function closePokeCard(){
    let closeCardContent = document.getElementById('overlay');
    closeCardContent.classList.add('display_none');
 
    document.getElementById('bodyId').style.overflow = "auto";
 }