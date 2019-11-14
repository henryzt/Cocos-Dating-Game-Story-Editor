var plainTextInsturction = 
`纯文本剧本必须强制按照以下格式撰写：
【卡片ID】.（【备注信息】）【故事剧情】【“（开始倒数计时）”，可不填】
【左】：【左滑剧情】（【数据项名称】++,【数据项名称】--）转入【关联卡片ID】
【右】：【右滑剧情】（【数据项名称】-）转入【关联卡片ID】
【超时】：【超时剧情】（【数据项名称】+++,【数据项名称】-）转入【关联卡片ID】

以上内容作为一张卡片，每张卡片以一个空行隔开，后三行选项顺序不重要，超时选项行可以不填。请忽略方括号“【】”。
若卡片需要倒计时，第一行剧情结束必须添加【（开始倒数计时）】字样。数据项名称包括好感，情趣，财富，亲友。必须以逗号分隔。现暂时不支持突然死亡，请在导入后手动添加。
范例剧本：
---------------
06a. （接05a右）听你这么说，女朋友开心极了，对你“啾咪”了一下，然后挽起你的胳膊走向影院。
左：先合拍几张，去朋友圈撒狗粮！（情趣++，好感++）转入07
右：抓紧买票，今天有大片上映！（情趣-，好感+）转入07

02b.（接01超时） 在你沉默的时候，女朋友一通抢白:“电话不接，微信也不回，你是什么意思吗！”掏出手机一看，有好多未接来电……（开始倒数计时）
左：在开车，没注意。（好感--）转入03b
超时：刚才和我妈视频来着。（亲友++，好感-）转入03b
右：看电影之前调了静音。（情趣-）转入03b
---------------`



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
var defaultAction = {order:3, text:"", nextCardId: null, playerData: 0}
var bracketRegex = /（[^）]*）/g


//parse muiltple lines, divided by ***
function parsePlainText(text){
    var blocks = text.split("***")
    var cardsArray = []
    blocks.forEach(element => {
        if(!element || element.length < 3) return
        console.log(element)
        cardsArray.push(getBlockObject(element))
    });
    console.log(cardsArray)
    return cardsArray
}

function getBlockObject(text){
    var sentence = text.split("@")
    if(sentence[0].length<2){sentence.shift()}
    console.log(sentence)
    // process story line (sentence[0])
    // @卡片ID#备注#说明文本#是否倒计时（若倒计时则写倒计时，没有则空）
    var section = sentence[0].split("#")

    if(section[0]=="tutorial"){
        return getTutorialCard(section);
    }

    var cardId = section[0]
    var comments = section[1]
    comments = comments? comments.toString() : "";
    var instructionText = section[2]
    var timeLimit = section[3]? (section[3].indexOf("倒计时") == -1 ? 0 : 1) : 0

    // process 属性 and 操作 (action) lines
    var actions = [defaultAction,defaultAction,defaultAction];
    var property = {cardType:"swipe", cardImage:null, playerIcon:null, cardText:null, comments: null }

    let actionCounter = 0;
    for(var i = 0; i < sentence.length-1; i++){
        let nextSentenceSections = sentence[i+1].split("#");
        console.log(nextSentenceSections)

        if(nextSentenceSections[0] == "属性"){
            property = parseProperty(nextSentenceSections, property)
        }else{
            actions[actionCounter] = getActionObject(nextSentenceSections, property.cardType)
            actionCounter ++;
        }
    }

    //reorder to correct postion
    actions.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));

    var newCardObject = new Object;
    newCardObject.cardId = cardId
    newCardObject.cardType = property.cardType
    newCardObject.timeLimit = timeLimit
    newCardObject.instructionText = instructionText
    newCardObject.cardText = property.cardText
    newCardObject.cardImage = property.cardImage
    newCardObject.playerIcon = property.playerIcon
    newCardObject.comment = comments +" "+ property.comments
    newCardObject.actions = actions;
    return newCardObject;
}


function getTutorialCard(section){
    var newCardObject = new Object;
    newCardObject.cardId = section[1]
    newCardObject.cardType = "tutorial"
    newCardObject.instructionText = section[2]
    newCardObject.nextCardId = section[3]

    newCardObject.cardText = ""
    newCardObject.cardImage = ""
    newCardObject.playerIcon = ""
    newCardObject.comment = ""
    newCardObject.actions = [defaultAction,defaultAction,defaultAction];
    newCardObject.timeLimit = ""
    return newCardObject;
}


function parseProperty(section, property){
    
    switch(section[1]){
        case "卡片类型":
            property.cardType = cardTypeSelectorInverse(section[2].slice(0, -1));
            console.log(property.cardType)
            break;
        case "卡片文本":
            property.cardText = section[2];
            break;
        case "图片地址":
            property.cardImage = section[2].replace("\n","");
            break;
        case "玩家头像":
            property.playerIcon = section[2].replace("\n","");
            break;
        default:
            property.comments = section[2];
            break;
    }
    return property;
}


function cardTypeSelectorInverse(cardType){

    switch(cardType){
        case "左右滑动":
            return "swipe";
        case "微信聊天":
            return "chat";
        case "微信朋友圈":
            return "moments";
        case "分手回避":
            return "multi";
        case "游戏失败":
            return "fail";
        case "游戏成功":
            return "success";
        default:
            return "unknown";
    }
}


function getActionObject(section, cardType){
    

    var actionOrder = actionOrderSelector( section[0] )
    var actionText = section[1] 
    var actionNextCardId = section[3] ? section[3].replace("转入","").replace("转到","").replace("\n","") : "";
    var dataText = section[2]
    var actionData = getPlayerDataChange(dataText)

    var actionsObject = new Object()
    actionsObject.order = actionOrder
    actionsObject.text = actionText
    actionsObject.nextCardId = actionNextCardId
    actionsObject.playerData = actionData

    if(cardType=="multi"){
        actionsObject.wrongChoiceText = section[4] ? section[4] : "";
    }

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
    switch(orderText){
        case "选项1":
            return 1;
        case "选项2":
            return 2;
        case "选项3":
            return 3;
    }
    return -1;
}


//change player data needed to a json array with respective order
function getPlayerDataChange(dataText){
    if(!dataText) return
    var data = dataText.replace(/\+\+\+/g,"3").replace(/\+\+/g,"2").replace(/\+/g,"1")
                       .replace(/---/g,"##3").replace(/--/g,"##2").replace(/-/g,"##1").replace(/##/g,"-");

    console.log(data)
    var result = 0
    var match = data.substring(0,2)
    var value = data.substring(2,5)
    if(match == "情绪") result = Number(value)

    return result;
}
                        