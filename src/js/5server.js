
class Server {
    static host = 'http://192.168.3.46'
    //   static host = ''
    constructor() {
        this.op = {
            dfid: "f7071a9b7600e17878977cca066999d3",
            mid: "f7071a9b7600e17878977cca066999d3",
            token: "",
            userid: "0",
            uuid: "f7071a9b7600e17878977cca066999d3",
            appid: 1014,
        };
    }
    jsonp(url, callback) {
        return new Promise((resolve) => {
            let oScript = document.createElement("script");
            oScript.src = url;
            document.body.appendChild(oScript);
            document.body.removeChild(oScript);
            try {
                window[callback] = function (data) {
                    resolve(data)
                }
            } catch (e) { }
        })

    }
    getSearchList(op) {
        return new Promise((resolve) => {
            window.infSign({ ...this.op, ...op }, null, {
                useH5: !0,
                postType: "json",
                callback: async (data) => {
                    let url = `https://complexsearch.kugou.com/v2/search/song?` + Server.join(data);
                    let result = await this.jsonp(url, op.callback);
                    resolve(result)
                },
            });
        })

    }
    getAudio(op) {
        return new Promise((resolve) => {
            window.infSign({ ...this.op, ...op }, null, {
                useH5: !0,
                postType: "json",
                callback: async (data) => {
                    let result = await fetch(Server.host + `/api/songinfo?${Server.join(data)}`).then((d) => d.json()).then((d) => d);
                    resolve(result)
                },
            });
        })
    }
    getAudioUrl(api, audio) {
        return new Promise(async (resolve) => {
            let result = await fetch(Server.host + `/api/${api}?hash=${audio.hash}&url=${audio.url}`
            ).then((d) => d.json()).then((d) => d);
            resolve(result)
        })
    }
    static join(data) {
        return Object.keys(data).reduce((obj, obj1, index) => {
            return (obj += `${index ? "&" : ""}${obj1}=${data[obj1]}`);
        }, "");
    }
}
const serve = new Server()
