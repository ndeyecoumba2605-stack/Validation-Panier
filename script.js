document.addEventListener('DOMContentLoaded', () => {
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

// GEstion des comptes 
document.addEventListener('DOMContentLoaded', () => {
    const formInscription = document.getElementById('form-inscription');
    const formConnexion = document.getElementById('form-connexion');

    // INSCRIPTION
    if (formInscription) {
        formInscription.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Récupération des informations du formulaire
            const nom = document.getElementById('new-nom').value.trim();
            const email = document.getElementById('new-email').value.trim();
            const motDePasse = document.getElementById('new-password').value;
            const confirmation = document.getElementById('confirm-password').value;

            // Vérification du nom
            if (nom === '') {
                alert('Veuillez renseigner votre nom.');
                return;
            }
            // Vérification des mots de passe
            if (motDePasse !== confirmation) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }

            try {
                // Vérifier si l'email existe déjà
                const recherche = await fetch(
                    `http://localhost:3000/utilisateurs?email=${encodeURIComponent(email)}`
                );
                const utilisateurs = await recherche.json();
                if (utilisateurs.length > 0) {
                    alert('Cette adresse email est déjà utilisée.');
                    return;
                }
                // Création de la nouvelle cliente
                const nouvelleCliente = {
                    nom: nom,
                    email: email,
                    motDePasse: motDePasse,
                    role: 'cliente'
                };
                // Enregistrement dans db.json
                const response = await fetch(
                    'http://localhost:3000/utilisateurs',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(nouvelleCliente)
                    }
                );
                if (!response.ok) {
                    throw new Error(
                        'Erreur lors de la création du compte.'
                    );
                }
                alert('Votre compte a été créé avec succès !');
                // Réinitialiser le formulaire
                formInscription.reset();
            } catch (error) {
                console.error(error);
                alert(
                    'Impossible de créer le compte. Vérifiez que le serveur est lancé.'
                );
            }
        });
    }

    // CONNEXION
    if (formConnexion) {
        formConnexion.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const motDePasse = document.getElementById('password').value;
            try {
                // Recherche de l'utilisateur
                const recherche = await fetch(
                    `http://localhost:3000/utilisateurs?email=${encodeURIComponent(email)}&motDePasse=${encodeURIComponent(motDePasse)}`
                );

                const utilisateurs = await recherche.json();
                // Aucun compte trouvé
                if (utilisateurs.length === 0) {
                    alert('Email ou mot de passe incorrect.');
                    return;
                }
                // Récupérer l'utilisateur trouvé
                const utilisateur = utilisateurs[0];
                // SESSION SIMULÉE
                localStorage.setItem(
                    'utilisateurConnecte',
                    JSON.stringify(utilisateur)
                );

                // DÉTECTION DU RÔLE
                if (utilisateur.role === 'admin') {
                    alert('Bienvenue administrateur !');
                    // Pour l'instant :
                    console.log('Connexion administrateur');
                } else {
                    alert(`Bienvenue ${utilisateur.nom} !`);
                    // Pour l'instant :
                    console.log('Connexion cliente');
                }
            } catch (error) {
                console.error(error);
                alert(
                    'Impossible de se connecter. Vérifiez que le serveur est lancé.'
                );
            }
        });
    }
});