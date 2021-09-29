Template de dépôt Git pour projet d'étudiant
============================================

NOTE: [ENGLISH VERSION HERE](README-en.md)

Ceci est un exemple de dépôt Git pratique qui peut être utilisé pour tout projet de semestre, projet de stage ou travail de Bachelor/Master. Il contient l'architecture de base suivante :

- un dossier `docs/` qui contiendra tous les documents utiles au projet (PVs des séances hebdomadaires, cahier des charges, présentation intermédiaire et finale, planning, rapport, etc.)
- un dossier `code/` qui contiendra, comme son nom l'indique, le code. Il contient déjà deux fichiers :
	- `.gitignore` : pour y mettre tous les fichiers qui devront être ignorés par Git (fichiers de config, mots de passe, config d'IDE, librairies etc.). Il sera différent en fonction du langage/framework utilisé.
	- `README.md` : devra contenir les explications pour lancer le projet (dépendances, manipulations à faire, installation, lancement)

Pour l'utiliser, téléchargez simplement ce dépôt et faites-en un dépôt Git relatif à votre projet.

Vous pouvez tout à fait améliorer ce template en créant une [Merge Request](https://gitlab.forge.hefr.ch/jacky.casas/student-project-template/merge_requests) ou proposer des améliorations dans les [Issues](https://gitlab.forge.hefr.ch/jacky.casas/student-project-template/issues).

Ce README contient les informations générales du projet à remplir. Supprimez donc tout ce qui se trouve au-dessus de la ligne ci-dessous.

PS : Le formatage des fichiers README se fait en Markdown, plus d'infos [ici](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

PS2 : Si vous utilisez ce template, n'hésitez pas à lui mettre une étoile, il gagnera en visibilité dans les dépôts publics de l'école.

--------------------------------------------------------------------------

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
Nom du projet
=============

Infos générales
---------------

- **Etudiant/stagiaire** : mon nom - mon-email@hefr.ch
- **Superviseur** : [Jacky Casas](https://gitlab.forge.hefr.ch/jacky.casas) - jacky.casas@hefr.ch
- **Professeur** : [Elena Mugellini](https://gitlab.forge.hefr.ch/elena.mugellini) - elena.mugellini@hefr.ch
- **Professeur** : [Omar Abou Khaled](https://gitlab.forge.hefr.ch/omar.aboukhaled) - omar.aboukhaled@hefr.ch
- **Dates** : du 01.07.2020 au 31.08.2020


Contexte
--------

Ce projet de xxx a été développé durant un stage effectué chez yyy en août 2017 ...


Description
-----------

Le but de ce projet est de développer un ...


Contenu
-------

Ce dépôt contient toute la documentation relative au projet dans le dossier `docs/`. Le code du projet est dans le dossier `code/`.