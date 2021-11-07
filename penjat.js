
//Variables i constants
//Variables per la compta enrere
const MINUTS_MAX = 0.50;
var temps = MINUTS_MAX*60
const COMPTA_ENRERE = document.getElementById('comptaEnrere');

//Variables del core del programa
const PARAULES = ["llarg","mongodb","xpath","oracle","java","tarantula","homeostasi","xiuxiuejar","atzavara"]
var resposta = '' //Variable que emmagatzema la paraula triada aleatòriament
var respostaAnterior = '' //Variable qu emmagatzema la paraula anterior
var maxIntents = 5 //Intents permesos abans de perdre
var errors = 0 //Errors actuals
var endevinat = [] //Array que guarda les lletres endevinades
var estatParaula = '' //Variable que guarda l'estat de la partida, és a dir, quantes lletres són desconegudes i quines han sigut descobertes
var pista = '' //Variable d'assignació d'un Char de pista
var pistesAnterior = [] //Array de Char amb les pistes donades emmagatzemades
var estatParaulaComptador = 0 //Variable que guarda quantes lletres s'han descobert
var pistesComptador = 0 //Variable que guarda quantes pistes s'han donat


//Inicialitzacions de funcions i elements
document.getElementById('maxIntents').innerHTML = maxIntents

var comptaEnrere = setInterval(comptaEnrere, 1000)
triarParaula()
generarBotons()
adivinaParaula()


//Funcions
//Funció que assigna la paraula a endevinar de forma aleatòria i mai serà com la paraula anterior
function triarParaula(){
    resposta = PARAULES[Math.floor(Math.random()*PARAULES.length)]
    while(resposta==respostaAnterior){
        resposta = PARAULES[Math.floor(Math.random()*PARAULES.length)]
    }
    respostaAnterior=resposta;
}

//Funció que genera tots els botons referents a les lletres del abecedari
function generarBotons(){
    /**
     * Faig un split per separar les lletres i posar-les en un array i després faig la creació de cada botó per lletra. Un cop creat ho
     * afegeixo a la pàgina. Cada botó té la lletra pertinent com a ID i cada clic als botons assigna la lletra pertinent.
     * 
     * Cada boto quan el cliques executa la funció 'comLletra' la qual determina si la lletra presionada és correcta o no.
     */
    var botons = 'abcçdefghijklmnopqrstuvwxyz'.split('').map(lletra => 
        ` 
            <button
                class="btn btn-lg btn-dark m-2"
                id='` + lletra + `'
                onClick="comLletra('` +lletra+ `')"
            >
                ` +lletra+ `
            </button>
        `).join('') //Per treure les cometes que surten haig de fer el join, ja que imprimeixo un array
    document.getElementById('lletres').innerHTML = botons
}

//Funció que comprova si la lletra introduïda és correcte i suma error o afegeix la lletra en cas de ser correcte
function comLletra(lletraTriada){
    //En cas de que la lletra no existeixi prèviament s'afegeix al array però si ja existeix (:) doncs no es fa res
    endevinat.indexOf(lletraTriada) == -1 ? endevinat.push(lletraTriada) : null 

    //I deshabilito el botó de la lletra triada
    document.getElementById(lletraTriada).setAttribute('disabled',true)

    //Reinici de la compta enrere
    temps = MINUTS_MAX*60 

    if(resposta.indexOf(lletraTriada)>=0){ //Si la lletra és correcta
        adivinaParaula() //Crido la funció 'adivinarParaula' per actualitzar les lletres
        revisarGuanyat()
    }else if(resposta.indexOf(lletraTriada) == -1){ //Si la lletra és incorrecta
        errors++
        actualitzarErrors()
        actualitzarImatge()
        revisarPerdut()
    }
}

//Array que imprimeix els '_' per cada lletra a endevinar que quedi
function adivinaParaula(){
    /*Totes les lletres de resposta, en cas de no haver sigut assignades a 'estatParaula' s'assignen amb un '_' 
    * i si s'han descovert ('endevinat') doncs les assigna a la seva posició pertinent 
    */
    estatParaula = resposta.split('').map(lletra => (endevinat.indexOf(lletra) >=0 ? lletra : " _ ")).join('') 

    document.getElementById('paraulaAdivinar').innerHTML = estatParaula
}

//Funció que mostra la quantitat d'errors a la pàgina
function actualitzarErrors(){
    if(errors>maxIntents){
        errors = maxIntents
    }
    document.getElementById("errors").innerHTML = errors

}

//Funció que mostra la imatge segons els errors que es tinguin
function actualitzarImatge(){
    document.getElementById("penjat").src = './imatges/'+ errors +'.png'
}

//Funció que determina si hi ha guanyador i si és el cas ho mostra per pantalla
function revisarGuanyat(){ 
    if(estatParaula == resposta){ 
        document.getElementById("lletres").innerHTML = "HAS GUANYAT!!"
    }
}

//Funció que determina si s'ha perdut, si és el cas ho mostra per pantalla i mostra la ultima imatge
function revisarPerdut(){ 
    if(errors >= maxIntents){ 
        document.getElementById("pista").setAttribute('disabled',true) //Deshabilitació del botó de donar pista
        document.getElementById("lletres").innerHTML = "La paraula era: "+resposta 
        document.getElementById("endevinaParaula").style.visibility = "hidden"
        document.getElementById("paraulaAdivinar").innerHTML = "Has perdut ;("
        document.getElementById('penjat').src = "./imatges/"+maxIntents+".png"    
    }
}

//Funció que reinicia els components de la pàgina per poder començar una nova partida
function reiniciar(){
    errors = 0
    endevinat = []
    estatParaulaComptador=0
    pistesComptador=0
    pistesAnterior = []
    temps = MINUTS_MAX*60 
    
    document.getElementById('penjat').src = "./imatges/0.png"
    document.getElementById("pista_donada").innerHTML= "Pista: "
    document.getElementById("pista").disabled = false
    
    triarParaula()
    adivinaParaula()
    actualitzarErrors()
    generarBotons()
    
}

//Funció que mostra una lletra no descoberta de la resposta al usuari i afageix +2 al comptador d'errors per cada pista demanada
function demanarPista(){
    
    pistesComptador = pistesAnterior.length
    var comptador = lletresDescobertes()+pistesComptador
    
    if(comptador<resposta.length){
        while(estatParaula.includes(pista) || pistesAnterior.includes(pista)){
            pista = resposta.charAt(Math.random()*resposta.length)
            
        }
        document.getElementById("pista_donada").innerHTML+=" - " + pista
        pistesAnterior.push(pista)
        errors += 2
        actualitzarErrors()
        actualitzarImatge()
        revisarPerdut()
    }else{
        alert("Ja has demanat totes les pistes possibles.") 
    }   
}

//Funció que retorna la quanitat de lletres descobertes per l'usuari
function lletresDescobertes(){
    estatParaulaComptador=0
    for(var x=0;x<estatParaula.length;x++){
        if(estatParaula[x]>='a' && estatParaula[x]<='z' || estatParaula[x]=="ç"){
            estatParaulaComptador++ 
        }
    }
    return estatParaulaComptador
}   

//Funció que fa un compta enrere per lletra, si el comptador arriba a 0 es selecciona una lletra aleatòria
function comptaEnrere(){
    const MINUTS = Math.floor(temps/60)
    var segons = temps % 60

    segons = segons<10 ? '0' + segons : segons //'?' = then / ':' = else
    
    COMPTA_ENRERE.innerHTML = `${MINUTS}:${segons}` //impressió dels minuts i els sagons amb format MM:SS
    temps--

    if(temps < 0){
        const alfabet = "abcçdefghijklmnopqrstuvwxyz"

        const lletraAleatoria = alfabet[Math.floor(Math.random() * alfabet.length)]
        document.getElementById(lletraAleatoria).click();
        temps = MINUTS_MAX*60
    }
}

//Funció de keyListeners de cada lletra de l'alfabet acceptada , 'Enter' per reiniciar i 'Shift' per demanar una pista
addEventListener("keydown", function (event) {
    switch (event.key) {
        case "a": 
        document.getElementById("a").click();
        break;
        case "b": 
        document.getElementById("b").click();
        break;
        case "c": 
        document.getElementById("c").click();
        break;
        case "ç": 
        document.getElementById("ç").click();
        break;
        case "d": 
        document.getElementById("d").click();
        break;
        case "e": 
        document.getElementById("e").click();
        break;
        case "f": 
        document.getElementById("f").click();
        break;
        case "g": 
        document.getElementById("g").click();
        break;
        case "h": 
        document.getElementById("h").click();
        break;
        case "i": 
        document.getElementById("i").click();
        break;
        case "j": 
        document.getElementById("j").click();
        break;
        case "k": 
        document.getElementById("k").click();
        break;
        case "l": 
        document.getElementById("l").click();
        break;
        case "m": 
        document.getElementById("m").click();
        break;
        case "n": 
        document.getElementById("n").click();
        break;
        case "o": 
        document.getElementById("o").click();
        break;
        case "p": 
        document.getElementById("p").click();
        break;
        case "q": 
        document.getElementById("q").click();
        break;
        case "r": 
        document.getElementById("r").click();
        break;
        case "s": 
        document.getElementById("s").click();
        break;
        case "t": 
        document.getElementById("t").click();
        break;
        case "u": 
        document.getElementById("u").click();
        break;
        case "v": 
        document.getElementById("v").click();
        break;
        case "w": 
        document.getElementById("w").click();
        break;
        case "x": 
        document.getElementById("x").click();
        break;
        case "y": 
        document.getElementById("y").click();
        break;
        case "z": 
        document.getElementById("z").click();
        break;
        case "Enter": 
        document.getElementById("reiniciar").click();
        break;
        case "Shift": 
        document.getElementById("pista").click();
        break;
    }
});

