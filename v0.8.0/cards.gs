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
