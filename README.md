# Validation-Panier
# SHEIN Validation

Application web permettant à une cliente de soumettre un lien de panier SHEIN
pour validation, et à un administrateur de vérifier, valider ou refuser ces
demandes. Projet réalisé dans le cadre d'un cours de développement web (L3) :
DOM, formulaires, événements, fetch/API REST, async/await, try/catch,
JSON/json-server, affichage dynamique, recherche/filtres/tri, authentification
simulée.

Le cahier des charges complet du projet se trouve dans le dépôt (fichier
`Cahier_des_charges_*.docx`).

## Structure du projet

```
.
├── index.html      # Page d'accueil publique + écran de connexion/inscription + dashboard
├── style.css       # Mise en forme (accueil, formulaires, dashboard)
├── script.js       # Authentification simulée, gestion des demandes, dashboard client/admin
├── db.json         # Données (utilisateurs + demandes) — source pour json-server
└── images/
    └── validation.jpg   # Photo de fond de la page d'accueil (à fournir)
```

## Prérequis

- [Node.js](https://nodejs.org/) installé (pour utiliser `npx`).

## Installation et lancement

1. Cloner le dépôt puis se placer dans le dossier du projet.

2. Démarrer le serveur de données simulé (API REST). **Important** : préciser
   la version `0.17.4` de json-server, pas la dernière version disponible —
   les versions plus récentes ne gèrent pas les identifiants numériques de la
   même façon (voir la note plus bas) :

   ```bash
   npx json-server@0.17.4 db.json --port 3000
   ```

   L'API est alors disponible sur :
   - `http://localhost:3000/utilisateurs`
   - `http://localhost:3000/demandes`

3. Ouvrir `index.html` dans le navigateur (double-clic, ou avec l'extension
   VS Code « Live Server »).

## Compte administrateur

Conformément au cahier des charges, **le rôle administrateur ne peut pas être
créé depuis le formulaire d'inscription public** (qui ne crée que des
comptes « cliente »). Un compte administrateur doit exister directement dans
`db.json`, par exemple :

```json
{
  "id": 1,
  "nom": "Administrateur",
  "email": "admin@shein-validation.com",
  "motDePasse": "admin123",
  "role": "administrateur"
}
```

> Le mot de passe est stocké en clair dans `db.json`, à des fins
> pédagogiques uniquement — aucun mécanisme de sécurité réel (hachage,
> session serveur, jeton) n'est mis en œuvre dans ce projet.

## Fonctionnement général

- **Visiteur non connecté** : voit la page d'accueil (présentation, étapes,
  avantages) et peut s'inscrire ou se connecter via la fenêtre modale.
- **Cliente connectée** : accède à son espace (« Bonjour ») avec le
  formulaire de nouvelle demande et la liste de ses propres demandes,
  filtrable par référence et par statut.
- **Administrateur connecté** : accède au tableau de bord avec les
  statistiques globales et la liste de toutes les demandes, avec recherche,
  filtres (statut, priorité), tri, et les actions Valider / Refuser /
  Supprimer (avec confirmation).
- La session est conservée dans le `localStorage` du navigateur : un
  rechargement de page ne déconnecte pas l'utilisateur.
- Un indicateur de chargement s'affiche en haut de la page pendant les
  échanges avec l'API.

## Note technique : version de json-server

Ce projet attribue lui-même un identifiant entier (`id`) aux nouveaux
utilisateurs et demandes avant l'envoi (`POST`), afin de garder des id
numériques lisibles. Cela suppose une version de json-server qui respecte
l'id fourni dans le corps de la requête plutôt que d'en générer un
automatiquement (chaîne aléatoire) — d'où l'utilisation de
`json-server@0.17.4` plutôt que la dernière version publiée.

## Limites connues (hors périmètre du projet)

- Pas de vraie sécurité des comptes (hachage de mot de passe, session
  serveur, jeton JWT/OAuth).
- Pas de réinitialisation de mot de passe (le lien correspondant informe
  l'utilisateur de contacter l'administrateur).
- Pas de connexion réelle à l'API SHEIN, pas de paiement automatique.