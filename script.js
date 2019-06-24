function openEditor() {
    let editor = document.getElementById("editor")
    editor.style.width = "40%";
    document.getElementById("main").style.marginRight = editor.style.width;
}

function closeEditor() {
    document.getElementById("editor").style.width = "0";
    document.getElementById("main").style.marginRight= "0";
}