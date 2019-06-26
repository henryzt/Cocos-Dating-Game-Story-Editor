var exmapleText = 
`06a. （接05a右）听你这么说，女朋友开心极了，对你“啾咪”了一下，然后挽起你的胳膊走向影院。
左：先合拍几张，去朋友圈撒狗粮！（情趣++，好感++）转入07
右：抓紧买票，今天有大片上映！（情趣-，好感+）转入07

02b.（接01超时） 在你沉默的时候，女朋友一通抢白:“电话不接，微信也不回，你是什么意思吗！”掏出手机一看，有好多未接来电……（开始倒数计时）
左：在开车，没注意。（好感--）转入03b
超时：刚才和我妈视频来着。（亲友++，好感-）转入03b
右：看电影之前调了静音。（情趣-）转入03b

03b.（接02b） “是吗？手机拿来！”女朋友沉着脸，对你伸出手。（开始倒数计时）
左：立马交出手机（好感+，亲友+，情趣-）转入04b
超时：沉默（突然死亡。“分手吧！坦白你都做不到，算什么男朋友！”）
右：“宝贝，不生气了好不好？”（突然死亡。“分手吧！你就知道糊弄我！”）
`
var defaultAction = {order:3, text:"", nextCardId: null, playerData: [0,0,0,0]}
var bracketRegex = /（[^）]*）/g


//parse muiltple lines, divided by two \n
function parsePlainText(text){
    var blocks = text.split("\n\n")
    var cardsArray = []
    blocks.forEach(element => {
        console.log(element)
        cardsArray.push(getBlockObject(element))
    });
    return cardsArray
}

function getBlockObject(text){
    var sentence = text.split("\n")
    console.log(sentence)
    //process story line (sentence[0])
    var indexOfDot = sentence[0].indexOf(".")

    var cardId = sentence[0].substring(0, indexOfDot) //get ID before dot
    var comments = sentence[0].match(bracketRegex).toString() //get all content that are bracketed
    var instructionText = sentence[0].substring(indexOfDot+1, sentence[0].length).replace(bracketRegex,"").trim()
    var timeLimit = comments.indexOf("开始倒数计时") == -1 ? 0 : 1
    var actions = [defaultAction,defaultAction,defaultAction];
    for(var i = 0; i < sentence.length-1; i++){
        actions[i] = getActionObject(sentence[i+1])
    }

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
                        