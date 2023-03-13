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
  if (userProperties.getProperty('daysNum')==null){userProperties.setProperty('daysNum', '7');}
  if (userProperties.getProperty('days')==null){userProperties.setProperty('days', '[]');}
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
