VidCtrl = new MediaController(document.querySelector("#vidCtrler"), document.querySelector("#video1"));
VidCtrl.appendMedia("src/1.mp4");
VidCtrl.appendMedia("src/2.mp4");

AudCtrl = new MediaController(document.querySelector("#audCtrler"), document.querySelector("#audio1"));
AudCtrl.appendMedia("src/1.mp3");
AudCtrl.appendMedia("src/2.mp3");
AudCtrl.appendMedia("src/3.mp3");

function getFileType(filePath) {
    var startIndex = filePath.lastIndexOf(".");
    if (startIndex != -1)
        return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
    else return "";
}

document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    for (const f of e.dataTransfer.files) {
        console.log(f.path);
        var type = getFileType(f.path);
        if (type === 'mp4' || type === 'webm' || type === 'ogg')
            VidCtrl.appendMedia(f.path);
        if (type === 'mp3' || type === 'wav' || type === 'ogg')
            AudCtrl.appendMedia(f.path);
    }
});
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});