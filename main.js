
// animation en ajax on cache puis on fait un effet d'apparition
$('#meteo').hide();
$('#meteo').fadeIn('slow');


// declaration des variables
let ville = "";
let villeFr = [];
// let meteo = $('#cadreMeteo')[0];
// let btnValider = $('#valider')[0];
// let inputVille = $('#ville')[0];


// ajout des listeners
$('#valider')[0].addEventListener('click', appelMeteo);
$('#ville')[0].addEventListener('keydown', testKey);


// recuperation de la liste des villes francaise depuis le fichier liste.json pour l'autcompletion
$.getJSON('liste.json', (result) => { 
    let i = 0;
    while (result[i]){
        if (result[i].country === 'FRA'){
            villeFr.push(result[i].url);
        }
        i++;
    }
});


// fonction test sur la touche entrer dans l'input de ville
function testKey(e){
    if(e.keyCode === 13 ){
        appelMeteo();
    }
}


// appel a l'api meteo
function appelMeteo(){
    ville = $('#ville')[0].value;

    // methode $.get compact
    // $.get('https://www.prevision-meteo.ch/services/json/'+ ville,(response)=>{
    //     afficheMeteo(response);
    // });

    // methode $.ajax complete
    $.ajax({
        url: 'https://www.prevision-meteo.ch/services/json/'+ ville,
        type: 'GET',
        dataType: 'json',
        timeout: 1000,
        error: function(){alert('Erreur chargement'); },
        success: function(json){ afficheMeteo(json); console.log('reussite'+ json)}
    });

}


// affichage de la meteo en fonction de la reponse de l'api
function afficheMeteo(response){

    // on vide le precedent code html contenu dans la div cadreMeteo
    $('#cadreMeteo')[0].innerHTML = " ";

    // on cache la div le temps de remplir son contenu puis on appliquera l'effet 
    $('#cadreMeteo').hide();

    // test pour savoir si la ville est connue par l'api 
    try {
        // recuperation et affichage des données de la météo du jour
        $('#cadreMeteo').append(`<div id="jour"> ${response.fcst_day_0.day_long}</div>`);
        $('#cadreMeteo').append(`<div id="date"> ${response.current_condition.date}</div>`);
        $('#cadreMeteo').append(`<div id="heure"> ${response.current_condition.hour}</div>`);

        // let nomVille = document.createElement('div');
        // nomVille.id = "nomVille"
        // nomVille.innerHTML = 'Météo de '+response.city_info.name;
        // meteo.append(nomVille);
        $('#cadreMeteo').append(`<div id="nomVille">Météo de ${response.city_info.name}   ${response.city_info.country}</div>`);


        // let temperature = document.createElement('div');
        // temperature.innerHTML = 'Température : ' +response.current_condition.tmp+'°C';
        // meteo.append(temperature);
        $('#cadreMeteo').append(`<div id="temp">Température : ${response.current_condition.tmp}°C</div>`);

        // let icon = document.createElement('img');
        // icon.src = response.current_condition.icon;
        // meteo.append(icon);
        $('#cadreMeteo').append(`<img id="picto" src="${response.current_condition.icon_big}"></img>`);

        $('#cadreMeteo').append(`<div id="forecast"></div>`).hide()
        // recuperation des forecast dans une liste
        let listeForecast =[];
        listeForecast.push(response.fcst_day_0);
        listeForecast.push(response.fcst_day_1);
        listeForecast.push(response.fcst_day_2);
        listeForecast.push(response.fcst_day_3);
        listeForecast.push(response.fcst_day_4);

        // boucle sur la liste de forecast pour afficher les prochain jours
        for (let i=1 ; i<listeForecast.length;i++){
            $('#cadreMeteo').append(`<div id="forecast_${i}" class="forecast"></div>`);
            $(`#forecast_${i}`).append(`<div id="jour${i}"> ${listeForecast[i].day_long}</div>`);
            $(`#forecast_${i}`).append(`<div id="min${i}">Min ${listeForecast[i].tmin}°C</div>`);
            $(`#forecast_${i}`).append(`<div id="max${i}">Max ${listeForecast[i].tmax}°C</div>`);
            $(`#forecast_${i}`).append(`<img id="icon${i}" src="${listeForecast[i].icon}" >`);
        }
    } 
    // si la response ne permet pas d'afficher la ville on affiche un text par defaut
    catch (error) {
        // let erreur = document.createElement('div');
        // erreur.innerHTML = response.errors[0].text;
        // meteo.append(erreur);
        $('#cadreMeteo').append(`<div id="erreur">${response.errors[0].text}</div>`);

        // let description = document.createElement('div');
        // description.innerHTML = response.errors[0].description;
        // meteo.append(description);
        $('#cadreMeteo').append(`<div id="description">${response.errors[0].description}</div>`);


        // let listeVillesFR = document.createElement('input');
        // listeVillesFR.type = 'text';
        // listeVillesFR.id = 'myInput';
        // listeVillesFR.name = 'myCountry';
        // meteo.append(listeVillesFR);
        $('#cadreMeteo').append(`<input type="text" id="myInput" name="myCountry">`);


        // premier essai de recuperer la liste des villes via l'API 
        // remplacé par le fichier local liste.json 
        // let btnVillesPays = document.createElement('input');
        // btnVillesPays.value = 'liste des villes';
        // btnVillesPays.type = 'button';
        // btnVillesPays.addEventListener('click',listeVillePays);
        // meteo.append(btnVillesPays);

        // appel a la fonction autocomplete
        autocomplete(document.getElementById("myInput"), villeFr);
        
    }

    // pas besoin du script UI ligne 11 de lHTML
    // $('#cadreMeteo').fadeIn('slow');
    
    // script UI necessaire ligne 11 de lHTML
    $('#cadreMeteo').show("fold",1000);

}

// appel pour recuperer la liste des villes
// remplacé par le fichier liste.json
// function listeVillePays(){
//     $.ajax({
//         url: ' https://www.prevision-meteo.ch/services/json/list-cities',
//         type: 'POST',
//         dataType: 'json',
//         timeout: 500000,
//         error: function(){alert('Erreur chargement'); },
//         success: function(json){  afficheListeVille(json);}
//     });
// }

// function afficheListeVille(json){
//     console.log('reussite'+ json);
// }









/**************************************************************************************************************
 * 
 *   code pour auto complete copier sur https://www.w3schools.com/howto/howto_js_autocomplete.asp
 *   et mofidier pour nos besoin
 * 
 **************************************************************************************************************/









function autocomplete(inp, arr) { 
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();


                

                    /////////////////////////////////////////////////////////
                    // adaptation du code pour notre application personnel
                    /////////////////////////////////////////////////////////
                    $.get('https://www.prevision-meteo.ch/services/json/'+ inp.value,(response)=>{
                        afficheMeteo(response);
                    });
                    /////////////////////////////////////////////////////////
                    /////////////////////////////////////////////////////////



                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x){
             x = x.getElementsByTagName("div");
        }
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } 
        else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } 
        else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) {
                    x[currentFocus].click();
                }
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
} 




 