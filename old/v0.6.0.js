/**
 * @OnlyCurrentDoc
 */

const output_width = 1000;  //輸出視窗的寬度，負數無效
const output_height = 800;  //輸出視窗的高度，負數無效
const modeless_width = 650; //檢視器視窗的寬度，負數無效
const modeless_height = 800; //檢視器視窗的寬度，負數無效
const goal = 1200; //每個節的目標字數，負數無效
const goal_all = 140000;  //這個文件的目標字數，負數無效
const freq_num = 10; //詞彙頻率的結果數，最多15個，負數無效
const lines = 1;  //輸出文章時，隔行的數量，負數無效
const whitespace_count = false; //為true時，字數統計會把空格計算在內，設為false把它關閉
const symbol_count = false; //為true時，字數統計會把標點符號計算在內，設為false把它關閉
const links = [{  //用作連結管理，link和name兩個欄位均不可為空
  "link":"",
  "name":"1️⃣"
  },
  {
  "link":"",
  "name":"2️⃣"
  },
  {
  "link":"",
  "name":"3️⃣"
  },
  {
  "link":"",
  "name":"4️⃣"
  },
  {
  "link":"",
  "name":"5️⃣"
  } //如要增加連結，請小心最後一個項目不要加上逗號
];

/*
這是分割線，下面的程式盡量不要動
*/

var installed = false;
var non_fatal_error = false;
var fatal_error = false;
var ui;
var body;
var para;
var levels;
var paraCounts;
var output;
var response;

function installFunctions() {
  if (!(installed||fatal_error)) {
    console.time("安裝花費時間");
    getDocument();
    if (output_width < 0) {console.warn("output_width不可為負值");non_fatal_error = true;}
    if (output_height < 0) {console.warn("output_height不可為負值");non_fatal_error = true;}
    if (modeless_width < 0) {console.warn("modeless_width不可為負值");non_fatal_error = true;}
    if (modeless_height < 0) {console.warn("modeless_height不可為負值");non_fatal_error = true;}
    if (goal < 0) {console.warn("goal不可為負值");non_fatal_error = true;}
    if (goal_all < 0) {console.warn("goal_all不可為負值");non_fatal_error = true;}
    if (freq_num < 0) {console.warn("freq_num不可為負值");non_fatal_error = true;}
    if (lines < 0) {console.warn("lines不可為負值");non_fatal_error = true;}
    if (!(whitespace_count===true||whitespace_count===false)) {console.warn("whitespace_count不可為boolean以外的值");non_fatal_error = true;}
    if (!(symbol_count===true||symbol_count===false)) {console.warn("symbol_count不可為boolean以外的值");non_fatal_error = true;}
    let menu = ui.createMenu('Google Docs Writing Engine v0.6.0');
    let subMenuExport = ui.createMenu('👀輸出章節(Export Chapter)');
    for (var i = 0; i < para.length; i++) {
      if (levels[i] == 2 && para[i].getText() != "" && para[i].getText() != null) {
        var dynamicMenu = para[i].getText();
        this["function" + i] = dynamicItem(i);
        subMenuExport.addItem(dynamicMenu, "function" + i);
      }
    }
    if (dynamicMenu==null) {
      subMenuExport.addItem("⚠️找不到章節", "chapterNotFound");
      console.warn("還未設置章節，詳情請觀看示範影片\nhttps://www.youtube.com/watch?v=9SKpUYWjXJY");
    }
    let subMenuViewer = ui.createMenu('👁️檢視器(Viewer)')
    .addItem('👁️自定(Custom Link)', 'customViewer')
    .addSeparator()
    .addItem('🔍搜尋(Google)', 'googleViewer')
    .addItem('📖維基百科(Wikipedia)', 'wikiViewer')
    .addItem('📑故事織機(Story Plotter)', 'storyplotterViewer')
    .addSeparator()
    .addItem('🍌蕉園(Penana)', 'penanaViewer')
    .addItem('👥角角者(KadoKado)', 'kadoViewer')
    .addSeparator()
    .addItem('🎨插畫委託(illustbuy)', 'illustbuyViewer');
    if (fatal_error===true) {
      console.error("程式無法正確安裝");
      return;
    }
    menu
    .addItem("✍🏻字數統計(Word Count)", "countPerSection")
    .addSubMenu(subMenuExport)
    .addItem("📉詞彙頻率(Words frequency)", "frequency")
    .addSubMenu(subMenuViewer)
    .addItem("🔗連結管理(Link Manager)" ,"linkManager")
    .addSeparator()
    .addItem("🎥示範影片(Demo Video)", "demoVideo")
    .addItem("👤關於作者(About me)", "aboutMe")
    .addSeparator()
    .addItem("💽下載TXT(Save as txt)(暫未開放)", "saveAsTxt")
    .addItem("⬜空白兩格(Spacing)(暫未開放)", "spacing")
    .addToUi();
    installed = true;
    if (non_fatal_error===false) {
      console.info("安裝完成！");
    } else {
      console.warn("安裝完成，但發現了一些錯誤");
    }
    console.timeEnd("安裝花費時間");
  }
}

function getDocument() {
  ui = DocumentApp.getUi();
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
}

function wordCount() {
  paraCounts = para.map(function (p) {
    let temtext = p.getText();
    if (whitespace_count===false) {
      temtext = temtext.trim();
    }
    if (symbol_count===false) {
      temtext = temtext.replace(/[。，「」『』？：；…！—～＄,.$]/gi, "");
    }
    let eng = temtext.match(/[A-Za-z0-9]+/g);
    let chi = temtext.replace(/[A-Za-z0-9]/gi, "");
    chi = chi ? chi.length : 0;
    eng = eng ? eng.length : 0;
    return chi + eng;
  });
}

function display(output, title) {
  output.setWidth(output_width);
  output.setHeight(output_height);
  ui.showModalDialog(output, title);
}

function displayModeless(output, title) {
  output.setWidth(modeless_width);
  output.setHeight(modeless_height);
  ui.showModelessDialog(output, title);
}

function displaySidebar(output, title) {
  output.setTitle(title);
  ui.showSidebar(output);
}

function onOpen(){}

installFunctions();

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
      if (counts[i] >= goal) {
        text += "<p>" + para[i].getText() + "（達標✅）</p>";
        text += "<div style='margin-bottom: 15px;'><div class='w3-grey w3-border'><div id='myBar' class='w3-container w3-green w3-center' style='width:"+ Math.round(Math.min(counts[i],goal)/goal*100) +"%'>"+ counts[i] + "/" + goal + "(" + Math.round(Math.min(counts[i],goal)/goal*100) + "%)</div></div></div>";
      } else {
        text += "<p>" + para[i].getText() + "（未達標❌）</p>";
        text += "<div style='margin-bottom: 15px;'><div class='w3-grey w3-border'><div id='myBar' class='w3-container w3-red w3-center' style='width:"+ Math.round(Math.min(counts[i],goal)/goal*100) +"%'>"+ counts[i] + "/" + goal + "(" + Math.round(Math.min(counts[i],goal)/goal*100) + "%)</div></div></div>";
      }
    }
  }

  if (countAll >= goal_all) {
    textAll += "<h5>總字數（達標✅）</h5>";
    textAll += "<div style='margin-bottom: 15px;'><div class='w3-grey w3-border'><div id='myBar' class='w3-container w3-green w3-center' style='width:"+ Math.round(Math.min(countAll,goal_all)/goal_all*100) +"%'>"+ countAll + "/" + goal_all + "(" + Math.round(Math.min(countAll,goal_all)/goal_all*100) + "%)</div></div></div>";
  } else {
    textAll += "<h5>總字數（未達標❌）</h5>";
    textAll += "<div style='margin-bottom: 15px;'><div class='w3-grey w3-border'><div id='myBar' class='w3-container w3-red w3-center' style='width:"+ Math.round(Math.min(countAll,goal_all)/goal_all*100) +"%'>"+ countAll + "/" + goal_all + "(" + Math.round(Math.min(countAll,goal_all)/goal_all*100) + "%)</div></div></div>";
  }

  let script = ("<script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js'></script>");
  for (var i = 0; i < para.length; i++) {
    if (levels[i] == 2 && para[i].getText() != "" && para[i].getText() != null) {
      chapterList += "'" + para[i].getText() + "',";
      colourList += "'#" + ((1<<24)*Math.random() | 0).toString(16) + "',"; 
    }
  }
  let style = ("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
  style += ("<style>.collapsible {background-color: #777;color: white;cursor: pointer;padding: 18px;width: 100%;border: none;text-align: left;outline: none;font-size: 15px;}.active, .collapsible:hover {background-color: #555;}.collapsible:after {content: '\53';color: white;font-weight: bold;float: right;margin-left: 5px;}.active:after {content: '\55';}.content {padding: 0 18px;max-height: 0;overflow: hidden;transition: max-height 0.2s ease-out;background-color: #f1f1f1;}</style>");
  let can_script = ("<script>var xValues = [" + chapterList.slice(0, -1) + "];");
  can_script += ("var yValues = [" + countList.slice(0, -1) + "];");
  can_script += ("var barColors = [" + colourList.slice(0, -1) + "];");
  can_script += ("new Chart('myChart', {type: 'bar',data: {labels: xValues,datasets: [{backgroundColor: barColors,data: yValues}]},");
  can_script += ("options: {legend: {display: false},title: {display: true,text: '" + DocumentApp.getActiveDocument().getName() + "'}}});</script>");
  let coll_script = ("<script>var coll=document.getElementsByClassName('collapsible');var i;for(i=0;i<coll.length;i++){coll[i].addEventListener('click',function(){this.classList.toggle('active');var content = this.nextElementSibling;if(content.style.maxHeight){content.style.maxHeight = null;}else{content.style.maxHeight = content.scrollHeight + 'px';}});}</script>");
  //var move_script = ("<script>function move() {var elem = document.getElementById('myBar');var width = 20;var id = setInterval(frame, 10);function frame(){if(width >= 100){clearInterval(id);}else{width++;elem.style.width = width + '%';}}}</script>");
  output = HtmlService.createHtmlOutput(style + script + "<body><canvas id='myChart' style='width:100%;'></canvas>" + textAll + text + can_script + coll_script);
  display(output, '✍🏻字數統計(Word Count)');
}

function dynamicItem(i) {
  return function() {
    getDocument();
    wordCount();
    var text = "";
    var parts = "";
    var x = 0;
    var paraText = para.map(function (p) {
      return p.getText();
    });
    var counts = [];
    for (var k = 0; k < para.length; k++) {
      var count = 0;
      for (var j = k+1; j < para.length; j++) {
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
        text += paraText[j];
        for (y=0;y<Math.max(lines, 0);y++) {
          text += "\n";
        }
        if (paraText[j] != "") {
          text += "\n";
        }
      } else if (levels[j] == 3) {
        if (x >= 1) {
          parts += "<textarea onclick='this.focus();this.select();document.execCommand(\"copy\");alert(\"Paragraph copied!\")' style='width:100%;' rows='5'>" + text.replace(/\n+$/, '').replace(/^\n+|\n+$/g, '') + "</textarea>";
        }
        parts += "<h5>" + para[j].getText() + " (" + counts[j] + " words)\n" + "</h5>";
        text = "";
        x++;
      } else if (levels[j] == 2 || j == para.length) {
        parts += "<textarea onclick='this.focus();this.select();document.execCommand(\"copy\");alert(\"Paragraph copied!\")' style='width:100%;' rows='5'>" + text.replace(/\n+$/, '').replace(/^\n+|\n+$/g, '') + "</textarea>";
        break;
      }
    }
    var style = "<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>";
    style += "<style>textarea {width: 100%;height: 150px;padding: 12px 20px;box-sizing: border-box;border: 2px solid #ccc;border-radius: 4px;background-color: #f8f8f8;font-size: 16px;resize: none;}</style>";
    output = HtmlService.createHtmlOutput(style + "<div class='w3-container'><div class='w3-panel w3-pale-blue w3-leftbar w3-rightbar w3-border-blue'><p>Click the text box to copy the paragraph</p><p>按一下文字框以複製段落文字</p></div></div>" + parts + "</body>");
    display(output, '👀輸出章節(Export Chapter) ' + para[i].getText());
  }
}

function chapterNotFound() {
  ui.alert("⚠️還未設置章節，詳情請觀看示範影片", "https://www.youtube.com/watch?v=9SKpUYWjXJY", DocumentApp.getUi().ButtonSet.OK);
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
  let script = ("<script src='https://www.gstatic.com/charts/loader.js'></script><script src='https://code.jquery.com/jquery-3.5.1.slim.min.js'></script><script src='https://pulipulichen.github.io/jieba-js/require-jieba-js.js'></script>");
  script += ("<style>#loader{border: 16px solid #f3f3f3;border-radius: 50%;border-top: 16px solid #3498db;width: 120px;height: 120px;animation: spin 2s linear infinite;}@keyframes spin{0%{transform:rotate(0deg);}100%{transform: rotate(360deg);}}</style>");
  script += ("<center><div id='display'><h1>數據處理中……</h1><h1>Loading...</h1><h3><div id='timer'>開始等候時間：00:00:00</div></h3><div id='loader'></div></div></center>");
  script += ("<script>var dt = new Date();if (dt.getHours() <= 9) {var h = '0' + dt.getHours();}else {var h = dt.getHours();}if (dt.getMinutes() <= 9) {var m = '0' + dt.getMinutes();}else {var m = dt.getMinutes();}if (dt.getSeconds() <= 9) {var s = '0' + dt.getSeconds();}else {var s = dt.getSeconds();}var time = h + ':' + m + ':' + s;document.getElementById('timer').innerText = '開始等候時間：' + time;</script>");
  script += ("<script>function gen_chart(obj) {var rdata = [['Word','Count']];for (var i=0;i<" + Math.min(freq_num, 15) + "; i++){var temp=[];if(obj[i]!=null){temp.push(obj[i].word);temp.push(obj[i].count);rdata.push(temp);}}google.charts.load('current', {'packages':['corechart']});google.charts.setOnLoadCallback(drawChart);function drawChart() {var data = google.visualization.arrayToDataTable(rdata);var options = {title:'" + DocumentApp.getActiveDocument().getName() + "'};var chart = new google.visualization.BarChart(document.getElementById('myChart'));chart.draw(data, options);}}</script>");
  script += ("<script>function remover(arr){var i = 0;while (i < arr.length) {if (arr[i].length<2||arr[i].match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/)==null){arr.splice(i, 1);}else{++i;}}return arr;}</script>");
  script += ("<script>function ranking(data){var counted = [];for (var c of data) {const alreadyCounted = counted.map(c => c.word); if (alreadyCounted.includes(c)) {counted[alreadyCounted.indexOf(c)].count += 1;}else{counted.push({'word': c,'count': 1});}};counted.sort(function(a, b){return b.count - a.count;});return counted;}</script>");
  script += ("<script>_text = '" + text + "';_custom_dict = [['以為', 99999999, 'n'],];call_jieba_cut(_text, _custom_dict, function (_result){$('#display').empty();var obj = ranking(remover(_result));var spent_time = new Date() - dt;s = Math.floor(spent_time / 1000);m = Math.floor(s / 60);h = Math.floor(m / 60);s = s % 60;m = m % 60;h = h % 24;$('<p>處理花費時間：' + h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0') + '</p><div id=\"myChart\" style=\"width:100%;height:500px;\"></div>').appendTo('#display');gen_chart(obj);});</script>");
  output = HtmlService.createHtmlOutput(script);
  display(output, '📉詞彙頻率(Words frequency)');
}

function demoVideo() {
  getDocument();
  output = HtmlService.createHtmlOutput("<center><iframe width='" + (output_width-100) + "' height='" + (output_height-100) + "' src='https://www.youtube.com/embed/9SKpUYWjXJY' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe></center>");
  display(output, '🎥示範影片(Demo Video)');
}

function saveAsTxt(){
  ui.alert("🙅🏻‍♂️This function is not available yet", "這項功能尚未開放，敬請期待！", DocumentApp.getUi().ButtonSet.OK);
}

function spacing() {
  getDocument();
  ui.alert("🙅🏻‍♂️This function is not available yet", "這項功能尚未開放，敬請期待！", DocumentApp.getUi().ButtonSet.OK);
}

function linkManager(){
  let style = "<style>a:link, a:visited{background-color:#3366ff;color:white;padding: 14px 25px;width:200px;text-align:center;text-decoration:none;display:inline-block;border-radius: 8px;}a:hover, a:active{background-color:#3399ff;}</style>";
  let buttons = "";
  for (var i=0;i<links.length;i++) {
    if (links[i]["link"] != "" && links[i]["name"] != "") {
      buttons += "<center><a href='" + links[i]["link"] + "' target='_blank'>" + links[i]["name"] + "</a></center><br>";
    }
  }
  output = HtmlService.createHtmlOutput(style + buttons);
  displaySidebar(output, '🔗連結管理(Link Manager)');
}

function customViewer() {
  response = ui.prompt('請輸入網頁連結：');
  if (response.getSelectedButton() == ui.Button.OK) {
    let script = "<script>window.location.href='" + response.getResponseText() + "'</script>";
    output = HtmlService.createHtmlOutput(script);
    displayModeless(output, "👁️檢視器(Viewer)");
  }
}

function penanaViewer() {
  let script = "<script>window.location.href='https://www.penana.com/home'</script>";
  output = HtmlService.createHtmlOutput(script);
  displayModeless(output, "👁️檢視器(Viewer)");
}

function googleViewer() {
  let script = "<script>window.location.href='https://www.google.com/webhp?igu=1'</script>";
  output = HtmlService.createHtmlOutput(script);
  displayModeless(output, "👁️檢視器(Viewer)");
}

function wikiViewer() {
  let script = "<script>window.location.href='https://www.wikipedia.org/'</script>";
  output = HtmlService.createHtmlOutput(script);
  displayModeless(output, "👁️檢視器(Viewer)");
}

function kadoViewer() {
  let script = "<script>window.location.href='https://www.kadokado.com.tw/'</script>";
  output = HtmlService.createHtmlOutput(script);
  displayModeless(output, "👁️檢視器(Viewer)");
}

function illustbuyViewer() {
  let script = "<script>window.location.href='https://illustbuy.com/'</script>";
  output = HtmlService.createHtmlOutput(script);
  displayModeless(output, "👁️檢視器(Viewer)");
}

function storyplotterViewer() {
  let script = "<script>window.location.href='https://storyplotter.net/zh-hant'</script>";
  output = HtmlService.createHtmlOutput(script);
  displayModeless(output, "👁️檢視器(Viewer)");
}

function aboutMe() {
  let script = "<script src='https://apis.google.com/js/platform.js'></script>";
  let style = "<style>a:link, a:visited{font-size:30px;color:black;padding: 14px 25px;width:400px;text-align:center;text-decoration:none;display:inline-block;border-radius: 8px;}img{width:35px;height:35px;}</style>";
  let buttons = "<center><a href='https://sites.google.com/view/kwokyingfai/' target='_blank' style='background-color:#3366ff;'><img src='https://i.imgur.com/7pAxvYw.png'>個人網站</a></center><br>";
  buttons += "<center><a href='https://www.instagram.com/doctor_fai/' target='_blank' style='background-color:#e1306c;'><img src='https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png'>Instagram</a></center><br>";
  buttons += "<center><a href='https://www.penana.com/user/98865/' target='_blank' style='background-color:yellow;'><img src='https://682716387-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FdCvq4A3Z8GBtJkq79Hxy%2Fuploads%2FEGCRo9jn4Gdd32mUrfvF%2Flogo_new.svg?alt=media&token=0ece9bc4-9cec-42c9-9317-a1dc23804262'>Penana</a></center><br>"
  buttons += "<center><div class='g-ytsubscribe' data-channelid='UCezw_R_PZxYUVxNYWtDHpPg' data-layout='full' data-count='hidden'></div></center>";
  output = HtmlService.createHtmlOutput(script + style + buttons);
  display(output, "👤關於作者(About me)");
}
