// Initial values
let appmemory = [];
let todayMemory = [];
let pastMemory = [];
let futureMemory = [];
let action; // "0" For DataLoading and "1" For New Data
let mode = -1; //"0" >> "Today" -- "1" >> "Future" -- "2" >> "Past"
let todayYear = new Date().getFullYear();
let todayMonth = new Date().getMonth() + 1;
let todayDay = new Date().getDate();
let date = new Date();
let duration = new Date();
// -----------------------------------//

// ّ For Writing Today Date In App
document.querySelector("#today").innerText =
  todayYear + "-" + todayMonth + "-" + todayDay;
// -----------------------------------//

// Load Previous Data
window.addEventListener("load", loadFromMemory);
function loadFromMemory(appmemory, pastMemory, todayMemory, futureMemory) {
  appmemory = JSON.parse(localStorage.getItem("memory"));
  action = 0; // Action Status When Data is Loading
  todayMemory = [];
  pastMemory = [];
  futureMemory = [];
  changeMode(appmemory, pastMemory, todayMemory, futureMemory, action, mode);
}
// -----------------------------------//

// Register New Data To Tables
let confirmRegister = document.getElementById("ok");
confirmRegister.addEventListener("click", addTaskInfo);
let key = 1;
function addTaskInfo(appmemory) {
  if (todayMemory == null || pastMemory == null || futureMemory == null) {
    todayMemory = [];
    pastMemory = [];
    futureMemory = [];
  }
  appmemory = JSON.parse(localStorage.getItem("memory"));
  if (appmemory == null) {
    appmemory = [];
  }
  let taskinfo = {
    task: document.querySelector("#inputmaintask").value,
    date: document.querySelector("#inputmaindate").value,
    duration: document.querySelector("#inputmainduration").value,
    status: "0",
    keyValue: 1,
  };

  ///
  if (appmemory.length != 0) {
    taskinfo.keyValue = appmemory[appmemory.length - 1].keyValue + 1;
  }
  if (taskinfo.task == "" || taskinfo.date == "" || taskinfo.duration == "") {
    alert("Please fill in all input fields");
    return;
  }
  ////
  if (taskinfo.duration < taskinfo.date) {
    alert("The start date must be before the end date");
    return;
  }
  ////
  appmemory.push(taskinfo); // Add New Data To Memory
  localStorage.setItem("memory", JSON.stringify(appmemory)); // Save New Data
  let action = 1; //Action Status When New Data Entered
  changeMode(appmemory, pastMemory, todayMemory, futureMemory, action);
}
// -----------------------------------//

// Identify the type of input data
function changeMode(appmemory, pastMemory, todayMemory, futureMemory, action) {
  let j = 0;
  if (action == 1) {
    j = appmemory.length - 1;
  }

  for (j; j < appmemory.length; j++) {
    let yearInput = parseInt(appmemory[j].date.slice(0, 4));
    let monthInput = parseInt(appmemory[j].date.slice(5, 7));
    let dayInput = parseInt(appmemory[j].date.slice(8, 10));
    if (
      yearInput == todayYear &&
      monthInput == todayMonth &&
      dayInput == todayDay
    ) {
      mode = 0; // Change To "Today Mode"
      todayMemory.push(appmemory[j]);
      localStorage.setItem("Today", JSON.stringify(todayMemory)); // Save Data To Local Srorage (Today Memory)
      createTable(
        appmemory,
        pastMemory,
        todayMemory,
        futureMemory,
        action,
        mode
      );
    } else if (
      yearInput > todayYear ||
      (yearInput == todayYear && monthInput > todayMonth) ||
      (yearInput == todayYear &&
        monthInput == todayMonth &&
        dayInput > todayDay)
    ) {
      mode = 1; // Change To "Future Mode"
      futureMemory.push(appmemory[j]);
      localStorage.setItem("Future", JSON.stringify(futureMemory)); // Save Data To Local Srorage (Future Memory)

      createTable(
        appmemory,
        pastMemory,
        todayMemory,
        futureMemory,
        action,
        mode
      );
    } else {
      mode = 2; // Change To "Past Mode"

      pastMemory.push(appmemory[j]);
      localStorage.setItem("Past", JSON.stringify(pastMemory)); // Save Data To Local Srorage (Past Memory)

      createTable(
        appmemory,
        pastMemory,
        todayMemory,
        futureMemory,
        action,
        mode
      );
    }
  }
}
// -----------------------------------//

// Create Table
function createTable(
  appmemory,
  pastMemory,
  todayMemory,
  futureMemory,
  action,
  mode
) {
  todayMemory = JSON.parse(localStorage.getItem("Today"));
  pastMemory = JSON.parse(localStorage.getItem("Past"));
  futureMemory = JSON.parse(localStorage.getItem("Future"));
  let datasurce;
  let list;
  if (mode == 0) {
    list = document.querySelector("#todayTableTasks tbody");
    datasurce = todayMemory;
  }

  if (mode == 1) {
    datasurce = futureMemory;
    list = document.querySelector("#futureTableTasks tbody");
  }
  if (mode == 2) {
    datasurce = pastMemory;
    list = document.querySelector("#pastTableTasks tbody");
  }

  let i = datasurce.length - 1;

  let Row = list.insertRow();

  //
  let ActionCell = Row.insertCell();
  ActionDiv = document.createElement("div");
  ActionCell.appendChild(ActionDiv);
  ActionDiv.className = "Action-Div";
  //
  let deleteIcon = document.createElement("i");
  deleteIcon.className = "fa-solid fa-trash-can";
  ActionDiv.appendChild(deleteIcon);
  //
  let tdId = document.createElement("td");
  let idText = document.createTextNode(i + 1);
  idText.value = datasurce.length + 1;
  tdId.appendChild(idText);
  tdId.className = "rank";
  Row.appendChild(tdId);
  //

  let tdTask = document.createElement("td");
  let taskText = document.createTextNode(datasurce[i].task);
  tdTask.appendChild(taskText);
  Row.appendChild(tdTask);
  //
  let tdDate = document.createElement("td");
  let dateText = document.createTextNode(datasurce[i].date);
  tdDate.appendChild(dateText);
  Row.appendChild(tdDate);
  //
  let tdDuration = document.createElement("td");
  let durationText = document.createTextNode(datasurce[i].duration);
  tdDuration.appendChild(durationText);
  Row.appendChild(tdDuration);
  //
  let tdStatus = document.createElement("td");
  let statusElement = document.createElement("input");
  statusElement.type = "Range";
  statusElement.min = "0";
  statusElement.max = "100";
  statusElement.className = "slider";
  statusElement.value = datasurce[i].status;
  tdStatus.appendChild(statusElement);
  statusElement.className = "taskstatus";
  Row.appendChild(tdStatus);
  //
  let percentStatus = document.createElement("span");
  percentStatus.innerText = statusElement.value + "%";
  percentStatus.className = "percentSpan";
  tdStatus.appendChild(percentStatus);
  if (statusElement.value < 30) {
    percentStatus.style.backgroundColor = "red";
  } else if (statusElement.value >= 30 && statusElement.value < 60) {
    percentStatus.style.backgroundColor = "orange";
    percentStatus.style.Color = "black";
  } else if (statusElement.value >= 60 && statusElement.value < 99) {
    percentStatus.style.backgroundColor = "green";
  } else {
    percentStatus.style.backgroundColor = "blue";
  }
  return mode;
}
// -----------------------------------//

// Delete records And Update status values
let alltask = document.querySelector(".myplans");
alltask.addEventListener("click", (e) => {
  let tableTarget = e.target.closest("table").id;
  let updateStatus = JSON.parse(localStorage.getItem("Today"));
  if (tableTarget == "pastTableTasks") {
    updateStatus = JSON.parse(localStorage.getItem("Past"));
  }
  if (tableTarget == "futureTableTasks") {
    updateStatus = JSON.parse(localStorage.getItem("Future"));
  }
  appmemory = JSON.parse(localStorage.getItem("memory"));
  let newrow = e.target.closest("tr");
  let newrankvalue = newrow.querySelector(".rank").innerText;

  // -----Start codes for delete row ------------
  if (e.target.className == "fa-solid fa-trash-can") {
    if (!confirm("Your Task Will Deleted. Are You Sure ?")) {
      return;
    }
    for (let j = 0; j < appmemory.length; j++) {
      if (appmemory[j].keyValue == updateStatus[newrankvalue - 1].keyValue) {
        appmemory.splice(j, 1); //Delete Selected Row Data From Array
        localStorage.setItem("memory", JSON.stringify(appmemory)); // Save New Data
        updateStatus.splice(j, 1); //Delete Selected Row Data From Array
      }
    }

    if (tableTarget == "futureTableTasks") {
      localStorage.setItem("Future", JSON.stringify(updateStatus)); // Save Data To Local Srorage (Future Memory)
    } else if (tableTarget == "pastTableTasks") {
      localStorage.setItem("Past", JSON.stringify(updateStatus)); // Save Data To Local Srorage (Past Memory)
    } else {
      localStorage.setItem("Today", JSON.stringify(updateStatus)); // Save Data To Local Srorage (Today Memory)
    }
    newrow.remove();
    return;
  }

  // -----End of codes for delete row ------------

  // -----Start of codes for update duty performed ------------
  let spanSelected = e.target.nextElementSibling;
  if (e.target.className != "taskstatus") {
    return;
  }
  for (let i = 0; i < updateStatus.length + 1; i++) {
    spanSelected.innerText = e.target.value + "%";
    updateStatus[newrankvalue - 1].status = e.target.value;
    if (tableTarget == "futureTableTasks") {
      localStorage.setItem("Future", JSON.stringify(updateStatus)); // Save Data To Local Srorage (Future Memory)
    } else if (tableTarget == "pastTableTasks") {
      localStorage.setItem("Past", JSON.stringify(updateStatus)); // Save Data To Local Srorage (Past Memory)
    } else {
      localStorage.setItem("Today", JSON.stringify(updateStatus)); // Save Data To Local Srorage (Today Memory)
    }
    for (let k = 0; k < appmemory.length; k++) {
      if (appmemory[k].keyValue == updateStatus[i].keyValue) {
        appmemory[k].status = updateStatus[i].status;
        localStorage.setItem("memory", JSON.stringify(appmemory)); // Save Data To Local Srorage (Memory)
      }
    }
    if (e.target.value < 30) {
      spanSelected.style.backgroundColor = "red";
      return;
    } else if (e.target.value >= 30 && e.target.value < 60) {
      spanSelected.style.backgroundColor = "orange";
      spanSelected.style.Color = "black !important";
    } else if (e.target.value >= 60 && e.target.value < 99) {
      spanSelected.style.backgroundColor = "green";
    } else {
      spanSelected.style.backgroundColor = "blue";
    }
  }
});
// -----End of codes for update duty performed ------------

// -----Start of codes for styles and showing data in seperate section ------------
let sectionHead = document.querySelector(".headings");
let divTitle = document.querySelector(".title");
let plantTitle = document.querySelector(".title h2").innerText;
let pastDisplay = document.querySelector(".pastSection");
let pastBackColor = document.querySelector("#pastDiv");
let futureBackColor = document.querySelector("#futureDiv");
let todayBackColor = document.querySelector("#todayDiv");
let futureDisplay = document.querySelector(".futureSection");
let todayDisplay = document.querySelector(".todaySection");
sectionHead.addEventListener("click", (e) => {
  if (e.target.innerText == "Past") {
    pastDisplay.style.display = "revert";
    pastBackColor.style.backgroundColor = "green";
    futureBackColor.style.backgroundColor = "bisque";
    todayBackColor.style.backgroundColor = "bisque";
    futureDisplay.style.display = "none";
    todayDisplay.style.display = "none";
    return;
  }
  if (e.target.innerText == "Future") {
    pastDisplay.style.display = "none";
    futureDisplay.style.display = "revert";
    futureBackColor.style.backgroundColor = "green";
    todayBackColor.style.backgroundColor = "bisque";
    pastBackColor.style.backgroundColor = "bisque";
    todayDisplay.style.display = "none";
    return;
  }
  if (e.target.innerText == "Today") {
    pastDisplay.style.display = "none";
    futureDisplay.style.display = "none";
    todayDisplay.style.display = "revert";
    todayBackColor.style.backgroundColor = "green";
    futureBackColor.style.backgroundColor = "bisque";
    pastBackColor.style.backgroundColor = "bisque";
    return;
  }
});
// -----End of codes for styles and showing data in seperate section ------------

// -----Start of codes for changing Styles when input new data  ------------
confirmRegister.addEventListener("click", (e) => {
  let dateInput = document.querySelector("#inputmaindate").value;
  let yearInput = dateInput.slice(0, 4);
  let monthInput = dateInput.slice(5, 7);
  let dayInput = dateInput.slice(8, 10);
  if (
    yearInput > todayYear ||
    (yearInput == todayYear && monthInput > todayMonth) ||
    (yearInput == todayYear && monthInput == todayMonth && dayInput > todayDay)
  ) {
    pastDisplay.style.display = "none";
    futureDisplay.style.display = "revert";
    futureBackColor.style.backgroundColor = "green";
    todayBackColor.style.backgroundColor = "bisque";
    pastBackColor.style.backgroundColor = "bisque";
    todayDisplay.style.display = "none";
    return;
  } else if (
    yearInput == todayYear &&
    monthInput == todayMonth &&
    dayInput == todayDay
  ) {
    pastDisplay.style.display = "none";
    futureDisplay.style.display = "none";
    todayDisplay.style.display = "revert";
    todayBackColor.style.backgroundColor = "green";
    futureBackColor.style.backgroundColor = "bisque";
    pastBackColor.style.backgroundColor = "bisque";
    return;
  } else {
    pastDisplay.style.display = "revert";
    pastBackColor.style.backgroundColor = "green";
    futureBackColor.style.backgroundColor = "bisque";
    todayBackColor.style.backgroundColor = "bisque";
    futureDisplay.style.display = "none";
    todayDisplay.style.display = "none";
    return;
  }
});
// -----End of codes for changing Styles when input new data  ------------

function reload() {
  location.reload();
}
// -----Start of codes for delete all tables  ------------
appmemory = JSON.parse(localStorage.getItem("memory"));
pastMemory = JSON.parse(localStorage.getItem("Past"));
todayMemory = JSON.parse(localStorage.getItem("Today"));
futureMemory = JSON.parse(localStorage.getItem("Future"));
let deleteAll = document.querySelector(".deleteAll");
let deletePasts = document.querySelector(".deletePast");
let deleteToday = document.querySelector(".deleteToday");
let deleteFutures = document.querySelector(".deleteFuture");
deleteAll.addEventListener("click", (e) => {
  if (!confirm("All Your Tasks Will Deleted. Are You Sure ?")) {
    return;
  }
  appmemory = [];
  localStorage.setItem("memory", JSON.stringify(appmemory)); // Save Data To Local Srorage (Memory)
  reload();
});
//--------------------------------------------------------

deletePasts.addEventListener("click", (e) => {
  if (!confirm("All Your Past Tasks Will Deleted. Are You Sure ?")) {
    return;
  }

  localStorage.setItem("Past", JSON.stringify(pastMemory)); // Save Data To Local Srorage (Past)
  for (let i = 0; i < appmemory.length; i++) {
    for (let j = 0; j < pastMemory.length; j++) {
      if (appmemory[i].keyValue == pastMemory[j].keyValue) {
        appmemory.splice(i, 1); // Remove Data From Memory
        localStorage.setItem("memory", JSON.stringify(appmemory)); // Save Data To Local Srorage (memory)
      }
    }
  }
  reload();
});
//--------------------------------------------------------

deleteToday.addEventListener("click", (e) => {
  if (!confirm("All Your Today Tasks Will Deleted. Are You Sure ?")) {
    return;
  }

  localStorage.setItem("Today", JSON.stringify(todayMemory)); // Save Data To Local Srorage (Today)
  for (let i = 0; i < appmemory.length; i++) {
    for (let j = 0; j < todayMemory.length; j++) {
      if (appmemory[i].keyValue == todayMemory[j].keyValue) {
        appmemory.splice(i, 1); // Remove Data From Memory
        localStorage.setItem("memory", JSON.stringify(appmemory)); // Save Data To Local Srorage (memory)
      }
    }
  }
  reload();
});
//--------------------------------------------------------

deleteFutures.addEventListener("click", (e) => {
  if (!confirm("All Your Future Tasks Will Deleted. Are You Sure ?")) {
    return;
  }

  localStorage.setItem("Future", JSON.stringify(futureMemory)); // Save Data To Local Srorage (Future)
  for (let i = 0; i < appmemory.length; i++) {
    for (let j = 0; j < futureMemory.length; j++) {
      if (appmemory[i].keyValue == futureMemory[j].keyValue) {
        appmemory.splice(i, 1); // Remove Data From Memory
        localStorage.setItem("memory", JSON.stringify(appmemory)); // Save Data To Local Srorage (memory)
      }
    }
  }
  reload();
});
