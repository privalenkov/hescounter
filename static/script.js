$watch.innerHTML = isMillisecondsVisible ? "00:00:00:00" : "00:00:00"
const startWatch = () => {
    clearInterval(timer)
    timer = setInterval(() => {
        
        milliseconds -= 10
        let dateTimer = new Date(milliseconds)
        watchSetup(dateTimer, isMillisecondsVisible)
        
    }, 10)
}

function watchSetup(dateTimer, isMillisecondsVisible) {

    $watch.innerHTML = !isMillisecondsVisible ? 
        (`0${dateTimer.getUTCHours()}`).slice(-2) + ':' +
        (`0${dateTimer.getUTCMinutes()}`).slice(-2) + ':' +
        (`0${dateTimer.getUTCSeconds()}`).slice(-2) 
    : 
        (`0${dateTimer.getUTCHours()}`).slice(-2) + ':' +
        (`0${dateTimer.getUTCMinutes()}`).slice(-2) + ':' +
        (`0${dateTimer.getUTCSeconds()}`).slice(-2) + ':' +
        (`0${dateTimer.getUTCMilliseconds()}`).slice(-3, -1)
    if (milliseconds == 0) {
        $watch.innerHTML = isMillisecondsVisible ? "00:00:00:00" : "00:00:00"
        clearInterval(timer)
    }
}