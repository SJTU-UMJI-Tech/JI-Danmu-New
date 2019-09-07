function MediaController(ele, media) {
    this.togglePlay = function () {
        if (!this.$.media.src) return;
        this.$.media.paused ? this.$.media.play() : this.$.media.pause();
        var tmpTxt = ["Pause", "Play"];
        this.$.togglePlay.innerText = tmpTxt[Number(this.$.media.paused)];
    };
    this.next = function () {
        if (!this.playList.length) {
            this.$.videoNow.innerText = '';
            this.$.media.src = '';
            this.$.media.load();
            return;
        }
        var file = this.playList.shift();
        this.$.videoNow.innerText = this.$.listIems.childNodes[1].innerText;
        this.$.listIems.removeChild(this.$.listIems.childNodes[1]);
        var status = this.$.media.paused;
        this.$.media.src = file;
        this.$.media.load();
        status || this.$.media.play();
    };
    this.volumeUp = function () {
        this.$.media.volume = Math.min(this.$.media.volume + 0.01, 1);
        this.$.volume.value = Math.round(this.$.media.volume * 100);
    };
    this.volumeDown = function () {
        this.$.media.volume = Math.max(this.$.media.volume - 0.01, 0);
        this.$.volume.value = Math.round(this.$.media.volume * 100);
    };
    this.toggleMuted = function () {
        this.$.media.muted ^= 1;
        var tmpTxt = ["Mute", "Unmute"];
        this.$.toggleMuted.innerText = tmpTxt[Number(this.$.media.muted)];
    };
    this.appendMedia = function (file) {
        var newP = document.createElement("li");
        newP.className = "list-group-item";
        filePath = file;
        var startIndex = filePath.lastIndexOf("/");
        if (startIndex === -1)
            startIndex = filePath.lastIndexOf("\\");
        if (startIndex !== -1)
            file = filePath.substring(startIndex + 1, filePath.length);
        newP.appendChild(document.createTextNode(file));
        this.$.listIems.appendChild(newP);
        this.playList.push(filePath);
        if (this.$.videoNow.innerText.length === 0) this.next();
    }
    this.toggleVisibility = function () {
        this.visible ^= 1;
        var tmpTxt = ["hidden", "visible"];
        this.$.media.style.visibility = tmpTxt[Number(this.visible)];
        tmpTxt = ["Visible", "Invisible"];
        this.$.toggleVisibility.innerText = tmpTxt[Number(this.visible)];
    }
    this.$ = ele;
    this.$.innerHTML = [
        '<div class="card">',
        '    <div class="card-body">',
        '        <div class="row">',
        '            <div class="col">',
        '                <h5>Now: <span id="videoNow"></span></h5>',
        '                <br />',
        '                <div>',
        '                    <button class="btn btn-outline-primary" id="togglePlay">Play</button>',
        '                    <button class="btn btn-outline-primary" id="next">Next</button>',
        '                    <button class="btn btn-outline-primary" id="toggleVisibility">Invisible</button>',
        '                    <button class="btn btn-outline-primary" id="toggleMuted">Mute</button>',
        '                </div>',
        '                <br />',
        '                <div class="input-group">',
        '                    <div class="input-group-prepend">',
        '                        <span class="input-group-text">Volume</span>',
        '                    </div>',
        '                    <input type="text" class="form-control" id="volume" style="text-align:center">',
        '                    <div class="input-group-append">',
        '                        <button class="btn btn-outline-secondary" id="volumeUp">+</button>',
        '                        <button class="btn btn-outline-secondary" id="volumeDown">-</button>',
        '                    </div>',
        '                </div>',
        '            </div>',
        '            <div class="col pre-scrollable" style="height: 180px">',
        '                <ul class="list-group" id="videoList">',
        '                </ul>',
        '            </div>',
        '        </div>',
        '    </div>',
        '</div>'
    ].join("\n");
    this.playList = [];
    this.$.media = media;
    this.visible = true;
    this.$.media.volume = 0.25;
    this.$.togglePlay = this.$.querySelector("#togglePlay");
    this.$.next = this.$.querySelector("#next");
    this.$.toggleMuted = this.$.querySelector("#toggleMuted");
    this.$.volumeUp = this.$.querySelector("#volumeUp");
    this.$.volumeDown = this.$.querySelector("#volumeDown");
    this.$.toggleVisibility = this.$.querySelector("#toggleVisibility");
    this.$.videoNow = this.$.querySelector("#videoNow");
    this.$.listIems = this.$.querySelector("#videoList");
    this.$.volume = this.$.querySelector("#volume");
    this.$.volume.value = Math.round(this.$.media.volume * 100);
    this.$.volume.onkeypress = function (event) {
        if (event.keyCode == "13") {
            this.$.media.volume = Math.min(Math.max(Number(this.$.volume.value), 0), 100) / 100;
            this.$.volume.value = Math.round(this.$.media.volume * 100);
        }
    }.bind(this);
    this.$.togglePlay.onclick = this.togglePlay.bind(this);
    this.$.next.onclick = this.next.bind(this);
    this.$.toggleMuted.onclick = this.toggleMuted.bind(this);
    this.$.volumeUp.onclick = this.volumeUp.bind(this);
    this.$.volumeDown.onclick = this.volumeDown.bind(this);
    this.$.toggleVisibility.onclick = this.toggleVisibility.bind(this);
}