const { ipcRenderer } = require('electron')
function ipcSend(ctrler, cmd) {
    ipcRenderer.send(ctrler, cmd);
}

const VidCtrler = document.querySelector("#vidCtrler");
VidCtrler.querySelector("#volumeUp").addEventListener('click', () => {
    VidCtrler.querySelector("#volume").value = Number(VidCtrler.querySelector("#volume").value) + Number(VidCtrler.querySelector("#volume").value != 100);
});
VidCtrler.querySelector("#volumeDown").addEventListener('click', () => {
    VidCtrler.querySelector("#volume").value = Number(VidCtrler.querySelector("#volume").value) - Number(VidCtrler.querySelector("#volume").value != 0);
});
VidCtrler.querySelector("#volume").addEventListener('keypress', (event)=>{
    if (event.keyCode == "13") {
        VidCtrler.querySelector("#volume").value = Math.min(Math.max(0, Number(VidCtrler.querySelector("#volume").value)), 100);
        ipcSend("vidCtrler", "setVolume(" + VidCtrler.querySelector("#volume").value + ")");
    }
})
VidCtrler.querySelector("#next").addEventListener('click', () => {
    var listItems = VidCtrler.querySelector("#videoList");
    if(listItems.childNodes.length > 1){
        listItems.removeChild(listItems.childNodes[1]);
    }
});

const AudCtrl = new MediaController(document.querySelector("#audCtrler"), document.querySelector("#audio1"));

function getFileType(filePath) {
    var startIndex = filePath.lastIndexOf(".");
    if (startIndex != -1)
        return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
    else return "";
}
var buttons = VidCtrler.querySelectorAll("button")
for (var i = 0; i < buttons.length; ++i) {
    buttons[i].addEventListener('click', ipcSend.bind(this, "vidCtrler", buttons[i].id + '()'))
}
appendMedia = function (file) {
    var newP = document.createElement("li");
    newP.className = "list-group-item";
    filePath = file;
    var startIndex = filePath.lastIndexOf("/");
    if (startIndex === -1)
        startIndex = filePath.lastIndexOf("\\");
    if (startIndex !== -1)
        file = filePath.substring(startIndex + 1, filePath.length);
    newP.appendChild(document.createTextNode(file));
    VidCtrler.querySelector("#videoList").appendChild(newP);
}
document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    for (const f of e.dataTransfer.files) {
        console.log(f.path);
        var type = getFileType(f.path);
        if (type === 'mp4' || type === 'webm') {
            ipcSend("vidCtrler", "appendMedia('" + f.path.replace(/\\/g, "\\\\") + "')");
            appendMedia(f.path);
        }
        if (type === 'mp3' || type === 'wav')
            AudCtrl.appendMedia(f.path);
    }
});
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});