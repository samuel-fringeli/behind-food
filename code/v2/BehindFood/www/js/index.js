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

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

let rootURL = 'cdvfile://localhost/persistent/';
let serverURL = 'https://adelente-admin.samf.me';
let localhost = 'http://127.0.0.1:8080/';

var converter;
var fileCounter = 0;
var size;
var stringJSON = '';
var newStringJSON = '';
var spinnerOptions = { dimBackground: true };

var devicePlatform = window.cordova.platformId;

function onErrorLoadFs(){
    navigator.notification.alert("Erreur en chargeant le FileSystem");
}

function onErrorCreateFile(){
    navigator.notification.alert("Erreur en créant le fichier");
}

function getContent(data) {
    if (data.media !== null) {
        var url = '';

        if(devicePlatform === 'android'){
            url = rootURL+data.media.hash+data.media.ext;
        }else{
            url = localhost+data.media.hash+data.media.ext;
        } 

        if (data.media.mime.includes('image')) {
            return `<div style="padding: 20px;" @click="$event.target.ownerDocument.getElementById('myModal').style.display = 'block'; $event.target.ownerDocument.getElementById('modal-content-div').innerHTML='<img src=${url}>'"><img style="max-width: 285px; max-height: 285px;" src="${url}"></div>`;
        }
        if (data.media.mime.includes('video')) {
            if (devicePlatform === 'android'){                
                return `<div height="350" width="350" onClick="(function(){
                    VideoPlayer.play('${url}',{scalingMode: VideoPlayer.SCALING_MODE.SCALE_TO_FIT_WITH_CROPPING});
                    return false;
                    })();return false;"><video height="250" width="250"></video></div>`;
            }else{
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
    // Fonction de téléchargement pour un fichier dont l'url est donné, basé sur une promesse jQuery

    // Le plugin FileTransfer est déprécié, mais toujours fonctionnel, et gère toujours très bien les gros fichiers et évite les CORS.
    var promise = new $.Deferred();
    window.requestFileSystem(PERSISTENT, 0, function(fs){
        var fileName = url.substring(url.lastIndexOf("/") + 1);
        fs.root.getFile(fileName, { create : true, exclusive : false }, function(fileEntry){
            var localURL = fileEntry.toURL();
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(url);
            fileTransfer.download(
                uri,
                localURL,
                function(entry){
                    // file downloaded
                    //SpinnerDialog.show("Téléchargement", "Fichier "+ (++fileCounter) +" sur "+size);
                    //SpinnerPlugin.activityStart("Téléchargement. Fichier "+ (++fileCounter) +" sur "+size, spinnerOptions);
                    promise.resolve();
                }, 
                function(err){
                    promise.reject();
                }
            );
        }, onErrorCreateFile);
    }, onErrorLoadFs);
    return promise;

    /* Téléchargement avec des XHR, fonctionnel mais ne gère pas bien les gros fichiers (memory-out-of-bounds)
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(){
            resolve(xhr);
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.send();
    }).then(function(xhr) {
        window.requestFileSystem(PERSISTENT, 0, function(fs){
            var fileName = url.substring(url.lastIndexOf("/") + 1);
            var fileData = xhr.response;
            if (fileData) {
                fs.root.getFile(fileName, { create : true, exclusive : false }, function(fileEntry){
                    fileEntry.createWriter(function(fileWriter){                        
                        SpinnerDialog.show("Téléchargement", "Fichier "+ (++fileCounter) +" sur "+size);
                        fileWriter.write(fileData);
                    });
                });
            }
        });
        return xhr;
    });*/
    
}

function downloadAllFiles(filesArray){
    // Fonction qui permet de résoudre toutes les promesses une après l'autre
    size = filesArray.length;
    var current = Promise.resolve();
    filesArray.forEach(function(url){
        current = current.then(function(){
            return downloadFile(url);
        });
    });
    return current;
}

function prepareJSON(json, withDownload){
    // Fonction à modifier afin de ne l'utiliser que si on a des fichiers à télécharger, flattenData ne devrait pas être retourné
    let filesArray = [];    
    let recursiveData = recursiveAdd(stringJSON);
    let flattenData = flatten(recursiveData);
    let components = flattenData.map(item => {
        if (!(item && item.enfants && item.enfants.length > 0)) {
            if (item.media !== null) {
                if (navigator.connection.type !== 'none' && withDownload) {
                    filesArray.push(serverURL+item.media.url);
                }
            }
        } else {
            if (item.media !== null) {
                if (navigator.connection.type !== 'none' && withDownload) {
                    filesArray.push(serverURL+item.media.url);
                }
            }
        }
    });
    if (withDownload) {
        SpinnerPlugin.activityStart("Téléchargement des fichiers ...")
        downloadAllFiles(filesArray).then(function(){
            SpinnerPlugin.activityStop();
            //SpinnerDialog.hide();
        }).catch(function(e){
            navigator.notification.alert("Something went wrong : " + e);
        })
    }
    return flattenData;
}

function initApp(flattenData){
    // Fonction de mise en place du template pour la Vue
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
                        fontSize = 25 - item.enfants[i].lien.split(' ').length;
                    }else{
                        fontSize = 17 - item.enfants[i].lien.split(' ').length;
                    }                        
                    zspots += `<z-spot slot="extension" :angle="${i * 35}" to-view="view_${item.enfants[i].id}">
                        <div style="font-size: ${fontSize}px; padding:5px;">${item.enfants[i].lien}</div>
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

function writeFile(fileEntry, fileData){
    // Fonction pour créer le fichier cachedJSON à la première utilisation puis prepareJSON
    fileEntry.createWriter(function(fileWriter){
        fileWriter.onwriteend = function(){
            let flattenData = prepareJSON("cachedJSON.json", true);
            initApp(flattenData);
        };
        fileWriter.onerror = function(e){
            navigator.notification.alert(e, null, 'fileWriter error');
        };
        fileWriter.write(fileData);
    });
}

function onOKpressed(){
    //OK pressé pour première utilisation avec connection
    window.requestFileSystem(PERSISTENT, 0, function(fs){
       var xhr = new XMLHttpRequest();
       xhr.open("GET", "https://adelente-admin.samf.me/zircle-elements?_limit=20000", false);
       xhr.onload = function(){
        if (this.status === 200) {
            var fileData = this.response;
            stringJSON = this.response;
            fs.root.getFile("cachedJSON.json", { create : true, exclusive : false }, function(fileEntry){
                writeFile(fileEntry, fileData);
            }, onErrorCreateFile);
        }
       };
       xhr.send(); 
    }, onErrorLoadFs);
}

function onConfirm(index){
    if (index === 1) {
        //Bouton OUI : mise à jour désirée
        //Pas encore implémenter de fonction de contrôle, pour l'instant c'est pour le debugage
        //ToDo: télécharger newJSON.json, comparer cachedJSON (déjà chargé dans stringJSON global)
        let flattenData = prepareJSON("cachedJSON.json", true);
        initApp(flattenData);
    }else{
        //Bouton NON : mise à jour non désirée
        let flattenData = prepareJSON("cachedJSON.json", false);
        initApp(flattenData);
    }
}

function onConfirmExit(){
    // Aucun fichier enregistré et pas de connexion, quitte l'application
    navigator.app.exitApp();
}

function onDeviceReady() {
    converter = new showdown.Converter();

    // Pour iOS, les WkWebViews empêchent l'utilisation des URLs locaux (cvdfile:// et file:///).
    // Afin d'éviter d'utiliser un reader pour chaque fichier à afficher, on peut démarrer un serveur local privé 
    // dans le cadre de l'application. Ainsi, on va pouvoir accéder aux fichiers locaux avec une adresse accéptée par les
    // WkWebViews dans les attributs src des tags image et video. 
    // "file:///var/mobile/Applications/<UUID>/Documents/XXX.png" (fs.root et cordova.file.documentsDirectory iOS) est remplacé 
    // par "http://127.0.0.1:8080/XXX.png", types de liens utilisables dans les attributs src.
    if(devicePlatform === 'ios'){
        cordova.plugins.CorHttpd.startServer({
            'www_root' : cordova.file.documentsDirectory.replace('file://',''),
            'port' : 8080,
            'localhost_only' : true
        }, null, function(err) {
            navigator.notification.alert("Erreur de serveur local : " + err);
        });
    }

    window.requestFileSystem(PERSISTENT, 0, function(fs){
        fs.root.getFile("cachedJSON.json", {create : false}, function(fileEntry){
            fileEntry.file(function (file){
                var reader = new FileReader();
                reader.onloadend = function(event){
                    stringJSON = event.target.result;
                }
                reader.readAsText(file);
            });
            // Un fichier cachedJSON existe dans les fichiers
            if (navigator.connection.type !== 'none') {
                // Connection détectée
                navigator.notification.confirm("Voulez-vous mettre à jour le contenu de l'application ? Le processus peut prendre quelques minutes.", onConfirm, 'Mise à jour', ['OUI','NON']);
            }else{
                // Connection non-détectée
                navigator.notification.alert("Pas de connection à internet détéctée. L'application utilisera les fichiers locaux.", function(){
                    initApp(prepareJSON("cachedJSON.json", false));
                });
            }
        }, function(){
            // Pas de fichier cachedJSON dans les fichiers
            if (navigator.connection.type !== 'none') {
                // Connection détectée
                navigator.notification.alert("Première utilisation détéctée. L'initialisation de l'application prendra quelques minutes", onOKpressed);
            }else{
                // Connection non-détectée
                navigator.notification.alert("Erreur : première utilisation détéctée. Veuillez trouver une connection à internet pour utiliser l'application pour la première fois.", onConfirmExit);
            }
        });
    }, onErrorLoadFs);
}