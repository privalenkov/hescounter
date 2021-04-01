const socket = new WebSocket('wss://centrifugo.donationalerts.com/connection/websocket')
const localsocket = io("http://127.0.0.1:5000")
const $watch = document.querySelector("#watch")
const $alert = document.querySelector("#alert")

let timer 

localsocket.on('message', function(msg){
    if (msg.channels) {
        let payload = {"params": {"channel": `$alerts:donation_${user_id}`,"token": msg.channels[0].token},"method": 1,"id": 2}
        socket.send(JSON.stringify(payload))
    }
        
})
localsocket.on('disconnect', function(e){
    connectClose()
    if (e.wasClean) {
        console.log(`[close] Соединение закрыто чисто, код=${e.code} причина=${e.reason}`);
    } else {
        console.log('[close] Соединение прервано');
    }
})


socket.onopen = function(e) {
    let payload = {"params": {"token": user_token},"id": 1}
    socket.send(JSON.stringify(payload))
};

socket.onmessage = function(event) {
    let data = JSON.parse(event.data)
    if (data.id == 1) {
        localsocket.send(event.data)   
    } else if ("type" in data.result) {
        startWatch() 
    } else if ("data" in data.result) {
        let donate = data.result.data.data
        if (milliseconds > 0) {
            if (donate.amount <= 100) {
                animText($alert, $watch, "10")
                milliseconds += 10000
            } else if (donate.amount <= 500 && donate.amount >= 100) {
                animText($alert, $watch, "50")
                milliseconds += 50000
            } else if (donate.amount <= 1000 && donate.amount >= 500) {
                animText($alert, $watch, "100")
                milliseconds += 100000
            }
        }
        
    }
    
};

socket.onerror = function(error) {
    console.log(`[error] ${error.message}`);
};

socket.onclose = function(event) {
    connectClose()
    if (event.wasClean) {
        console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
    } else {
        console.log('[close] Соединение прервано');
    }
};


function animText(el1, el2, ml) {
    console.log(milliseconds)
    el1.innerHTML = `+${ml}`
    el1.animate([
        {opacity: '0', padding: "0 0 80px 150px"},
        {opacity: '100', padding: "0 0 90px 150px"}
    ], 1000);
    el2.animate([
        {fontSize: '50px'},
        {fontSize: '55px'},
        {fontSize: '50px'},
        {fontSize: '52px'},
        {fontSize: '50px'},
    ], 500);
}

function connectClose() {
    $watch.innerHTML = "Я все :("
    clearInterval(timer)
}