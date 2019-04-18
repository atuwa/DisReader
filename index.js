const Discord = require('discord.js');
const client = new Discord.Client();

document.getElementById("submit").addEventListener("click", main, false);
/*
var remote = require('remote');
var argv = remote.process.argv;
if(argv.length>0)document.getElementById("input_port").value=argv[0];
if(argv.length>1)document.getElementById("input_atuwaBouyomi").value=argv[1];
if(argv.length>2)document.getElementById("input_atuwaBouyomiP").value=argv[2];
if(argv.length>3)document.getElementById("input_area").value=argv[3];
if(argv.length>4)document.getElementById("input").innerHTML=argv[4];
*/
url = require('url');
const net = require('net');
function isExistFile(file) {
    let fs = require('fs');
    try {
      fs.statSync(file);
      return true
    } catch(err) {
      if(err.code === 'ENOENT') return false
    }
  }
  // 現在の時刻を取得
  function whatTimeIsIt() {
    const time = new Date();
    const year = time.getFullYear();
    const month = zeroPadding(time.getMonth() + 1);
    const day = zeroPadding(time.getDate());
    const hours = zeroPadding(time.getHours());
    const minutes = zeroPadding(time.getMinutes());
    const seconds = zeroPadding(time.getSeconds());
    const text = (() => {
      return `${year}-${month}-${day}_${hours}.${minutes}.${seconds}`;
    })();
    return text;
  }
  // ゼロパディング
  function zeroPadding(num) {
    const str = String(num);
    const txt = (() => {
      if (str.length == 1) return `0${str}`;
      return str;
    })();
    return txt;
  }
function download(data){
    var input_autoDL= document.getElementById("input_autoDL");
    var bp=input_autoDL.value;
    if(!bp)return;
    console.log("DL path="+data);
	try {
  let request = require('request');
  request(data, {
    encoding: 'binary'
  }, (error, response, body) => {
    if (!error) {
      let fs = require('fs');
      let path = require('path');
      let fn=path.basename(data);
      if(fn=="unknown.png")fn=whatTimeIsIt()+".png";
      var pa=bp+fn;
      var num=0;
      while(isExistFile(pa)){
        pa=bp+num+"_"+fn;
        num++;
      }
      fs.writeFile(pa, body, 'binary', (err) => {
        console.log(err);
      });
      console.log("LocalPath="+pa);
    }else{
        console.log(error);
    }
  });
	}catch(error) {
        console.log(error);
	}
}
var input_autoDL= document.getElementById("input_autoDL");
input_autoDL.value=window.localStorage.getItem('input_autoDL');
var input_area = document.getElementById("input_area");
input_area.value=window.localStorage.getItem('input_areaTOKEN');
var input_atuwaBouyomi= document.getElementById("input_atuwaBouyomi");
input_atuwaBouyomi.value=window.localStorage.getItem('input_atuwaBouyomi')||"localhost";
var input_atuwaBouyomiP= document.getElementById("input_atuwaBouyomiP");
input_atuwaBouyomiP.value=window.localStorage.getItem('input_atuwaBouyomiP')||"5003";

function main() {
    var input_autoDL= document.getElementById("input_autoDL");
    window.localStorage.setItem('input_autoDL',input_autoDL.value);
    var input_area = document.getElementById("input_area");
    window.localStorage.setItem('input_areaTOKEN',input_area.value);
    var input_atuwaBouyomi = document.getElementById("input_atuwaBouyomi");
    window.localStorage.setItem('input_atuwaBouyomi',input_atuwaBouyomi.value);
    var input_atuwaBouyomiP = document.getElementById("input_atuwaBouyomiP");
    window.localStorage.setItem('input_atuwaBouyomiP',input_atuwaBouyomiP.value);

    client.on("ready", () => {
        boot_client();
        input_area.value = "";
    });
    client.login(input_area.value);
    client.on('message', msg => {//メッセージ受け取り
        var data=msg.content.replace(/<@!?([0-9]*?)>/g, '');
        //https://github.com/micelle/dc_DiSpeak からCopyright (c) 2017 micelle
    let message = data.replace(/\s+/g, ' ').trim();
    const attachmentsSize = msg.attachments.size;
    //console.log("<Discord> files=" + attachmentsSize); 
        var selected_guild = document.getElementById("server_select").value;
        var selected_channel = document.getElementById("channel_select").value;
        if(msg.channel.id!=selected_channel)return;
        if(msg.channel.guild.id!=selected_guild)return;//対象外の時この下は実行されない
  if (attachmentsSize > 0) {
    const filenameAry = msg.attachments.map(function(val, key) {
        download(val.url);
      return val.filename;
    });
    const filenameList = filenameAry.join(' file://');
    message+="file://" + filenameList;
  }
  // 絵文字の処理
  const dataMatch = data.match(/<a?(:[a-zA-Z0-9!-/:-@¥[-`{-~]+:)([0-9]+)>/g); // 絵文字を抽出
    const dataLen = (function() {
      if (dataMatch) return dataMatch.length;
      return 0;
    })();
    for (let i = 0; i < dataLen; i++) {
      const emojiId = dataMatch[i].replace(/<a?:[a-zA-Z0-9!-/:-@¥[-`{-~]+:([0-9]+)>/, '$1'); // 絵文字IDのみを抜き出し
      const emojiTxt = (function() {
        if (objectCheck(setting, `emojis.${emojiId}`) == null) return '（絵文字）'; // 絵文字の文字を調べる
        return setting.emojis[emojiId];
      })();
      const emojiReg = new RegExp('<a?:[a-zA-Z0-9!-/:-@¥[-`{-~]+:(' + emojiId + ')>'); // 絵文字を文字に置換
      data = data.replace(emojiReg, emojiTxt);
    }
    var atuwaBouyomi = document.getElementById("input_atuwaBouyomi").value;
    var atuwaBouyomiP = document.getElementById("input_atuwaBouyomiP").value;
    if(atuwaBouyomi){
        console.log('[Discord] channels', msg.channel.id+"/"+selected_channel);
        console.log('[Discord] channel', msg.channel.guild.id+"/"+selected_guild);
        //console.log("<atuwaBouyomi> " + atuwaBouyomi);

        const bouyomiServer = {};
        bouyomiServer.host = atuwaBouyomi;
        bouyomiServer.port = parseInt(atuwaBouyomiP, 10);
        const options = bouyomiServer;
        //console.log("setData");
        console.log(msg.author.username+'UID='+msg.author.id);
        const bouyomiClient = net.createConnection(options, () => {
            //console.log("SendStart");
        const messageBuffer = Buffer.from(message);
        const UIDBuffer = Buffer.from(""+msg.author.id);//拡張分
        const username = msg.author.username; // 対象者の名前
        const nickname = (function() { // 対象者のニックネーム。未設定はnull
          if (msg.member == null || msg.member.nickname == null) return username;
          return msg.member.nickname;
        })();
        const NickBuffer = Buffer.from(""+nickname);//拡張分
        const len=15 + messageBuffer.length+UIDBuffer.length+4+NickBuffer.length+4;
        const buffer = Buffer.alloc(len);
        buffer.writeUInt16LE(0xF001, 0);
        buffer.writeInt16LE(-1, 2); // 速度 speed
        buffer.writeInt16LE(-1, 4); // 音程 tone
        buffer.writeInt16LE(-1, 6); // 音量 volume
        buffer.writeInt16LE(0, 8); // 声質 voice
        buffer.writeUInt8(0x00, 10);//UTF-8
        buffer.writeUInt32LE(messageBuffer.length, 11);
        messageBuffer.copy(buffer, 15, 0, messageBuffer.length);

        buffer.writeUInt32LE(UIDBuffer.length, 15+messageBuffer.length);//ユーザIDをテキストとして
        UIDBuffer.copy(buffer, messageBuffer.length+19, 0, UIDBuffer.length);

        buffer.writeUInt32LE(NickBuffer.length, 15+messageBuffer.length+UIDBuffer.length+4);//ニックネームをテキストとして
        NickBuffer.copy(buffer, messageBuffer.length+15+UIDBuffer.length+4+4, 0, NickBuffer.length);

        bouyomiClient.write(buffer);
        //console.log("<Send> " + buffer);
        });
        // エラー（接続できなかったときなど）
        bouyomiClient.on('error', (e) => {
          console.log("<SendError> " + e);
        });
        bouyomiClient.on('data', (e) => {
          bouyomiClient.end();
        });
        // 接続が完了したとき
        bouyomiClient.on('end', () => {
            console.log("END");
        });
    }
    //ここまで
        console.log("<Discord> " + message);
//        if (msg.content === 'ping') {
//            msg.reply('pong');
//        }else if (msg.content === "伊藤ライフ" || msg.content ==="伊藤ライフ" || msg.content ==="以東ライフ" || msg.content ==="依投ライフ") {
//            msg.reply('伊東だっつってんだろ次はないぞ');
//        } else if(msg.content === "トイレ"){
//            msg.reply("だめ");
//        }
    });
};

function boot_client(){
    console.log('Ready!');
    var status_text = document.getElementById("client_status_text");
    status_text.innerHTML = "Ready!";
    status_text.insertAdjacentHTML('afterend','<div id="ui"></div>');

    var ui = document.getElementById("ui");
    ui.insertAdjacentHTML('afterbegin','<div><h3 class="form_name_text">Server: </h3><form class="form"><select name="Server" id="server_select" class="selects"></select></form></div><div><h3 class="form_name_text">Channel: </h3><form class="form"><select name="Channel" id="channel_select" class="selects"></select></form></div>');

    var server_select = document.getElementById("server_select");
    var channel_select = document.getElementById("channel_select");

    var guilds = client.guilds;

    server_select.insertAdjacentHTML('afterbegin', '<option value="0">選択してください</option>');
    guilds.map(guild => {
        server_select.insertAdjacentHTML('afterbegin', '<option value="' + guild.id + '">' + guild.name + '</option>')
        console.log(guild.id);
        console.log(guild.name);
    });

    server_select.addEventListener('change', function(){
        guilds.map(guild => {
            if(guild.id === server_select.value) {
                update_channel_select(guild);
            }
        });
    });
    document.getElementById("submit").value = "Post!";
    document.getElementById("submit").removeEventListener("click", main, false);
    document.getElementById("submit").addEventListener("click", post_message, false);
};

function update_channel_select (guild) {
    var channels = guild.channels;

    delete_child_element('channel_select');
    channels.map(channel => {
        if(channel.type === "text"){
            channel_select.insertAdjacentHTML('afterbegin', '<option value="' + channel.id + '">' + channel.name + '</option>');
        }
        console.log(channel.id);
        console.log(channel.name);
    })
};

function delete_child_element(name){
    var obj = document.getElementById(name);
    while(obj.firstChild !== null){
        obj.removeChild(obj.firstChild);
    }
};

function post_message(){
    var content = document.getElementById("input_area");
    var guilds = client.guilds;
    var selected_guild = document.getElementById("server_select").value;
    var selected_channel = document.getElementById("channel_select").value;

    guilds.map(guild => {
        if(guild.id === selected_guild){
            guild.channels.map(channel => {
                if(channel.id === selected_channel){
                    console.log(channel.name);
                    console.log(content.value);
                    channel.send(content.value);
                    content.value = "";
                };
            });
        };
    });
};