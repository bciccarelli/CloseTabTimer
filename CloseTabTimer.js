timers = []
setInterval(function() {
    console.log(timers)
    removeArray = []
    for(let t in timers) {
        browser.runtime.sendMessage({"operation": "update", "tabID": timers[t].tabID})
        if (timers[t].endTime.getTime() - (new Date()).getTime() < 0) {
            browser.tabs.remove(timers[t].tabID)
            removeArray.unshift(t)
        }
    }
    for(let t in removeArray) {
        timers.splice(t,1)
    }
}, 1000)
function addTimer(endTime, tabID) {
    timers.push(new timer(endTime, tabID))
}
class timer {
    constructor(endTime, tabID){
        this.endTime = endTime;
        this.tabID = tabID;
    }
}

function receiveMessage(request) {
    for(let t in timers) {
        if (timers[t].tabID == request.tabID) {
            timers.splice(t,1)
        }
    }
    if(request.operation == "remove") {
        return
    } else if (request.operation == "create"){
        addTimer(request.endTime, request.tabID)
    }
}

browser.runtime.onMessage.addListener(receiveMessage);