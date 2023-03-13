function countPerSection(bookId) {
  getDocument(bookId);
  wordCount();
  goal = books[bookId]["goal"];
  goalAll = books[bookId]["goalAll"];
  let textAll = "";
  let text = "";
  let countAll = 0;
  let chapterList = "";
  let countList = "";
  let colourList = 0;
  let totalTime = 0;
  let chapter = 0;

  for (var i = 0; i < para.length; i++) {
    if (levels[i] < 8 && levels[i] == 2) {
      if (text!="") {
        text += "</div></div>";
      }
      chapter++;
      text += "<p>"+para[i].getText()+" (" + counts[i] + " words) <a class='btn btn-primary' data-bs-toggle='collapse' href='#collapseExample"+chapter+"' role='button' aria-expanded='false' aria-controls='collapseExample'>展開</a></p><div class='collapse' id='collapseExample"+chapter+"'><div class='card card-body mb-4'>";
      countAll += counts[i];
      countList += counts[i] + ",";
    } else if (levels[i] < 8 && levels[i] == 3) {
      totalTime += predictTime(counts[i]);
      if (counts[i] >= goal) {
        text += "<p>" + para[i].getText() + "（達標✅）（⌛預計閱讀時間："+predictTime(counts[i])+"分鐘）</p>";
        text += "<div class='progress mb-4' style='font-size: 14px;height: 24px;'><div id='myBar' class='progress-bar bg-success' role='progressbar' style='width:"+ Math.round(Math.min(counts[i],goal)/goal*100) +"%'>"+ counts[i] + "/" + goal + "(" + Math.round(Math.min(counts[i],goal)/goal*100) + "%)</div></div>";
      } else {
        text += "<p>" + para[i].getText() + "（未達標❌）（⌛預計閱讀時間："+predictTime(counts[i])+"分鐘）</p>";
        text += "<div class='progress mb-4' style='font-size: 14px;height: 24px;'><div id='myBar' class='progress-bar progress-bar-striped progress-bar-animated bg-danger' role='progressbar' style='width:"+ Math.round(Math.min(counts[i],goal)/goal*100) +"%'>"+ counts[i] + "/" + goal + "(" + Math.round(Math.min(counts[i],goal)/goal*100) + "%)</div></div>";
      }
    }
  }

  if (countAll >= goalAll) {
    textAll += "<h6>總字數（達標✅）（⌛預計閱讀時間："+totalTime+"分鐘）</h6>";
    textAll += "<div class='progress mb-4' style='font-size: 14px;height: 24px;'><div id='myBar' class='progress-bar bg-success' role='progressbar' style='width:"+ Math.round(Math.min(countAll,goalAll)/goalAll*100) +"%'>"+ countAll + "/" + goalAll + "(" + Math.round(Math.min(countAll,goalAll)/goalAll*100) + "%)</div></div>";
  } else {
    textAll += "<h6>總字數（未達標❌）（⌛預計閱讀時間："+totalTime+"分鐘）</h6>";
    textAll += "<div class='progress mb-4' style='font-size: 14px;height: 24px;'><div id='myBar' class='progress-bar progress-bar-striped progress-bar-animated bg-danger' role='progressbar' style='width:"+ Math.round(Math.min(countAll,goalAll)/goalAll*100) +"%'>"+ countAll + "/" + goalAll + "(" + Math.round(Math.min(countAll,goalAll)/goalAll*100) + "%)</div></div>";
  }

  script = "<script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js'></script>";
  for (var i = 0; i < para.length; i++) {
    if (levels[i] == 2 && para[i].getText() != "" && para[i].getText() != null) {
      chapterList += "'" + para[i].getText() + "',";
      colourList++;
    }
  }
  end_script = "<script>var xValues = [" + chapterList.slice(0, -1) + "];";
  end_script += "var yValues = [" + countList.slice(0, -1) + "];";
  end_script += "var barColors = Array("+colourList+").fill('#ADD8E6');";
  end_script += "new Chart('myChart', {type: 'bar',data: {labels: xValues,datasets: [{backgroundColor: barColors,data: yValues}]},";
  end_script += "options: {legend: {display: false},title: {display: true,text: '" + DocumentApp.openByUrl(books[bookId]["link"]).getName() + "'}}});</script>";
  return script + "<body><div class='container-sm'><canvas id='myChart'></canvas></div>" + textAll + "<div class='panel-group' id='accordion'>" + text + "</div>" + end_script;
}

function countTotal() {
  
}

function wordCount() {
  let count = 0;
  paraCounts = para.map(function (p) {
    let temtext = p.getText();
    if (whitespaceCount===false) {temtext = temtext.trim();}
    if (symbolCount===false) {temtext = temtext.replace(/[\（\）。，「」『』？：；…、！—～＄,$-.]/gi, " ");}
    let eng = temtext.match(/[A-Za-z0-9]+/gi);
    let chi = temtext.replace(/[\sA-Za-z0-9]/gi, "");
    chi = chi ? chi.length : 0;
    eng = eng ? eng.length : 0;
    return chi + eng;
  });
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
}

function predictTime(wordcount) {
  let time = 0;
  let count = wordcount;
  if (count > 0) {
    time++;
  }
  count-=450;
  for (i=count;i>=0;i-=300) {
    time++
  }
  return time;
}

function addDay() {
  let newDate = new Date();
  let wordCounts = 0;
  for (x=0;x<books.length;x++) {
    getDocument(x);
    wordCount();
    for (y=0;y<para.length;y++) {
      if (levels[y] < 8 && levels[y] == 2) {
        wordCounts+=counts[y];
      }
    }
    counts = [];
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
