var currentPlayerValue = [50,50,50,50]


function setRunCard(id){
    console.log(id)
    let runBlock = document.getElementById("runBlock")
    runBlock.classList.toggle('flip');

    let card = cardsArray[findIndex(id)]
    document.getElementById("runInstruction").innerHTML = card.instructionText;
    for(var i = 0; i < 3; i++){
        let action = document.getElementById(`runAction${i+1}`);
        if(card.actions[i].text.length > 1){
            action.innerHTML = `【${actionSelector(card.cardType, card.actions[i].order)}】${card.actions[i].text}`;
        }else{
            action.innerHTML = "(无文本)"
        }

        let nextCardId = card.actions[i].nextCardId
        console.log(nextCardId)
        if(nextCardId){
            let nextId = nextCardId.toString()
            let valueChange = card.actions[i].playerData
            document.getElementById(`runAction${i+1}`).setAttribute("href", nextId)
            document.getElementById(`runAction${i+1}`).onclick = function(){
                updatePlayerValue(valueChange)
                setRunCard(nextId)
            }
        }else{
            action.onclick = ""
        }
            
    }
    var history = document.getElementById("runHistory").innerHTML
    history = history + `<a class="run-history-btn mdl-button mdl-js-button mdl-button--primary" href="javascript:scrollTo('${id}')">${id}</a>`
    document.getElementById("runHistory").innerHTML = history

    runBlock.classList.remove("success_card_background")
    runBlock.classList.remove("fail_card_background")
    if(card.cardType=="success"){
        runBlock.classList.add("success_card_background")
    }else if(card.cardType=="fail"){
        runBlock.classList.add("fail_card_background")
    }
}

function updatePlayerValue(valueChange){
    for(let i = 0; i < 4; i++){
        currentPlayerValue[i] = currentPlayerValue[i] + valueChange[i] * 10
    }
    console.log(currentPlayerValue)

    document.querySelector('#pInterest').MaterialProgress.setProgress(currentPlayerValue[0]);
    document.querySelector('#pLove').MaterialProgress.setProgress(currentPlayerValue[1]);
    document.querySelector('#pWealth').MaterialProgress.setProgress(currentPlayerValue[2]);
    document.querySelector('#pFamily').MaterialProgress.setProgress(currentPlayerValue[3]);

    document.querySelector('#vInterest').innerHTML = (currentPlayerValue[0]);
    document.querySelector('#vLove').innerHTML = (currentPlayerValue[1]);
    document.querySelector('#vWealth').innerHTML = (currentPlayerValue[2]);
    document.querySelector('#vFamily').innerHTML = (currentPlayerValue[3]);
}


function startNewRunTest(){
    currentPlayerValue = [50,50,50,50]
    updatePlayerValue([0,0,0,0])
    document.getElementById("runBlock").setAttribute("style","");
    document.getElementById("runHistory").innerHTML = ""
    setRunCard(cardsArray[0].cardId)
}