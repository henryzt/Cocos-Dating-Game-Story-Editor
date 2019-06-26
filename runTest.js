

function setRunCard(id){
    var card = cardsArray[findIndex(id)]
    document.getElementById("runInstruction").innerHTML = card.instructionText;
    for(var i = 0; i < 3; i++){
        if(card.actions[i].text){
            document.getElementById(`runAction${i+1}`).innerHTML = `【${actionSelector(card.cardType, card.actions[i].order)}】${card.actions[i].text}`;
            var nextCardId = card.actions[i].nextCardId
            document.getElementById(`runAction${i+1}`).onclick = function(){
                setRunCard(nextCardId)
            }
        }
            
    }
    var history = document.getElementById("runHistory").innerHTML
    history = history + `<a class="run-history-btn mdl-button mdl-js-button mdl-button--primary" href="javascript:scrollTo('${id}')">${id}</a>`
    document.getElementById("runHistory").innerHTML = history
}


function startNewRunTest(){
    document.getElementById("runBlock").setAttribute("style","");
    document.getElementById("runHistory").innerHTML = ""
    setRunCard(cardsArray[0].cardId)
}