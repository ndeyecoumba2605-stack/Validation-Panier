const API_UTILISATEURS = 'http://localhost:3000/utilisateurs';
const API_DEMANDES = 'http://localhost:3000/demandes';

/* 
   0. Indicateur de chargement (compteur de requêtes en cours)
    */
let requetesEnCours = 0;

function demarrerChargement() {
    requetesEnCours++;
    const indicateur = document.getElementById('loadingIndicator');
    if (indicateur) indicateur.hidden = false;
}

function terminerChargement() {
    requetesEnCours = Math.max(0, requetesEnCours - 1);
    if (requetesEnCours === 0) {
        const indicateur = document.getElementById('loadingIndicator');
        if (indicateur) indicateur.hidden = true;
    }
}

// Remplace fetch() partout dans ce fichier : affiche/masque l'indicateur automatiquement
async function fetchAvecChargement(url, options) {
    demarrerChargement();
    try {
        return await fetch(url, options);
    } finally {
        terminerChargement();
    }
}

/* 
   1. Sélection des éléments du DOM
    */
const sectionHome = document.getElementById('home');
const sectionFonctionnement = document.getElementById('fonctionnement');
const sectionIdent = document.getElementById('identification');
const sectionDashboard = document.getElementById('dashboard');

const divConnexion = document.getElementById('connexion');
const divInscription = document.getElementById('inscription');

const dashboardClient = document.getElementById('dashboard-client');
const dashboardAdmin = document.getElementById('dashboard-admin');

const dashboardNom = document.getElementById('dashboard-nom');
const nomClient = document.getElementById('nom-client');
const clienteDemandeInput = document.getElementById('cliente-demande');

/* 
   2. Gestion de la session (simulée en localStorage)
    */
function getSession() {
    const brut = localStorage.getItem('utilisateurConnecte');
    return brut ? JSON.parse(brut) : null;
}

function setSession(utilisateur) {
    localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateur));
}

function clearSession() {
    localStorage.removeItem('utilisateurConnecte');
}

/* 
   3. Bascule entre page publique et dashboard
    */
function afficherAccueil() {
    sectionHome.hidden = false;
    sectionFonctionnement.hidden = false;
    sectionDashboard.classList.remove('active');
    if (sectionIdent) sectionIdent.classList.remove('active');
}

function afficherDashboard(utilisateur) {
    sectionHome.hidden = true;
    sectionFonctionnement.hidden = true;
    if (sectionIdent) sectionIdent.classList.remove('active');
    sectionDashboard.classList.add('active');

    dashboardNom.textContent = `${utilisateur.nom} · ${utilisateur.role}`;

    dashboardClient.classList.remove('active');
    dashboardAdmin.classList.remove('active');

    const role = (utilisateur.role || '').trim().toLowerCase();
    if (role === 'administrateur' || role === 'admin') {
        dashboardAdmin.classList.add('active');
        chargerDemandesAdmin();
    } else {
        dashboardClient.classList.add('active');
        nomClient.textContent = utilisateur.nom;
        clienteDemandeInput.value = utilisateur.nom;
        chargerDemandesClient();
    }
}

/* 
   4. Modale de connexion / inscription (accueil public)
    */
document.addEventListener('DOMContentLoaded', () => {
    const btnConnexion = document.getElementById('btn-connexion');
    const btnInscription = document.getElementById('btn-inscription');
    const btnSuivi = document.getElementById('btn-suivi');
    const btnPanier = document.getElementById('btn-panier');
    const navPanier = document.getElementById('nav-panier');
    const navSuivi = document.getElementById('nav-suivi');
    const lienVersInscription = document.getElementById('lien-vers-inscription');
    const lienVersConnexion = document.getElementById('lien-vers-connexion');
    const lienOubli = document.getElementById('lien-oubli');

    function ouvrirFormulaire(formulaireAAfficher) {
        if (!formulaireAAfficher || !sectionIdent) return;
        divConnexion.classList.remove('active');
        divInscription.classList.remove('active');
        formulaireAAfficher.classList.add('active');
        sectionIdent.classList.add('active');
    }

    [btnConnexion, btnSuivi, btnPanier, navPanier, navSuivi].forEach((btn) => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                ouvrirFormulaire(divConnexion);
            });
        }
    });

    if (btnInscription) {
        btnInscription.addEventListener('click', (e) => {
            e.preventDefault();
            ouvrirFormulaire(divInscription);
        });
    }

    if (lienVersInscription) {
        lienVersInscription.addEventListener('click', (e) => {
            e.preventDefault();
            ouvrirFormulaire(divInscription);
        });
    }

    if (lienVersConnexion) {
        lienVersConnexion.addEventListener('click', (e) => {
            e.preventDefault();
            ouvrirFormulaire(divConnexion);
        });
    }

    if (lienOubli) {
        lienOubli.addEventListener('click', (e) => {
            e.preventDefault();
            alert('La réinitialisation du mot de passe n\'est pas disponible pour le moment. Merci de contacter l\'administrateur.');
        });
    }

    // La réinitialisation de mot de passe n'est pas dans le périmètre du projet
    // (aucun envoi d'email, aucune sécurité réelle) : on informe simplement l'utilisateur.
    if (lienOubli) {
        lienOubli.addEventListener('click', (e) => {
            e.preventDefault();
            alert(
                "La réinitialisation automatique n'est pas disponible pour ce projet.\n" +
                'Contactez l\'administrateur pour faire réinitialiser votre mot de passe.'
            );
        });
    }

    if (sectionIdent) {
        sectionIdent.addEventListener('click', (e) => {
            if (e.target === sectionIdent) {
                sectionIdent.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sectionIdent) {
            sectionIdent.classList.remove('active');
        }
    });
});

/* 
   5. Inscription (toujours rôle "cliente") et connexion
    */
document.addEventListener('DOMContentLoaded', () => {
    const formInscription = document.getElementById('form-inscription');
    const formConnexion = document.getElementById('form-connexion');
    const btnDeconnexion = document.getElementById('btn-deconnexion');

    // --- INSCRIPTION ---
    if (formInscription) {
        formInscription.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nom = document.getElementById('new-nom').value.trim();
            const email = document.getElementById('new-email').value.trim();
            const motDePasse = document.getElementById('new-password').value;
            const confirmation = document.getElementById('confirm-password').value;

            if (nom === '') {
                alert('Veuillez renseigner votre nom.');
                return;
            }
            if (nom.length < 3 || nom.length > 25) {
                alert('Le nom doit contenir entre 3 et 25 caractères.');
                return;
            }
            if (motDePasse.length < 6) {
                alert('Le mot de passe doit contenir au moins 6 caractères.');
                return;
            }
            if (motDePasse !== confirmation) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }

            try {
                // Vérifier si l'email existe déjà (recherche filtrée)
                const rechercheEmail = await fetchAvecChargement(
                    `${API_UTILISATEURS}?email=${encodeURIComponent(email)}`
                );
                const utilisateursAvecCetEmail = await rechercheEmail.json();
                if (utilisateursAvecCetEmail.length > 0) {
                    alert('Cette adresse email est déjà utilisée.');
                    return;
                }

                // Calcul du prochain id à partir de TOUS les utilisateurs
                const rechercheTous = await fetchAvecChargement(API_UTILISATEURS);
                const tousLesUtilisateurs = await rechercheTous.json();
                let prochainId = 1;
                if (tousLesUtilisateurs.length > 0) {
                    const ids = tousLesUtilisateurs.map((u) => Number(u.id) || 0);
                    prochainId = Math.max(...ids) + 1;
                }

                // Inscription publique = toujours le rôle "cliente"
                const nouvelleCliente = {
                    id: prochainId,
                    nom,
                    email,
                    motDePasse,
                    role: 'cliente',
                };

                const response = await fetchAvecChargement(API_UTILISATEURS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nouvelleCliente),
                });
                if (!response.ok) throw new Error('Erreur lors de la création du compte.');

                formInscription.reset();
                setSession(nouvelleCliente);
                afficherDashboard(nouvelleCliente);
            } catch (error) {
                console.error(error);
                alert('Impossible de créer le compte. Vérifiez que le serveur est lancé.');
            }
        });
    }

    // --- CONNEXION ---
    if (formConnexion) {
        formConnexion.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const motDePasse = document.getElementById('password').value;

            try {
                const recherche = await fetchAvecChargement(
                    `${API_UTILISATEURS}?email=${encodeURIComponent(email)}&motDePasse=${encodeURIComponent(motDePasse)}`
                );
                const utilisateurs = await recherche.json();

                if (utilisateurs.length === 0) {
                    alert('Email ou mot de passe incorrect.');
                    return;
                }

                const utilisateur = utilisateurs[0];
                setSession(utilisateur);
                formConnexion.reset();
                afficherDashboard(utilisateur);
            } catch (error) {
                console.error(error);
                alert('Impossible de se connecter. Vérifiez que le serveur est lancé.');
            }
        });
    }

    // --- DÉCONNEXION ---
    if (btnDeconnexion) {
        btnDeconnexion.addEventListener('click', () => {
            clearSession();
            afficherAccueil();
        });
    }

    // --- Session déjà active au chargement de la page ---
    const utilisateurConnecte = getSession();
    if (utilisateurConnecte) {
        afficherDashboard(utilisateurConnecte);
    }
});

/* 
   6. Utilitaires d'affichage (badges, formatage)
    */
function classeStatut(statut) {
    if (statut === 'validée') return 'validee';
    if (statut === 'refusée') return 'refusee';
    return 'attente';
}

function formaterFCFA(valeur) {
    return Math.round(valeur).toLocaleString('fr-FR') + ' FCFA';
}

function formaterDate(iso) {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
}

function creerCarteDemande(demande, { avecActions }) {
    const carte = document.createElement('article');
    carte.className = `demande-card statut-${classeStatut(demande.statut)}`;

    const reference = demande.reference || `Demande #${demande.id}`;
    const nomCliente = demande.cliente || 'Cliente inconnue';

    const actionsHtml = avecActions
        ? `<div class="actions-demande">
             ${demande.statut === 'en attente' ? `
               <button class="btn btn-valider" data-action="valider" data-id="${demande.id}">Valider</button>
               <button class="btn btn-refuser" data-action="refuser" data-id="${demande.id}">Refuser</button>
             ` : ''}
             <button class="btn btn-supprimer" data-action="supprimer" data-id="${demande.id}">Supprimer</button>
           </div>`
        : '';

    carte.innerHTML = `
        <div class="demande-header">
            <h3>${avecActions ? nomCliente : reference}</h3>
            <div class="badges">
                <span class="badge badge-${demande.priorite}">${demande.priorite}</span>
                <span class="badge badge-${classeStatut(demande.statut)}">${demande.statut}</span>
            </div>
        </div>
        <div class="demande-informations">
            <span><strong>Référence :</strong> ${reference}</span>
            <span><strong>Montant :</strong> ${demande.montantUSD} $ (${formaterFCFA(demande.montantFCFA)})</span>
            <span><strong>Panier :</strong> <a href="${demande.lienPanier}" target="_blank" rel="noopener">Voir le lien</a></span>
            <span><strong>Date :</strong> ${formaterDate(demande.dateCreation)}</span>
        </div>
        ${actionsHtml}
    `;
    return carte;
}

/* 
   7. Dashboard CLIENTE — nouvelle demande + mes demandes
    */
document.addEventListener('DOMContentLoaded', () => {
    const formDemande = document.getElementById('form-demande');
    const montantDollar = document.getElementById('montant-dollar');
    const tauxDollar = document.getElementById('taux-dollar');
    const montantFCFA = document.getElementById('montant-fcfa');
    const btnActualiserClient = document.getElementById('btn-actualiser-client');
    const rechercheClient = document.getElementById('recherche-client');
    const filtreStatutClient = document.getElementById('filtre-statut-client');
    const filtrePrioriteClient = document.getElementById('filtre-priorite-client');
    const triClient = document.getElementById('tri-client');

    function calculerFCFA() {
        const montant = Number(montantDollar.value) || 0;
        const taux = Number(tauxDollar.value) || 0;
        montantFCFA.value = Math.round(montant * taux);
    }
    if (montantDollar && tauxDollar) {
        montantDollar.addEventListener('input', calculerFCFA);
        tauxDollar.addEventListener('input', calculerFCFA);
    }

    if (formDemande) {
        formDemande.addEventListener('submit', async (e) => {
            e.preventDefault();
            const utilisateur = getSession();
            if (!utilisateur) return;

            const lienPanier = document.getElementById('lien-panier').value.trim();
            const montantUSD = Number(montantDollar.value);
            const taux = Number(tauxDollar.value);
            const priorite = document.getElementById('priorite').value;

            if (!lienPanier || montantUSD <= 0 || taux <= 0) {
                alert('Merci de renseigner correctement tous les champs.');
                return;
            }

            try {
                const rechercheTous = await fetchAvecChargement(API_DEMANDES);
                const toutesLesDemandes = await rechercheTous.json();
                let prochainId = 1;
                if (toutesLesDemandes.length > 0) {
                    const ids = toutesLesDemandes.map((d) => Number(d.id) || 0);
                    prochainId = Math.max(...ids) + 1;
                }

                const nouvelleDemande = {
                    id: prochainId,
                    clienteId: utilisateur.id,
                    cliente: utilisateur.nom,
                    reference: 'PAN-' + String(prochainId).padStart(3, '0'),
                    lienPanier,
                    montantUSD,
                    tauxDollar: taux,
                    montantFCFA: Math.round(montantUSD * taux),
                    priorite,
                    statut: 'en attente',
                    dateCreation: new Date().toISOString(),
                };

                const reponse = await fetchAvecChargement(API_DEMANDES, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nouvelleDemande),
                });
                if (!reponse.ok) throw new Error('Échec de l\'enregistrement');

                formDemande.reset();
                clienteDemandeInput.value = utilisateur.nom;
                montantFCFA.value = '';
                chargerDemandesClient();
            } catch (error) {
                console.error(error);
                alert('Impossible d\'enregistrer la demande. Vérifiez que le serveur est lancé.');
            }
        });
    }

    if (btnActualiserClient) btnActualiserClient.addEventListener('click', chargerDemandesClient);
    if (rechercheClient) rechercheClient.addEventListener('input', afficherListeClient);
    if (filtreStatutClient) filtreStatutClient.addEventListener('change', afficherListeClient);
    if (filtrePrioriteClient) filtrePrioriteClient.addEventListener('change', afficherListeClient);
    if (triClient) triClient.addEventListener('change', afficherListeClient);
});

let demandesClientCache = [];

async function chargerDemandesClient() {
    const utilisateur = getSession();
    const liste = document.getElementById('liste-demandes-client');
    if (!utilisateur || !liste) return;

    try {
        const reponse = await fetchAvecChargement(`${API_DEMANDES}?clienteId=${utilisateur.id}`);
        if (!reponse.ok) throw new Error('Réponse API invalide');
        demandesClientCache = await reponse.json();
        afficherListeClient();
    } catch (error) {
        console.error(error);
        liste.innerHTML = '<p class="message-vide">Impossible de charger vos demandes.</p>';
    }
}

function afficherListeClient() {
    const liste = document.getElementById('liste-demandes-client');
    const recherche = (document.getElementById('recherche-client').value || '').toLowerCase();
    const statut = document.getElementById('filtre-statut-client').value;
    const priorite = document.getElementById('filtre-priorite-client').value;
    const tri = document.getElementById('tri-client').value;

    let filtrees = demandesClientCache.filter((d) => {
        const matchRecherche = recherche === '' || (d.reference || '').toLowerCase().includes(recherche);
        const matchStatut = statut === 'tous' || d.statut === statut;
        const matchPriorite = priorite === 'tous' || d.priorite === priorite;
        return matchRecherche && matchStatut && matchPriorite;
    });

    filtrees = filtrees.slice().sort((a, b) => {
        if (tri === 'date-asc') return new Date(a.dateCreation) - new Date(b.dateCreation);
        if (tri === 'montant-desc') return b.montantFCFA - a.montantFCFA;
        return new Date(b.dateCreation) - new Date(a.dateCreation); // date-desc par défaut
    });

    liste.innerHTML = '';
    if (filtrees.length === 0) {
        liste.innerHTML = '<p class="message-vide">Aucune demande ne correspond à votre recherche.</p>';
        return;
    }
    filtrees.forEach((d) => liste.appendChild(creerCarteDemande(d, { avecActions: false })));
}

/* 
   8. Dashboard ADMIN — statistiques + gestion des demandes
    */
document.addEventListener('DOMContentLoaded', () => {
    const btnActualiserAdmin = document.getElementById('btn-actualiser-admin');
    const rechercheAdmin = document.getElementById('recherche-admin');
    const filtreStatutAdmin = document.getElementById('filtre-statut-admin');
    const filtrePrioriteAdmin = document.getElementById('filtre-priorite-admin');
    const triAdmin = document.getElementById('tri-admin');
    const listeAdmin = document.getElementById('liste-demandes-admin');

    if (btnActualiserAdmin) btnActualiserAdmin.addEventListener('click', chargerDemandesAdmin);
    if (rechercheAdmin) rechercheAdmin.addEventListener('input', afficherListeAdmin);
    if (filtreStatutAdmin) filtreStatutAdmin.addEventListener('change', afficherListeAdmin);
    if (filtrePrioriteAdmin) filtrePrioriteAdmin.addEventListener('change', afficherListeAdmin);
    if (triAdmin) triAdmin.addEventListener('change', afficherListeAdmin);

    if (listeAdmin) {
        listeAdmin.addEventListener('click', async (e) => {
            const bouton = e.target.closest('button[data-action]');
            if (!bouton) return;
            const id = bouton.dataset.id;
            const action = bouton.dataset.action;

            if (action === 'valider') await mettreAJourStatut(id, 'validée');
            if (action === 'refuser') await mettreAJourStatut(id, 'refusée');
            if (action === 'supprimer') {
                if (confirm('Supprimer définitivement cette demande ?')) {
                    await supprimerDemande(id);
                }
            }
        });
    }
});

let demandesAdminCache = [];

async function chargerDemandesAdmin() {
    const liste = document.getElementById('liste-demandes-admin');
    if (!liste) return;
    try {
        const reponse = await fetchAvecChargement(API_DEMANDES);
        if (!reponse.ok) throw new Error('Réponse API invalide');
        demandesAdminCache = await reponse.json();
        mettreAJourStats();
        afficherListeAdmin();
    } catch (error) {
        console.error(error);
        liste.innerHTML = '<p class="message-vide">Impossible de charger les demandes.</p>';
    }
}

function mettreAJourStats() {
    document.getElementById('stat-total').textContent = demandesAdminCache.length;
    document.getElementById('stat-attente').textContent =
        demandesAdminCache.filter((d) => d.statut === 'en attente').length;
    document.getElementById('stat-validees').textContent =
        demandesAdminCache.filter((d) => d.statut === 'validée').length;
    document.getElementById('stat-refusees').textContent =
        demandesAdminCache.filter((d) => d.statut === 'refusée').length;

    const montantTotal = demandesAdminCache.reduce(
        (somme, d) => somme + (Number(d.montantFCFA) || 0),
        0
    );
    document.getElementById('stat-montant').textContent = montantTotal.toLocaleString('fr-FR');
}

function afficherListeAdmin() {
    const liste = document.getElementById('liste-demandes-admin');
    const recherche = (document.getElementById('recherche-admin').value || '').toLowerCase();
    const statut = document.getElementById('filtre-statut-admin').value;
    const priorite = document.getElementById('filtre-priorite-admin').value;
    const tri = document.getElementById('tri-admin').value;

    let filtrees = demandesAdminCache.filter((d) => {
        const matchRecherche =
            recherche === '' ||
            d.cliente.toLowerCase().includes(recherche) ||
            d.reference.toLowerCase().includes(recherche);
        const matchStatut = statut === 'tous' || d.statut === statut;
        const matchPriorite = priorite === 'tous' || d.priorite === priorite;
        return matchRecherche && matchStatut && matchPriorite;
    });

    const ordrePriorite = { haute: 0, moyenne: 1, basse: 2 };
    filtrees = filtrees.slice().sort((a, b) => {
        if (tri === 'date-asc') return new Date(a.dateCreation) - new Date(b.dateCreation);
        if (tri === 'cliente-asc') return a.cliente.localeCompare(b.cliente);
        if (tri === 'montant-desc') return b.montantFCFA - a.montantFCFA;
        return new Date(b.dateCreation) - new Date(a.dateCreation); // date-desc par défaut
    });

    liste.innerHTML = '';
    if (filtrees.length === 0) {
        liste.innerHTML = '<p class="message-vide">Aucune demande ne correspond à votre recherche.</p>';
        return;
    }
    filtrees.forEach((d) => liste.appendChild(creerCarteDemande(d, { avecActions: true })));
}

async function mettreAJourStatut(id, nouveauStatut) {
    try {
        const reponse = await fetchAvecChargement(`${API_DEMANDES}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut: nouveauStatut }),
        });
        if (!reponse.ok) throw new Error('Échec de la mise à jour');
        await chargerDemandesAdmin();
    } catch (error) {
        console.error(error);
        alert('Impossible de mettre à jour cette demande (elle a peut-être déjà été supprimée).');
        chargerDemandesAdmin();
    }
}

async function supprimerDemande(id) {
    try {
        const reponse = await fetchAvecChargement(`${API_DEMANDES}/${id}`, { method: 'DELETE' });
        if (!reponse.ok) throw new Error('Échec de la suppression');
        await chargerDemandesAdmin();
    } catch (error) {
        console.error(error);
        alert('Impossible de supprimer cette demande.');
        chargerDemandesAdmin();
    }
}