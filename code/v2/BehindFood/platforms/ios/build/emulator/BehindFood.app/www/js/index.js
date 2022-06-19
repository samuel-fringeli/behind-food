/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('offline', onOffline, false);
document.addEventListener('online', onOnline, false);

window.ALL_FILES_DOWNLOADED = false;

let rootURL = 'cdvfile://localhost/persistent/';
let serverURL = 'https://adelente-admin.samf.me';
let localhost = 'http://127.0.0.1:8080/';

var converter;
var spinnerOptions = { dimBackground: true };
var devicePlatform = window.cordova.platformId;
var filesToDownload = [];
var filesArraySize = 0;
var connectionChanged = 0;
var downloadFailed = false;

let cachedJsonDatas;

function onErrorLoadFs(){
    navigator.notification.alert("Erreur en chargeant le FileSystem");
}

function onErrorCreateFile(){
    navigator.notification.alert("Erreur en créant le fichier");
}

function getContent(data) {
    // Fonction originale de l'application web pour créer des tags HTML selon le contenu.
    if (data.media !== null) {
        var url = '';

        if (devicePlatform === 'android') {
            url = rootURL+data.media.hash+data.media.ext;
        } else{
            url = localhost+data.media.hash+data.media.ext;
        }

        if (data.media.mime.includes('image')) {
			if (!window.ALL_FILES_DOWNLOADED) {
				url = 'adelante.png';
			}
            return `<div style="padding: 20px;" @click="$event.target.ownerDocument.getElementById('myModal').style.display = 'block'; $event.target.ownerDocument.getElementById('modal-content-div').innerHTML='<img src=${url}>'"><img style="max-width: 285px; max-height: 285px;" src="${url}"></div>`;
        }
        if (data.media.mime.includes('video')) {
            if (devicePlatform === 'android'){
                return `<div height="350" width="350" onClick="(function(){
                    VideoPlayer.play('${url}',{volume:1.0, scalingMode: VideoPlayer.SCALING_MODE.SCALE_TO_FIT});
                    return false;
                    })();return false;"><video height="250" width="250"></video></div>`;
            }else{
				if (!window.ALL_FILES_DOWNLOADED) {
					url = 'adelante.png';
					return `<div style="padding: 20px;" @click="$event.target.ownerDocument.getElementById('myModal').style.display = 'block'; $event.target.ownerDocument.getElementById('modal-content-div').innerHTML='<img src=${url}>'"><img style="max-width: 285px; max-height: 285px;" src="${url}"></div>`;
				}
                return `<video height="280" width="280" src="${url}" controls></video>`;
            }
        }
    }

    if (data.contenu !== null) {
        if (devicePlatform === 'android'){
            return `<div class="textContentAndroid" style="max-height: 285px; overflow: auto;">${converter.makeHtml(data.contenu)}</div>`;
        }else{
            return `<div class="textContent" style="max-height: 285px; overflow: auto;">${converter.makeHtml(data.contenu)}</div>`;
        }
    }
    return 'élément manquant...';
}

function recursiveAdd(responseText) {
    // Fonction originale de l'application web pour ajouter récursivement le contenu de la réponse JSON.
    let reformatResult = JSON.parse(responseText);
    function recursiveChildrenAdd(currentElements) {
        for (let i = 0; i < currentElements.length; i++) {
            let wholeElement = reformatResult.filter(item => item.id === currentElements[i].id)[0];
            if (wholeElement.enfants && wholeElement.enfants.length > 0) {
                currentElements[i].enfants = wholeElement.enfants;
            }
            if (currentElements[i].enfants) {
                recursiveChildrenAdd(currentElements[i].enfants);
            }
        }
        return currentElements;
    }
    return recursiveChildrenAdd(reformatResult).filter(item => item.titre === 'root')[0];
}

function flatten(initialData) {
    // Fonction originale de l'application web pour aplatir les éléments ajoutés récursivement.
    let resultData = [];
    function flatten(data) {
        resultData.push(data)

        if (!(data && data.enfants && data.enfants.length > 0)) {
            return;
        }

        for (let i = 0; i < data.enfants.length; i++) {
            flatten(data.enfants[i]);
        }
    }
    flatten(initialData);
    return resultData;
}

function downloadFile(url){
    // Fonction de téléchargement pour un fichier dont l'URL est donné, retourne une promesse jQuery. Peu importe si le nom du
    // fichier passé en paramètre existe déjà sur le disque, cela écrasera le fichier existant grâce
    // aux paramètres {create:true,exclusive:false} du FileSystem.

    // Le plugin FileTransfer est déprécié, mais toujours fonctionnel, et gère toujours très bien les gros fichiers
    // et évite les problèmes de CORS.
    var promise = new $.Deferred();
    window.requestFileSystem(PERSISTENT, 0, function(fs){
        // Permet de trouver la sous-chaîne à partir du dernier "/", donc le nom du fichier et l'extension.
        var fileName = url.substring(url.lastIndexOf("/") + 1);
        // Permet de trouver la sous-chaîne à partir du premier "|", donc l'URL complet sans la date.
        var fileUrl = url.substring(url.indexOf("|") + 1);

        fs.root.getFile(fileName, { create : true, exclusive : false }, function(fileEntry){
            var localURL = fileEntry.toURL();
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(fileUrl);
            fileTransfer.download(
                uri,
                localURL,
                function(entry){
                    console.log("File downloaded : " + localURL);
                    promise.resolve();
                },
                function(err){
                    console.log(err);
                    downloadFailed = true;
                    document.getElementById("myLoadingModal").style.display = 'none';
                    promise.reject();
                },
                true
            );
        }, onErrorCreateFile);
    }, onErrorLoadFs);
    return promise;
}

function downloadAllFiles(filesArray){
    // Fonction qui permet de résoudre toutes les promesses une après l'autre selon un tableau d'URLs de fichiers à télécharger.
    var fileIndex = 0;
    var current = Promise.resolve();
    filesArray.forEach(function(url){
        current = current.then(function(){
            document.getElementById("myProgress").value = ++fileIndex;
            document.getElementById("myProgressText").innerHTML = "Fichier " + fileIndex + " sur " + filesArraySize;
            return downloadFile(url);
        });
    });
    return current;
}

function prepareForDownloads(filesArray, fromUpdate){
    // Fonction qui permet de lancer la série de promesses pour un tableau d'URLs.
    document.getElementById("myLoadingModal").style.display = 'block';
    document.getElementById("myProgress").max = filesArraySize;
    downloadFailed = false;
    downloadAllFiles(filesArray).then(function(){
        // Une fois tous les téléchargements terminés, enlever la barre de progression et redémarrer l'application si màj. Si iOS, éteindre le serveur local et redémarrer l'app une fois éteint.
        document.getElementById("myLoadingModal").style.display = 'none';
        if (fromUpdate || connectionChanged > 1) {
            if(devicePlatform === 'ios'){
                cordova.plugins.CorHttpd.stopServer(function(){
                    window.location.reload(true);
                }, function(err) {
                    console.log("Erreur à l'arrêt du serveur local : " + err);
                });
            }else{
                window.location.reload(true);
            }
        }else{
            // Si première utilisation, contrôle complet du contenu. Pas besoin de redémarrer car la Vue a été construite avec le JSON fraîchement téléchargé.
            prepareTocheckIfAllFilesExist(filesArray);
        }
    }).catch(function(e){
        if (connectionChanged < 2) {
            if (navigator.connection.type === 'none') {
                navigator.notification.alert("Une erreur est survenue lors du téléchargement des fichiers. Veuillez trouver une connexion à internet et mettre à jour l'application pour compléter le téléchargement.", null, "Erreur lors du téléchargement");
            }else{
                navigator.notification.alert("Une erreur est survenue lors du téléchargement des fichiers. Veuillez essayer de mettre à jour l'application pour compléter le téléchargement.", null, "Erreur lors du téléchargement");
            }
        }
    })
}

function checkIfFileExists(url){
    // Fonction qui permet de contrôler si un fichier existe dans le FileSystem à partir de son URL, retourne une promesse JQuery.
    var promise = new $.Deferred();
    var fileName = url.substring(url.lastIndexOf("/") + 1);
    window.requestFileSystem(PERSISTENT, 0, function(fs){
        fs.root.getFile(fileName, { create : false }, function(fileEntry){
            promise.resolve();
        }, function(error){
            filesToDownload.push(url);
            promise.reject();
        });
    }, onErrorLoadFs);
    return promise;
}

function checkIfAllFilesExist(filesArray){
    // Fonction qui permet de résoudre toutes les promesses une après l'autre selon un tableau d'URLs de fichiers à contrôler.
    var current = Promise.resolve();
    filesArray.forEach(function(url){
        current = current.then(function(){
            return checkIfFileExists(url);
        }, function(err){
            filesArraySize++;
            return checkIfFileExists(url);
        });
    });
    return current;
}

function prepareTocheckIfAllFilesExist(filesArray, callback){
    // Fonction qui permet de lancer la série de promesses pour un tableau d'URLs.
    // Si une promesse est rompue, cela va être catché et il est donc intéressant d'informer l'utilisateur qu'il manque
    // un ou plusieurs fichiers et qu'il serait nécessaire de mettre à jour l'application.
    filesToDownload = [];
    filesArraySize = 0;
    SpinnerPlugin.activityStart("Contrôle du contenu local en cours...");
    checkIfAllFilesExist(filesArray).then(function(){
        SpinnerPlugin.activityStop();
		window.ALL_FILES_DOWNLOADED = true;
		callback();
    }).catch(function(e){
        // Un fichier n'a pas été trouvé
        SpinnerPlugin.activityStop();
        if (filesToDownload.length !== 0 && downloadFailed === false) {
            if (navigator.connection.type === 'none') {
                navigator.notification.alert("Certains fichiers de contenu sont manquants. Afin de pouvoir profiter au maximum de l'application, veuillez trouver une connexion à internet et mettre à jour l'application pour télécharger les fichiers manquants.", null, "Contenu manquant");
            }else{
                navigator.notification.alert("Certains fichiers de contenu sont manquants. Afin de pouvoir profiter au maximum de l'application, veuillez mettre à jour l'application pour télécharger les fichiers manquants.", null, "Contenu manquant");
            }
        }
		callback();
    })
}

function deleteFile(url){
    // Fonction qui permet de supprimer un fichier des fichiers locaux à partir de son URL.
    var fileName = url.substring(url.lastIndexOf("/") + 1);
    window.requestFileSystem(PERSISTENT, 0, function(fs) {
        fs.root.getFile(fileName, { create : false }, function(fileEntry){
            fileEntry.remove(function(file){
                console.log("File removed : "+file);
            }, function(err){
                console.log("Error while removing file : "+err);
            });
        });
    });
}

function deleteAllFiles(filesArray){
    // Fonction qui permet de supprimer tous les fichiers d'un tableau d'URLs.
    // URL de type : "<updated_at>|https://adelente.../uploads/<hash>.<ext>"
    filesArray.forEach(function(url){
        deleteFile(url);
    });
}

function extractFilesAndFlatten(json){
    // Fonction qui permet de préparer le flattenData afin d'initialiser la Vue, mais également un tableau d'URLs pour les fichiers
    // à télécharger si c'est nécessaire. Sinon le tableau est retourné vide. Ces deux éléments sont retournés dans un objet à
    // utiliser comme ceci : let object = extractFilesAndFlatten(json); object.filesArray[x] ou object.flattenData.
    let filesArray = [];
    let recursiveData = recursiveAdd(json);
    let flattenData = flatten(recursiveData);
    let components = flattenData.map(item => {
        if (!(item && item.enfants && item.enfants.length > 0)) {
            if (item.media !== null) {
                // URL de type : "<updated_at>|https://adelente.../uploads/<hash>.<ext>"
                // Ainsi, même si un fichier existe déjà avec le même nom mais qu'il a été mis à jour,
                // les tests de comparaisons le remarqueront.
                filesArray.push(item.media.updated_at+"|"+serverURL+item.media.url);
            }
        } else {
            if (item.media !== null) {
                filesArray.push(item.media.updated_at+"|"+serverURL+item.media.url);
            }
        }
    });
    return { filesArray, flattenData };
}

function initApp(flattenData){
    // Fonction de mise en place du template pour la Vue.
    let allComponents = flattenData.map(item => {
        let viewId = 'view_' + item.id;
        if (item.titre === 'root') {
            viewId = 'root';
        }
        let template;
        if (!(item && item.enfants && item.enfants.length > 0)) {
            template = `<z-view>${getContent(item)}</z-view>`;
        } else {
            if (devicePlatform === 'android'){
                let zspots = '';
                for (let i = 0; i < item.enfants.length; i++) {
                    let fontSize = 0;
                    if (window.screen.width > 600){
                        fontSize = 13 - item.enfants[i].lien.split(' ').length;
                    }
                    if (window.screen.width > 1000){
                        fontSize = 19 - item.enfants[i].lien.split(' ').length;
                    }
                    zspots += `<z-spot slot="extension" :angle="${i * 35}" to-view="view_${item.enfants[i].id}">
                        <div style="font-size: ${fontSize}px; padding:5px;">${item.enfants[i].lien}</div>
                    </z-spot>`;
                }
                template = `<z-view>${getContent(item)}${zspots}</z-view>`;
            }else{
                let zspots = '';
                for (let i = 0; i < item.enfants.length; i++) {
                    let fontSize = 0;
                    if (window.screen.width > 500){
                        fontSize = 20 - item.enfants[i].lien.split(' ').length;
                    }
                    if (window.screen.width > 1000){
                        fontSize = 30 - item.enfants[i].lien.split(' ').length;
                    }else{
                        fontSize = 20 - item.enfants[i].lien.split(' ').length;
                    }
                    zspots += `<z-spot slot="extension" :angle="${i * 35}" to-view="view_${item.enfants[i].id}">
                        <div style="font-size: ${fontSize}px; word-wrap: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; -ms-hyphens: auto;">${item.enfants[i].lien}</div>
                    </z-spot>`;
                }
                template = `<z-view>${getContent(item)}${zspots}</z-view>`;
            }

        }
        return { viewId, template };
    });
    let components = {};

    for (let i = 0; i < allComponents.length; i++) {
        components[allComponents[i].viewId] = { template: allComponents[i].template };
    }

    new Vue({
        el: '#app',
        components,
        mounted() {
            this.$zircle.config({ style: { theme: 'white' }})
            this.$zircle.setView('root')
        }
    });
}

function createJsonFile(callback){
    // OK pressé pour première utilisation avec connexion.
    // Donc télécharger le JSON, télécharger tous les fichiers, contrôler si tous les fichiers ont bien été téléchargés, initialiser l'app et enregistrer cachedJSON.json.
    // Également enregistrer dans la variable globale cachedJsonDatas pour une éventuelle mise à jour demandée par l'utilisateur.
	window.requestFileSystem(PERSISTENT, 0, function(fs){
		let fileData = window.BASE_DATA;
		fs.root.getFile("cachedJSON.json", { create : true, exclusive : false }, function(fileEntry){
			fileEntry.createWriter(function(fileWriter){
				fileWriter.onwriteend = callback;
				fileWriter.onerror = function(e){
					navigator.notification.alert(e, null, 'fileWriter error');
				};
				fileWriter.write(fileData);
			});
		}, onErrorCreateFile);
    }, onErrorLoadFs);
}

function downloadJsonAndCompare(){
    // Fonction de contrôle de contenu. Cette fonction télécharge une nouvelle version du JSON sur le serveur qui peut avoir
    // des changements par rapport au JSON enregistré. Elle va ensuite comparer les deux tableaux de fichiers nécessaires au
    // bon fonctionnement de leur application respective, générés dans le extractFilesAndFlatten. Elle prend également en compte
    // les éventuels fichiers manquants trouvés au démarrage (fichiers trouvés dans le JSON enregistré mais pas dans les fichiers locaux).
    window.requestFileSystem(PERSISTENT, 0, function(fs){
       var xhr = new XMLHttpRequest();
       xhr.open("GET", "https://adelente-admin.samf.me/zircle-elements?_limit=20000");
       xhr.onload = function(){
        if (this.status === 200) {
            var newJson = this.response;

            let newJsonDatas = extractFilesAndFlatten(newJson);
            let filesToDownloadOnline = [];

            // Parcourir le tableau de newJsonDatas.
            for (var i = 0; i < newJsonDatas.filesArray.length; i++) {
                // Si on trouve le fichier dans le tableau de cachedJsonDatas (date & url & nom égaux)
                // alors le sortir du tableau de cachedJsonDatas.
                var url = newJsonDatas.filesArray[i];
                let index = cachedJsonDatas.filesArray.indexOf(url);
                if(index > -1){
                     cachedJsonDatas.filesArray.splice(index,1);
                }else{
                    // Sinon mettre cet url dans le tableau filesToDownload.
                    filesToDownloadOnline.push(url);
                    filesArraySize++;
                }
            }

            // Appondre les deux tableaux de fichiers à télécharger.
            let result = filesToDownloadOnline.concat(filesToDownload);
            filesToDownload = [];

            // Tous les fichiers restants dans le tableau cachedJsonDatas doivent donc être supprimés car ils ne sont
            // pas utilisés dans newJsonDatas, ils sont donc en trop.
            if(cachedJsonDatas.filesArray.length > 0){
                deleteAllFiles(cachedJsonDatas.filesArray);
                console.log("files to delete : " + cachedJsonDatas.filesArray);
            }

            // Tous les fichiers dans le tableau result doivent être téléchargés, c'est à dire les nouveaux fichiers
            // trouvés dans newJsonDatas et ceux qui manqueraient dans filesToDownload.
            if (result.length > 0) {
                prepareForDownloads(result, true);
                console.log("files to download : " + result);
            }

            // Remplacer cachedJsonDatas par newJsonDatas.
            cachedJsonDatas = newJsonDatas;

            // Écraser cachedJSON avec newJSON.
            fs.root.getFile("cachedJSON.json", { create : true, exclusive : false }, function(fileEntry){
                fileEntry.createWriter(function(fileWriter){
                    fileWriter.onwriteend = function(){
                        // Si les deux listes sont vides, c'est que le contenu est à jour.
                        if(result.length === 0){
                            // Aucun contenu n'a été téléchargé, recharger la page dans tous les cas.
                            window.location.reload(true);
                        }else{
                            // Du nouveau contenu a été téléchargé, il est nécessaire de recharger la page. Ceci est effectué dans la fonction prepareForDownloads().
                            result = [];
                        }
                    };
                    fileWriter.onerror = function(e){
                        navigator.notification.alert(e, null, 'fileWriter error');
                    };
                    fileWriter.write(newJson);
                });
            }, onErrorCreateFile);
        }
       };
       xhr.send();
    }, onErrorLoadFs);
}

function onConfirmUpdate(index){
    // Fonction qui gère les deux choix possibles quand l'utilisateur appuie sur le bouton de mise à jour, avec une connexion.
    if (index === 1) {
        // Bouton OUI : mise à jour désirée.
        downloadJsonAndCompare();
    }else{
        // Bouton NON : mise à jour non désirée.
        // Dans le cas où des fichiers seraient manquants (déterminés au démarrage), rappel.
        if (filesToDownload.length !== 0) {
            console.log(filesToDownload);
            navigator.notification.alert("Certains fichiers de contenu sont manquants. Afin de pouvoir profiter au maximum de l'application, veuillez mettre à jour l'application pour télécharger les fichiers manquants.", null, "Contenu manquant");
        }
    }
}

function onConfirmExit(){
    // Aucun fichier JSON enregistré et pas de connexion, quitter l'application après OK.
    navigator.app.exitApp();
}

function onButtonClicked(){
    // Fonction qui gère le bouton de mise à jour.
	SpinnerPlugin.activityStart("Chargement des informations de mise à jour...");
	let xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function() {
		if (this.readyState === 4) {
			let downloadSize = this.responseText;
			SpinnerPlugin.activityStop();
			navigator.notification.confirm("Voulez-vous mettre à jour le contenu de l'application ? Le processus peut prendre quelques minutes et téléchargera " + downloadSize +  " de données.", onConfirmUpdate, 'Mise à jour', ['OUI','NON']);
		}
	});
	xhr.open("GET", "https://s3.samf.me/adelante_download_size.txt");
	xhr.send();
}

function onOffline(){
    connectionChanged++;
    document.getElementById("br-icon").style.display = "none";
    if (connectionChanged > 1) {
        window.location.reload(true);
    }
}

function onOnline(){
    connectionChanged++;
    document.getElementById("br-icon").style.display = "block";
    if (connectionChanged > 1) {
        window.location.reload(true);
    }
}

function onDeviceReady() {
    // Pour être sûr que tous les plugins soient bien prêts, tout est démarré à partir de cet événement.
    converter = new showdown.Converter();

    // Pour iOS, les WkWebViews empêchent l'utilisation des URLs locaux (cvdfile:// et file:///).
    // Afin d'éviter d'utiliser un reader pour chaque fichier à afficher, on peut démarrer un serveur local privé
    // au cadre de l'application qui remplacera les URLs locaux par des URLs HTTP. Ainsi, on va pouvoir accéder aux fichiers locaux
    // avec une adresse accéptée par les WkWebViews dans les attributs src des tags image et video.
    // ----------------------------------------------------------------------------------------------------------------------------
    // "file:///var/mobile/Applications/<UUID>/Documents/XXX.png" (fs.root et cordova.file.documentsDirectory iOS) est remplacé
    // par "http://127.0.0.1:8080/XXX.png", types de liens utilisables dans les attributs src.
    if(devicePlatform === 'ios'){
        cordova.plugins.CorHttpd.startServer({
            'www_root' : cordova.file.documentsDirectory.replace('file://',''),
            'port' : 8080,
            'localhost_only' : true
        }, null, function(err) {
            console.log("Erreur au démarrage du serveur local : " + err);
        });
    }

	function onFileEntrySuccess(fileEntry){
		fileEntry.file(function (file){
			var reader = new FileReader();
			reader.onloadend = function(event){
				// Un fichier cachedJSON existe dans les fichiers locaux. Directement générer cachedJsonDatas.
				cachedJsonDatas = extractFilesAndFlatten(event.target.result);
				if (navigator.connection.type !== 'none') {
					// Connexion détectée, contrôler si tous les fichiers demandés par ce JSON sont disponibles.
					prepareTocheckIfAllFilesExist(cachedJsonDatas.filesArray, function() {
						initApp(cachedJsonDatas.flattenData);
					});
				}else{
					// Connexion non-détectée. Contrôle de contenu et lancement de l'application. Cacher le bouton download.
					document.getElementById("br-icon").style.display = "none";
					prepareTocheckIfAllFilesExist(cachedJsonDatas.filesArray, function() {
						initApp(cachedJsonDatas.flattenData);
					});
				}
			}
			reader.readAsText(file);
		});
	}

    // Contrôler si cachedJSON.json existe, si oui, déjà mettre le résultat dans une variable globale pour une utilisation future.
    window.requestFileSystem(PERSISTENT, 0, function(fs){
        fs.root.getFile("cachedJSON.json", {create : false}, onFileEntrySuccess, function() {
			createJsonFile(function() {
				window.requestFileSystem(PERSISTENT, 0, function(fs){
					fs.root.getFile("cachedJSON.json", {create : false}, onFileEntrySuccess, function() {
						navigator.notification.alert("Erreur : fichier cachedJSON.json non trouvé.");
					});
				}, onErrorLoadFs);
			})
		});
    }, onErrorLoadFs);
}
