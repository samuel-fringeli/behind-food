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

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

var xhr = new XMLHttpRequest();
xhr.withCredentials = false;

var counter = 0;

var converter = new showdown.Converter();

function getContent(data) {
    if (data.media !== null) {
        if (data.media.mime.includes('image')) {
            return `<div style="padding: 20px;" @click="$event.target.ownerDocument.getElementById('myModal').style.display = 'block'; $event.target.ownerDocument.getElementById('modal-content-div').innerHTML='<img src=https://adelente-admin.samf.me${data.media.url}>'"><img style="max-width: 285px; max-height: 285px;" src="https://adelente-admin.samf.me${data.media.url}"></div>`;
            /* if (!data.Image_en_grand) {
                // return `<div style="height: 420px; width: 420px; background-image: url(https://adelente-admin.samf.me${data.media.url}); background-size: cover;"></div>`;
            } else {
                return '';
            } */
        }
        if (data.media.mime.includes('video')) {
            return `<video height="280" width="280" src="https://adelente-admin.samf.me${data.media.url}" controls></video>`;
        }
    }

    if (data.contenu !== null) {
        return `<div style="max-width: 250px; max-height: 285px; overflow: scroll;">${converter.makeHtml(data.contenu)}</div>`;
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

xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        let recursiveData = recursiveAdd(this.responseText);
        let flattenData = flatten(recursiveData);

        let allComponents = flattenData.map(item => {
            let viewId = 'view_' + item.id;
            if (item.titre === 'root') {
                viewId = 'root';
            }

            let template;
            if (!(item && item.enfants && item.enfants.length > 0)) {
                template = `<z-view>${getContent(item)}</z-view>`;
            } else {
                let zspots = '';
                for (let i = 0; i < item.enfants.length; i++) {
                    let fontSize = 18 - item.enfants[i].lien.split(' ').length;
                    zspots += `<z-spot slot="extension" :angle="${i * 35}" to-view="view_${item.enfants[i].id}">
                        <div style="font-size: ${fontSize}px;">${item.enfants[i].lien}</div>
                    </z-spot>`;
                }
                template = `<z-view>${getContent(item)}${zspots}</z-view>`;
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
});

xhr.open("GET", "https://adelente-admin.samf.me/zircle-elements?_limit=20000");
xhr.send();