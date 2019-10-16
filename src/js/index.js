let Danmu
let player

Danmu = $("#danmu")
myPlayer = document.querySelector("#player")

VidCtrl = new MediaController(null, myPlayer);

const {
  ipcRenderer
} = require('electron')
ipcRenderer.on('vidCtrler', (event, arg) => {
  var cmd = 'VidCtrl.' + arg
  console.log(cmd)
  eval(cmd)
})

//初始化
Danmu.danmu({
  left: 0,
  top: 0,
  height: "100%",
  width: "100%",
  speed: 5500,
  opacity: 1,
  font_size_small: 16,
  font_size_big: 24,
  top_botton_danmu_time: 6000,
  maxCountInScreen: 1000
});

sendDanmu("这是滚动弹幕", "yellow", 0, 1);
sendDanmu("这是顶部弹幕", "blue", 1, 1);
sendDanmu("这是底部弹幕", "red", 2, 1);

Danmu.danmu('danmuResume');
timedCount();

function timedCount() {
  $("#time").text(Danmu.data("nowTime"));
  query();
  t = setTimeout("timedCount()", 50);
}

function setOpacity(opa) {
  Danmu.danmu("setOpacity", opa / 100);
}

function toggleVisible() {
  if (Danmu.data("opacity") != 0) {
    Danmu.danmu("setOpacity", 0);
  } else {
    Danmu.danmu("setOpacity", 1);
  }
}

String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

function parseTextAndSend(text) {
  if (text.search(/\#admin/) === -1) {
    text = text.replace("\#rev", "");
    sendDanmuFromText(text);
    return;
  }
  text = text.replace("\#admin", "");
  if (text.search(/\#toggle/) !== -1) {
    toggleVisible();
    return;
  }
  if (text.search(/\#opa\s*\d{0,3}/) !== -1) {
    var opa = parseInt(text.match(/\#opa\s*(?<opa>\d{0,3})/).groups['opa']);
    console.log(opa);
    setOpacity(opa);
    return;
  }
  if (text.search(/#times\s*\d+/) === -1 && text.search(/#rainbow/) === -1) {
    sendDanmuFromText(text);
    return;
  }
  var times = 7
  if (text.search(/#times\s*\d+/) !== -1) {
    times = parseInt(text.match(/#times\s*(?<t>\d+)/).groups['t']);
    text = text.replace(/\#times\s*\d+/, "");
  }
  if (text.search(/\#rainbow/) !== -1) {
    rainbow = ["#red", "#FF8C00", "#yellow", "#green", "#47A1D7", "#blue", "#purple"];
    text = text.replace("\#rainbow", "");
    for (var i = 0; i < times; ++i) {
      sendDanmuFromText(rainbow[6 - (i % 7)] + text);
    }
  } else {
    for (var i = 0; i < times; ++i) {
      sendDanmuFromText(text);
    }
  }
}

function sendDanmuFromText(text) {
  text = text.replace(/&/g, "&gt;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\n/g, " ");
  // set position
  var position = 0;
  if (text.search(/\#top/) !== -1) {
    position = 1;
    text = text.replace("\#top", "");
  }
  if (text.search(/\#btm/) !== -1) {
    position = 2;
    text = text.replace("\#btm", "");
  }
  if (text.search(/\#rev/) !== -1) {
    position = 3;
    text = text.replace("\#rev", "");
  }
  // set color
  var color = "white";
  regs = ["aqua", "#black", "#blue", "#fuchsia", "#gray", "#green", "#lime", "#maroon", "#navy", "#olive", "#purple", "#red", "#silver", "#teal", "#white", "#yellow"];
  for (var i = 0; i < regs.length; ++i) {
    if (text.search(regs[i]) !== -1) {
      color = regs[i].substring(1);
      text = text.replace(regs[i], "");
    }
  }
  var regPos = text.search(/\#[0-9a-fA-F]{6}/);
  if (regPos !== -1) {
    color = text.match(/(?<color>\#[0-9a-fA-F]{6})/).groups['color']
    text = text.replace(/\#[0-9a-fA-F]{6}/, "");
  }
  // set font size
  var size = 1;
  if (text.search(/\#small/) !== -1) {
    size = 0;
    text = text.replace("\#small", "");
  }
  sendDanmu(text.trim(), color, position, size);
}

function sendDanmu(text, color, position, size) {
  var time = Danmu.data("nowTime") + 1;
  var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + '}';
  Danmu.danmu("addDanmu", eval('(' + text_obj + ')'));
}


function query() {
  $.ajax({
    url: 'http://sjtuji.tech:8091/danmu/dmpush',
    type: 'get',
    dataType: 'json',
    error: function () {
      console.error('Error');
    },
    success: function (msg) {
      var len = msg.length;
      for (var i = 0; i < len; i++) {
        parseTextAndSend(msg[i]);
      }
    }
  });
}