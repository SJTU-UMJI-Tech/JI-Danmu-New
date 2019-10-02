let Danmu
let player

Danmu = $("#danmu")
myPlayer = document.querySelector("#player")

VidCtrl = new MediaController(null, myPlayer);

const { ipcRenderer } = require('electron')
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
  speed: 20000,
  opacity: 1,
  font_size_small: 16,
  font_size_big: 24,
  top_botton_danmu_time: 6000,
  maxCountInScreen: 1000
});

sendDanmu("这是滚动弹幕", "yellow", 0, 1);
sendDanmu("这是顶部弹幕", "blue", 1, 1);
sendDanmu("这是底部弹幕", "red", 2, 1);

$('#danmu').danmu('danmuResume');
// timedCount();

function timedCount() {
  $("#time").text($('#danmu').data("nowTime"));
  query();
  t = setTimeout("timedCount()", 50)
}

function setOpacity(opa) {
  $('#danmu').danmu("setOpacity", opa / 100);
}

function toggleVisible() {
  if (Danmu.data("opacity") != 0) {
    Danmu.danmu("setOpacity", 1)
  } else {
    Danmu.danmu("setOpacity", 0)
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
    color = text.substring(pos, pos + 7);
    text = text.replace(/\#[0-9a-fA-F]{6}/, "");
  }
  // set font size
  var size = 1;
  if (text.search(/\#small/) !== -1) {
    size = 0;
    text = text.replace("\#small", "");
  }//弹幕字体设定
  sendDanmu(text, color, position, size);
}

function sendDanmu(text, color, position, size) {
  var time = $('#danmu').data("nowTime") + 1;
  var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + '}';
  $('#danmu').danmu("addDanmu", eval('(' + text_obj + ')'));
}


function query() {
  $.ajax({
    url: 'http://139.155.26.38:8900/danmu',
    type: 'get',
    dataType: 'json',
    error: function () {
      console.error('Error');
    },
    success: function (msg) {
      var len = msg.length;
      for (var i = 0; i < len; i++) {
        sendDanmuFromText(msg[i]);
      }
    }
  });
}
