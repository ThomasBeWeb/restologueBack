$(document).ready(function () {
    showCartes();
    showAllMenus();
});

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

        $("#listeCartes").append($("<button>")
            .addClass("btn btn-outline-info btn-sm btn-block boutonCarte")
            .attr("type", "button")
            .text(listeCartes[i].nom)
            .attr("onclick", "showMeACard(" + listeCartes[i].id + ");")
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

    //Mise en memoire de l'id de la carte selectionnee dans l'input stockIDCarte
    $("#stockIDCarte").val(carteAAfficher.id);

    //Ajout du nom de la carte
    $("#nomCarteEdit").val(carteAAfficher.nom);

    //Activation et modif de l'action du bouton supprimer
    $("#modalSuppCarte").removeAttr('disabled');
    $("#modalSuppCarte").attr("aria-disabled", false)
    $("#modalSuppCarte").attr("onclick", "deleteCarCheck(" + carteAAfficher.id + ");");

    //Affichage des menus dans le tableau si il y en a

    if (carteAAfficher.menu.length !== 0) {

        for (var i = 0; i < carteAAfficher.menu.length; i++) {

            //Creation d'une ligne par menu

            $("#listeMenusCarte").append($("<tr>")
                .append($("<td>").text(carteAAfficher.menu[i].nom))
                .append($("<td>")
                    .append($("<button>")
                        .addClass("btn btn-outline-danger btn-sm")
                        .attr("type", "button")
                        .text("Retirer")
                        .attr("onclick", "retireMenu(" + carteAAfficher.menu[i].id + ");")
                    )
                )
            );
        }
    }
};

//Supprimer definitivement une carte => Modal de confirmation
function deleteCarCheck(idCarte) {

    //Recup du nom de la carte
    $carteToDelete = $("#nomCarteEdit").val();

    //affichage confirmation
    $("#confirmDeleteCard").text("Etes vous sûr de vouloir supprimer la carte " + $carteToDelete + " ?");

    //Modif de l'action du bouton Supprimer
    $("#deleteCardButt").attr("onclick", "deleteCardForGood(" + idCarte + ");")
};

//Supprimer definitivement une carte => Action
function deleteCardForGood(idCarte){

    $.ajax({
        type: "GET",
        url: "https://whispering-anchorage-52809.herokuapp.com/cartes/" + idCarte + "/remove",
        async: false,
        success: function () {
            //RAZ des infos carte et de sa liste de menus
            $("#nomCarteEdit").val("");
            $("#stockIDCarte").val(0);
            $("#listeMenusCarte").empty();

            //Affichage de la liste de carte mise à jour
            showCartes();

            //Bouton supprimer disabled
            $("#modalSuppCarte").attr("aria-disabled", true)
            $("#modalSuppCarte").prop("disabled", true);

            //Fermeture de la modal
            $('#deleteCard').modal('hide');
        },
        error: function () {
            alert("Impossible de supprimer cette carte");
        }
    });

}

//Requete pour retirer un menu d'une carte. Cela ne supprime pas complètement le menu
function retireMenu(idMenu) {

    //Recup de l'id de la carte en cours
    var idCarteEnCours = $("#stockIDCarte").val();

    $.ajax({
        type: "GET",
        url: "https://whispering-anchorage-52809.herokuapp.com/cartes/" + idCarteEnCours + "/remove/" + idMenu,
        async: false,
        success: function () {
            showMeACard(idCarteEnCours);
        },
        error: function () {
            alert("Impossible de retirer ce menu de la carte");
        }
    });
};

//Requete pour ajouter un menu à une carte.
function ajouteMenu(idMenu) {

    //Recup de l'id de la carte en cours
    var idCarteEnCours = $("#stockIDCarte").val();

    //Verifie si une carte est bien selectionnee
    if (idCarteEnCours !== "") {

        $.ajax({
            type: "GET",
            url: "https://whispering-anchorage-52809.herokuapp.com/cartes/" + idCarteEnCours + "/add/" + idMenu,
            async: false,
            success: function () {
                showMeACard(idCarteEnCours);
            },
            error: function () {
                alert("Impossible d'ajouter ce menu à la carte");
            }
        });
    } else {
        alert("Aucune carte sélectionnée");
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
            .append($("<td>")
                .append($("<button>")
                    .addClass("btn btn-outline-danger btn-sm ptitButton")
                    .attr("type", "button")
                    .text("X")
                    .attr("onclick", "deleteMenu(" + listeMenus[i].id + ");")
                )
            )
            .append($("<td>").text(listeMenus[i].nom))
            .append($("<td>").text(listeMenus[i].entree.nom))
            .append($("<td>").text(listeMenus[i].plat.nom))
            .append($("<td>").text(listeMenus[i].dessert.nom))
            .append($("<td>")
                .append($("<button>")
                    .addClass("btn btn-outline-primary btn-sm ptitButton")
                    .attr("type", "button")
                    .attr("data-toggle", "modal")
                    .attr("data-target", "#showMenu")
                    .text("Modifier")
                    .attr("onclick", "showMeTheMenu(" + listeMenus[i].id + ");")
                )
                .append($("<button>")
                    .addClass("btn btn-outline-success btn-sm ptitButton")
                    .attr("type", "button")
                    .text("Ajouter à la carte")
                    .attr("onclick", "ajouteMenu(" + listeMenus[i].id + ");")
                )
            )
        );
    }
}

//Affichage modal pour nouveau menu OU modifier un menu existant
function showMeTheMenu(idMenu) {

    //Si idMenu = 0 => Creation d'un nouveau menu
    if (idMenu === 0) {
        //modifictaion du titre du modal
        $("#titredelAction").text("Ajouter un menu");

        //RAZ des inputs
        $("#titreMenu").val("");
        $("#titreEntree").val("");
        $("#prixEntree").val(0);
        $("#titrePlat").val("");
        $("#prixPlat").val(0);
        $("#titreDessert").val("");
        $("#prixDessert").val(0);

        //Modif de l'action et du titre du bouton
        $("#saveButtModal").text("Ajouter");
        $("#saveButtModal").attr("onclick", "sauveMoiCeMenu(0);")

    } else { //Recup des infos du menu et affichage dans les imputs

        $("#titredelAction").text("Modifier un menu");

        var menuSelected;

        $.ajax({
            type: "GET",
            url: "https://whispering-anchorage-52809.herokuapp.com/menus/" + idMenu + "/get",
            async: false,
            success: function (data) {
                menuSelected = data;
            },
            error: function () {
                alert("Erreur dans la récupération du menu");
            }
        });

        $("#titreMenu").val(menuSelected.nom);
        $("#titreEntree").val(menuSelected.entree.nom);
        $("#prixEntree").val(menuSelected.entree.prix);
        $("#titrePlat").val(menuSelected.plat.nom);
        $("#prixPlat").val(menuSelected.plat.prix);
        $("#titreDessert").val(menuSelected.dessert.nom);
        $("#prixDessert").val(menuSelected.dessert.prix);

        //Modif de l'action et du titre du bouton
        $("#saveButtModal").text("Modifier");
        $("#saveButtModal").attr("onclick", "sauveMoiCeMenu(" + idMenu + ");")
    }
};

//Sauvegarde à partir de la modal d'un menu ajouté ou modifié
function sauveMoiCeMenu(idMenu) {

    var menuToSave = {
        id: idMenu,
        nom: $("#titreMenu").val(),
        entree: {
            nom: $("#titreEntree").val(),
            prix: $("#prixEntree").val()
        },
        plat: {
            nom: $("#titrePlat").val(),
            prix: $("#prixPlat").val()
        },
        dessert: {
            nom: $("#titreDessert").val(),
            prix: $("#prixDessert").val()
        }
    };


    //Enregistrement du menu

    $.ajax({
        type: "POST",
        url: "https://whispering-anchorage-52809.herokuapp.com/menus/add",
        data: menuToSave,
        async: false,

        success: function (data) {
            //Reaffiche la liste des menus
            showAllMenus();
            //Clode la modal
            $('#showMenu').modal('hide');
        },
        error: function (param1, param2) {
            alert("erreur dans l'enregistrement du menu");
        }
    });

    //Verif si ce menu est présent dans la carte affichée, si oui relance de l'affichage de tous les menus de cette carte
    var testMenu = checkMyMenu(idMenu);
    if(testMenu === true){
        var idCarteEnCours = $("#stockIDCarte").val();
        showMeACard(idCarteEnCours);
    };
        
};

//Supression definitive d'un menu

function deleteMenu(idMenu) {

    //Avant de le supprimer, verif si carte en cours contenait ce menu
    var testMenuDeleted = checkMyMenu(idMenu);

    $.ajax({
        type: "GET",
        url: "https://whispering-anchorage-52809.herokuapp.com/menus/" + idMenu + "/remove",
        async: false,
        success: function () {
            //Reload de la liste des menus disponibles
            showAllMenus();
        },
        error: function () {
            alert("Erreur dans la récupération du menu");
        }
    });

    //Si carte en cours contenait ce menu, reload de la carte
    console.log(testMenuDeleted);
    if(testMenuDeleted === true){
        var idCarteEnCours = $("#stockIDCarte").val();
        showMeACard(idCarteEnCours);
    };
};

//Fonction qui checke si un menu est present dans la carte en cours, retourne un boolean
function checkMyMenu(idMenuToCheck){

    //Recup de l'id de la carte en cours
    var idCarteEnCours = $("#stockIDCarte").val();

    var reponse = false;
    
    $.ajax({
        type: "GET",
        url: "https://whispering-anchorage-52809.herokuapp.com/cartes/" + idCarteEnCours + "/check/" + idMenuToCheck,
        async: false,
        success: function (data) {
            reponse = data;
        },
        error: function () {
            alert("Erreur dans la recherche d'informations");
        }
    });

    return reponse;
};

