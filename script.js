// speech reco API :  constructor setup start
const speechReco = window.webkitSpeechRecognition || window.SpeechRecognition;

const recognition = new speechReco();

// constructor setup end
let mic_button = document.getElementById('voice');

// beats
const notification_beat = new Audio('./audios/notifications-beat.mp3');

// scroll down to bottom
function scrollDown(){
    const scrollingElement = document.getElementById('mytable');
    scrollingElement.scrollTop = scrollingElement.scrollHeight;

    const scrollingElement2 = (document.scrollingElement || document.body);
    scrollingElement2.scrollTop = scrollingElement2.scrollHeight;
}

// start the mic function
function startVoice(){
  
    notification_beat.play();

    recognition.onstart = ()=>{
      console.log("Listening !");
      mic_button.style.color = "red";
      mic_button.style.borderColor = 'transparent';

      setTimeout(()=>notification_beat.pause(),2000);
    }
  
    recognition.onend = ()=>{
      console.log("Speech has stopped being detected");
      recognition.stop();
      notification_beat.play();
      mic_button.style.color = "white";
    }
    
    recognition.start();

    recognition.onresult = (response)=>{
        let text = Array.from(response.results)
        .map(r => r[0])
        .map(txt => txt.transcript)
        .join(" ");
    
    // console.log(text);
    if(tasksArray == null){
        tasksArray = [];
    }

    tasksArray.push({
        'task' : text,
        'color':''
    });
    
    saveInformation(tasksArray);
    displayInformation(tasksArray);
    updateDisplay(tasksArray);
    scrollDown();
}}
  
const userInputElement = document.getElementById("task");
const searchInputElement = document.getElementById("searchInput");

const addTaskButton = document.getElementById("addButton");
const addTaskButtonText = addTaskButton.innerText;

let displayBox = document.querySelectorAll(".displayBox");

const totalTaskDisplayElement = document.getElementById("total tasks");
const checkedTaskDisplayElement = document.getElementById("checked tasks");
const pendingTaskDisplayElement = document.getElementById("pending tasks");


let tasksArray = [];
let edit_index = null;
let is_task_edited = false;

function loadData(){
let localData_string_format = localStorage.getItem("tasks");
if(localData_string_format != '[]'){
    tasksArray = JSON.parse(localData_string_format);}
else{
    console.log("Nothing to load : tasks list empty");
}
}

loadData();
updateDisplay(tasksArray);
displayInformation(tasksArray);

function countCheckedTasks(tasksArray){
    let colorCount = 0;
    tasksArray.forEach((ele)=>{
        if(ele.color != '')
        colorCount++;
    })

    return colorCount;
}

function updateDisplay(tasksArray){

    if(tasksArray != null){
        totalTaskDisplayElement.innerHTML = `<span><b>Tasks( ${tasksArray.length} )</b></span>`;
        let count = countCheckedTasks(tasksArray);
        checkedTaskDisplayElement.innerHTML = `<span><b>Checked( ${count} )</b></span>`
        pendingTaskDisplayElement.innerHTML = `<span><b>Pending( ${tasksArray.length- count} )</b></span>`;
    }
    
}

addTaskButton.addEventListener("click",function addTask(){

    if(tasksArray == null)
    tasksArray = [];
    
    if(edit_index != null){ 
        tasksArray.splice(edit_index,1,{'task':userInputElement.value,'color':''});
        edit_index = null;
     }
     else if(userInputElement.value != "" && tasksArray != null){
        tasksArray.push({
            'task' : userInputElement.value,
            'color':''
        }) ;

        const anchor = document.createElement('a');
        anchor.href = "#page-end";
     }
    
    saveInformation(tasksArray);
    displayInformation(tasksArray);

    userInputElement.value  = "";
    searchInputElement.value = "";

    addTaskButton.innerText = addTaskButtonText;
    updateDisplay(tasksArray);
    scrollDown();
}
);


 function displayInformation(tasksArray){

    let tableBody = document.getElementById("tableBody");
    let rowData = "";

    if(tasksArray != null){
    tasksArray.forEach((item,id)=>{
            rowData += `<tbody>
            <tr style="background-color: ${item.color};">
              <th scope="row">${id+1}</th>
              <td  id = "task-content" btn onClick = "editInformation(${id})"  class
              = "break-wrd"><a href="#tasks">${item.task}</a></td>
              <td class="center">
              <i class="btn fa-solid fa-trash fa-xl m-2" onClick = "deleteInformation(${id})"></i>

              <i class="btn fa-solid fa-circle-check fa-xl m-2" onClick = "colorInformation(${id})"></i>
              </td>
            </tr>
          </tbody>`;
        });
    }
    tableBody.innerHTML = rowData; 
    searchInputElement.value = "";
}

function deleteInformation(id){
    tasksArray.splice(id,1);

    saveInformation(tasksArray);
    displayInformation(tasksArray);
    updateDisplay(tasksArray);
}

function editInformation(id){ 

    userInputElement.focus();
    edit_index = id;

    userInputElement.value = tasksArray[id].task;
    addTaskButton.innerText = "Save Changes";

    is_task_edited = !is_task_edited;
    updateDisplay(tasksArray);
}

let colored_elements_array = [];
let colored_elements_count = colored_elements_array.length;

function colorInformation(id){

    if(tasksArray[id].color == '')
    {
        tasksArray[id].color = "#80ed99";
        colored_elements_array.push(id);
    }else{

        tasksArray[id].color = '';
        colored_elements_array.pop(id);
    }
    
    saveInformation(tasksArray);
    displayInformation(tasksArray);
    updateDisplay(tasksArray);
}

function saveInformation(tasksArray){
    const tasksArray_string_format = JSON.stringify(tasksArray);
    localStorage.setItem("tasks",tasksArray_string_format);
}

let allTableRows = document.querySelectorAll("#tableBody tr");
let rows_count = null;

if(tasksArray == null)
rows_count = 0
else
rows_count = tasksArray.length;

searchInputElement.addEventListener("input",function searchTask(e){

    if(tasksArray.length > rows_count || tasksArray.length < rows_count || colored_elements_array.length > colored_elements_count || colored_elements_array.length < colored_elements_count || is_task_edited){

        allTableRows = document.querySelectorAll("#tableBody tr");
        rows_count = tasksArray.length;
        colored_elements_count = colored_elements_array.length;

        saveInformation(tasksArray);
        displayInformation(tasksArray);
        updateDisplay(tasksArray);

        is_task_edited = !is_task_edited;
    }

    let searchValue = e.target.value.toLowerCase();
    tableBody.innerHTML = "";

    allTableRows.forEach((tr)=>{
        
        const rowData = tr.querySelectorAll("td");
        if(rowData[0].innerText.toLowerCase().indexOf(searchValue) > -1){
            tableBody.appendChild(tr);
        }
    })
    
    if(tableBody.innerHTML == ""){
        tableBody.innerHTML = `<div class="mt-3 mb-2"><h5>No matching results found!</h5></div>`
    }
});
