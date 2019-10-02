function MediaController(ele, media) {
    this.togglePlay = function () {
        if (!this.media.src) return;
        var tmpTxt = ["Pause", "Play"];
        this.media.paused ? this.media.play() : this.media.pause();
        if (this.$) {
            this.$.togglePlay.innerText = tmpTxt[Number(this.media.paused)];
        }
    };
    this.next = function () {
        console.log(this.playList);
        if (!this.playList.length) {
            this.media.src = '';
            this.media.load();
            return;
        }
        var file = this.playList.shift();
        if (this.$) {
            this.$.listItems.removeChild(this.$.listItems.childNodes[1]);
        }
        var status = this.media.paused;
        this.media.src = file;
        this.media.load();
        status || this.media.play();
    };
    this.volumeUp = function () {
        this.media.volume = Math.min(this.media.volume + 0.01, 1);
        if (this.$)
            this.$.volume.value = Math.round(this.media.volume * 100);
    };
    this.volumeDown = function () {
        this.media.volume = Math.max(this.media.volume - 0.01, 0);
        if (this.$)
            this.$.volume.value = Math.round(this.media.volume * 100);
    };
    this.toggleMuted = function () {
        this.media.muted ^= 1;
        var tmpTxt = ["Mute", "Unmute"];
        if (this.$)
            this.$.toggleMuted.innerText = tmpTxt[Number(this.media.muted)];
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
        if (this.$)
            this.$.listItems.appendChild(newP);
        this.playList.push(filePath);
    }
    this.toggleVisibility = function () {
        this.visible ^= 1;
        var tmpTxt = ["hidden", "visible"];
        this.media.style.visibility = tmpTxt[Number(this.visible)];
        tmpTxt = ["Visible", "Invisible"];
        if (this.$)
            this.$.toggleVisibility.innerText = tmpTxt[Number(this.visible)];
    }
    this.setVolume = function (volume) {
        this.media.volume = Math.min(Math.max(Number(volume), 0), 100) / 100;
    }
    this.playList = [];
    this.visible = true;
    this.media = media;
    this.media.volume = 0.25;
    if (ele !== null) {
        this.$ = ele;
        this.$.innerHTML = [
            '<div class="card">',
            '    <div class="card-body">',
            '        <h5 class="card-title">Audio</h5>',
            '        <div>',
            '            <button class="btn btn-outline-primary" id="togglePlay">Play</button>',
            '            <button class="btn btn-outline-primary" id="next">Next</button>',
            '            <button class="btn btn-outline-primary" id="toggleVisibility">Invisible</button>',
            '            <button class="btn btn-outline-primary" id="toggleMuted">Mute</button>',
            '        </div>',
            '        <br />',
            '        <div class="input-group">',
            '            <div class="input-group-prepend">',
            '                <span class="input-group-text">Volume</span>',
            '            </div>',
            '            <input type="text" class="form-control" id="volume" style="text-align:center">',
            '            <div class="input-group-append">',
            '                <button class="btn btn-outline-secondary" id="volumeDown">-</button>',
            '                <button class="btn btn-outline-secondary" id="volumeUp">+</button>',
            '            </div>',
            '        </div>',
            '        <br />',
            '        <div class="col pre-scrollable">',
            '            <ul class="list-group" id="videoList">',
            '            </ul>',
            '        </div>',
            '    </div>',
            '</div>'
        ].join("\n");
        this.$.togglePlay = this.$.querySelector("#togglePlay");
        this.$.next = this.$.querySelector("#next");
        this.$.toggleMuted = this.$.querySelector("#toggleMuted");
        this.$.volumeUp = this.$.querySelector("#volumeUp");
        this.$.volumeDown = this.$.querySelector("#volumeDown");
        this.$.toggleVisibility = this.$.querySelector("#toggleVisibility");
        this.$.listItems = this.$.querySelector("#videoList");
        this.$.volume = this.$.querySelector("#volume");
        this.$.volume.value = Math.round(this.media.volume * 100);
        this.$.volume.onkeypress = function (event) {
            if (event.keyCode == "13") {
                this.setVolume(this.$.volume.value);
                this.$.volume.value = Math.round(this.media.volume * 100);
            }
        }.bind(this);
        this.$.togglePlay.onclick = this.togglePlay.bind(this);
        this.$.next.onclick = this.next.bind(this);
        this.$.toggleMuted.onclick = this.toggleMuted.bind(this);
        this.$.volumeUp.onclick = this.volumeUp.bind(this);
        this.$.volumeDown.onclick = this.volumeDown.bind(this);
        this.$.toggleVisibility.onclick = this.toggleVisibility.bind(this);
    }
}