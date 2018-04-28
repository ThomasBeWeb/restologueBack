$(document).ready(function () {
    showCartes();
    showAllMenus();

});

//VARIABLES
var menuChoisi;
var deleteMenuVar;

// Récupérer la liste de cartes et l'afficher
function showCartes() {

    var listeCartes;

    $.ajax({
        type: "GET",
        url: "https://whispering-anchorage-52809.herokuapp.com/cartes/get",
        async: false,
        success: function (data) {
            listeCartes = data;
        },
        error: function () {
            alert("erreur1");
        }
    });

    $("#listeCartes").empty();

    for (var i = 0; i < listeCartes.length; i++) {
        $("#listeCartes").append($("<li>")
                .append($("<a>")
                        .attr("href", "#")   //Le # permet de ne pas rafraichir entierement la page après le clic
                        .attr("onclick", "showMeACard(" + listeCartes[i].id + ");")
                        .html(listeCartes[i].nom))
                );
    }
}

// Ajouter une carte et relancer la fonction showCartes() + affichage de la carte à droite
function addCarte() {

    var newName = $("#nouveauNomCarte").val();
   
    if (newName !== "") {

        $.ajax({
            type: "GET",
            url: "https://whispering-anchorage-52809.herokuapp.com/cartes/add/" + newName,
            async: false,
            success: function (data) {
                showCartes();
                showMeACard(data.id);
                $("#nouveauNomCarte").val("");
            },
            error: function () {
            }
        });
    }
}

// requete pour afficher une carte après click dans liste gauche

function showMeACard(idCarte) {

    //Vide la carte déjà présente
    $("#listeMenusCarte").empty();
    $("#nomCarteEdit").val("");

    var carteAAfficher; //Carte à afficher avec les menus complets

    //Recuperation de la carte
    $.ajax({
        type: "GET",
        url: "https://whispering-anchorage-52809.herokuapp.com/cartes/" + idCarte + "/get",
        async: false,
        success: function (data) {
            carteAAfficher = data;
        },
        error: function () {
            alert("Impossible de récupérer cette carte");
        }
    });

    //Ajout du nom de la carte
    $("#nomCarteEdit").val(carteAAfficher.nom);

    //Modif de l'action du bouton supprimer
    $("#modalSuppCarte").attr("onclick", "deleteCarte(" + carteAAfficher.id + ");");

    //Affichage des menus dans le tableau si il y en a

    if (carteAAfficher.menu.length !== 0) {

        for (var i = 0; i < carteAAfficher.menu.length; i++) {

            //Creation d'une ligne par menu

            $("#listeMenusCarte").append($("<tr>")
                    .append($("<td>").text(carteAAfficher.menu[i].nom))
                    .append($("<td>")
                            .append($("<button>")
                                    .addClass("btn btn-danger")
                                    .attr("type", "button")
                                    .text("Supprimer")
                                    .attr("onclick", "") //AJOUTER FONCTION
                                    )
                            )
                    );
        }
    }
};

// requete pour afficher Tous les menus disponibles dans table du bas

function showAllMenus() {

    var listeMenus;

    $.ajax({
        type: "GET",
        url: "https://whispering-anchorage-52809.herokuapp.com/menus/get",
        async: false,
        success: function (data) {
            listeMenus = data;
        },
        error: function () {
            alert("Erreur dans la récupération des menus");
        }
    });

    $("#ligneMenu").empty();

    for (var i = 0; i < listeMenus.length; i++) {
        $("#ligneMenu").append($("<tr>")
            .append($("<td>").text(listeMenus[i].nom))
            .append($("<td>").text(listeMenus[i].entree.nom))
            .append($("<td>").text(listeMenus[i].plat.nom))
            .append($("<td>").text(listeMenus[i].dessert.nom))
            .append($("<td>")
                    .append($("<button>")
                            .addClass("btn btn-danger")
                            .attr("type", "button")
                            .text("Supprimer")
                            .attr("onclick", "") //AJOUTER FONCTION
                            )
                    )
            );
    }
}
