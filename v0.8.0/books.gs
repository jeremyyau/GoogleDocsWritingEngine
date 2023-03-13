function getEditBookId() {
  return cache.get('bookId');
}

function setCurBook(e) {
  currentBook = e.parameter.bookId;
  userProperties.setProperty('currentBook', e.parameter.bookId);
}

function getCurBook() {
  return currentBook;
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
    newGoal = goal;
  }
  if (e.parameter.goalAll != "") {
    newGoalAll = e.parameter.goalAll;
  } else {
    newGoalAll = goalAll;
  }
  sheet.appendRow([e.parameter.image,newBookName,e.parameter.desc,e.parameter.bookUrl,newGoal,newGoalAll]);
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
