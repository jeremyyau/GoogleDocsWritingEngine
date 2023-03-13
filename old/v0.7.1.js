/**
 * @OnlyCurrentDoc
 */

/*
請勿更動下面的程式碼，有任何損失的話，後果自負
*/

function installFunctions() {
  if (!(userProperties.getProperty('installed')==="true"||fatal_error)) {
    console.time("安裝花費時間");
    setAllProperties();
    setLinks();
    setCards();
    setDays();
    setSymbols();
    let menu = ui.createMenu('Google Docs Writing Engine v0.7.1');
    let subMenuViewer = ui.createMenu('👁️檢視器(Viewer)')
    .addItem('👁️自定(Custom Link)', 'customViewer')
    .addSeparator()
    .addItem('🔍搜尋(Google)', 'googleViewer')
    .addItem('📖維基百科(Wikipedia)', 'wikiViewer')
    .addItem('📔教育百科(Edupedia)', 'edupediaViewer')
    .addItem('📑故事織機(Story Plotter)', 'storyplotterViewer')
    .addSeparator()
    .addItem('🍌蕉園(Penana)', 'penanaViewer')
    .addItem('🌍原創星球(Novelstar)', 'novelstarViewer')
    .addItem('👥角角者(KadoKado)', 'kadoViewer')
    .addSeparator()
    .addItem('🎨插畫委託(illustbuy)', 'illustbuyViewer');
    let subMenuSettings = ui.createMenu('⚙️設定(Settings)')
    .addItem("⚙️一般設定(Regular Settings)", "regularSettings")
    .addSeparator()
    .addItem("🌙夜間模式(Dark Mode)", "darkMode")
    .addSeparator()
    .addItem("🔗連結管理(Links Manager)", "manageLinks")
    .addItem("👨‍👩‍👦角色卡管理(Cards Manager)", "manageCards")
    .addSeparator()
    .addItem('🗑️刪除所有連結(Delete Links)', 'deleteLinks')
    .addItem('🗑️刪除所有角色卡(Delete Cards)', 'deleteCards')
    .addSeparator()
    .addItem('🗑️重設所有設定(Reset Settings)', 'resetAllData');
    if (fatal_error===true) {
      console.error("程式無法正確安裝");
      return;
    }
    menu
    .addItem("✍🏻字數統計(Word Count)", "countPerSection")
    .addItem("🖨️輸出章節(Export Chapter)", "exportParagraph")
    .addItem("📉詞彙頻率(Words frequency)", "frequency")
    .addSubMenu(subMenuViewer)
    .addItem("🔗連結一覽(Links List)" ,"linksList")
    .addItem("👨‍👩‍👦角色卡一覽(Character Cards)", "cardsList")
    .addItem("🔣常用標點(Common Symbol)", "commonSymbol")
    .addSeparator()
    .addSubMenu(subMenuSettings)
    .addSeparator()
    .addItem("🎥示範影片(Demo Video)", "demoVideo")
    .addItem("👤關於作者(About me)", "aboutMe")
    .addSeparator()
    .addItem("💽下載TXT(Save as txt)(暫未開放)", "saveAsTxt")
    .addToUi();
    userProperties.setProperty('installed', 'true');
    if (non_fatal_error===false) {
      console.info("安裝完成！");
    } else {
      console.warn("安裝完成，但發現了一些錯誤");
    }
    console.timeEnd("安裝花費時間");
  }
}

function setAllProperties() {
  if (userProperties.getProperty('output_width')==null){userProperties.setProperty('output_width', '1000');}
  if (userProperties.getProperty('output_height')==null){userProperties.setProperty('output_height', '800');}
  if (userProperties.getProperty('modeless_width')==null){userProperties.setProperty('modeless_width', '650');}
  if (userProperties.getProperty('modeless_height')==null){userProperties.setProperty('modeless_height', '800');}
  if (userProperties.getProperty('goal')==null){userProperties.setProperty('goal', '1500');}
  if (userProperties.getProperty('goal_all')==null){userProperties.setProperty('goal_all', '100000');}
  if (userProperties.getProperty('freq_num')==null){userProperties.setProperty('freq_num', '10');}
  if (userProperties.getProperty('indents')==null){userProperties.setProperty('indents', '0');}
  if (userProperties.getProperty('lines')==null){userProperties.setProperty('lines', '1');}
  if (userProperties.getProperty('whitespace_count')==null){userProperties.setProperty('whitespace_count', 'false');}
  if (userProperties.getProperty('symbol_count')==null){userProperties.setProperty('symbol_count', 'false');}
  if (userProperties.getProperty('links_num')==null){userProperties.setProperty('links_num', '5');}
  if (userProperties.getProperty('cards_size')==null){userProperties.setProperty('cards_size', 's');}
  if (userProperties.getProperty('cards_display')==null){userProperties.setProperty('cards_display', 's');}
  if (userProperties.getProperty('cards_num')==null){userProperties.setProperty('cards_num', '4');}
  if (userProperties.getProperty('dark_mode')==null){userProperties.setProperty('dark_mode', 'false');}
  if (userProperties.getProperty('days_num')==null){userProperties.setProperty('days_num', '7');}
}

function setLinks() {if (userProperties.getProperty('links')==null){userProperties.setProperty('links', '[{"name":"","link":"️"}]');}}

function setCards() {
  if (userProperties.getProperty('cards')==null){
    let emptyCards = "";
    for (i=0;i<cards_num;i++) {
      emptyCards += '{"type":"","name":"","gender":"","img":"","desc":""}';
      if (i!=(cards_num-1)) {emptyCards += ',';}
    }
    userProperties.setProperty('cards', '[' + emptyCards + ']');
  }
}

function setDays() {if (userProperties.getProperty('days')==null){userProperties.setProperty('days', '[{"day":"","words":"️"}]');}}

function setSymbols() {if (userProperties.getProperty('symbol')==null){userProperties.setProperty('symbols', '["，","。","「","」","『","』","《","》"]');}}

var installed = false;
var non_fatal_error = false;
var fatal_error = false;
var ui = DocumentApp.getUi();
var body;
var para;
var levels;
var paraCounts;
var output;
var response;
var style = "<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>";
var script;
var end_script;
var userProperties = PropertiesService.getUserProperties();
const output_width = userProperties.getProperty('output_width');
const output_height = userProperties.getProperty('output_height');
const modeless_width = userProperties.getProperty('modeless_width');
const modeless_height = userProperties.getProperty('modeless_height');
const goal = userProperties.getProperty('goal');
const goal_all = userProperties.getProperty('goal_all');
const freq_num = userProperties.getProperty('freq_num');
const indents = userProperties.getProperty('indents');
const lines = userProperties.getProperty('lines');
const whitespace_count = (userProperties.getProperty('whitespace_count')==="true");
const symbol_count = (userProperties.getProperty('symbol_count')==="true");
const links_num = userProperties.getProperty('links_num');
const cards_size = userProperties.getProperty('cards_size');
const cards_display = userProperties.getProperty('cards_display');
const cards_num = userProperties.getProperty('cards_num');
const links = JSON.parse(userProperties.getProperty('links'));
const cards = JSON.parse(userProperties.getProperty('cards'));
const days = JSON.parse(userProperties.getProperty('days'));
const symbols = JSON.parse(userProperties.getProperty('symbols'));
const dark_mode = (userProperties.getProperty('dark_mode')==="true");

function getDocument() {
  console.time("文件讀取時間");
  body = DocumentApp.getActiveDocument().getBody();
  para = body.getParagraphs();
  levels = para.map(function(p) {
    return [DocumentApp.ParagraphHeading.TITLE, 
            DocumentApp.ParagraphHeading.SUBTITLE, 
            DocumentApp.ParagraphHeading.HEADING1,
            DocumentApp.ParagraphHeading.HEADING2,
            DocumentApp.ParagraphHeading.HEADING3,
            DocumentApp.ParagraphHeading.HEADING4,
            DocumentApp.ParagraphHeading.HEADING5,
            DocumentApp.ParagraphHeading.HEADING6,
            DocumentApp.ParagraphHeading.NORMAL].indexOf(p.getHeading());
  });
  console.timeEnd("文件讀取時間");
}

function wordCount() {
  paraCounts = para.map(function (p) {
    let temtext = p.getText();
    if (whitespace_count===false) {temtext = temtext.trim();}
    if (symbol_count===false) {temtext = temtext.replace(/[\（\）。，「」『』？：；…、！—～＄,$-.]/gi, " ");}
    let eng = temtext.match(/[A-Za-z0-9]+/gi);
    let chi = temtext.replace(/[\sA-Za-z0-9]/gi, "");
    chi = chi ? chi.length : 0;
    eng = eng ? eng.length : 0;
    return chi + eng;
  });
}

function predictTime(wordcount) {
  let time = 0;
  let count = wordcount;
  if (count > 0) {
    time++;
  }
  count-=450;
  for (i=count;i>=0;i-=300) {
    time++
  }
  return time;
}

function display(html, title) {
  output = HtmlService.createHtmlOutput(html);
  output.setWidth(Math.max(output_width, 1));
  output.setHeight(Math.max(output_height, 1));
  ui.showModalDialog(output, title);
}

function displayModeless(html, title) {
  output = HtmlService.createHtmlOutput(html);
  output.setWidth(Math.max(modeless_width, 1));
  output.setHeight(Math.max(modeless_height, 1));
  ui.showModelessDialog(output, title);
}

function displaySidebar(html, title) {
  output = HtmlService.createHtmlOutput(html);
  output.setTitle(title);
  ui.showSidebar(output);
}

function notAvailable() {ui.alert("🙅🏻‍♂️This function is not available yet", "這項功能尚未開放，敬請期待！", ui.ButtonSet.OK);}

function onOpen(){
  userProperties.setProperty('installed', 'false');
  installFunctions();
}

function countPerSection() {
  getDocument();
  wordCount();
  let textAll = "";
  let text = "";
  let countAll = 0;
  let chapterList = "";
  let countList = "";
  let colourList = "";
  let counts = [];
  let count = 0;
  let totalTime = 0;
  for (var i = 0; i < para.length; i++) {
    count = 0;
    for (var j = i+1; j < para.length; j++) {
      if (levels[j] <= levels[i]) {
        break;
      }
      if (levels[j] == 8) {
        count += paraCounts[j];
      }
    }
    counts.push(count);
  }

  for (var i = 0; i < para.length; i++) {
    if (levels[i] < 8 && levels[i] == 2) {
      if (text!="") {
        text += "</div>";
      }
      text += "<button class='collapsible' onclick='move()'>" + para[i].getText() + " (" + counts[i] + " words)</button><div class='content'>";
      countAll += counts[i];
      countList += counts[i] + ",";
    } else if (levels[i] < 8 && levels[i] == 3) {
      totalTime += predictTime(counts[i]);
      if (counts[i] >= goal) {
        text += "<p>" + para[i].getText() + "（達標✅）（⌛預計閱讀時間："+predictTime(counts[i])+"分鐘）</p>";
        text += "<div style='margin-bottom: 15px;'><div class='w3-grey w3-border'><div id='myBar' class='w3-container w3-green w3-center' style='width:"+ Math.round(Math.min(counts[i],goal)/goal*100) +"%'>"+ counts[i] + "/" + goal + "(" + Math.round(Math.min(counts[i],goal)/goal*100) + "%)</div></div></div>";
      } else {
        text += "<p>" + para[i].getText() + "（未達標❌）（⌛預計閱讀時間："+predictTime(counts[i])+"分鐘）</p>";
        text += "<div style='margin-bottom: 15px;'><div class='w3-grey w3-border'><div id='myBar' class='w3-container w3-red w3-center' style='width:"+ Math.round(Math.min(counts[i],goal)/goal*100) +"%'>"+ counts[i] + "/" + goal + "(" + Math.round(Math.min(counts[i],goal)/goal*100) + "%)</div></div></div>";
      }
    }
  }

  if (countAll >= goal_all) {
    textAll += "<h5>總字數（達標✅）（⌛預計閱讀時間："+totalTime+"分鐘）</h5>";
    textAll += "<div style='margin-bottom: 15px;'><div class='w3-grey w3-border'><div id='myBar' class='w3-container w3-green w3-center' style='width:"+ Math.round(Math.min(countAll,goal_all)/goal_all*100) +"%'>"+ countAll + "/" + goal_all + "(" + Math.round(Math.min(countAll,goal_all)/goal_all*100) + "%)</div></div></div>";
  } else {
    textAll += "<h5>總字數（未達標❌）（⌛預計閱讀時間："+totalTime+"分鐘）</h5>";
    textAll += "<div style='margin-bottom: 15px;'><div class='w3-grey w3-border'><div id='myBar' class='w3-container w3-red w3-center' style='width:"+ Math.round(Math.min(countAll,goal_all)/goal_all*100) +"%'>"+ countAll + "/" + goal_all + "(" + Math.round(Math.min(countAll,goal_all)/goal_all*100) + "%)</div></div></div>";
  }

  script = "<script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js'></script>";
  for (var i = 0; i < para.length; i++) {
    if (levels[i] == 2 && para[i].getText() != "" && para[i].getText() != null) {
      chapterList += "'" + para[i].getText() + "',";
      colourList += "'#" + ((1<<24)*Math.random() | 0).toString(16) + "',";
    }
  }
  style += "<style>.collapsible {background-color: #777;color: white;cursor: pointer;padding: 18px;width: 100%;border: none;text-align: left;outline: none;font-size: 15px;}.active, .collapsible:hover {background-color: #555;}.collapsible:after {content: '\53';color: white;font-weight: bold;float: right;margin-left: 5px;}.active:after {content: '\55';}.content {padding: 0 18px;max-height: 0;overflow: hidden;transition: max-height 0.2s ease-out;background-color: #f1f1f1;}</style>";
  end_script = "<script>var xValues = [" + chapterList.slice(0, -1) + "];";
  end_script += "var yValues = [" + countList.slice(0, -1) + "];";
  end_script += "var barColors = [" + colourList.slice(0, -1) + "];";
  end_script += "new Chart('myChart', {type: 'bar',data: {labels: xValues,datasets: [{backgroundColor: barColors,data: yValues}]},";
  end_script += "options: {legend: {display: false},title: {display: true,text: '" + DocumentApp.getActiveDocument().getName() + "'}}});</script>";
  end_script += "<script>var coll=document.getElementsByClassName('collapsible');var i;for(i=0;i<coll.length;i++){coll[i].addEventListener('click',function(){this.classList.toggle('active');var content = this.nextElementSibling;if(content.style.maxHeight){content.style.maxHeight = null;}else{content.style.maxHeight = content.scrollHeight + 'px';}});}</script>";
  display(style + script + "<body><canvas id='myChart' style='width:100%;'></canvas>" + textAll + text + end_script, '✍🏻字數統計(Word Count)');
}

function exportParagraph() {
  getDocument();
  let html = "<center>請選擇要輸出的章節：<select class='w3-select w3-border' id='selectedParagraph'>";
  let header = 0;
  for (var i = 0; i < para.length; i++) {
    if (levels[i] == 2 && para[i].getText() != "" && para[i].getText() != null) {
      html+="<option value='"+i+"'>"+para[i].getText()+"</option>";
      header++;
    }
  }
  html+="</select></center><br><input class='w3-button w3-blue' value='🖨️開始輸出' type='button' onclick='callExport()' style='width:100%;'/>";
  html+="<script>function callExport() {var selectedParagraph=document.getElementById('selectedParagraph').value;google.script.run.withSuccessHandler(function(){google.script.host.close();}).exportResult(selectedParagraph);}</script>";
  if (header<=0) {
    html="<h4>⚠️找不到章節</h4>";
    html+="還未設置章節，詳情請觀看示範影片<br>";
    html+="<center><iframe width='" + (output_width-100) + "' height='" + (output_height-100) + "' src='https://www.youtube.com/embed/9SKpUYWjXJY' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe></center>";
  }
  display(style + html, '🖨️輸出章節(Export Chapter)');
}

function exportResult(i) {
  i = parseInt(i);
  getDocument();
  wordCount();
  let text = "";
  let parts = "";
  let x = 0;
  let paraText = para.map(function (p) {
    return p.getText();
  });
  let counts = [];
  for (k = 0; k < para.length; k++) {
    var count = 0;
    for (j = k+1; j < para.length; j++) {
      if (levels[j] <= levels[k]) {
        break;
      }
      if (levels[j] == 8) {
        count += paraCounts[j];
      }
    }
    counts.push(count);
  }
  for (var j = i+1; j <= para.length; j++) {
    if (levels[j] == 8 && paraText[j] != null) {
      if (paraText[j] != "") {
        for (z=0;z<Math.max(indents, 0);z++) {
          text += "　";
        }
      }
      text += paraText[j];
      if (paraText[j] != "") {
        text += "\n";
      }
      for (y=0;y<Math.max(lines, 0);y++) {
        text += "\n";
      }
    } else if (levels[j] == 3) {
      if (x >= 1) {
        parts += "<textarea onclick='this.focus();this.select();document.execCommand(\"copy\");alert(\"Paragraph copied!\")' style='width:100%;' rows='5'>" + text.replace(/\n+$/, '').replace(/^\n+|\n+$/g, '') + "</textarea>";
      }
      parts += "<h5>" + para[j].getText() + " (" + counts[j] + " words)（⌛預計閱讀時間："+predictTime(counts[j])+"分鐘）\n" + "</h5>";
      text = "";
      x++;
    } else if (levels[j] == 2 || j == para.length) {
      parts += "<textarea onclick='this.focus();this.select();document.execCommand(\"copy\");alert(\"Paragraph copied!\")' style='width:100%;' rows='5'>" + text.replace(/\n+$/, '').replace(/^\n+|\n+$/g, '') + "</textarea>";
      break;
    }
  }
  style += "<style>textarea {width: 100%;height: 150px;padding: 12px 20px;box-sizing: border-box;border: 2px solid #ccc;border-radius: 4px;background-color: #f8f8f8;font-size: 16px;resize: none;}</style>";
  display(style + "<div class='w3-container'><div class='w3-panel w3-pale-blue w3-leftbar w3-rightbar w3-border-blue'><p>Click the text box to copy the paragraph</p><p>按一下文字框以複製段落文字</p></div></div>" + parts + "</body>", '🖨️輸出章節(Export Chapter) ' + para[i].getText());
}

function frequency() {
  getDocument();
  let text = "";
  var paraText = para.map(function (p) {
    return p.getText();
  });
  for (var j = 0; j <= para.length; j++) {
    if (levels[j] == 8 && paraText[j] != null) {
      text += paraText[j].replace(/\r?\n|\r/g, "");
    }
  }
  script = "<script src='https://www.gstatic.com/charts/loader.js'></script><script src='https://code.jquery.com/jquery-3.5.1.slim.min.js'></script><script src='https://pulipulichen.github.io/jieba-js/require-jieba-js.js'></script>";
  script += "<style>#loader{border: 16px solid #f3f3f3;border-radius: 50%;border-top: 16px solid #3498db;width: 120px;height: 120px;animation: spin 2s linear infinite;}@keyframes spin{0%{transform:rotate(0deg);}100%{transform: rotate(360deg);}}</style>";
  script += "<center><div id='display'><h1>數據處理中……</h1><h1>Loading...</h1><h3><div id='timer'>開始等候時間：00:00:00</div></h3><div id='loader'></div></div></center>";
  script += "<script>var dt = new Date();if (dt.getHours() <= 9) {var h = '0' + dt.getHours();}else {var h = dt.getHours();}if (dt.getMinutes() <= 9) {var m = '0' + dt.getMinutes();}else {var m = dt.getMinutes();}if (dt.getSeconds() <= 9) {var s = '0' + dt.getSeconds();}else {var s = dt.getSeconds();}var time = h + ':' + m + ':' + s;document.getElementById('timer').innerText = '開始等候時間：' + time;</script>";
  script += "<script>function gen_chart(obj) {var rdata = [['Word','Count']];for (var i=0;i<" + freq_num + "; i++){var temp=[];if(obj[i]!=null){temp.push(obj[i].word);temp.push(obj[i].count);rdata.push(temp);}}google.charts.load('current', {'packages':['corechart']});google.charts.setOnLoadCallback(drawChart);function drawChart() {var data = google.visualization.arrayToDataTable(rdata);var options = {title:'" + DocumentApp.getActiveDocument().getName() + "'};var chart = new google.visualization.BarChart(document.getElementById('myChart'));chart.draw(data, options);}}</script>";
  script += "<script>function remover(arr){var i = 0;while (i < arr.length) {if (arr[i].length<2||arr[i].match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/)==null){arr.splice(i, 1);}else{++i;}}return arr;}</script>";
  script += "<script>function ranking(data){var counted = [];for (var c of data) {const alreadyCounted = counted.map(c => c.word); if (alreadyCounted.includes(c)) {counted[alreadyCounted.indexOf(c)].count += 1;}else{counted.push({'word': c,'count': 1});}};counted.sort(function(a, b){return b.count - a.count;});return counted;}</script>";
  script += "<script>_text = '" + text + "';_custom_dict = [['以為', 99999999, 'n'],];call_jieba_cut(_text, _custom_dict, function (_result){$('#display').empty();var obj = ranking(remover(_result));var spent_time = new Date() - dt;s = Math.floor(spent_time / 1000);m = Math.floor(s / 60);h = Math.floor(m / 60);s = s % 60;m = m % 60;h = h % 24;$('<p>處理花費時間：' + h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0') + '</p><div id=\"myChart\" style=\"width:100%;height:500px;\"></div>').appendTo('#display');gen_chart(obj);});</script>";
  display(script, '📉詞彙頻率(Words frequency)');
}

function customViewer() {
  response = ui.prompt('請輸入網頁連結：');
  if (response.getSelectedButton() == ui.Button.OK) {
    script = "<script>window.location.href='" + response.getResponseText() + "'</script>";
    displayModeless(script, "👁️檢視器(Viewer)");
  }
}

function penanaViewer() {
  script = "<script>window.location.href='https://www.penana.com/home'</script>";
  displayModeless(script, "👁️檢視器(Viewer)");
}

function novelstarViewer() {
  script = "<script>window.location.href='https://www.novelstar.com.tw/'</script>";
  displayModeless(script, "👁️檢視器(Viewer)");
}

function kadoViewer() {
  script = "<script>window.location.href='https://www.kadokado.com.tw/'</script>";
  displayModeless(script, "👁️檢視器(Viewer)");
}

function googleViewer() {
  script = "<script>window.location.href='https://www.google.com/webhp?igu=1'</script>";
  displayModeless(script, "👁️檢視器(Viewer)");
}

function wikiViewer() {
  script = "<script>window.location.href='https://zh.m.wikipedia.org/zh-hk/Wikipedia:%E9%A6%96%E9%A1%B5'</script>";
  displayModeless(script, "👁️檢視器(Viewer)");
}

function edupediaViewer() {
  script = "<script>window.location.href='https://pedia.cloud.edu.tw/'</script>";
  displayModeless(script, "👁️檢視器(Viewer)");
}

function illustbuyViewer() {
  script = "<script>window.location.href='https://illustbuy.com/'</script>";
  displayModeless(script, "👁️檢視器(Viewer)");
}

function storyplotterViewer() {
  script = "<script>window.location.href='https://storyplotter.net/zh-hant'</script>";
  displayModeless(script, "👁️檢視器(Viewer)");
}

function linksList(){
  let html = "";
  for (var i=0;i<links.length;i++) {
    if (links[i]["link"] != "" && links[i]["name"] != "") {
      html += "<br><center><a href='" + links[i]["link"] + "' target='_blank'><button class='w3-button w3-blue w3-round-large'>" + links[i]["name"] + "</button></a></center>";
    }
  }
  if (html === "") {
    html = "<center><h5>尚未設定任何連結</h5></center>";
  }
  displaySidebar(style + html, '🔗連結一覽(Links List)');
}

function cardsList() {
  let html = "";
  let col = 1;
  for (var i=0;i<cards_num;i++) {
    let desc = cards[i]["desc"].replace(/\n/g, "<br>");
    if (col==1) {
      html += "<tr><td>";
    } else if (col==2) {
      html += "<td>";
    }
    if (cards[i]["gender"] === "m") {
      html += "<div class='w3-card-4 w3-blue' id='card' style='width:100%'>";
    } else if (cards[i]["gender"] === "f") {
      html += "<div class='w3-card-4 w3-red' id='card' style='width:100%'>";
    } else {
      html += "<div class='w3-card-4 w3-dark-grey' style='width:100%'>";
    }
    html += "<div class='w3-container w3-center'><h3>"+cards[i]["type"]+"</h3>";
    if (cards[i]["img"] == "") {
      if (cards[i]["gender"] != "f") {
        html += "<img src='https://www.w3schools.com/howto/img_avatar.png' alt='Avatar' style='width:80%'>";
      } else {
        html += "<img src='https://www.w3schools.com/howto/img_avatar2.png' alt='Avatar' style='width:80%'>";
      }
    } else {
      html += "<img src='"+cards[i]["img"]+"' alt='Avatar' style='width:80%'>";
    }
    html += "<h5>"+cards[i]["name"]+"</h5><div class='w3-section'>"+desc+"</div></div></div>";
    if (cards_size=="s"){
      if (col==1) {
        html += "</td>";
      } else if (col==2) {
        html += "</td></tr>";
      }
      if (col==2) {
        col=1;
      } else {
        col++;
      }
    }
  }
  if (cards_size=="s"){html = "<table>" + html + "</table>";}
  if (cards_display==="s") {displaySidebar(style + html, "👨‍👩‍👦角色卡(Character Cards)");} else if (cards_display==="m") {displayModeless(style + html, "👨‍👩‍👦角色卡(Character Cards)");}
}

function demoVideo() {
  display("<center><iframe width='" + (output_width-100) + "' height='" + (output_height-100) + "' src='https://www.youtube.com/embed/9SKpUYWjXJY' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe></center>", '🎥示範影片(Demo Video)');
}

function aboutMe() {
  script = "<script src='https://apis.google.com/js/platform.js'></script>";
  let html = "<center><a href='https://sites.google.com/view/kwokyingfai/' target='_blank'><button class='w3-button w3-blue w3-round-large' style='width:30%'><img src='https://i.imgur.com/7pAxvYw.png' width='50' height='50'> 個人網站</button></a></center><br>";
  html += "<center><a href='https://www.instagram.com/doctor_fai/' target='_blank'><button class='w3-button w3-pink w3-round-large' style='width:30%'><img src='https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' width='50' height='50'>Instagram</button></a></center><br>";
  html += "<center><a href='https://www.penana.com/user/98865/' target='_blank'><button class='w3-button w3-yellow w3-round-large' style='width:30%'><img src='https://www.penana.com/img/logo_new.svg' width='50' height='50'>Penana</button></a></center><br>"
  html += "<center><div class='g-ytsubscribe' data-channelid='UCezw_R_PZxYUVxNYWtDHpPg' data-layout='full' data-count='hidden'></div></center>";
  display(script + style + html, "👤關於作者(About me)");
}

function regularSettings() {
  let html="<center>";
  html+="<fieldset><legend>🖥️輸出設定</legend><div class='w3-half'><h6>🖥️輸出視窗寬度(output_width)</h6><input class='w3-input w3-border' type='number' id='output_width' value='"+output_width+"'/></div>";
  html+="<div class='w3-half'><h6>🖥️輸出視窗高度(output_height)</h6><input class='w3-input w3-border' type='number' id='output_height' value='"+output_height+"'/></div></fieldset>";
  html+="<br><fieldset><legend>🖥️檢視器設定</legend><div class='w3-half'><h6>🖥️檢視器視窗寬度(modeless_width)</h6><input class='w3-input w3-border' id='modeless_width' type='number' value='"+modeless_width+"'/></div>";
  html+="<div class='w3-half'><h6>🖥️檢視器視窗高度(modeless_height)</h6><input class='w3-input w3-border' type='number' id='modeless_height' value='"+modeless_height+"'/></div></fieldset>";
  html+="<br><fieldset><legend>🚩字數目標設定</legend><div class='w3-half'><h6>🚩章節目標字數(goal)</h6>每個節的目標字數<input class='w3-input w3-border' id='goal' type='number' value='"+goal+"'/></div>";
  html+="<div class='w3-half'><h6>🏁文章目標字數(goal_all)</h6>這個文件的目標字數<input class='w3-input w3-border' type='number' id='goal_all' value='"+goal_all+"'/></div></fieldset>";
  html+="<br><fieldset><legend>🔢詞彙頻率設定</legend><div class='w3-half'><h6>🔢詞彙頻率結果數(freq_num)</h6>詞彙頻率的結果數，最多15個<input class='w3-input w3-border' type='number' id='freq_num' value='"+freq_num+"'/></div></fieldset>";
  html+="<br><fieldset><legend>🖨️格式設定</legend><div class='w3-half'><h6>⬜縮排空格數量(indents)</h6>輸出文章時，縮排的空格數量<input class='w3-input w3-border' id='indents' type='number' value='"+indents+"'/></div>";
  html+="<div class='w3-half'><h6>〰️隔行數量(lines)</h6>輸出文章時，隔行的數量 <input class='w3-input w3-border' type='number' id='lines' value='"+lines+"'/></div></fieldset>";
  if (whitespace_count) {
    html+="<br><fieldset><legend>📈計算設定</legend><div class='w3-half'><h6>⬜計算空格(whitespace_count)</h6>字數統計會把空格計算在內<select class='w3-select w3-border' id='whitespace_count'><option value='false'>關閉</option><option value='true' selected>開啟</option></select></div>";
  } else {
    html+="<br><fieldset><legend>📈計算設定</legend><div class='w3-half'><h6>⬜計算空格(whitespace_count)</h6>字數統計會把空格計算在內<select class='w3-select w3-border' id='whitespace_count'><option value='false' selected>關閉</option><option value='true'>開啟</option></select></div>";
  }
  if (symbol_count) {
    html+="<div class='w3-half'><h6>🔣計算標點符號(symbol_count)</h6>字數統計會把標點符號計算在內<select class='w3-select w3-border' id='symbol_count'><option value='false'>關閉</option><option value='true' selected>開啟</option></select></div></fieldset>";
  } else {
    html+="<div class='w3-half'><h6>🔣計算標點符號(symbol_count)</h6>字數統計會把標點符號計算在內<select class='w3-select w3-border' id='symbol_count'><option value='false' selected>關閉</option><option value='true'>開啟</option></select></div></fieldset>";
  }
  html+="<br><fieldset><legend>🔗連結設定</legend><div class='w3-half'><h6>🔗連結數量(links_num)</h6><input class='w3-input w3-border' type='number' id='links_num' value='"+links_num+"'/></div></fieldset>";
  if (cards_size==="s") {
    html+="<br><fieldset><legend>👨‍👩‍👦角色卡設定</legend><div class='w3-half'><h6>👨‍👩‍👦角色卡大小</h6><select class='w3-select w3-border' id='cards_size'><option value='s' selected>小</option><option value='b'>大</option></select></div>";
  } else if (cards_size==="b") {
    html+="<br><fieldset><legend>👨‍👩‍👦角色卡設定</legend><div class='w3-half'><h6>👨‍👩‍👦角色卡大小</h6><select class='w3-select w3-border' id='cards_size'><option value='s'>小</option><option value='b' selected>大</option></select></div>";
  }
  if (cards_display==="s") {
    html+="<div class='w3-half'><h6>👨‍👩‍👦角色卡顯示方式</h6><select class='w3-select w3-border' id='cards_display'><option value='s' selected>Sidebar</option><option value='m'>檢視器</option></select></div>";
  } else if (cards_display==="m") {
    html+="<div class='w3-half'><h6>👨‍👩‍👦角色卡顯示方式</h6><select class='w3-select w3-border' id='cards_display'><option value='s'>Sidebar</option><option value='m' selected>檢視器</option></select></div>";
  }
  html+="<div class='w3-half'><h6>👨‍👩‍👦角色卡數量(cards_num)</h6><input class='w3-input w3-border' type='number' id='cards_num' value='"+cards_num+"'/></div></fieldset>";
  html+="</center><br><input class='w3-button w3-blue' value='💾保存設定' type='button' onclick='saveOptions()' style='width:100%;'/>";
  html+="<script>function saveOptions() {var output_width=document.getElementById('output_width').value;var output_height=document.getElementById('output_height').value;var modeless_width=document.getElementById('modeless_width').value;var modeless_height=document.getElementById('modeless_height').value;var goal=document.getElementById('goal').value;var goal_all=document.getElementById('goal_all').value;var freq_num=document.getElementById('freq_num').value;var indents=document.getElementById('indents').value;var lines=document.getElementById('lines').value;var whitespace_count=document.getElementById('whitespace_count').value;var symbol_count=document.getElementById('symbol_count').value;var links_num=document.getElementById('links_num').value;var cards_size=document.getElementById('cards_size').value;var cards_display=document.getElementById('cards_display').value;var cards_num=document.getElementById('cards_num').value;google.script.run.withSuccessHandler(function(){google.script.host.close();}).saveSettings(output_width, output_height, modeless_width, modeless_height, goal, goal_all, freq_num, indents, lines, whitespace_count, symbol_count, links_num, cards_size, cards_display, cards_num);}</script>";
  display(style + html, '⚙️設定(Settings)');
}

function saveSettings(output_width, output_height, modeless_width, modeless_height, goal, goal_all, freq_num, indents, lines, whitespace_count, symbol_count, links_num, cards_size, cards_display, cards_num) {
  userProperties.setProperty('output_width', output_width);
  userProperties.setProperty('output_height', output_height);
  userProperties.setProperty('modeless_width', modeless_width);
  userProperties.setProperty('modeless_height', modeless_height);
  userProperties.setProperty('goal', goal);
  userProperties.setProperty('goal_all', goal_all);
  userProperties.setProperty('freq_num', Math.min(freq_num, 15)+"");
  userProperties.setProperty('indents', indents);
  userProperties.setProperty('lines', lines);
  userProperties.setProperty('whitespace_count', whitespace_count);
  userProperties.setProperty('symbol_count', symbol_count);
  userProperties.setProperty('links_num', links_num);
  userProperties.setProperty('cards_size', cards_size);
  userProperties.setProperty('cards_display', cards_display);
  userProperties.setProperty('cards_num', cards_num);
  for (i=0;i<cards_num;i++) {
    let oldCards = JSON.stringify(cards).slice(0, -1) + ",";
    let emptyCards = "";
    for (i=0;i<cards_num;i++) {
      if (cards[i] == null) {
        emptyCards += '{"type":"","name":"","gender":"","img":"","desc":""}';
        emptyCards += ',';
      }
    }
    if (emptyCards === "") {
      oldCards = oldCards.slice(0, -1);
    }
    userProperties.setProperty('cards', oldCards + emptyCards.slice(0, -1) + "]");
  }
  ui.alert("👍🏻所有設定已成功保存!");
}

function manageLinks() {
  let html="<div class='w3-panel w3-pale-blue w3-leftbar w3-rightbar w3-border-blue'><p>顯示名稱和連結都要填上，否則將無法顯示</p></div><center>";
  for (var i=0;i<links_num;i++) {
    if (links[i]!=null) {
      html+="<fieldset><legend>🔗連結"+(i+1)+"</legend><div class='w3-half'><h6>📛顯示名稱</h6><input class='w3-input w3-border' type='text' id='name"+i+"' value='"+links[i]["name"]+"'/></div>";
      html+="<div class='w3-half'><h6>🔗連結</h6><input class='w3-input w3-border' type='text' id='link"+i+"' value='"+links[i]["link"]+"'/></div></fieldset><br>";
    } else {
      html+="<fieldset><legend>🔗連結"+(i+1)+"</legend><div class='w3-half'><h6>📛顯示名稱</h6><input class='w3-input w3-border' type='text' id='name"+i+"' value=''/></div>";
      html+="<div class='w3-half'><h6>🔗連結</h6><input class='w3-input w3-border' type='text' id='link"+i+"' value=''/></div></fieldset><br>";
    }
  }
  html+="</center><br><input class='w3-button w3-blue' value='💾保存變更' type='button' onclick='setNewLinks()' style='width:100%;'/>";
  html+="<script>function setNewLinks() {var newLinks = '[';for (i=0;i<"+links_num+";i++) {var newName = document.getElementById('name' + i).value;var newLink = document.getElementById('link' + i).value;newLinks += '{\"name\":\"'+newName+'\",\"link\":\"'+newLink+'\"}';if(i!="+(links_num-1)+"){newLinks+=','}}newLinks += ']';google.script.run.withSuccessHandler(function(){google.script.host.close();}).saveLinks(newLinks);}</script>";
  display(style + html, '🔗連結管理(Links Manager)');
}

function saveLinks(newLinks) {
  userProperties.setProperty('links', newLinks);
  ui.alert("👍🏻所有連結已成功保存!");
}

function manageCards() {
  let html="<div class='w3-panel w3-pale-blue w3-leftbar w3-rightbar w3-border-blue'><p>欄位可以填空，不需要所有資料都填上</p></div><center>";
  for (var i=0;i<cards_num;i++) {
    if (cards[i]!=null) {
      html+="<fieldset><legend>🙍🏻‍♂️🙍🏻‍♀️角色卡"+(i+1)+"</legend><div class='w3-half'><h6>👽類型</h6><input class='w3-input w3-border' type='text' id='type"+i+"' value='"+cards[i]["type"]+"'/></div>";
      html+="<div class='w3-half'><h6>📛名稱</h6><input class='w3-input w3-border' type='text' id='name"+i+"' value='"+cards[i]["name"]+"'/></div>";
      if (cards[i]["gender"]==="m") {
        html+="<div class='w3-half'><h6>🚻性別</h6><select class='w3-select w3-border' id='gender"+i+"'><option value='m' selected>男</option><option value='f'>女</option><option value='na'>不適用</option></select></div>";
      } else if (cards[i]["gender"]==="f") {
        html+="<div class='w3-half'><h6>🚻性別</h6><select class='w3-select w3-border' id='gender"+i+"'><option value='m'>男</option><option value='f' selected>女</option><option value='na'>不適用</option></select></div>";
      } else {
        html+="<div class='w3-half'><h6>🚻性別</h6><select class='w3-select w3-border' id='gender"+i+"'><option value='m'>男</option><option value='f'>女</option><option value='na' selected>不適用</option></select></div>";
      }
      html+="<div class='w3-half'><h6>🖼️圖片</h6><input class='w3-input w3-border' type='text' id='img"+i+"' value='"+cards[i]["img"]+"'/></div>";
      html+="<h6>📋描述</h6><textarea class='w3-input w3-border' rows='5' id='desc"+i+"' style='resize:vertical;'/>"+cards[i]["desc"]+"</textarea></fieldset><br>";
    } else {
      html+="<fieldset><legend>🙍🏻‍♂️🙍🏻‍♀️角色卡"+(i+1)+"</legend><div class='w3-half'><h6>👽類型</h6><input class='w3-input w3-border' type='text' id='type"+i+"' value=''/></div>";
      html+="<div class='w3-half'><h6>📛名稱</h6><input class='w3-input w3-border' type='text' id='name"+i+"' value=''/></div>";
      html+="<div class='w3-half'><h6>🚻性別</h6><select class='w3-select w3-border' id='gender"+i+"'><option value='m'>男</option><option value='f'>女</option><option value='na' selected>不適用</option></select></div>";
      html+="<div class='w3-half'><h6>🖼️圖片</h6><input class='w3-input w3-border' type='text' id='img"+i+"' value=''/></div>";
      html+="<h6>📋描述</h6><textarea class='w3-input w3-border' rows='5' id='desc"+i+"' style='resize:vertical;'/></textarea></fieldset><br>";
    }
  }
  html+="</center><br><input class='w3-button w3-blue' value='💾保存變更' type='button' onclick='setNewCards()' style='width:100%;'/>";
  html+="<script>function setNewCards() {var newCards = '[';for (i=0;i<"+cards_num+";i++) {var newType = document.getElementById('type' + i).value;var newName = document.getElementById('name' + i).value;var newGender = document.getElementById('gender' + i).value;var newImg = document.getElementById('img' + i).value;var newDesc = document.getElementById('desc' + i).value;newDesc = newDesc.replace(\/\\n\/g, '\\\\n');newCards += '{\"type\":\"'+newType+'\",\"name\":\"'+newName+'\",\"gender\":\"'+newGender+'\",\"img\":\"'+newImg+'\",\"desc\":\"'+newDesc+'\"}';if(i!="+(cards_num-1)+"){newCards+=','}}newCards += ']';google.script.run.withSuccessHandler(function(){google.script.host.close();}).saveCards(newCards);}</script>";
  display(style + html, '👨‍👩‍👦角色卡管理(Cards Managers)');
}

function saveCards(newCards) {
  userProperties.setProperty('cards', newCards);
  ui.alert("👍🏻所有角色卡已成功保存!");
}

function freqBlackList() {

}

function saveBlackList() {
  userProperties.setProperty('freqBlackList', newBlackList);
  ui.alert("👍🏻所有詞彙已成功保存!");
}

function deleteLinks() {
  response = ui.alert("⚠️你是否確定要刪除所有連結" , ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) {
    userProperties.deleteProperty('links');
    setLinks();
  }
}

function deleteCards() {
  response = ui.alert("⚠️你是否確定要刪除所有角色卡" , ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) {
    userProperties.deleteProperty('cards');
    setCards();
  }
}

function resetAllData() {
  response = ui.alert("⚠️你是否確定要重設所有設定？（包括連結和角色卡）" , ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) {
    userProperties.deleteAllProperties();
    setAllProperties();
    setLinks();
    setCards();
    setDays();
    setSymbols();
  }
}

function darkMode() {
  response = ui.alert("⚠️此功能會修改你的頁面和字體顏色\n如果你的文件只有白底黑字的話，可以無視" , ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) {
    let backcolour = {};
    let forecolour = {};
    if (dark_mode) {
      backcolour = {[DocumentApp.Attribute.BACKGROUND_COLOR]: "#ffffff"};
      forecolour = {[DocumentApp.Attribute.FOREGROUND_COLOR]: "#000000"};
    } else {
      backcolour = {[DocumentApp.Attribute.BACKGROUND_COLOR]: "#000000"};
      forecolour = {[DocumentApp.Attribute.FOREGROUND_COLOR]: "#ffffff"};
    }
    userProperties.setProperty('dark_mode', !dark_mode);
    DocumentApp.getActiveDocument().getBody().setAttributes(backcolour);
    DocumentApp.getActiveDocument().getBody().setAttributes(forecolour);
  }
}

function commonSymbol() {
  let html = "<center><h6>按一下按鈕即可插入標點符號</h6><hr>";
  let col = 0;
  html += "<input class='w3-button w3-blue w3-round-xxlarge' value='空白兩格' type='button' onclick='insertSymbol(\"　　\")'/><hr>";
  for (i=0;i<symbols.length;i++) {
    html += "<input class='w3-button w3-blue w3-round-xxlarge' value='"+symbols[i]+"' type='button' onclick='insertSymbol(this.value)'/>";
    col++;
    if (col===4) {
      col=0;
      html += "<hr><br>";
    } else {
      html += " ";
    }
  }
  html += "</center><script>function insertSymbol(symbol) {google.script.run.withSuccessHandler(function(){}).insertSymbol(symbol);}</script>";
  displaySidebar(style + html, "🔣常用標點(Insert Symbol)");
}

function insertSymbol(selected_symbol) {
  let cursor = DocumentApp.getActiveDocument().getCursor();
  if (cursor) {
    cursor.insertText(selected_symbol);
  } else {
    ui.alert('Cannot find a cursor.');
  }
}

function saveAsTxt(){
  let html = "<input type='button' id='dwn-btn' value='Download'/><script>function download(filename, text) {var element = document.createElement('a');element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));element.setAttribute('download', filename);element.style.display = 'none';document.body.appendChild(element);element.click();document.body.removeChild(element);}document.getElementById('dwn-btn').addEventListener('click', function(){var text = 'Hello World!';var filename = 'hello.txt';download(filename, text);download(filename, text);}, false);</script>";
  display(html, '💽下載TXT(Save as txt)');
  //notAvailable();
}
