const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");
const qs = require('querystring')//追加

const index_page = fs.readFileSync('./index.ejs', "utf8");
const style_css = fs.readFileSync('./2-5.css', "utf8");
const other_page = fs.readFileSync('./other.ejs', "utf8");

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

        case '/other':
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

function response_index(request, response) {
    let msg = "これはIndexページです。"
    let content = ejs.render(index_page, {
        title: "Index",
        content: msg,
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(content);
    response.end();

}

function response_other(request, response) {
    let msg = "これはotherページです。"
    //POSTアクセスの処理
    if (request.method == 'POST') {

        let body = '';
        //データ受信のイベント処理
        request.on('data', (data) => {
            body += data;
        });
        //データ受信終了のイベント処理
        request.on('end', () => {

            let post_data = qs.parse(body);
            msg += 'あなたは、「' + post_data.msg + '」と書きました。';
            let content = ejs.render(other_page, {
                title: "Other",
                content: msg,
            });
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(content);
            response.end();
        });
    }
    //GETアクセスの処理
    else {
        let msg = 'ページがありません。'
        content = ejs.render(other_page, {
            title: "Other",
            content: msg,
        });
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(content);
        response.end();

    }
}