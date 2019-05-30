const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");
const qs = require('querystring')//追加

const index_page = fs.readFileSync('./3-15.ejs', "utf8");
const style_css = fs.readFileSync('./3-5.css', "utf8");
//const other_page = fs.readFileSync('./other2.ejs', "utf8");

let server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

// ここまでメインプログラム＝＝＝＝＝＝

// createServerの処理
function getFromClient(request, response) {
    let url_parts = url.parse(request.url, true);
    switch (url_parts.pathname) {

        case '/':
            response_index(request, response);//修正
            break;

        case '/other2':
            response_other(request, response);//修正
            break;


        case '/style.css':
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(style_css);
            response.end();
            break;

        default:
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('no page...');
            break;
    }
}

let data = { msg: 'no message...' };

let data2 = {
    'Taro': ['taro@yamada', '09-999-999', 'Tokyo'],
    'Hanako': ['hanako@flower', '080-888-888', 'Yokohama'],
    'Sachiko': ['sachi@happy', '070-777-777', 'Nagoya'],
    'Ichiro': ['ichi@baseball', '060-666-666', 'USA']
};

//indexのアクセス処理
function response_index(request, response) {
    //POSTアクセス処理
    if (request.method == 'POST') {
        let body = '';
        //データ受信のイベント処理
        request.on('data', (data) => {
            body += data;
        });
        //データ受信終了のイベント処理
        request.on('end', () => {
            data = qs.parse(body);
            console.log(data.msg)
            //クッキーの保存
            setCookie('msg', data.msg, response);
            write_index(request, response);
        });
     } else {
        write_index(request, response);

    }
}

function write_index(request, response) {
     msg = "※伝言を表示する"
    let cookie_data = getCookie('msg',request);
    let content = ejs.render(index_page, {
        title: "Index",
        content: msg,
        data: data,
        cookie_data: cookie_data,
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(content);
    response.end();

}

function setCookie(key, value, response) {
    let cookie = escape(value);
    response.setHeader('Set-Cookie', [key + '=' + cookie]);
}

function getCookie(key, request) {
    let cookie_data = request.headers.cookie != undefined ?
        request.headers.cookie : '';
    data = cookie_data.split(';');
    for (var i in data) {
        if (data[i].trim().startsWith(key + '=')) {
            let result = data[i].trim().substring(key.length + 1);
            return unescape(result);
        }
    }
    return '';
}