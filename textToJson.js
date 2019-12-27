var plainTextInsturction = 
`纯文本剧本必须强制按照以下格式撰写：

每张卡片以***符号表示卡片开始。

每一行以@开始，第一行为卡片的主要信息，不可忽略。单项信息以#分割开，单项信息内可以随意换行，但不能出现#符号。每行相应#符号的数量应该保持一致，否则信息可能会错乱。

第二行之后为属性和操作行，行之间顺序不重要，且每行可以按照卡片需要忽略。属性行以“@属性#”开头。

注意：转入卡片ID不可以使用括号表示游戏成功或突然死亡，需要转入对应的卡片类型为“游戏成功”或“游戏失败”卡片表示死亡或成功。对应卡片可只需要写明“卡片文本”属性说明死亡或成功原因，不需要相应操作行。

---------------
***
@11#接说明过渡和10b#庆生会有惊无险地结束了。你去结账之前，女朋友的闺蜜加了你的微信，并把晚上的饭钱转给了你。#
@左#接受，再转给女朋友！#亲友-，好感-，财富+#转入12
@右#不接受，我请了！#财富-，亲友+#转入12

***
@12#接11，左右滑动进入闺蜜朋友圈界面#送女朋友的闺蜜先上车离开之后，一旁的女朋友要你看闺蜜刚发的朋友圈。#
@左###转入pyq
@右###转入pyq

***
---------------`



var exmapleText = 
`***
@11#接说明过渡和10b#庆生会有惊无险地结束了。你去结账之前，女朋友的闺蜜加了你的微信，并把晚上的饭钱转给了你。#
@左#接受，再转给女朋友！#亲友-，好感-，财富+#转入12
@右#不接受，我请了！#财富-，亲友+#转入12

***
@12#接11，左右滑动进入闺蜜朋友圈界面#送女朋友的闺蜜先上车离开之后，一旁的女朋友要你看闺蜜刚发的朋友圈。#
@左###转入pyq
@右###转入pyq

***
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
    newCardObject.nextCardId = section[3].replace("\n","")

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
                        

function checkCardPackValid(cardsArray){
    var errorList = [];
    var warningList = [];
    var hasSuccess = false;
    var hasFail = false;
    cardsArray.forEach(element => {
        if(!element.cardId){
            errorList.push("卡片缺少ID!")
        }
        if(!element.instructionText){
            warningList.push("【卡片 - "+element.cardId+"】缺少说明文本")
        }
        if(!element.cardImage){
            warningList.push("【卡片 - "+element.cardId+"】缺少图片")
        }

        if(element.cardType == "fail" || element.cardType == "success"){
            if(element.cardType == "fail"){
                hasFail = true;
            }else{
                hasSuccess = true;
            }
            return
        }

        element.actions.forEach(action=>{
            if(action.order==3){ return }
            if(!action.text){
                warningList.push("【卡片 - "+element.cardId+"】缺少动作文本")
            }
            if(!document.getElementById(action.nextCardId)){
                errorList.push("【卡片 - "+element.cardId+"】找不到下张ID为"+action.nextCardId+"的卡片！！")
            }
        })
    });

    if(!hasFail){
        errorList.push("卡包内没有游戏结束类型卡片！");
    }
    if(!hasSuccess){
        errorList.push("卡包内没有游戏成功类型卡片！");
    }
    console.log(errorList)
    console.log(warningList)

    document.getElementById("validateErrors").innerHTML = errorList.length>0? errorList.toString().replace(/,/g,"<br>") : "恭喜，没有格式错误"
    document.getElementById("validateWarnings").innerHTML = warningList.length>0? warningList.toString().replace(/,/g,"<br>"): "恭喜，没有格式警告"
    document.getElementById("validatResult").className = ""

    if(errorList.length>0){
        alert("剧本包基本格式检查失败，请修复下列格式错误，具体可参见'剧本包格式检查器'区域。\n"+errorList[0]);
    }else if(warningList.length>0){
        alert("剧本包基本格式检查完毕，剧本包中没有显著格式错误，但有格式警告可以修复，具体可参见'剧本包格式检查器'区域。");
    }else{
        alert("剧本包基本格式检查完毕，恭喜，没有格式错误或警告！请注意，这并不代表没有逻辑错误。")
    }
}