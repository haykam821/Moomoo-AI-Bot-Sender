// ==UserScript==
// @name         Moomoo Bot Utilities
// @namespace    https://discord.gg/Uj3GWPy
// @version      1.3.0
// @description  Shows your internal ID and position.
// @author       Mega_Mewthree
// @match        *://moomoo.io/*
// @match        *://45.77.0.81/*
// @match        *://dev.moomoo.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
    var ws = null;
    var id = null;
    var pos = [];

    WebSocket = class extends WebSocket {
        constructor(...arg) {
            super(...arg);
            ws = this;
            this.addEventListener('message', function(e){
                handleMessage(e);
            });
            this._send = this.send;
            this.send = function (){
                if (arguments[0].startsWith("42")){
                    try {
                        const sent = JSON.parse(arguments[0].replace("42", ""));
                        if (sent[0] === "1"){
                            const req = new XMLHttpRequest();
                            req.open("POST", `http://localhost:15729/?spawned=true`, true);
                            req.send();
                        }
                    }catch (e){
                        console.error(e);
                    }
                }
                this._send.apply(this, arguments);
            };
        }
    };

    function handleMessage(e){
        var m = e.data;
        if (!m.startsWith(`42["2",`) && !m.startsWith(`42["3",`) && !m.startsWith(`42["5",`) && !m.startsWith(`42["6",`)) displayID();
        if (m.startsWith(`42["1",`)){
            id = /(42\[\"1\",)([0-9]+)\]/.exec(m)[2];
            const req = new XMLHttpRequest();
            req.open("POST", `http://localhost:15729/?ownerID=${id}`, true);
            req.send();
        }else if (m.startsWith(`42["3",`)){
            var packet = m.replace(`42["3",`, "");
            packet = packet.substr(0, packet.length - 1);
            var data = JSON.parse(packet);
            for (var i = 0, len = data.length / 13; i < len; i++){
                if (id == data[0 + i * 13]){
                    pos[0] = data[1 + i * 13];
                    pos[1] = data[2 + i * 13];
                }
            }
        }
    }

    function displayID(){
        var t = document.getElementById("ageText");
        var age = /AGE [0-9]+/.exec(t.innerHTML);
        t.innerHTML = `${age && age[0]} (${id}) [${pos.join(", ")}]`;
    }

    setInterval(() => {
        if (id){
            const req = new XMLHttpRequest();
            req.open("POST", `http://localhost:15729/?ownerID=${id}`, true);
            req.send();
        }
    }, 5000);
})();
