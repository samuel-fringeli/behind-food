Git repo template for student project
=====================================

NOTE: [VERSION FRANCAISE ICI](README.md)

This is a template that you can use for any semester project, internship project or Bachelor/Master thesis. It contains the following files:

- a `docs/` folder that will contain useful project documents (weekly meeting minutes, specifications, presentations slides, planning, report and so on.)
- a `code/` folder that will contain your code. Two files are already there:
	- `.gitignore` : list all the files that you want Git to ignore (config files, passwords, IDEs configs, libraries, and so on.). Its content will vary depending on the language/technologies you use.
	- `README.md` : explain how to use the code (prerequisites, dependencies, things to do to install and run the software)

To use it, just download this repository and create a new Git repo for your project.

If you want to improve this template, just create a [Merge Request](https://gitlab.forge.hefr.ch/jacky.casas/student-project-template/merge_requests) or suggest improvements by opening an [Issue](https://gitlab.forge.hefr.ch/jacky.casas/student-project-template/issues).

This README contains the general information about your project (that you have to fill). Delete all that is above the dotted line here below.

PS: README files formatting is done in [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

PS2: If you use this template, please give it a star (on top of the page). It'll gain visibility among the public repos of HEIA-FR.

--------------------------------------------------------------------------

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
Project name
============

General information
-------------------

- **Student/Intern**: my name - my-email@hefr.ch
- **Supervisor**:  [Jacky Casas](https://gitlab.forge.hefr.ch/jacky.casas) - jacky.casas@hefr.ch
- **Professeur**: [Elena Mugellini](https://gitlab.forge.hefr.ch/elena.mugellini) - elena.mugellini@hefr.ch
- **Professeur**: [Omar Abou Khaled](https://gitlab.forge.hefr.ch/omar.aboukhaled) - omar.aboukhaled@hefr.ch
- **Dates**: from 01.07.2020 to 31.08.2020


Context
--------

This project ...


Description
-----------

The goal of the project is to ...


Content
-------

This repo contain all the documentation related to the project in the `docs/` folder. The code is in the `code/` folder.
