Behind Food - Amélioration de l'application mobile sur la face cachée des aliments industriels
============================================

NOTE: [ENGLISH VERSION HERE](README-en.md)

Onboarding
==========

Afin de bien débuter votre projet, voici les différentes étapes à réaliser. Cochez-les au fur et à mesure. Lorsque toutes les étapes seront cochées, vous serez prêts !


Premier jour
------------

- [ ] Télécharger ce template, créer un nouveau dépôt Git pour votre projet (p.ex. "tb-super-website"), et pusher le tout sur Gitlab (info: si vous avez un compte "externe", vous n'avez pas les permissions nécessaires pour créer un dépôt, dans ce cas c'est votre superviseur qui le fera à votre place).
- [ ] Editer ce README et supprimer la première partie (cocher ces deux premières étapes en mettant un "x" entre les crochets, comme ça: [x])
- [ ] Faire une séance d'introduction avec votre superviseur
- [ ] Remplir les méta-données du projet ci-dessous (Voir [Nom du projet](#nom-du-projet))
- [ ] Donner les accès à mon dépôt Gitlab à mon/mes superviseur/s (dans le panneau à gauche `Settings/Members`)


**Ressources :** Si vous n'êtes pas à l'aise avec Git, Docker ou d'autres outils, des tutoriels se trouvent sur le dépôt [jacky.casas/basic-tutorials](https://gitlab.forge.hefr.ch/jacky.casas/basic-tutorials), jettez-y un oeil.


Première semaine
----------------

- [ ] Installer les logiciels requis sur votre ordinateur
- [ ] Prendre en main les différentes technologies liées au projet
- [ ] Rédiger le **cahier des charges** du projet (template disponible [ici](/docs/templates/CahierDesCharges-Template.docx))
- [ ] Prévoir une séance hebdomadaire avec votre superviseur. Après chaque séance, vous devrez **rédiger un PV** et le mettre dans le dépôt du projet `/docs/PVs/`. Un [template LaTeX](/docs/PVs/template/pv.tex) et un [template Word](/docs/PVs/template/PV-Template.docx) se trouvent dans le même dossier)
- [ ] Mettre son code dans le dossier `code/` et renseigner dans le fichier `code/README.md` la façon d'installer et de lancer votre code (tout doit y figurer pour qu'une personne lambda puisse installer votre logiciel depuis zéro)

Une séance de présentation du cahier des charges sera organisée aux environs de la 2e semaine par votre superviseur (encore une fois, un [template](/docs/templates/Presentation-Template.pptx) existe).

Une présentation finale sera également organisée en temps voulu.

Voilà, vous êtes "onboardés" ! :)

--------------------------------------------------------------------------
Offboarding
===========

Voici une check-list pour être sûr d'avoir tout déposé sur Gitlab avant la fin de votre projet. Si tout est coché, ça devrait être ok.

- [ ] Tout le code se trouve dans le dossier `code/`
- [ ] Le fichier `code/README.md` contient toutes les explications nécessaire pour l'installation et le lancement de mon code
- [ ] Les PVs de toutes les séances se trouvent dans le dossier `docs/PVs/`
- [ ] Le cachier des charges se trouve dans le dossier `docs/`
- [ ] Les slides de la présentation du cahier des charges se trouve dans le dossier `docs/`
- [ ] Le rapport final se trouve dans le dossier `docs/`
- [ ] Les slides de la présentation finale du projet se trouvent dans le dossier `docs/`
- [ ] Une vidéo de démonstration de votre projet a été montée, envoyée à votre superviseur, et uploadée sur la [chaine Youtube de l'institut HumanTech](https://www.youtube.com/user/MISGchannel)
- [ ] J'ai complété la [fiche d'évaluation](docs/supervision-evaluation.md) de mon superviseur afin de l'aider à s'améliorer
- [ ] J'ai organisé un apéro de départ (optionnel, dépend de votre superviseur) ;)


--------------------------------------------------------------------------
Behind Food
=============

Infos générales
---------------

- **Etudiant** : Grégory Geinoz - gregory.geinoz@edu.hefr.ch
- **Superviseur** : [Pascal Bruegger](https://gitlab.forge.hefr.ch/pascal.bruegger) - pascal.bruegger@hefr.ch
- **Mandant** : [Samuel Fringeli](https://gitlab.forge.hefr.ch/samuel.fringeli) - samuel.fringeli@hefr.ch
- **Dates** : du 27.09.2021 au 09.02.2022

Description
-----------

Behind food est une application mobile utilisée dans le cadre d’une exposition sur le développement durable. Elle permet aux visiteurs d’explorer les faces cachées de différents aliments du quotidien au moyen d’un parcours de divers thèmes reliés à ces aliments. Ce parcours donne accès à des images, à des vidéos et à des textes pour illustrer les caractéristiques des aliments concernés. Ces éléments sont mis à jour par l’équipe qui gère l’exposition, au moyen d’une interface backend, et sont accessibles depuis l’application grâce à une API.
Dans la version actuelle de l’application, c’est une webview qui est chargée et qui affiche les images et vidéos au fur et à mesure du parcours de l’utilisateur dans la structure, mais les médias ne sont pas sauvegardés dans le stockage local de l’application, ce qui rend impossible l’utilisation de celle-ci hors ligne. Comme l’exposition a pour objectif de fonctionner entièrement hors ligne, il serait nécessaire de faire en sorte que les données affichées soient téléchargées localement, avec un système permettant d’actualiser les dernières modifications effectuées sur le backend par l’utilisateur de l’application.

Contenu
-------

Ce dépôt contient toute la documentation relative au projet dans le dossier `docs/`. Le code du projet est dans le dossier `code/`.