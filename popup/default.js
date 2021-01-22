let thisInterval
function start(){
    let endTime = new Date();
    duration = document.getElementById("endTime").valueAsNumber
    let hours, minutes, seconds
    [hours, minutes, seconds] = milliToHourMinute(duration)
    endTime.setHours( hours, minutes, 0, 0);
    
    let dateNow = new Date()
    if( endTime.getTime() - dateNow.getTime() > 0){
        [hours, minutes, seconds] = milliToHourMinute(endTime.getTime() - dateNow.getTime())
        updateTimer(hours + "h, " + minutes + "m, " + seconds + "s")
        var query = { active: true, currentWindow: true };
        function callback(tabs) {
            browser.runtime.sendMessage({"operation": "create", "endTime": endTime, "tabID": tabs[0].id})
        }
        browser.tabs.query(query, callback)
    } else {
        updateTimer("Invalid Time")
        return
    }
    startCountdown(endTime)
}

function clear(){
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
        browser.runtime.sendMessage({"operation": "remove", "tabID": tabs[0].id})
    }
    browser.tabs.query(query, callback)
    clearInterval(thisInterval)
    updateTimer("---")
}
function startCountdown(endTime) {
    clearInterval(thisInterval)
    timerTick(endTime)
    thisInterval = setInterval(function(){
        timerTick(endTime)
    }, 1000)
}

function timerTick(endTime) {
    let dateNow = new Date()
    let hours, minutes, seconds
    [hours, minutes, seconds] = milliToHourMinute(endTime.getTime() - dateNow.getTime())
    if(seconds < 0) {
        clearInterval(thisInterval)
        updateTimer("---")
        return
    }
    updateTimer(hours + "h, " + minutes + "m, " + seconds + "s")
}

function updateTimer(timerText){
    document.getElementById("timeUntilClose").innerText = timerText
}

function milliToHourMinute(duration) {
    
    seconds = Math.floor((duration / 1000) % 60)
    minutes = Math.floor((duration / (1000 * 60)) % 60)
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return [hours, minutes, seconds]
}

function onError(error) {
    console.log(`Error: ${error}`);
  }  

function receiveMessage(request) {
    
    console.log(request.operation)
    if(request.operation == "update") {
        var query = { active: true, currentWindow: true };
        function callback(tabs) {
            if(tabs[0].id == request.tabID) {
                let endTime = request.endTime;
                startCountdown(endTime);
            }
        }
        browser.tabs.query(query, callback)
    }
}
function checkUpdate(){
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
        browser.runtime.sendMessage({"operation": "update", "tabID": tabs[0].id})
    }
    browser.tabs.query(query, callback)
}

browser.runtime.onMessage.addListener(receiveMessage);
document.getElementById("start").onclick = start
document.getElementById("clear").onclick = clear
checkUpdate()