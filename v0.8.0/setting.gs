function setSettings(e) {
  userProperties.setProperty('goal', e.parameter.goal);
  userProperties.setProperty('goalAll', e.parameter.goalAll);
  userProperties.setProperty('freqNum', e.parameter.freqNum);
  userProperties.setProperty('indents', e.parameter.indents);
  userProperties.setProperty('lines', e.parameter.lines);
  userProperties.setProperty('whitespaceCount', e.parameter.whitespaceCount);
  userProperties.setProperty('symbolCount', e.parameter.symbolCount);
  userProperties.setProperty('speakLang', e.parameter.speakLang);
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
