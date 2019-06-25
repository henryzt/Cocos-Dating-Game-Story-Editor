function openEditor() {
    let editor = document.getElementById("editor")
    editor.style.width = "40%";
    document.getElementById("main").style.marginRight = editor.style.width;
}

function closeEditor() {
    document.getElementById("editor").style.width = "0";
    document.getElementById("main").style.marginRight= "0";
}


function createActionsHTML(action1, action2, action3) {
    var template = document.getElementById("action_template").innerHTML;
    var html = ""
    html += template.replace(/#value#/g, 1).replace(/#action#/g,action1);
    html += template.replace(/#value#/g, 2).replace(/#action#/g,action2);
    html += template.replace(/#value#/g, 3).replace(/#action#/g,action3);
    document.getElementById("actions").innerHTML= html;
}

createActionsHTML("左滑选项", "右滑选项", "超时选项")


var templatePack = [{
                cardId: "01",
                instructionText: "一小时后，你到达战场。电影院门外的女朋友好像在发脾气。",
                cardText: null,
                cardImage: null,
                cardType: "swipe",
                timeLimit: 0,
                actions: [{
                    order: 1,
                    text: "“宝贝，我错了！”赶紧道歉",
                    nextCardId: "02a",
                    playerData: [-1,0,0,0]
                },{
                    order: 2,
                    text: "“宝贝，谁欺负你了？”",
                    nextCardId: "02c",
                    playerData: [1,1,0,0]
                },{
                    order: 3,
                    text: "沉默",
                    nextCardId: "02b",
                    playerData: [-2,0,0,0]
                }]
            }];


function createCardHTML(cardObject) {
    var template = document.getElementById("card_template").innerHTML;
    var html = template.replace(/#cardId#/g, cardObject.cardId)
                        .replace(/#instructionText#/g, cardObject.instructionText)
                        .replace(/#cardText#/g, nullChecker(cardObject.cardText))
                        .replace(/#cardImage#/g, nullChecker(cardObject.cardImage))
                        .replace(/#cardType#/g, cardTypeSelector(cardObject.cardType))
                        .replace(/#timeLimit#/g, cardObject.timeLimit == 0 ? "否":"是" );

    document.getElementById("cards").innerHTML += html;
}


function cardTypeSelector(cardType){
    switch(cardType){
        case "swipe":
            return "左右滑动";
        case "chat":
            return "微信聊天";
        case "moments":
            return "微信朋友圈";
        case "fail":
            return "游戏失败";
        case "success":
            return "游戏成功";
        default:
            return "未知";
    }
}

function nullChecker(content){
    return content? content : "无";
}

createCardHTML(templatePack[0])