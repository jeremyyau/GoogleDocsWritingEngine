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
        heading1Counts = 0;
        heading2Counts = 0;
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
      if (!symbolCount) {text = text.replace(/[\（\）。，「」『』《》？：；…、！—～＄,$-.]/gi, " ");}
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
    details = countPerSection(i);
    for (let x in details) {
      wordCounts += reportResult[x]["heading1Counts"];
    }
  }
  if (days.length==daysNum) {
    days.splice(0, 1);
  }
  days.push({"year": newDate.getFullYear(), "month": month = newDate.getMonth()+1, "date":newDate.getDate(),"wordCount":wordCounts});
  userProperties.setProperty('days', JSON.stringify(days));
}

function deleteDay() {
  days.splice(0, 1);
  userProperties.setProperty('days', JSON.stringify(days));
}

function fakeDays() {
  days.push({"year": 2023, "month": month = 2, "date":1,"wordCount":1851});
  days.push({"year": 2023, "month": month = 2, "date":2,"wordCount":5786});
  days.push({"year": 2023, "month": month = 2, "date":3,"wordCount":15982});
  days.push({"year": 2023, "month": month = 2, "date":4,"wordCount":47979});
  days.push({"year": 2023, "month": month = 2, "date":5,"wordCount":89190});
  days.push({"year": 2023, "month": month = 2, "date":6,"wordCount":105815});
  days.push({"year": 2023, "month": month = 2, "date":7,"wordCount":150849});
  userProperties.setProperty('days', JSON.stringify(days));
}

function deleteAllDays() {
  days = JSON.parse('[]');
  userProperties.deleteProperty('days');
}
