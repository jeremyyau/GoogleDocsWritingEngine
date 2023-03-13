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
