function frequency_chi(bookId) {
  getDocument(bookId);
  let text = "";
  var paraText = para.map(function (p) {
    if (p.getText()==p.getLinkUrl()) {
      return;
    }
    let temtext = p.getText();
    temtext = temtext.replace(/[\（\）。，「」『』？：；…、！—～＄,$-.]/gi, " ");
    chi = temtext.replace(/[\sA-Za-z0-9]/gi, "");
    return chi;
  });
  for (var j = 0; j <= para.length; j++) {
    if (levels[j] == 8 && paraText[j] != null) {
      text += paraText[j];
    }
  }
  console.log(text);
  return frequency_export(text, bookId);
}

function frequency_eng(bookId) {
  let blacklist = ['the', 'is', 'am', 'are', 'and'];
  getDocument(bookId);
  let text = "";
  var paraText = para.map(function (p) {
    if (p.getText()==p.getLinkUrl()) {
      return;
    }
    let temtext = p.getText();
    eng = temtext.match(/[A-Za-z]+/gi);
    if (eng!=null) {
      if (blacklist.some(r=> eng.indexOf(r) >= 0)) {
        return;
      }
    }
    return eng;
  });
  for (var j = 0; j <= para.length; j++) {
    if (levels[j] == 8 && paraText[j] != null) {
      text += paraText[j];
    }
  }
  return frequency_export(text, bookId);
}

function frequency_export(text, bookId) {
  script = "<script src='https://www.gstatic.com/charts/loader.js'></script><script src='https://code.jquery.com/jquery-3.5.1.slim.min.js'></script><script src='https://pulipulichen.github.io/jieba-js/require-jieba-js.js'></script>";
  script += "<style>#loader{border: 16px solid #f3f3f3;border-radius: 50%;border-top: 16px solid #3498db;width: 120px;height: 120px;animation: spin 2s linear infinite;}@keyframes spin{0%{transform:rotate(0deg);}100%{transform: rotate(360deg);}}</style>";
  script += "<center><div id='display'><h1>數據處理中……</h1><h1>Loading...</h1><h3><div id='timer'>開始等候時間：00:00:00</div></h3><div id='loader'></div></div></center>";
  script += "<script>var dt = new Date();if (dt.getHours() <= 9) {var h = '0' + dt.getHours();}else {var h = dt.getHours();}if (dt.getMinutes() <= 9) {var m = '0' + dt.getMinutes();}else {var m = dt.getMinutes();}if (dt.getSeconds() <= 9) {var s = '0' + dt.getSeconds();}else {var s = dt.getSeconds();}var time = h + ':' + m + ':' + s;document.getElementById('timer').innerText = '開始等候時間：' + time;</script>";
  script += "<script>function gen_chart(obj) {var rdata = [['Word','Count']];for (var i=0;i<" + freqNum + "; i++){var temp=[];if(obj[i]!=null){temp.push(obj[i].word);temp.push(obj[i].count);rdata.push(temp);}}google.charts.load('current', {'packages':['corechart']});google.charts.setOnLoadCallback(drawChart);function drawChart() {var data = google.visualization.arrayToDataTable(rdata);var options = {title:'" + DocumentApp.openByUrl(books[bookId]["link"]).getName() + "'};var chart = new google.visualization.BarChart(document.getElementById('myChart'));chart.draw(data, options);}}</script>";
  script += "<script>function remover(arr){var i = 0;while (i < arr.length) {if (arr[i].length<2){arr.splice(i, 1);}else{++i;}}return arr;}</script>";
  script += "<script>function ranking(data){var counted = [];for (var c of data) {const alreadyCounted = counted.map(c => c.word); if (alreadyCounted.includes(c)) {counted[alreadyCounted.indexOf(c)].count += 1;}else{counted.push({'word': c,'count': 1});}};counted.sort(function(a, b){return b.count - a.count;});return counted;}</script>";
  script += "<script>_text = '" + text + "';_custom_dict = [];call_jieba_cut(_text, _custom_dict, function (_result){$('#display').empty();var obj = ranking(remover(_result));var spent_time = new Date() - dt;s = Math.floor(spent_time / 1000);m = Math.floor(s / 60);h = Math.floor(m / 60);s = s % 60;m = m % 60;h = h % 24;$('<p>處理花費時間：' + h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0') + '</p><div id=\"myChart\" style=\"width:100%;height:500px;\"></div>').appendTo('#display');gen_chart(obj);});</script>";
  return script;
}

function freqBlacklist() {
  let html="<div class='w3-panel w3-pale-blue w3-leftbar w3-rightbar w3-border-blue'><p>用分行來分隔詞彙便可</p></div><center>";
  html+="<div class='w3-half'><h6>中文</h6><textarea class='w3-input w3-border' rows='20' id='words_chi' style='resize:vertical;'/></textarea></div>";
  html+="<div class='w3-half'><h6>英文</h6><textarea class='w3-input w3-border' rows='20' id='words_eng' style='resize:vertical;'/></textarea></div>";
  html+="<br><input class='w3-button w3-blue' value='💾保存變更' type='button' onclick='saveList()' style='width:100%;'/>";
  html+="<script>function saveList() {var freqBlackList_chi = '';var freqBlackList_eng = ''; google.script.run.withSuccessHandler(function(){google.script.host.close();}).saveBlackList(freqBlackList_chi, freqBlackList_eng);}</script>";
  return html;
}
