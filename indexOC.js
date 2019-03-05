const Discord = require('discord.js');
const client = new Discord.Client();



console.log("test!")
document.getElementById("submit").addEventListener("click", main, false);

function main() {
    var input_area = document.getElementById("input_area");

    client.on("ready", () => {
        boot_client();
        input_area.value = "";
    });
    client.login(input_area.value);
    client.on('message', msg => {
        console.log("<Discord> " + msg.content);
        if (msg.content === 'ping') {
            msg.reply('pong');
        }else if (msg.content === "伊藤ライフ" || msg.content ==="伊藤ライフ" || msg.content ==="以東ライフ" || msg.content ==="依投ライフ") {
            msg.reply('伊東だっつってんだろ次はないぞ');
        } else if(msg.content === "ping"){
            msg.reply("pong");
        }
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
