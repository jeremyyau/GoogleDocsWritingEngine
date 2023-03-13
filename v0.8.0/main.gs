function installFunctions() {
  console.time("安裝花費時間");
  setAllProperties();
  createTimeDrivenTriggers();
  if (createDB()) {
    initialDbData();
  }
  console.timeEnd("安裝花費時間");
}

var body;
var para;
var levels;
var paraCounts;
var counts = [];
var output;
var script;
var end_script;
var userProperties = PropertiesService.getUserProperties();
var cache = CacheService.getScriptCache();
var currentBook = userProperties.getProperty('currentBook');
var goal = userProperties.getProperty('goal');
var goalAll = userProperties.getProperty('goalAll');
var freqNum = userProperties.getProperty('freqNum');
var indents = userProperties.getProperty('indents');
var lines = userProperties.getProperty('lines');
var whitespaceCount = (userProperties.getProperty('whitespaceCount')==="true");
var symbolCount = (userProperties.getProperty('symbolCount')==="true");
var speakLang = userProperties.getProperty('speakLang');
var daysNum = userProperties.getProperty('daysNum');
var books = getDbBooks();
var cards = getDbCards();
var days = JSON.parse(userProperties.getProperty('days'));

function getDocument(bookId) {
  console.time("文件讀取時間");
  body = DocumentApp.openByUrl(books[bookId]["link"]).getBody();
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

function getParagraph(bookId) {
  getDocument(bookId);
  var paraText = "[]";
  paraText = JSON.parse(paraText);
  for (var i = 0; i < para.length; i++) {
    if (levels[i] == 2 && para[i].getText() != "" && para[i].getText() != null) {
      paraText.push({"index":i,"text":para[i].getText()});
    }
  }
  return paraText;
}

function doGet(e) {
  /*path = e.pathInfo;
  if (path==null||e.parameter.page=="") {
    var html = HtmlService.createTemplateFromFile("index");
  } else {
    var html = HtmlService.createTemplateFromFile(path);
  }*/
  if (e.parameter.page==null||e.parameter.page=="") {
    var html = HtmlService.createTemplateFromFile("index");
  } else {
    var html = HtmlService.createTemplateFromFile(e.parameter.page);
  }
  switch(e.parameter.page) {
    case "bookshelf_edit":
      cache.put('bookId', e.parameter.bookId, 1800);
      break;
    case "cards_edit":
      cache.put('cardId', e.parameter.cardId, 1800);
      break;
    case "export_result":
      cache.put('para', e.parameter.para, 1800);
      break;
    default:
      break;
  }
  if (e.parameter.actionType=="createDB") {createDB();initialDbData();}
  if (e.parameter.actionType=="deleteDB") {deleteDB();}
  if (e.parameter.actionType=="setCurBook") {setCurBook(e);}
  var check = html.evaluate().setTitle('Google Docs Writing Engine v0.8.0');
  var show = check.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return show;
}

function doPost(e) {
  switch(e.parameter.actionType) {
    case "addBook":
      addBook(e);
      break;
    case "editBook":
      editBook(e);
      break;
    case "deleteBook":
      deleteBook(e);
      break;
    case "deleteAllBooks":
      deleteAllBooks();
      break;
    case "addCard":
      addCard(e);
      break;
    case "editCard":
      editCard(e);
      break;
    case "deleteCard":
      deleteCard(e);
      break;
    case "deleteAllCards":
      deleteAllCards();
      break;
    case "setSettings":
      setSettings(e);
      break;
    case "deleteAllData":
      deleteAllData();
      break;
    case "resetAllData":
      resetAllData();
      break;
    case "loadDB":
      loadDB(e);
      break;
    default:
      break;
  }
  var html = HtmlService.createTemplateFromFile(e.parameter.page);
  var check = html.evaluate().setTitle('Google Docs Writing Engine v0.8.0');
  var show = check.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return show;
}

function getUrl() {
  return ScriptApp.getService().getUrl();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getHeader() {
  let image = "";
  let name = "";
  if (books[currentBook]!=null) {
    image = books[currentBook]["image"];
    name = books[currentBook]["name"];
  }
  if (true) {
    let sidebar = "";
    sidebar += `<main class="d-flex flex-nowrap"><div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark overflow-auto" style="width: 280px;">
    <a href="`+getUrl()+`?page=index" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <img src="https://i.imgur.com/rHgvyHs.png" alt="Logo" width="30" height="30" class="d-inline-block">&nbsp;
      <span class="fs-6">Google Docs Writing Engine</span>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item"><a class="nav-link active" href="`+getUrl()+`?page=index">🏠主頁</a></li>
      <li class="nav-item"><a class="nav-link text-white" href="`+getUrl()+`?page=bookshelf">📚我的書櫃 <span class="badge bg-secondary">`+books.length+`</span></a></li>
      <button class="btn d-inline-flex align-items-center rounded border-0 collapsed text-white" data-bs-toggle="collapse" data-bs-target="#word_count-collapse" aria-expanded="false">✍🏻字數統計</button>
      <div class="collapse" id="word_count-collapse">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
          <li><a class="d-inline-flex text-decoration-none text-white rounded" href="`+getUrl()+`?page=word_count_report">📊統計報告</a></li>
          <li><a class="d-inline-flex text-decoration-none text-white rounded" href="`+getUrl()+`?page=word_count_record">📆統計紀錄(全部作品)</a></li>
          <li><a class="d-inline-flex text-decoration-none text-white rounded" href="`+getUrl()+`?page=notavailable">📆統計紀錄(當前作品)</a></li>
        </ul>
      </div>
      <li class="nav-item"><a class="nav-link text-white" href="`+getUrl()+`?page=export_chapter">🖨️輸出文件</a></li>
      <button class="btn d-inline-flex align-items-center rounded border-0 collapsed text-white" data-bs-toggle="collapse" data-bs-target="#freq-collapse" aria-expanded="false">📉詞彙頻率</button>
      <div class="collapse" id="freq-collapse">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
          <li><a class="d-inline-flex text-decoration-none text-white rounded" href="`+getUrl()+`?page=frequency_report">📉詞彙頻率</a></li>
          <li><a class="d-inline-flex text-decoration-none text-white rounded" href="`+getUrl()+`?page=notavailable">📃詞彙黑名單</a></li>
        </ul>
      </div>
      <li class="nav-item"><a class="nav-link text-white" href="`+getUrl()+`?page=cards_list">👨‍👩‍👦角色卡 <span class="badge bg-secondary">`+cards.length+`</span></a></li>
      <li class="nav-item"><a class="nav-link text-white" href="`+getUrl()+`?page=qrcode">📲QR Code <span class="badge bg-danger">new</span></a></a></li>
      <li class="nav-item"><a class="nav-link text-white" href="`+getUrl()+`?page=database_manage">💾資料管理 <span class="badge bg-danger">new</span></a></li>
      <li class="nav-item"><a class="nav-link text-white" href="`+getUrl()+`?page=demo_video">🎥示範影片</a></li>
      <li class="nav-item"><a class="nav-link text-white" href="`+getUrl()+`?page=about_me">👤關於作者</a></li>
      <li class="nav-item"><a class="nav-link text-white" href="`+getUrl()+`?page=settings">⚙️設定</a></li>
    </ul>
    <hr>
    <center><h6 class="text-white mb-2">現時書本</h6></center>
    <div class="dropdown">
      <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="`+image+`" alt="" width="120" height="160" class="me-2">
        <strong>`+name+`</strong>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark text-small shadow">`;
      for (i=0;i<books.length;i++) {
        if (books[i]!=null){
          sidebar += "<li><a class='dropdown-item' href='"+getUrl()+"?page=index&actionType=setCurBook&bookId="+i+"'>"+books[i]["name"]+"</a></li>";
        }
      }
      sidebar += `</ul>
    </div>
  </div><div class="container-fluid overflow-auto">`;
    return sidebar;
  }
  return `<nav class="navbar navbar-expand-lg navbar-light bg-light mb-4" style="background-color: #e3f2fd;">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">
          <img src="https://i.imgur.com/rHgvyHs.png" alt="Logo" width="40" height="40" class="d-inline-block">
          Google Docs Writing Engine
        </span>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link active" href="`+getUrl()+`?page=index">🏠主頁</a></li>
            <li class="nav-item"><a class="nav-link" href="`+getUrl()+`?page=bookshelf">📚我的書櫃</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">✍🏻字數統計</a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li><a class="dropdown-item" href="`+getUrl()+`?page=word_count_report">📊統計報告</a></li>
                <li><a class="dropdown-item" href="`+getUrl()+`?page=word_count_record">📆統計記錄</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">🖨️輸出文件</a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li><a class="dropdown-item" href="`+getUrl()+`?page=export_chapter">🖨️輸出章節</a></li>
                <li><a class="dropdown-item" href="`+getUrl()+`?page=">🖨️TXT輸出</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">📉詞彙頻率</a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li><a class="dropdown-item" href="`+getUrl()+`?page=frequency_report">📉詞彙頻率</a></li>
                <li><a class="dropdown-item" href="`+getUrl()+`?page=">📃詞彙黑名單</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="#">👨‍👩‍👦角色卡一覽</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">⚙️設定</a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li><a class="dropdown-item" href="`+getUrl()+`?page=">⚙️一般設定</a></li>
                <hr>
                <li><a class="dropdown-item" href="`+getUrl()+`?page=">🌙夜間模式</a></li>
                <hr>
                <li><a class="dropdown-item" href="`+getUrl()+`?page=">👨‍👩‍👦角色卡管理</a></li>
                <hr>
                <li><a class="dropdown-item" href="`+getUrl()+`?page=">🗑️刪除所有書本</a></li>
                <li><a class="dropdown-item" href="`+getUrl()+`?page=">🗑️刪除所有角色卡</a></li>
                <hr>
                <li><a class="dropdown-item" href="`+getUrl()+`?page=">🗑️重設所有設定</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="`+getUrl()+`?page=demo_video">🎥示範影片</a></li>
            <li class="nav-item"><a class="nav-link" href="`+getUrl()+`?page=about_me">👤關於作者</a></li>
          </ul>
        </div>
      </div>
    </nav>`;
}
