Behind Food - Amélioration de l'application mobile sur la face cachée des aliments industriels
=====================================

NOTE: [VERSION FRANCAISE ICI](README.md)

Onboarding
==========

In order to start your project in the best way possible, here is a list of the step you have to do. Tick the boxes once they're done. When all of them are ticked, you'll be ready to start!


First day
---------

- [ ] Download this template, create a new Git repository for your project (eg "tb-super-website"), and push it all on Gitlab (info: if you have an "external" account, you do not have the necessary permissions to create a repository, in this case your supervisor will do it for you).
- [ ] Edit this README and delete the first part (check these first two steps by putting an "x" between the brackets, like this: [x])
- [ ] Do an introductory meeting with your supervisor
- [ ] Fill in the project metadata below (See [Project name](#project-name))
- [ ] Give access to my Gitlab repository to my supervisor(s) (in the left pane `Settings/Members`)


**Resources:** If you are not comfortable with Git, Docker or other tools, tutorials can be found on the repository[jacky.casas/basic-tutorials](https://gitlab.forge.hefr.ch/jacky.casas/basic-tutorials), take a look.


First week
----------

- [ ] Install the required software on your computer
- [ ] Discover/read/test the different technologies linked to the project
- [ ] Write the **specifications** of the project (template available [here](/docs/templates/CahierDesCharges-Template.docx))
- [ ] Schedule a weekly meeting with your supervisor. After each session, you will **write a meeting minute (or PV)** and put it in the project repository `/docs/PVs/`. A [LaTeX template](/docs/PVs/template/pv.tex) and a [Word template](/docs/PVs/template/PV-Template.docx) are in the same folder)
- [ ] Mettre son code dans le dossier `code/` et renseigner dans le fichier `code/README.md` la façon d'installer et de lancer votre code (tout doit y figurer pour qu'une personne lambda puisse installer votre logiciel depuis zéro)
- [ ] Put your code in the `code/` folder and write in the `code/README.md` file how to install and launch your code (everything must be there so that anyone can install your software from scratch)

A presentation session of the specifications will be organized around the 2nd week by your supervisor (again, a [template](/docs/templates/Presentation-Template.pptx) exists).

A final presentation will also be organized in due course.

Here you are, you're officially on board! :)

--------------------------------------------------------------------------
Offboarding
===========

Here is a checklist to make sure you have everything pushed on Gitlab before the end of your project. If everything is checked, it should be ok.

- [ ] All the code is in the `code/` folder
- [ ] The file `code/README.md` contains all the explanations necessary for installing and running my code
- [ ] The meeting minutes of all the sessions are in the folder `docs/PVs/`
- [ ] The specification sheet is located in the `docs/` folder
- [ ] The slides of the midterm presentation can be found in the `docs/` folder
- [ ] The final report can be found in the `docs/` folder
- [ ] The slides of the final presentation of the project are in the folder `docs/`
- [ ] A demonstration video of your project has been edited, sent to your supervisor, and uploaded to the [YouTube channel of the HumanTech Institute](https://www.youtube.com/user/MISGchannel)
- [ ] I filled the [evaluation sheet](docs/supervision-evaluation.md) of my supervisor to help him/her improve
- [ ] I organized a departure apero (optional, depends on your supervisor);)

--------------------------------------------------------------------------
Behind Food
============

General information
-------------------

- **Student** : Grégory Geinoz - gregory.geinoz@edu.hefr.ch
- **Supervisor** : [Pascal Bruegger](https://gitlab.forge.hefr.ch/pascal.bruegger) - pascal.bruegger@hefr.ch
- **Client** : [Samuel Fringeli](https://gitlab.forge.hefr.ch/samuel.fringeli) - samuel.fringeli@hefr.ch
- **Dates** : du 27.09.2021 au 09.02.2022

Description
-----------

Behind food is a mobile application used in an exhibition on sustainable development. It allows visitors to explore the hidden sides of different everyday foods through a journey of various themes related to these foods. This pathway provides access to images, videos and texts to illustrate the characteristics of the foods concerned. These elements are updated by the team managing the exhibition, through a backend interface, and are accessible from the application through an API.
In the current version of the application, a webview is loaded which displays images and videos as the user moves through the structure, but the media is not saved in the application's local storage, making it impossible to use the application offline. As the exhibition aims to operate entirely offline, it would be necessary to ensure that the data displayed is downloaded locally, with a system for updating the latest changes made on the backend by the user of the application.

Content
-------

This repo contain all the documentation related to the project in the `docs/` folder. The code is in the `code/` folder.
