var notes = [{id:"",title:"",content:"",}];

let isUpdateMenu = false; //Se usa como estado del menu, dependiendo de este, la opción del menu en pantalla cambia (agregar o editar nota)
let currentNoteIndex; //Al entrar en el menu de edicion de una nota, se guarda el index de esa nota.
notes = LoadNotes(); //Cargar notas.
ShowNotes();

SetDate(); //Establecer fecha.

let timerDate = setInterval(() => { //Timer para actualizar la fecha cada 1 minuto
    SetDate();
}, 60000);

/*-----------------------ELEMENTOS---------------------------*/
const addNoteButton = document.getElementById("addnote-button"); //Boton para abrir el menu de creación de nota.
    addNoteButton.addEventListener('click', OnAddButton);

const fixedBox = document.getElementById("fixed-box"); //Caja con position:fixed, donde se va a situar el menu en medio de la pantalla.
    fixedBox.onclick = function(event){
            if(event.target == fixedBox){ //si el evento click es el elemento ("modalbox", elemento fixed) ocultarlo
                HideFixedBox();   
            }
        ;};

const closeBTN = fixedBox.querySelector(".close-btn"); //Botón que cierra el panel de creacion o edición de nota.
    closeBTN.addEventListener('click', ()=>{
        HideFixedBox();
    });

const confirmNoteBTN = fixedBox.querySelector("#confirm-note-btn"); //Boton que confirma la creacion o edicion de la nota.
    confirmNoteBTN.addEventListener('click', OnConfirmNoteButton);

const titleNoteMenu = fixedBox.querySelector("#title-note-menu"); //Titulo del menu, si crea o edita una nota.

const titleInput = fixedBox.querySelector("#title-note-input"); //Input(text) donde va a ir el contenido de la nota.
const contentTextArea = fixedBox.querySelector("#content-note-input"); //TextArea donde va a ir el contenido de la nota.
/*----------------------------------------------------------*/

function HideFixedBox(){
    contentTextArea.value = ""; //Limpiar input
    titleInput.value = ""; //Limpiar input
    fixedBox.style.display = "none"; //Ocultar el menu
}

function OnAddButton(){
    isUpdateMenu = false;
    titleNoteMenu.textContent = "Crea una nueva nota 📃";
    titleInput.value = "";
    contentTextArea.value = "";
    confirmNoteBTN.textContent = "Agregar Nota ➕";
    
    fixedBox.style.display = "flex";
    titleInput.focus();
}

function OnConfirmNoteButton(){
    if(!ValidateNote()) return; //Si no valida la nota, retornar.

    if(isUpdateMenu){
        //EDITAR UNA NOTA
        UpdateNote(currentNoteIndex, titleInput.value, contentTextArea.value);
    }else{
        //CREAR UNA NOTA    
        CreateNote(titleInput.value, contentTextArea.value);
    }
    HideFixedBox();
}

function ValidateNote(){
    let title = titleInput.value;
    let content = contentTextArea.value;
    if(title.length == 0 || title[0] == " "|| content.length == 0 || content[0] == " "){
        //Si el string está vacio o empieza con un espacio " ", retornar
        alert("¡Los campos no pueden estar vacíos o empezar con un espacio! 😥");
        return false;
    } 
    return true;
}

function CreateNote(title, content){
    let id = Date.now();
    notes.push({
        id: id,
        title: title,
        content: content
    });
    localStorage.setItem("notes", JSON.stringify(notes));
    ShowNotes();
}

function DeleteNote(index){
    notes.splice(index, 1);
    SaveNotes();
    ShowNotes();
}

function ShowNotes(){
    let container = document.querySelector("#container");
    container.innerHTML = "";

    
    notes.forEach((value, index) =>{
        let noteElement = document.createElement('div');
        noteElement.innerHTML = `
            <div class="note">
                <div class="note-banner">
                    <div class="title-note">${value.title}</div>
                    <div>
                        <span onclick="OnEdit(this, ${index})" class="edit-note-btn">
                        💬<!-- -->
                        </span>
                        <div class="submenu">
                            <div class="edit-submenu submenu-item">Editar 📝</div>
                            <div class="delete-submenu submenu-item">Eliminar ❌</div>
                        </div>
                    </div>
                </div>
                <div class="note-content">${value.content}</div>
            </div>
        `;
        container.innerHTML += noteElement.innerHTML;
    });
}

/*Recibe el parametro "this" haciendo referencia a ese elemento
  para luego obtener el submenu que esta en el mismo contenedor.
*/
function OnEdit(element, index){
    let submenu = element.parentElement.querySelector(".submenu");
    let display = window.getComputedStyle(submenu).display;
    if(display == "none"){
        submenu.style.display = "flex";
    }else{
        submenu.style.display = "none";
    }
    //MOSTRAR MENU PARA EDITAR LA NOTA
    let editMenu = submenu.querySelector(".edit-submenu");
    editMenu.onclick = ()=>{
        submenu.style.display = "none";
        ShowEditMenu(index)
    };

    //ELIMINAR LA NOTA
    let deleteMenu = submenu.querySelector(".delete-submenu");
    deleteMenu.onclick = ()=>{
        //Ventana de confirmación por si se elimina la nota por error.
        if(window.confirm(`¿Eliminar nota del título "${notes[index].title}"? 😪`)){
            submenu.style.display = "none";
            DeleteNote(index);
        }
    };
}

function ShowEditMenu(index){
    isUpdateMenu = true; //Al ser true, el boton de confirmar en el menu, edita la nota, sino crea una nueva.
    currentNoteIndex = index; //Se guarda el index de la nota. Luego el boton de confirmar actualizara la nota segun este index.

    titleNoteMenu.textContent = "Editar nota 📝";
    confirmNoteBTN.textContent = "Actualizar nota ✔";
    titleInput.value = notes[index].title; //Establecer el valor del input con el titulo de la nota
    contentTextArea.value = notes[index].content; //Establecer el valor del input con el contenido de la nota
    fixedBox.style.display = "flex"; //Mostrar el menu
    titleInput.focus();
}

/*Se edita la nota en memoria, se guarda en localstorage y se vuelve a generar todo el HTML*/
function UpdateNote(index, title, content){
    notes[index].title = title;
    notes[index].content = content;

    SaveNotes();
    ShowNotes();
}

function LoadNotes(){
    let stringNotes = localStorage.getItem("notes"); //Obtener las notas del localstorage.
    let notes = JSON.parse(stringNotes); //Convertir el string a un objeto.
    if(notes == null) notes = []; //Si no hay nada guardado, inicializar el array.
    return notes;
}

function SaveNotes(){
    localStorage.setItem("notes", JSON.stringify(notes));
}

function SetDate(){
    let timeElement = document.getElementsByClassName("time"); //elementos donde se va a mostrar la hora
    let dateElement = document.getElementsByClassName("date"); //elementos donde se va a mostrar la fecha

    let days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    let months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
    let date = new Date();

    let day = date.getDay();
    let dateNumber = date.getDate();
    let month = date.getMonth();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let year = date.getFullYear();

    if(hour == 0){
        hour = "00";
    }else if (hour <= 9){
        hour = "0" + hour;
    }

    if(minutes == 0){
        minutes = "00";
    }else if (minutes <= 9){
        minutes = "0" + minutes;
    } 
    
    Array.from(timeElement).forEach(function(element, index, array) {
        element.textContent = hour + ":" + minutes + " 🕒";
    });

    Array.from(dateElement).forEach(function(element, index, array) {
        element.textContent = days[day] + " " + dateNumber + " de " + months[month] + " del " + year + " 📆";
    });
}