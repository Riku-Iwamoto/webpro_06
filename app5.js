const express = require("express");
const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE02", name:"八丁堀駅"},
  { id:3, code:"JE03", name:"越中島駅"},
  { id:4, code:"JE04", name:"潮見駅"},
  { id:5, code:"JE05", name:"新木場駅"},
  { id:6, code:"JE06", name:"葛西臨海公園駅"},
  { id:7, code:"JE07", name:"舞浜駅"},
  { id:8, code:"JE08", name:"新浦安駅"},
  { id:9, code:"JE09", name:"市川塩浜駅"},
  { id:10, code:"JE10", name:"二俣新町駅"},
  { id:11, code:"JE11", name:"南船橋駅"},
  { id:12, code:"JE12", name:"新習志野駅"},
  { id:13, code:"JE13", name:"幕張豊砂駅"},
  { id:14, code:"JE14", name:"海浜幕張駅"},
];

app.get("/keiyo", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('db2', { data: station });
});

app.get("/keiyo_add", (req, res) => {
  const id = Number(req.query.id);
  const code = req.query.code;
  const name = req.query.name;

  station.push({ id, code, name });
  res.redirect("/public/keiyo_add.html");
});

const station2 = [
  { id: 1, code: "JE01", name: "東京駅", change: "総武本線，中央線，etc", passengers: 403831, distance: 0 },
  { id: 2, code: "JE02", name: "八丁堀駅", change: "日比谷線", passengers: 31071, distance: 1.2 },
  { id: 3, code: "JE05", name: "新木場駅", change: "有楽町線，りんかい線", passengers: 67206, distance: 7.4 },
  { id: 4, code: "JE07", name: "舞浜駅", change: "舞浜リゾートライン", passengers: 76156, distance: 12.7 },
  { id: 5, code: "JE12", name: "新習志野駅", change: "", passengers: 11655, distance: 28.3 },
  { id: 6, code: "JE17", name: "千葉みなと駅", change: "千葉都市モノレール", passengers: 16602, distance: 39.0 },
  { id: 7, code: "JE18", name: "蘇我駅", change: "内房線，外房線", passengers: 31328, distance: 43.0 },
];

app.get("/keiyo2", (req, res) => {
  res.send(ejs.render(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>京葉線の駅一覧</title>
</head>
<body>
  <h1>京葉線の駅一覧</h1>
  <table>
    <thead>
      <tr><th>ID</th><th>駅コード</th><th>駅名</th></tr>
    </thead>
    <tbody>
      <% for (const [number, row] of data.entries()) { %>
        <tr>
          <td><%= row.id %></td>
          <td><%= row.code %></td>
          <td><a href="/keiyo2/<%= number %>"><%= row.name %></a></td>
        </tr>
      <% } %>
    </tbody>
  </table>
</body>
</html>`, { data: station2 }));
});

app.get("/keiyo2/:number", (req, res) => {
  const number = req.params.number;
  const detail = /^\d+$/.test(number) ? station2[Number(number)] : undefined;
  if (!detail) {
    return res.status(404).send("指定された駅が見つかりません。");
  }

  res.send(ejs.render(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title><%= data.name %>の詳細</title>
</head>
<body>
  <h1><%= data.name %>の詳細</h1>
  <table>
    <thead>
      <tr><th>項目</th><th>データ</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">ID</th><td><%= data.id %></td></tr>
      <tr><th scope="row">駅コード</th><td><%= data.code %></td></tr>
      <tr><th scope="row">駅名</th><td><%= data.name %></td></tr>
      <tr><th scope="row">乗り換え線</th><td><%= data.change || "なし" %></td></tr>
      <tr><th scope="row">乗車人員</th><td><%= data.passengers %> 人</td></tr>
      <tr><th scope="row">東京駅からの距離</th><td><%= data.distance %> km</td></tr>
    </tbody>
  </table>
  <a href="/keiyo2">駅一覧に戻る</a>
</body>
</html>`, { data: detail }));
});

const songs = [
  { id: 1, title: "共犯", scene: "盛り上がりたい時" },
  { id: 2, title: "ア・ポステリオリ", scene: "ムカついた時" },
  { id: 3, title: "うブ", scene: "ぶち上がりたい時" }
];

app.get("/song_add", (req, res) => {
  const title = req.query.title;
  const scene = req.query.scene;

  if (typeof title !== "string" || !title.trim() ||
      typeof scene !== "string" || !scene.trim()) {
    return res.status(400).send("曲名と聴きたい場面を入力してください．");
  }

  const id = songs.length + 1;
  songs.push({ id, title: title.trim(), scene: scene.trim() });
  res.redirect("/songs");
});

app.get("/songs", (req, res) => {
  res.render("songs", { data: songs });
});

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let judgement = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 以下の数行は人間の勝ちの場合の処理なので，
  // 判定に沿ってあいこと負けの処理を追加する
  judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
