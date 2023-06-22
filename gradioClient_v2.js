function gradioClient(domain, fn) {
    let _this = this;
    this.url = "wss://" + domain + "/queue/join"
    this.fn_index = parseInt(fn)

    //"wss://t2.nonlinearform.com/queue/join"

    this.predict = async (param_list) => {
        const process = new Promise((resolve, reject) => {
            const session_hash = Math.random().toString(36).substring(2);
            const websocket = new WebSocket(this.url);
            websocket.onmessage = function (event) {
                const _data = JSON.parse(event.data)
                const fn = _this.fn_index;
                if (_data.msg === "send_hash") {
                    websocket.send(JSON.stringify({
                        fn_index: fn,
                        session_hash
                    }));
                }
                if (_data.msg === "send_data") {
                    console.log(param_list)
                    websocket.send(JSON.stringify({
                        fn_index: fn,
                        data: param_list,
                        "event_data": null,
                        session_hash
                    }));
                }
                if (_data.msg === "process_completed") {
                    resolve(_data.output.data);
                }
                console.log(_data);
            }
        });

        var result = await process;
        return result

    }


    this.convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };
}


