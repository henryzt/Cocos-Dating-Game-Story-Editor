var text = 
`02b.（接01超时） 在你沉默的时候，女朋友一通抢白:“电话不接，微信也不回，你是什么意思吗！”掏出手机一看，有好多未接来电……（开始倒数计时）
左：在开车，没注意。（好感--）转入03b
超时：刚才和我妈视频来着。（亲友++，好感-）转入03b
右：看电影之前调了静音。（情趣-）转入03b`

var bracketRegex = /（[^）]*）/g
    

function getBlockObject(){
    var sentence = text.split("\n")
    console.log(sentence)
    //process story line (sentence[0])
    var indexOfDot = sentence[0].indexOf(".")

    var cardId = sentence[0].substring(0, indexOfDot) //get ID before dot
    var comments = sentence[0].match(bracketRegex).toString() //get all content that are bracketed
    var instructionText = sentence[0].substring(indexOfDot+1, sentence[0].length).replace(bracketRegex,"").trim()
    var timeLimit = comments.indexOf("开始倒数计时") == -1 ? 0 : 1
    var actions = [ getActionObject(sentence[1]),
                    getActionObject(sentence[2]),
                    getActionObject(sentence[3])];

    var newCardObject = new Object;
    newCardObject.cardId = cardId
    newCardObject.cardType = "swipe"
    newCardObject.timeLimit = timeLimit
    newCardObject.instructionText = instructionText
    newCardObject.cardText = null
    newCardObject.cardImage = null
    newCardObject.comment = comments
    newCardObject.actions = actions;
    return newCardObject;
}


function getActionObject(actionLine){
    var indexOfColon = actionLine.indexOf("：")
    var indexOfCommentLeft = actionLine.lastIndexOf("（")
    var indexOfCommentRight = actionLine.lastIndexOf("）")
    var indexOfLastCardId = actionLine.lastIndexOf("转入") + 2
    var actionOrder = actionOrderSelector( actionLine.substring(0, indexOfColon) )
    var actionText = actionLine.substring(indexOfColon+1, indexOfCommentLeft)
    var actionNextCardId = actionLine.substring(indexOfLastCardId, actionLine.length)
    var dataText = actionLine.substring(indexOfCommentLeft+1, indexOfCommentRight)
    var actionData = getPlayerDataChange(dataText)

    var actionsObject = new Object()
    actionsObject.order = actionOrder
    actionsObject.text = actionText
    actionsObject.nextCardId = actionNextCardId
    actionsObject.playerData = actionData

    return actionsObject;
}


//order selector
function actionOrderSelector(orderText){
    switch(orderText){
        case "左":
            return 1;
        case "右":
            return 2;
        case "超时":
            return 3;
    }
    return -1;
}


//change player data needed to a json array with respective order
function getPlayerDataChange(dataText){
    var data = dataText.replace("+++","3").replace("++","2").replace("+","1")
                       .replace("---","##3").replace("--","##2").replace("-","##1").replace("##","-");
    var datas = data.split("，")
    var result = [0,0,0,0] //好感，情趣，财富，亲友
    datas.forEach(element => {
        var match = element.substring(0,2)
        var value = element.substring(2,5)
        if(match == "好感") result[0] = Number(value)
        if(match == "情趣") result[1] = Number(value)
        if(match == "财富") result[2] = Number(value)
        if(match == "亲友") result[3] = Number(value)
    });
    return result;
}
                        