function installFunctions() {
  oldDBLink = ""; // 請把舊的數據庫連結放在""中
  console.time("安裝花費時間");
  setAllProperties();
  createTimeDrivenTriggers();
  if (oldDBLink=="") {
    if (createDB()) {
      initialDbData();
    }
  } else {
    userProperties.setProperty('dbUrl', oldDBLink);
  }
  console.timeEnd("安裝花費時間");
}

var userProperties = PropertiesService.getUserProperties();
var cache = CacheService.getScriptCache();
var books = getDbBooks();
var cards = getDbCards();
var days = JSON.parse(userProperties.getProperty('days'));

function getUserEmail() {
   return Session.getActiveUser().getEmail();
}

function getDocument(bookId) {
  console.time("文件讀取時間");
  return DocumentApp.openByUrl(books[bookId]["link"]).getBody();
}

function getPara(body) {
  return body.getParagraphs();
}

function getLevels(para) {
  let levels = para.map(function(p) {
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
  return levels;
}

function getGoal(bookId) {
  return books[bookId]["goal"];
}

function getGoalAll(bookId) {
  return books[bookId]["goalAll"];
}

function getParagraph(bookId) {
  let body = getDocument(bookId);
  let para = getPara(body);
  let levels = getLevels(para);
  var paraText = [];
  for (var i = 0; i < para.length; i++) {
    if (levels[i] == 2 && para[i].getText() != "" && para[i].getText() != null) {
      paraText.push({"index":i,"text":para[i].getText()});
    }
  }
  return paraText;
}

function doGet(e) {
  path = e.pathInfo;
  if (path==null||e.parameter.page=="") {
    path = "index";
  } else {
    var html = HtmlService.createTemplateFromFile(path);
  }
  var response = UrlFetchApp.fetch("https://raw.githubusercontent.com/jeremyyau/GoogleDocsWritingEngine/main/v0.9.0/index.html");
  var html = HtmlService.createTemplate(response);
  switch(path) {
    case "index":
      toast = [{"img":"https://i.imgur.com/oKLUHRw.png", "title": "交稿提醒", "content": "你未交稿呀，木嘴！"}];
      cache.put('toast', JSON.stringify(toast));
      break;
    case "bookshelf_edit":
      cache.put('bookId', e.parameter.bookId, 1800);
      break;
    case "cards_edit":
      cache.put('cardId', e.parameter.cardId, 1800);
      break;
    case "frequency_report":
      html.e = e;
      break;
    case "export_result":
      html.e = e;
      break;
    case "about_me":
      toast = [{"img":"https://i.imgur.com/oKLUHRw.png", "title": "突發消息", "content": "郭凝輝失去了一切"}, {"img":"https://i.imgur.com/oKLUHRw.png", "title": "突發消息", "content": "郭凝輝的家人證實了這一消息"}];
      cache.put('toast', JSON.stringify(toast));
      break;
    default:
      break;
  }
  if (e.parameter.actionType=="createDB") {createDB();}
  if (e.parameter.actionType=="deleteDB") {deleteDB();}
  if (e.parameter.actionType=="setCurBook") {setCurBook(e);}
  var check = html.evaluate().setTitle('Google Docs Writing Engine v0.10.0').setFaviconUrl("https://i.imgur.com/rHgvyHs.png");
  var show = check.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return show;
}

function doPost(e) {
  path = e.pathInfo;
  if (path==null||e.parameter.page=="") {
    path = "index";
  } else {
    var html = HtmlService.createTemplateFromFile(path);
  }
  var response = UrlFetchApp.fetch("https://raw.githubusercontent.com/jeremyyau/GoogleDocsWritingEngine/main/v0.9.0/index.html");
  var html = HtmlService.createTemplate(response);
  switch(e.parameter.actionType) {
    case "setBookshelfDisplay" :
      setBookshelfDisplay(e);
      break;
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
    case "setCharacterDisplay" :
      setCharacterDisplay(e);
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
  var check = html.evaluate().setTitle('Google Docs Writing Engine v0.10.0').setFaviconUrl("https://i.imgur.com/rHgvyHs.png");
  var show = check.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return show;
}

function getUrl() {
  return ScriptApp.getService().getUrl();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function includeWithCode(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

function getToast() {
  return JSON.parse(cache.get('toast'));
}

function getAllProperties() {
  console.log(userProperties.getProperties());
}

function removeAllProperties() {
  userProperties.deleteAllProperties();
}

function setAllProperties() {
  if (userProperties.getProperty('currentBook')==null){userProperties.setProperty('currentBook', '0');}
  if (userProperties.getProperty('goal')==null){userProperties.setProperty('goal', '1200');}
  if (userProperties.getProperty('goalAll')==null){userProperties.setProperty('goalAll', '100000');}
  if (userProperties.getProperty('freqNum')==null){userProperties.setProperty('freqNum', '10');}
  if (userProperties.getProperty('indents')==null){userProperties.setProperty('indents', '0');}
  if (userProperties.getProperty('lines')==null){userProperties.setProperty('lines', '1');}
  if (userProperties.getProperty('whitespaceCount')==null){userProperties.setProperty('whitespaceCount', 'false');}
  if (userProperties.getProperty('symbolCount')==null){userProperties.setProperty('symbolCount', 'false');}
  if (userProperties.getProperty('speakLang')==null){userProperties.setProperty('speakLang', 'zh-HK');}
  if (userProperties.getProperty('bookshelfDisplay')==null){userProperties.setProperty('bookshelfDisplay', 'card');}
  if (userProperties.getProperty('characterDisplay')==null){userProperties.setProperty('characterDisplay', 'card');}
  if (userProperties.getProperty('streamerMode')==null){userProperties.setProperty('streamerMode', 'false');}
  if (userProperties.getProperty('daysNum')==null){userProperties.setProperty('daysNum', '14');}
  if (userProperties.getProperty('days')==null){userProperties.setProperty('days', '[]');}
  if (userProperties.getProperty('highestOnceWordCount')==null){userProperties.setProperty('highestOnceWordCount', '0')}
  if (userProperties.getProperty('highestAvgWordCount')==null){userProperties.setProperty('highestAvgWordCount', '0')}
  console.log("成功建立本地數據");
}

function setProperty(propertyName) {
  return userProperties.setProperty(propertyName, '[]');
}

function getProperty(propertyName) {
  var property;
  if (!(['books','cards','days'].includes(propertyName))) {
    property = userProperties.getProperty(propertyName);
  } else {
    if (propertyName=="books") {property = getDbBooks();}
    if (propertyName=="cards") {property = getDbCards();}
    if (propertyName=="days") {property = JSON.parse(userProperties.getProperty(propertyName));}
  }
  return property;
}
