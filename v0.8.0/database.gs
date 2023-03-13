function createDB() {
  if (userProperties.getProperty('dbUrl')==null||userProperties.getProperty('dbUrl')=='') {
    var newDB = SpreadsheetApp.create("Google Docs Writing Engine數據庫", 1, 1);
    userProperties.setProperty('dbUrl', newDB.getUrl());
    console.log("成功建立數據庫！");
    return true;
  } else {
    console.error("數據庫已存在！");
    return false;
  }
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
    sheet.appendRow([userProperties.getProperty('goal'),userProperties.getProperty('goalAll'),userProperties.getProperty('freqNum'),userProperties.getProperty('indents'),userProperties.getProperty('lines'),userProperties.getProperty('whitespaceCount'),userProperties.getProperty('symbolCount'),userProperties.getProperty('speakLang')]);
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
  sheet.appendRow([e.parameter.goal,e.parameter.goalAll,e.parameter.freqNum,e.parameter.indents,e.parameter.lines,e.parameter.whitespaceCount,e.parameter.symbolCount,e.parameter.speakLang]);
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
        newBooks.push({"image":values[i][0],"name":values[i][1], "desc":values[i][2],"link":values[i][3],"goal":values[i][4],"goalAll":values[i][5]});
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
      newSettings.push({"goal":values[0][0]+"","goalAll":values[0][1]+"", "freqNum":values[0][2]+"","indents":values[0][3]+"","lines":values[0][4]+"","whitespaceCount":values[0][5],"symbolCount":values[0][6],"speakLang":values[0][7]});
      return newSettings;
    }
  }
  return [];
}
