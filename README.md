# Portail-math | Services Numériques de la PLM

Ce projet est un portail permettant d'accéder aux différents services de la Plateforme en Ligne pour les Mathématiques. 

Certains de ces services (web conférences, espaces de stockage et de partage de fichiers, éditions en ligne, messageries instantanées, …) sont accessibles à tous.
D'autres, ainsi que certaines fonctionnalitées (favoris, activation/désactivation,...), ne sont accessibles qu'après une authentification.

Ce portail permet aussi la gestion de son compte par l'intermédiaire d'une page d'édition de profil, une modale et une page de réinitialisation de mot de passe.

Une interface permet d'inviter une personne à pouvoir utiliser les services, lui créer un compte).

Enfin une interface permet de gérer les unités/laboratoires ainsi que les comptes qui lui sont rattachés. 

Ce projet est entièrement en français et en anglais. On passe d'une langue à l'autre depuis la barre de navigation.

## Installation du projet en locale 
Vous devez installer les Node_modules avec la commande:
```
npm install
```
#### Mock-Up d'API
Ce projet nécessite un mock-up d'API que vous trouverez [ici](https://plmlab.math.cnrs.fr/plm-services/mock_api). Ce mock-up simule une API pour faire des requêtes en locale.
Vous devais le lancer avec la comande:
```
nodemon
```
Pour pouvoir tester toutes les fonctionnalités du projet: dans le fichier `dataprofile.json` la propriété "anonymous" doit être false, pour simuler l'authentification.
Cette simulation se rechargera automatiquement à chaque modification et sauvegarde d'un fichier. 
Au cours des tests du projets, les différents fichiers .JSON ne se modifieront pas directement mais virtuellement. En d'autres termes: les données renvoyées par l'API reviendront à l'état initial à chaque rechargement du mock-up.

#### Compilation et rechargement automatique pour le développement
Une fois l'installation des node_modules et la mise en place du mock-up et que vous l'avais lancé, vous pouvez visualiser le projet dans votre navigateur avec la commande:
```
npm run serve
```
Cette visualisation se rechargera automatiquement à chaque modification et sauvegarde d'un fichier.

#### Compilation et minification pour la mise en production
Si vous n'utilisez pas l'intégration continue d'OpenShit (un des services de la PLM), vous devez compiler le projet une fois finis avec la commande:
```
npm run build
```

## Interface d'accès au différents services

Pour accéder aux services de la PLM, l'interface génère des tuiles (cards). Ces tuiles comportes le nom du service et un résumé.
Dans l'entête de chaque tuile, il y a un icône "?" qui mène à l'explication du service, un icône étoile qui permet de mettre en favoris (si authentifié), et un bouton ON/OFF si le service est activable/désactivable et que l'on est authentifié.
L'affichage des favoris se fait au clique du bouton étoile dans la barre de navigation (si au moins un service est favoris).

![Card Service PLM](/imgsReadme/card.PNG "Card Service PLM")

![Icons navbar](/imgsReadme/navbar1.png "Icons navbar")

Une de ces tuile permet de réinitialiser son mot de passe. Elle ouvre une modale qui une fois validé renvoie sur une page de validation du nouveau mot de passe. 
En ligne un mail est envoyé qui renvoi sur la page de validation avec le token dans l'URL.

Une autre tuile permet de gérer ses unités/labos. cf plus bas: Interface de gestion des unités.


## Interface d'édition de profile

Cette interface est accessible en cliquant sur un icône de la barre de navigation (utilisateur avec un engrenage).

![Icon édition du profil](/imgsReadme/navbar.png "Icon édition du profil")

Elle affiche certaines informations du profile et permet d'en modifier d'autres. Pour chaque modification une modale de confirmation s'ouvre.

![modale de confirmation](/imgsReadme/modale1.PNG "modale de confirmation")

## Interface d'invitation (! work in progress !)

Cette intérface (/invitations) s'ouvre sur une modale explicant son fonctionement. Cette modale une fois fermé peut être réouverte à tous moments en cliquant sur l'icône "?".

Un formulaire demande le nom, le prénom et le mail.

En desous on trouve deux onglets: 
- Comptes existants, qui affiche les comptes déjà existants pour vérifier que l'on invite pas quelqu'un de déjà inscrit.

- Mes invités, qui affiche les personne que l'on a déjà personnellement invité. On peut les effacer depuis cet onglet.

![onglets d'invitation](/imgsReadme/invitations.png "onglets d'invitation")

## Interface de gestion des Unités

Cette interface est accessible par la tuile `gestion des comptes`.
Elle est découpée en trois zones:

#### Choix de l'unité

En entête, on commence par choisir l'unité et l'on peut ouvrire une modale pour en gérer les VPNs.

![bandeau de choix d'unité](/imgsReadme/Bandeau.PNG "bandeau de choix d'unité")

#### Liste des comptes

Une deuxième zone affiche les différents comptes utilisateurs de l'unité sélectionnée. Il est possible de les filtrer.
Plusieurs boutons permettent d'ajouter un compte, de modifier (son statut, le déplacer, le supprimer ou valider un transfère), envoyer un mail de récupération de mot de passe ou d'afficher une aide pour l'utilisation de cette zone.

On séléctionne donc un compte qui passe en fond vert.

![zone de choix de compte](/imgsReadme/Users.PNG "zone de choix de compte")

#### Détails des informations du compte

En fin la troisième zone affiche les informations détaillées du compte sélectionné.
On peut y modifier certaines informations (celons le statut du compte) et valider ces modifications en cliquant sur "Appliquer" en bas de la zone.
Et pour les "membres" (pas les "invités", ni "en attente"), on peut éditer les VPNs en cliquant sur l'icône "crayon", qui ouvre une modale à cette effet.

![zone détails compte](/imgsReadme/Account.PNG "zone détails compte")

![zone détails compte](/imgsReadme/VPNs.PNG "zone détails compte")
