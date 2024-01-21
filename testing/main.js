function installFunctions() {
  console.time("安裝花費時間");
  setAllProperties();
  createTimeDrivenTriggers();
  if (createDB()) {
    initialDbData();
  }
  console.timeEnd("安裝花費時間");
}

const operateMode = "testing";
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
  }
  var response = UrlFetchApp.fetch("https://raw.githubusercontent.com/jeremyyau/GoogleDocsWritingEngine/main/"+operateMode+"/"+path+".html");
  var html = HtmlService.createTemplate(response);
  switch(path) {
    case "index":
      // toast = [{"img":"https://i.imgur.com/oKLUHRw.png", "title": "交稿提醒", "content": "你未交稿呀，木嘴！"}];
      // cache.put('toast', JSON.stringify(toast));
      // break;
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
  }
  var response = UrlFetchApp.fetch("https://raw.githubusercontent.com/jeremyyau/GoogleDocsWritingEngine/main/"+operateMode+"/"+path+".html");
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
  var response = UrlFetchApp.fetch("https://raw.githubusercontent.com/jeremyyau/GoogleDocsWritingEngine/main/"+operateMode+"/"+filename+".html");
  return HtmlService.createHtmlOutput(response).getContent();
}

function includeWithCode(filename) {
  var response = UrlFetchApp.fetch("https://raw.githubusercontent.com/jeremyyau/GoogleDocsWritingEngine/main/"+operateMode+"/"+filename+".html");
  return HtmlService.createTemplate(response).evaluate().getContent();
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
  if (userProperties.getProperty('geminiAPIkey')==null){userProperties.setProperty('geminiAPIkey', '');}
  if (userProperties.getProperty('openJourneyAPIkey')==null){userProperties.setProperty('openJourneyAPIkey', '');}
  if (userProperties.getProperty('penanaEmail')==null){userProperties.setProperty('penanaEmail', '');}
  if (userProperties.getProperty('penanaPassword')==null){userProperties.setProperty('penanaPassword', '');}
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

function getEditBookId() {
  return cache.get('bookId');
}

function setCurBook(e) {
  userProperties.setProperty('currentBook', e.parameter.bookId);
}

function getCurBookName(bookId) {
  return DocumentApp.openByUrl(books[bookId]["link"]).getName();
}

function addBook(e) {
  let db = getDB();
  let sheet = db.getSheetByName("書本");
  let newGoal;
  let newGoalAll;
  if (e.parameter.bookName != "") {
    newBookName = e.parameter.bookName;
  } else {
    newBookName = DocumentApp.openByUrl(e.parameter.bookUrl).getName();
  }
  if (e.parameter.goal != "") {
    newGoal = e.parameter.goal;
  } else {
    newGoal = getProperty("goal");
  }
  if (e.parameter.goalAll != "") {
    newGoalAll = e.parameter.goalAll;
  } else {
    newGoalAll = getProperty("goalAll");
  }
  sheet.appendRow([e.parameter.image,newBookName,e.parameter.desc,e.parameter.bookUrl,newGoal,newGoalAll,e.parameter.tags,e.parameter.status,e.parameter.penanaUrl]);
  sheet.insertRowAfter(sheet.getLastRow());
  console.log("成功新增書本！");
}

function editBook(e) {
  db = getDB();
  sheet = db.getSheetByName("書本");
  sheet.getRange(parseInt(e.parameter.bookId)+1,1).setValue(e.parameter.image);
  if (e.parameter.bookName != "") {
    sheet.getRange(parseInt(e.parameter.bookId)+1,2).setValue(e.parameter.bookName);
  } else {
    sheet.getRange(parseInt(e.parameter.bookId)+1,2).setValue(DocumentApp.openByUrl(e.parameter.bookUrl).getName());
  }
  sheet.getRange(parseInt(e.parameter.bookId)+1,3).setValue(e.parameter.desc);
  sheet.getRange(parseInt(e.parameter.bookId)+1,4).setValue(e.parameter.bookUrl);
  if (e.parameter.goal != "") {
    sheet.getRange(parseInt(e.parameter.bookId)+1,5).setValue(e.parameter.goal);
  } else {
    sheet.getRange(parseInt(e.parameter.bookId)+1,5).setValue(goal);
  }
  if (e.parameter.goalAll != "") {
    sheet.getRange(parseInt(e.parameter.bookId)+1,6).setValue(e.parameter.goalAll);
  } else {
    sheet.getRange(parseInt(e.parameter.bookId)+1,6).setValue(goalAll);
  }
  sheet.getRange(parseInt(e.parameter.bookId)+1,7).setValue(e.parameter.tags);
  sheet.getRange(parseInt(e.parameter.bookId)+1,8).setValue(e.parameter.status);
  sheet.getRange(parseInt(e.parameter.bookId)+1,9).setValue(e.parameter.penanaUrl);
  console.log("成功編輯書本！");
}

function deleteBook(e) {
  db = getDB();
  sheet = db.getSheetByName("書本");
  sheet.deleteRow(parseInt(e.parameter.bookId)+1);
  sheet.insertRowAfter(sheet.getLastRow());
  console.log("成功刪除書本！");
}

function deleteAllBooks() {
  db = getDB();
  sheet = db.getSheetByName("書本");
  var range = sheet.getDataRange();
  range.clear();
  console.log("成功刪除所有書本！");
}

function countPerSection(bookId) {
  let body = getDocument(bookId);
  let para = getPara(body);
  let levels = getLevels(para);
  let headingList = getHeading(para, levels);
  console.log(JSON.stringify(headingList));
  return headingList;
}

function getHeading(para, levels) {
  let headingList = [];
  let currentHeading = -1;
  let count;
  let heading1Counts = 0;
  let heading2Counts = 0;
  let heading1PredictTime = 0;
  let heading2PredictTime = 0;
  let whitespaceCount = (getProperty('whitespaceCount')==="true");
  let symbolCount = (getProperty('symbolCount')==="true");
  let text;
  console.time("字數統計時間");
  for (let i in para) {
    if (levels[i] == 2 && para[i].getText() != "" && para[i].getText() != null) {
      if (currentHeading != -1) {
        headingList[currentHeading]["heading1Counts"] = heading1Counts;
        if (headingList[currentHeading]["heading2Counts"] != null && heading2Counts != 0) {
          headingList[currentHeading]["heading2Counts"].push(heading2Counts);
          heading2PredictTime = predictTime(heading2Counts);
          headingList[currentHeading]["heading2PredictTime"].push(heading2PredictTime);
        }
        headingList[currentHeading]["heading1PredictTime"] = predictTime(heading1Counts);
        heading1Counts = 0;
        heading2Counts = 0;
        heading1PredictTime = 0;
        heading2PredictTime = 0;
      }
      headingList.push({"heading1": para[i].getText()});
      currentHeading++;
    }
    if (levels[i] == 3 && para[i].getText() != "" && para[i].getText() != null) {
      if (headingList[currentHeading]["heading2"] == null) {
        headingList[currentHeading]["heading2"] = [para[i].getText()];
      } else {
        headingList[currentHeading]["heading2"].push(para[i].getText());
      }
      if (headingList[currentHeading]["heading2Counts"] == null) {
        if (heading2Counts != 0) {
          headingList[currentHeading]["heading2Counts"] = [heading2Counts];
          heading2PredictTime = predictTime(heading2Counts);
          headingList[currentHeading]["heading2PredictTime"] = [heading2PredictTime];
          heading2Counts = 0;
          heading2PredictTime = 0;
        }
      } else {
        headingList[currentHeading]["heading2Counts"].push(heading2Counts);
        heading2PredictTime = predictTime(heading2Counts);
        headingList[currentHeading]["heading2PredictTime"].push(heading2PredictTime);
        heading2Counts = 0;
        heading2PredictTime = 0;
      }
    }
    if (levels[i] == 8 && para[i].getText() != "" && para[i].getText() != null && currentHeading != -1) {
      text = para[i].getText();
      if (!whitespaceCount) {text = text.trim();}
      if (!symbolCount) {text = text.replace(/[\（\）。，「」『』《》？：；…、！—～＄,$-.，！。？、【】]/g, " ");}
      eng = text.match(/[A-Za-z0-9]+/gi);
      chi = text.replace(/[\sA-Za-z0-9]/gi, "");
      chi = chi ? chi.length : 0;
      eng = eng ? eng.length : 0;
      count = chi + eng;
      heading1Counts += count;
      heading2Counts += count;
    }
  }
  headingList[currentHeading]["heading1Counts"] = heading1Counts;
  headingList[currentHeading]["heading1PredictTime"] = predictTime(heading1Counts);
  if (headingList[currentHeading]["heading2Counts"] != null) {
    headingList[currentHeading]["heading2Counts"].push(heading2Counts);
    heading2PredictTime = predictTime(heading2Counts);
  }
  if (headingList[currentHeading]["heading2PredictTime"] != null) {
    headingList[currentHeading]["heading2PredictTime"].push(heading2PredictTime);
  }
  console.timeEnd("字數統計時間");
  return headingList;
}

function wordCount(text) {
  let whitespaceCount = (getProperty('whitespaceCount')==="true");
  let symbolCount = (getProperty('symbolCount')==="true");
  let temtext = text;
  if (!whitespaceCount) {temtext = temtext.trim();}
  if (!symbolCount) {temtext = temtext.replace(/[\（\）。，「」『』？：；…、！—～＄,$-.]/gi, " ");}
  let eng = temtext.match(/[A-Za-z0-9]+/gi);
  let chi = temtext.replace(/[\sA-Za-z0-9]/gi, "");
  chi = chi ? chi.length : 0;
  eng = eng ? eng.length : 0;
  return chi + eng;
}

function predictTime(wordCount) {
  let time = 0;
  let count = wordCount;
  if (count > 0) {
    time++;
  }
  count-=450;
  for (i=count;i>=0;i-=300) {
    time++;
  }
  return time;
}

function addDay() {
  let newDate = new Date();
  let wordCounts = 0;
  for (let i in books) {
    reportResult = countPerSection(i);
    for (let x in reportResult) {
      wordCounts += reportResult[x]["heading1Counts"];
    }
  }
  if (days.length==getProperty("daysNum")) {
    days.splice(0, 1);
  }
  days.push({"year": newDate.getFullYear(), "month": month = newDate.getMonth()+1, "date":newDate.getDate(),"wordCount":wordCounts});
  userProperties.setProperty('days', JSON.stringify(days));
}

function deleteDay() {
  days.splice(0, 1);
  userProperties.setProperty('days', JSON.stringify(days));
}

function deleteAllDays() {
  days = JSON.parse('[]');
  userProperties.deleteProperty('days');
}

function addManuscript() {
  for (let i in books) {
    
  }
  userProperties.setProperty('manuscript', JSON.stringify(manuscript));
}

function createDB() {
  if (userProperties.getProperty('dbUrl')==null||userProperties.getProperty('dbUrl')=='') {
    var newDB = SpreadsheetApp.create("Google Docs Writing Engine數據庫", 1, 1);
    userProperties.setProperty('dbUrl', newDB.getUrl());
    console.log("成功建立數據庫！");
    return true;
  } else {
    console.error("數據庫已存在！");
  }
  return false;
}

function loadDB(e) {
  userProperties.setProperty('dbUrl', e.parameter.dbUrl);
  getDbBooks();
  getDbCards();
  getDbSettings();
}

function deleteDB() {
  userProperties.setProperty('dbUrl', '');
}

function getDB() {
  url = userProperties.getProperty('dbUrl');
  if (url!=""&&url!=null) {
    return SpreadsheetApp.openByUrl(url);
  }
  return;
}

function initialDbData() {
  db = getDB();
  if (db!=null) {
    sheet1 = db.getSheets()[0];
    if (db.getSheetByName("書本")==null) {
      db.insertSheet('書本');
    }
    if (db.getSheetByName("角色卡")==null) {
      db.insertSheet('角色卡');
    }
    if (db.getSheetByName("設定")==null) {
      db.insertSheet('設定');
    }
    if (sheet1!=null) {
      db.deleteSheet(sheet1);
    }
    sheet = db.getSheetByName("設定");
    sheet.appendRow([userProperties.getProperty('goal'),userProperties.getProperty('goalAll'),userProperties.getProperty('freqNum'),userProperties.getProperty('indents'),userProperties.getProperty('lines'),userProperties.getProperty('whitespaceCount'),userProperties.getProperty('symbolCount'),userProperties.getProperty('speakLang'),userProperties.getProperty('geminiAPIkey'),userProperties.getProperty('openJourneyAPIkey'),userProperties.getProperty('penanaEmail'),userProperties.getProperty('penanaPassword')]);
    console.log("數據初始化完成！");
  } else {
    console.error("數據庫不存在！");
  }
}

function addDbBooks() {
  db = getDB();
  sheet = db.getSheetByName("書本");
  for (i=0;i<books.length;i++) {
    sheet.appendRow([books[i]["image"],books[i]["name"],books[i]["desc"],books[i]["link"],books[i]["goal"],books[i]["goalAll"]]);
    sheet.insertRowAfter(sheet.getLastRow());
  }
}

function addDbCards() {
  db = getDB();
  sheet = db.getSheetByName("角色卡");
  for (i=0;i<cards.length;i++) {
    sheet.appendRow([cards[i]["image"],cards[i]["type"],cards[i]["name"],cards[i]["gender"],cards[i]["desc"]]);
    sheet.insertRowAfter(sheet.getLastRow());
  }
}

function addDbSettings(e) {
  db = getDB();
  sheet = db.getSheetByName("設定");
  sheet.appendRow([e.parameter.goal,e.parameter.goalAll,e.parameter.freqNum,e.parameter.indents,e.parameter.lines,e.parameter.whitespaceCount,e.parameter.symbolCount,e.parameter.speakLang,e.parameter.geminiAPIkey,e.parameter.openJourneyAPIkey,e.parameter.penanaEmail,e.parameter.penanaPassword]);
  sheet.deleteRow(1);
  sheet.insertRowAfter(sheet.getLastRow()); 
}

function getDbBooks() {
  db = getDB();
  if (db!=null) {
    sheet = db.getSheetByName("書本");
    if (sheet!=null) {
      let newBooks = [];
      var range = sheet.getDataRange();
      var values = range.getValues();
      for (var i = 0; i < values.length; i++) {
        newBooks.push({"image":values[i][0],"name":values[i][1], "desc":values[i][2],"link":values[i][3],"goal":values[i][4],"goalAll":values[i][5],"tags":values[i][6],"status":values[i][7],"penanaUrl":values[i][8]});
      }
      books = newBooks;
      return books;
    }
  }
  return [];
}

function getDbCards() {
  db = getDB();
  if (db!=null) {
    sheet = db.getSheetByName("角色卡");
    if (sheet!=null) {
      let newCards = [];
      var range = sheet.getDataRange();
      var values = range.getValues();
      for (var i = 0; i < values.length; i++) {
        newCards.push({"image":values[i][0],"type":values[i][1], "name":values[i][2],"gender":values[i][3],"desc":values[i][4]});
      }
      cards = newCards;
      return cards;
    }
  }
  return [];
}

function getDbSettings() {
  db = getDB();
  if (db!=null) {
    sheet = db.getSheetByName("設定");
    if (sheet!=null) {
      let newSettings = [];
      var range = sheet.getDataRange();
      var values = range.getValues();
      userProperties.setProperty('goal', values[0][0]+"");
      userProperties.setProperty('goalAll', values[0][1]+"");
      userProperties.setProperty('freqNum', values[0][2]+"");
      userProperties.setProperty('indents', values[0][3]+"");
      userProperties.setProperty('lines', values[0][4]+"");
      userProperties.setProperty('whitespaceCount', values[0][5]);
      userProperties.setProperty('symbolCount', values[0][6]);
      userProperties.setProperty('speakLang', values[0][7]);
      userProperties.setProperty('geminiAPIkey', values[0][8]);
      userProperties.setProperty('openJourneyAPIkey', values[0][9]);
      userProperties.setProperty('penanaEmail', values[0][10]);
      userProperties.setProperty('penanaPassword', values[0][11]);
      newSettings.push({"goal":values[0][0]+"","goalAll":values[0][1]+"", "freqNum":values[0][2]+"","indents":values[0][3]+"","lines":values[0][4]+"","whitespaceCount":values[0][5],"symbolCount":values[0][6],"speakLang":values[0][7],"geminiAPIkey":values[0][8],"openJourneyAPIkey":values[0][9],"penanaEmail":values[0][10],"penanaPassword":values[0][11]});
      return newSettings;
    }
  }
  return [];
}

function exportResult(bookId, selectedPara) {
  db = getDB();
  if (selectedPara == null) {
    paraIndex = getParagraph(bookId);
    selectedPara = paraIndex.map(item => item.index);
  }
  selectedPara = selectedPara.map(Number);
  bookName = DocumentApp.openByUrl(books[bookId]["link"]).getName();
  let body = getDocument(bookId);
  if (db.getSheetByName(bookName)==null) {
    db.insertSheet(bookName);
  }
  sheet = db.getSheetByName(bookName);
  let para = getPara(body);
  let levels = getLevels(para);
  let paragraphs = [];
  let currentHeading = -1;
  let currentHeading2 = 0;
  console.time("輸出時間");
  for (let i = 0; i < para.length; i++) {
    if (levels[i] == 2 && para[i].getText() != "" && para[i].getText() != null) {
      isGreaterThanAll = true;
      if (selectedPara.includes(i)) {
        paragraphs.push({"heading1": para[i].getText()});
        currentHeading++;
        currentHeading2 = 0;
      } else {
        for (let k in selectedPara) {
          if (selectedPara[k] > i) {
            i = selectedPara[k]-1;
            isGreaterThanAll = false;
            break;
          }
        }
        if (isGreaterThanAll) {
          console.timeEnd("輸出時間");
          return paragraphs;
        }
      }
    }
    if (levels[i] == 3 && para[i].getText() != "" && para[i].getText() != null) {
      if (currentHeading != -1) {
        if (paragraphs[currentHeading]["heading2"] == null) {
          paragraphs[currentHeading]["heading2"] = [{"title": [para[i].getText()], "content": []}];
        } else {
          paragraphs[currentHeading]["heading2"].push({"title": [para[i].getText()], "content": []});
          currentHeading2++;
        }
      }
    }
    if (levels[i] == 8 && para[i].getText() != null) {
      if (currentHeading != -1) {
        if (paragraphs[currentHeading]["heading2"]===undefined) {
          if (paragraphs[currentHeading]["content"]==null) {
            if (para[i].getText()!="") {
              paragraphs[currentHeading]["content"] = [para[i].getText()];
            }
          } else {
            paragraphs[currentHeading]["content"].push(para[i].getText());
          }
        } else {
          if (!(paragraphs[currentHeading]["heading2"][currentHeading2]["content"].length == 0 && para[i].getText()=="")) {
            paragraphs[currentHeading]["heading2"][currentHeading2]["content"].push(para[i].getText());
          }
        }
        // This is for backup and version control
        // sheet.appendRow([para[i].getText()]);
      }
    }
  }
  console.timeEnd("輸出時間");
  return paragraphs;
}

function frequency_chi(bookId, selectedPara) {
  const segmentUrl = 'https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.min.js';
  const response = UrlFetchApp.fetch(segmentUrl);
  const jsCode = response.getContentText();
  eval(jsCode);
  const segmentit = Segmentit.useDefault(new Segmentit.Segment());
  if (selectedPara == null) {
    paraIndex = getParagraph(bookId);
    selectedPara = paraIndex.map(item => item.index);
  }
  selectedPara = selectedPara.map(Number);
  let body = getDocument(bookId);
  let para = getPara(body);
  let paragraphs = [];
  let currentHeading = -1;
  let currentHeading2 = 0;
  let levels = getLevels(para);
  let freqList = [];
  let countRank = {};
  const symbolsToRemove = ['「', '？', '，'];
  console.time("頻率分析時間");
  for (let i = 0; i < para.length; i++) {
    if (levels[i] == 2 && para[i].getText() != "" && para[i].getText() != null) {
      isGreaterThanAll = true;
      if (selectedPara.includes(i)) {
        paragraphs.push({"heading1": para[i].getText()});
        currentHeading++;
        currentHeading2 = 0;
      } else {
        for (let k in selectedPara) {
          if (selectedPara[k] > i) {
            i = selectedPara[k]-1;
            isGreaterThanAll = false;
            break;
          }
        }
        if (isGreaterThanAll) {
          console.log(JSON.stringify(paragraphs));
          console.timeEnd("頻率分析時間");
          return paragraphs;
        }
      }
    }
    if (levels[i] == 3 && para[i].getText() != "" && para[i].getText() != null) {
      if (currentHeading != -1) {
        if (paragraphs[currentHeading]["heading2"] == null) {
          paragraphs[currentHeading]["heading2"] = [{"title": [para[i].getText()], "content": []}];
        } else {
          paragraphs[currentHeading]["heading2"].push({"title": [para[i].getText()], "content": []});
          currentHeading2++;
        }
      }
    }
    if (levels[i] == 8 && para[i].getText() != null) {
      if (currentHeading != -1) {
        if (paragraphs[currentHeading]["heading2"]===undefined) {
          if (paragraphs[currentHeading]["content"]==null) {
            if (para[i].getText()!="") {
              paragraphs[currentHeading]["content"] = [para[i].getText()];
              freqList = freqList.concat(segmentit.doSegment(para[i].getText()));
            }
          } else {
            paragraphs[currentHeading]["content"].push(para[i].getText());
            freqList = freqList.concat(segmentit.doSegment(para[i].getText()));
          }
        } else {
          if (!(paragraphs[currentHeading]["heading2"][currentHeading2]["content"].length == 0 && para[i].getText()=="")) {
            paragraphs[currentHeading]["heading2"][currentHeading2]["content"].push(para[i].getText());
            freqList = freqList.concat(segmentit.doSegment(para[i].getText()));
          }
        }
      }
    }
  }
  freqList = freqList.filter(item => !symbolsToRemove.includes(item.w));
  freqList = freqList.filter(item => item.w.length >= 2);
  freqList.forEach(item => {
    const key = item.w;
    countRank[key] = (countRank[key] || 0) + 1;
  });
  countRank = Object.entries(countRank)
  .sort((a, b) => b[1] - a[1])
  .map(entry => ({ word: entry[0], count: entry[1] }));
  // console.log(paragraphs);
  // console.log(freqList);
  console.log(countRank);
  console.timeEnd("頻率分析時間");
  return countRank;
}

function frequency_eng(bookId) {
  let blacklist = ['the', 'is', 'am', 'are', 'and'];
  let text = "";
  let body = getDocument(bookId);
  let para = getPara(body);
  let levels = getLevels(para);
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

function frequency_report() {
  var jsUrl = 'https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.min.js';
  var response = UrlFetchApp.fetch(jsUrl);
  var jsCode = response.getContentText();
  eval(jsCode);
  const segmentit = Segmentit.useDefault(new Segmentit.Segment());
  const result = segmentit.doSegment('現今，網絡世界發展一日千里，每個人都有能力成為媒體的一部份，小時候不敢前往探險的廢棄地方，現在有人以影片，甚至以直播的形式，為大家揭露那些地方的真實一面，陳立聰和李仁佳就是其中一員。');
  console.log(result[1]["w"]);
}

function getEditCardId() {
  return cache.get('cardId');
}

function addCard(e) {
  let db = getDB();
  let sheet = db.getSheetByName("角色卡");
  if (e.parameter.image != "") {
    newImage = e.parameter.image;
  } else {
    if (e.parameter.gender!="女性") {
      newImage = "https://www.w3schools.com/howto/img_avatar.png";
    } else {
      newImage = "https://www.w3schools.com/howto/img_avatar2.png";
    }
  }
  sheet.appendRow([newImage,e.parameter.type,e.parameter.name,e.parameter.gender,e.parameter.desc]);
  sheet.insertRowAfter(sheet.getLastRow());
  console.log("成功新增角色卡！");
}

function editCard(e) {
  db = getDB();
  sheet = db.getSheetByName("角色卡");
  if (e.parameter.image != "") {
    sheet.getRange(parseInt(e.parameter.cardId)+1,1).setValue(e.parameter.image);
  } else {
    if (e.parameter.gender!="女性") {
      sheet.getRange(parseInt(e.parameter.cardId)+1,1).setValue("https://www.w3schools.com/howto/img_avatar.png");
    } else {
      sheet.getRange(parseInt(e.parameter.cardId)+1,1).setValue("https://www.w3schools.com/howto/img_avatar2.png");
    }
  }
  sheet.getRange(parseInt(e.parameter.cardId)+1,2).setValue(e.parameter.type);
  sheet.getRange(parseInt(e.parameter.cardId)+1,3).setValue(e.parameter.name);
  sheet.getRange(parseInt(e.parameter.cardId)+1,4).setValue(e.parameter.gender);
  sheet.getRange(parseInt(e.parameter.cardId)+1,5).setValue(e.parameter.desc);
  console.log("成功編輯角色卡！");
}

function deleteCard(e) {
  db = getDB();
  sheet = db.getSheetByName("角色卡");
  sheet.deleteRow(parseInt(e.parameter.cardId)+1);
  sheet.insertRowAfter(sheet.getLastRow());
  console.log("成功刪除角色卡！");
}

function deleteAllCards() {
  db = getDB();
  sheet = db.getSheetByName("角色卡");
  var range = sheet.getDataRange();
  range.clear();
  console.log("成功刪除所有角色卡！");
}

function setBookshelfDisplay(e) {
  userProperties.setProperty('bookshelfDisplay', e.parameter.bookshelfDisplay);
}

function setCharacterDisplay(e) {
  userProperties.setProperty('characterDisplay', e.parameter.characterDisplay);
}

function setSettings(e) {
  userProperties.setProperty('goal', e.parameter.goal);
  userProperties.setProperty('goalAll', e.parameter.goalAll);
  userProperties.setProperty('freqNum', e.parameter.freqNum);
  userProperties.setProperty('indents', e.parameter.indents);
  userProperties.setProperty('lines', e.parameter.lines);
  userProperties.setProperty('whitespaceCount', e.parameter.whitespaceCount);
  userProperties.setProperty('symbolCount', e.parameter.symbolCount);
  userProperties.setProperty('speakLang', e.parameter.speakLang);
  userProperties.setProperty('geminiAPIkey', e.parameter.geminiAPIkey);
  userProperties.setProperty('openJourneyAPIkey', e.parameter.openJourneyAPIkey);
  userProperties.setProperty('penanaEmail', e.parameter.penanaEmail);
  userProperties.setProperty('penanaPassword', e.parameter.penanaPassword);
  addDbSettings(e);
}

function deleteAllSettings() {
  db = getDB();
  sheet = db.getSheetByName("設定");
  var range = sheet.getDataRange();
  range.clear();
}

function deleteAllData() {
  var triggers = ScriptApp.getProjectTriggers();
  if (triggers.length!=0) {
    ScriptApp.deleteTrigger(triggers[0]);
    console.log("已刪除Trigger");
  }
  if (db != null) {
    deleteAllBooks();
    deleteAllCards();
    deleteAllSettings();
    console.log("已刪除數據庫的所有數據");
  }
  userProperties.deleteAllProperties();
  console.log("已刪除所有本地數據");
}

function resetAllData() {
  deleteAllData();
  installFunctions();
}

function createTimeDrivenTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  if (triggers.length!=1) {
    const createTrigger = ([hour, minute])=>
    ScriptApp.newTrigger("addDay")
    .timeBased()
    .atHour(hour)
    .nearMinute(minute)
    .everyDays(1) 
    .create();
    [[0,0]].forEach(createTrigger);
    console.log("成功建立TimeDrivenTrigger！");
  } else {
    console.error("TimeDrivenTrigger已存在！");
  }
}

function createCalendar() {
  var calendar = CalendarApp.createCalendar("GoogleDocsWritingEngine");
Logger.log('Created the calendar "%s", with the ID "%s".',
    calendar.getName(), calendar.getId());
}

function createOneOff(bookName, id, datetime) {
  var event = CalendarApp.getCalendarById(id).createEvent(bookName,
    new Date(datetime),
    new Date(datetime));
Logger.log('Event ID: ' + event.getId());
}

function createLongTerm(bookName, id, datetime, endDate) {
  var eventSeries = CalendarApp.getCalendarById(id).createEventSeries(bookName,
    new Date(datetime),
    new Date(datetime),
    CalendarApp.newRecurrence().addWeeklyRule()
        .onlyOnWeekdays([CalendarApp.Weekday.TUESDAY, CalendarApp.Weekday.THURSDAY])
        .until(new Date(endDate)));
  Logger.log('Event Series ID: ' + eventSeries.getId());
}

function fetchHTML(title, content) {
  const paragraphs = content.split("\n\n");
  const finalContent = paragraphs.map(paragraph => `<p>${paragraph}</p>`).join("");

  var formData = {
    email: "",
    password: ""
  };

  if (email == "" || password == "") {
    throw new error("Hello World!")
  }

  var loginResponse = UrlFetchApp.fetch('https://www.penana.com/login.php', {
    method: 'post',
    payload: formData,
    followRedirects: false
  });

  var cookies = loginResponse.getHeaders()['Set-Cookie'];

  formData = {
    content: finalContent,
    chaptertitle: title,
    newdraft: "Save as draft"
  };

  params = {
    headers: {
      'Cookie': cookies
    },
    method: 'post',
    payload: formData
  }
  storyUrl = books[getProperty("currentBook")]["penanaUrl"];
  Logger.log(storyUrl);
  storyId = storyUrl.split('story/')[1].split('/')[0];
  Logger.log(storyId);
  var otherResponse = UrlFetchApp.fetch('https://www.penana.com/write.php?id=' + storyId, params);
  response = otherResponse.getContentText();
  Logger.log(response);
  return response;
}