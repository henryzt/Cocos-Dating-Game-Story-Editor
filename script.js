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