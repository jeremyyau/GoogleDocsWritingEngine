function getPara() {
  return cache.get('para');
}

function exportResult(chapter, bookId) {
  i = parseInt(chapter);
  getDocument(bookId);
  wordCount();
  let text = "";
  let parts = "";
  let x = 0;
  let current_chapter;
  let paraText = para.map(function (p) {
    return p.getText();
  });
  let counts = [];
  for (k = 0; k < para.length; k++) {
    var count = 0;
    for (j = k+1; j < para.length; j++) {
      if (levels[j] <= levels[k]) {
        break;
      }
      if (levels[j] == 8) {
        count += paraCounts[j];
      }
    }
    counts.push(count);
  }
  for (var j = i+1; j <= para.length; j++) {
    if (levels[j] == 8 && paraText[j] != null) {
      if (paraText[j] != "") {
        for (z=0;z<Math.max(indents, 0);z++) {
          text += "　";
        }
      }
      text += paraText[j];
      if (paraText[j] != "") {
        text += "\n";
      }
      for (y=0;y<Math.max(lines, 0);y++) {
        text += "\n";
      }
    } else if (levels[j] == 3) {
      if (x >= 1) {
        parts += "<input type='button' class='btn btn-primary mb-4' id='txt"+j+"' value='💽下載TXT檔'/>&emsp;<input type='button' class='btn btn-primary mb-4' id='speak"+j+"' value='🔊朗讀'/>&emsp;<input type='button' class='btn btn-danger mb-4' value='🔈停止朗讀' onclick='speechSynthesis.cancel();'/><script>function download(filename, text) {var element = document.createElement('a');element.setAttribute('href', 'data:text/docx;charset=utf-8,' + encodeURIComponent(text));element.setAttribute('download', filename);element.style.display = 'none';document.body.appendChild(element);element.click();document.body.removeChild(element);}function speakPara(text){const string = text;let utterance = new SpeechSynthesisUtterance(string);utterance.lang = '"+speakLang+"';speechSynthesis.speak(utterance);}document.getElementById('txt"+j+"').addEventListener('click', function(){var text = document.getElementById('textarea"+j+"').value;var filename = '"+para[chapter].getText()+ " - " +current_chapter+".txt';download(filename, text);}, false);document.getElementById('speak"+j+"').addEventListener('click', function(){var text = document.getElementById('textarea"+j+"').value;speakPara(text);}, false);</script>";
        parts += "<textarea onclick='this.focus();this.select();document.execCommand(\"copy\");alert(\"Paragraph copied!\")' style='width:100%;' rows='5' id='textarea"+j+"'>" + text.replace(/\n+$/, '').replace(/^\n+|\n+$/g, '') + "</textarea>";
      }
      current_chapter = para[j].getText();
      parts += "<h5>" + para[j].getText() + " (" + counts[j] + " words)（⌛預計閱讀時間："+predictTime(counts[j])+"分鐘）\n" + "</h5>";
      text = "";
      x++;
    } else if (levels[j] == 2 || j == para.length) {
      parts += "<input type='button' class='btn btn-primary mb-4' id='txt"+j+"' value='💽下載TXT檔'/>&emsp;<input type='button' class='btn btn-primary mb-4' id='speak"+j+"' value='🔊朗讀'/>&emsp;<input type='button' class='btn btn-danger mb-4' value='🔈停止朗讀' onclick='speechSynthesis.cancel()'/><script>function download(filename, text) {var element = document.createElement('a');element.setAttribute('href', 'data:text/docx;charset=utf-8,' + encodeURIComponent(text));element.setAttribute('download', filename);element.style.display = 'none';document.body.appendChild(element);element.click();document.body.removeChild(element);}function speakPara(text){const string = text;let utterance = new SpeechSynthesisUtterance(string);utterance.lang = '"+speakLang+"';speechSynthesis.speak(utterance);}document.getElementById('txt"+j+"').addEventListener('click', function(){var text = document.getElementById('textarea"+j+"').value;var filename = '"+para[chapter].getText()+ " - " +current_chapter+".txt';download(filename, text);}, false);document.getElementById('speak"+j+"').addEventListener('click', function(){var text = document.getElementById('textarea"+j+"').value;speakPara(text);}, false);</script>";
      parts += "<textarea onclick='this.focus();this.select();document.execCommand(\"copy\");alert(\"Paragraph copied!\")' style='width:100%;' rows='5' id='textarea"+j+"'>" + text.replace(/\n+$/, '').replace(/^\n+|\n+$/g, '') + "</textarea>";
      break;
    }
  }
  return "<div class='alert alert-primary' role='alert'>按一下文字框以複製段落文字</div>" + parts;
}
