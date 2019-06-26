

function setRunCard(id){
    console.log(id)
    var card = cardsArray[findIndex(id)]
    document.getElementById("runInstruction").innerHTML = card.instructionText;
    for(var i = 0; i < 3; i++){
        var action = document.getElementById(`runAction${i+1}`);
        if(card.actions[i].text.length > 1){
            action.innerHTML = `【${actionSelector(card.cardType, card.actions[i].order)}】${card.actions[i].text}`;
        }else{
            action.innerHTML = "(无文本)"
        }

        var nextCardId = card.actions[i].nextCardId
        
        if(nextCardId){
            var nextId = nextCardId
            action.onclick = function(){
                setRunCard(nextId)
            }
        }else{
            action.onclick = ""
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