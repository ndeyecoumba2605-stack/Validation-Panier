document.addEventListener('DOMContentLoaded', () => {
    const sectionIdent = document.getElementById('identification');
    const divConnexion = document.getElementById('connexion');
    const divInscription = document.getElementById('inscription');

    // Bouton unique de l'en-tête
    const btnConnexion = document.getElementById('btn-connexion');

    // Boutons d'action du hero
    const btnSuivi = document.getElementById('btn-suivi');
    const btnPanier = document.getElementById('btn-panier');

    // Liens de navigation horizontale
    const navPanier = document.getElementById('nav-panier');
    const navSuivi = document.getElementById('nav-suivi');
    // "Accueil" et "À propos" n'ouvrent pas la modale : Accueil reste sur place,
    // "À propos" fait défiler vers #fonctionnement via l'ancre HTML native.

    // Liens de bascule internes à la modale
    const lienVersInscription = document.getElementById('lien-vers-inscription');
    const lienVersConnexion = document.getElementById('lien-vers-connexion');

    // Fonction d'affichage sélectif
    function ouvrirFormulaire(formulaireAAfficher) {
        if (!formulaireAAfficher || !sectionIdent) return;

        if (divConnexion) divConnexion.classList.remove('active');
        if (divInscription) divInscription.classList.remove('active');

        formulaireAAfficher.classList.add('active');
        sectionIdent.classList.add('active');
    }

    // Ouvrir CONNEXION (en-tête, boutons du hero, liens de nav "panier"/"suivi")
    [btnConnexion, btnSuivi, btnPanier, navPanier, navSuivi].forEach(btn => {
        if (btn && divConnexion) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                ouvrirFormulaire(divConnexion);
            });
        }
    });

    // Basculer vers INSCRIPTION depuis la fenêtre de connexion
    if (lienVersInscription && divInscription) {
        lienVersInscription.addEventListener('click', (e) => {
            e.preventDefault();
            ouvrirFormulaire(divInscription);
        });
    }

    // Basculer vers CONNEXION depuis la fenêtre d'inscription
    if (lienVersConnexion && divConnexion) {
        lienVersConnexion.addEventListener('click', (e) => {
            e.preventDefault();
            ouvrirFormulaire(divConnexion);
        });
    }

    // Fermeture arrière-plan
    if (sectionIdent) {
        sectionIdent.addEventListener('click', (e) => {
            if (e.target === sectionIdent) {
                sectionIdent.classList.remove('active');
            }
        });
    }

    // Fermeture touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sectionIdent) {
            sectionIdent.classList.remove('active');
        }
    });
});document.addEventListener('DOMContentLoaded', () => {
    const sectionIdent = document.getElementById('identification');
    const divConnexion = document.getElementById('connexion');
    const divInscription = document.getElementById('inscription');

    // Boutons de l'en-tête
    const btnConnexion = document.getElementById('btn-connexion');
    const btnInscription = document.getElementById('btn-inscription');

    // Boutons d'action du hero
    const btnSuivi = document.getElementById('btn-suivi');
    const btnPanier = document.getElementById('btn-panier');

    // Liens de navigation horizontale
    const navPanier = document.getElementById('nav-panier');
    const navSuivi = document.getElementById('nav-suivi');
    // "Accueil" et "À propos" n'ouvrent pas la modale : Accueil reste sur place,
    // "À propos" fait défiler vers #fonctionnement via l'ancre HTML native.

    // Liens de bascule internes à la modale
    const lienVersInscription = document.getElementById('lien-vers-inscription');
    const lienVersConnexion = document.getElementById('lien-vers-connexion');

    // Fonction d'affichage sélectif
    function ouvrirFormulaire(formulaireAAfficher) {
        if (!formulaireAAfficher || !sectionIdent) return;

        if (divConnexion) divConnexion.classList.remove('active');
        if (divInscription) divInscription.classList.remove('active');

        formulaireAAfficher.classList.add('active');
        sectionIdent.classList.add('active');
    }

    // Ouvrir CONNEXION (en-tête, boutons du hero, liens de nav "panier"/"suivi")
    [btnConnexion, btnSuivi, btnPanier, navPanier, navSuivi].forEach(btn => {
        if (btn && divConnexion) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                ouvrirFormulaire(divConnexion);
            });
        }
    });

    // Ouvrir INSCRIPTION depuis l'en-tête
    if (btnInscription && divInscription) {
        btnInscription.addEventListener('click', (e) => {
            e.preventDefault();
            ouvrirFormulaire(divInscription);
        });
    }

    // Basculer vers INSCRIPTION depuis la fenêtre de connexion
    if (lienVersInscription && divInscription) {
        lienVersInscription.addEventListener('click', (e) => {
            e.preventDefault();
            ouvrirFormulaire(divInscription);
        });
    }

    // Basculer vers CONNEXION depuis la fenêtre d'inscription
    if (lienVersConnexion && divConnexion) {
        lienVersConnexion.addEventListener('click', (e) => {
            e.preventDefault();
            ouvrirFormulaire(divConnexion);
        });
    }

    // Fermeture arrière-plan
    if (sectionIdent) {
        sectionIdent.addEventListener('click', (e) => {
            if (e.target === sectionIdent) {
                sectionIdent.classList.remove('active');
            }
        });
    }

    // Fermeture touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sectionIdent) {
            sectionIdent.classList.remove('active');
        }
    });
});