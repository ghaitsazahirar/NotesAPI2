import "./loading-indicator";
import "../styles/main.css";
import dummyNotes from "./data/data";

const notesData = 'https://notes-api.dicoding.dev/v2';

function main() {

    //getNotes non archived
    const getNotes = () => {
        const loadingIndicator = document.querySelector("loading-indicator");
        loadingIndicator.style.display = "block";
    
        // const noteList = document.getElementById("note-list");
    
        fetch(`${notesData}/notes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to retrieve notes');
            }
            return response.json();
        })
        .then(responseJson => {
            renderNotes(responseJson.data, noteList); // Pass noteList as an argument
        })
        .catch(error => {
            showErrorResponse(error.message);
        })
        .finally(() => {
            loadingIndicator.style.display = "none";
        });
    };
    
    

    //createNotes
    const createNotes = async (id, title, body) => {
        try {
            const response = await fetch(`${notesData}/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title, // Adjust payload format according to API docs
                    body: body,   // Adjust payload format according to API docs
                }),
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            const addNotes = await response.json();
            renderNotes([addNotes]);
            // Assuming there's a function `showNotesToLocalStorage` defined somewhere
            // showNotesToLocalStorage([addNotes]);
        } catch (error) {
            showErrorResponse(error.message);
        }
    };
    

    //deleteNotes
    const removeNotes = (noteId) => {
        fetch(`${notesData}/delete/${noteId}`, {
          method: 'DELETE',
        })
        .then(response => {
          return response.json();
        })
        .then(responseJson => {
          showResponseMessage(responseJson.message);
          getNotes();
        })
        .catch(error => {
          showResponseMessage(error);
        });
      };
    //get single notes
    const getSingleNotes = (note) => {
        fetch(`${notesData}/${note.id}`, {
          method: 'GET',
        })
        .then(response => {
          return response.json();
        })
        .then(responseJson => {
          if (responseJson.error) {
            showResponseMessage(responseJson.message);
          } else {
            renderAllBooks(responseJson.note);
          }
        })
        .catch(error => {
          showResponseMessage(error);
        });
      };

    //archivedNotes
    const archivedNotes = async (notes) => {
        const notesId = document.getElementById('src/index.html');
        try {
          const archivedNotes = [];
          notes = notes.filter((note) => {
            if (note.id !== notesId) {
              archivedNotes.push(notes);
              return false;
            } else {
              return true;
            }
          });
          await fetch(`https://notes-api.dicoding.dev/v2/notes/archived`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": "12345",
            },
            body: JSON.stringify({ notes }),
          });
          renderNotes(notes);
          saveNotesToLocalStorage(notes);
          saveArchivedNotesToLocalStorage(archivedNotes);
        } catch (error) {
          console.error(error);
        }
    
    };

    //unarchived
    const unArchivedNotes = () => {
        fetch(`${notesData}/${notesId}/unarchived`, {
            method: 'POST'
        , body: JSON.stringify(notes)
        })
        .then(response => {
          return response.json();
        })
        .then(responseJson => {
          if (responseJson.error) {
            showResponseMessage(responseJson.message);
          } else {
            renderAllBooks(responseJson.notes);
          }
        })
        .catch(error => {
          showResponseMessage(error);
        });
    };

    const renderNotes = (notes, noteList) => {
        if (notes && Array.isArray(notes)) {
            notes.forEach(note => {
                const noteItem = document.createElement("div");
                noteItem.classList.add("note-item");
                noteItem.innerHTML += `
                <div class="note-item">
                  <h3>${note.id}</h3>
                  <br>
                  <h1>${note.title}</h1>
                  <br>
                  <p>${note.body}</p>
                  <div class="form-group">
                    <button id="${note.id}" class="btnDelete">Delete</button>
                  </div>
                </div>`;
                noteList.appendChild(noteItem);
            });
        }
    
        const buttons = noteList.querySelectorAll('.btnDelete');
        buttons.forEach(button => {
            button.addEventListener('click', event => {
                const noteId = event.target.id;
                removeNotes(noteId);
            });
        });
    };
    


    const showResponseMessage = (message = 'Reload Your Page.') => {
        alert(message);
      };
      
      const noteList = document.getElementById("note-list"); // Define noteList outside DOMContentLoaded
      console.log("noteList:", noteList);

      document.addEventListener("DOMContentLoaded", function () {
        const noteList = document.getElementById("note-list");
          const nomerInput = document.getElementById("inputNotesNum");
          const judulInput = document.getElementById("inputNotesTitle");
          const descInput = document.getElementById("inputNotesBody");
          const btnSubmit = document.getElementById("buttonSave");
      
          getNotes();
      
          noteList.addEventListener("submit", (event) => {
              event.preventDefault();
              const id = nomerInput.value.trim();
              const title = judulInput.value.trim();
              const body = descInput.value.trim();
      
              if (id && title && body) {
                  const note = { id, title, body };
                  dummyNotes.unshift(note);
      
                  const noteElement = createNotes(id, title, body);
                  noteList.prepend(noteElement);
      
                  nomerInput.value = "";
                  judulInput.value = "";
                  descInput.value = "";
      
                  renderNotes(dummyNotes, noteList);
                  saveNoteToStorage(id, title, body);
              }
          });
      
          btnSubmit.addEventListener("click", function () {
              const id = nomerInput.value.trim();
              const title = judulInput.value.trim();
              const body = descInput.value.trim();
      
              if (id && title && body) {
                  const note = { id, title, body };
                  dummyNotes.unshift(note);
                  createNotes(id, title, body);
      
                  const noteElement = createNotes(id, title, body);
                  noteList.prepend(noteElement);
      
                  nomerInput.value = "";
                  judulInput.value = "";
                  descInput.value = "";
      
                  saveNoteToStorage(id, title, body);
                  console.log(note);
              }
          });
      
          function saveNoteToStorage(id, title, body) {
              const notes = JSON.parse(localStorage.getItem("notes")) || [];
              notes.push({ nomer: id, judul: title, deskripsi: body });
              localStorage.setItem("notes", JSON.stringify(notes));
      
              console.log(
                  `new notes with id '${id}' and title '${title}' added.`,
              );
          }
      
          function loadNotesFromStorage() {
              const notes = JSON.parse(localStorage.getItem("notes")) || [];
              notes.forEach((notes) => {
                  const noteElement = document.createElement("note-item");
                  noteElement.setNote({
                      id: notes.id,
                      title: notes.judul,
                      body: notes.deskripsi,
                  });
                  noteList.appendChild(noteElement);
              });
          }
      
          function loadNotesFromLocalStorage() {
              const notes = JSON.parse(localStorage.getItem("notes")) || [];
              notes.forEach((note) => {
                  const noteElement = document.createElement("note-item");
                  noteElement.setNote(note);
                  noteList.appendChild(noteElement);
              });
          }
      
          function loadArchivedNotesFromLocalStorage() {
              const archivedNotes = JSON.parse(localStorage.getItem("archivedNotes")) || [];
              archivedNotes.forEach((note) => {
                  const noteElement = document.createElement("note-item");
                  noteElement.setNote(note);
                  noteList.appendChild(noteElement);
              });
          }
          loadNotesFromLocalStorage();
          loadArchivedNotesFromLocalStorage();
      
          function createNoteDummyElement(notesData) {
              const { id, title, body } = notesData;
      
              const ElementNote = document.createElement("note-item");
              ElementNote.setNote({ id, title, body });
      
              const ElementNotesData = document.createElement("div");
              ElementNotesData.classList.add("note-list");
              ElementNotesData.setAttribute("data-id", id);
              ElementNotesData.setAttribute("data-title", title);
              ElementNotesData.setAttribute("data-desc", body);
      
              const elementNote = document.createElement("div");
              elementNote.classList.add("note");
      
              const numberElement = document.createElement("h5");
              numberElement.textContent = id;
      
              const titleElement = document.createElement("h2");
              titleElement.textContent = title;
      
              const bodyElement = document.createElement("p");
              bodyElement.textContent = body;
      
              elementNote.appendChild(numberElement);
              elementNote.appendChild(titleElement);
              elementNote.appendChild(bodyElement);
      
              ElementNotesData.appendChild(ElementNote);
      
              return ElementNotesData;
          }
      
          function loadNotesFromDummyData() {
              dummyNotes.forEach((note) => {
                  const noteElement = createNoteDummyElement(note);
                  // const noteListShadow = noteList.shadowRoot;
                  noteList.appendChild(noteElement);
              });
          }
      
          console.log(dummyNotes);
          loadNotesFromDummyData();
      });
      
      const showErrorResponse = (message = "Reload this page") => {
          alert(message);
      };
      
    }



class NoteList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  }

  class NoteItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    setNote(note) {
      this.note = note;
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
        .note-item {
                display: grid;
                grid-template-areas: 
                'h2'
                'p';
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 10px;
                padding: 10px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                font-size: 30px;
              }
    
              h2{
                font-size: 30px;
              }
    
              p{
                font-size: 20px;
              }
    
              .note-item > div {
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 10px;
                padding: 20px;
    
                font-size: 30px;
            }
    
            .note-item > div h2, .note-item > div p {
                margin: 0;
                font-size: 30px;
            }
            </style>
    
            <div class="note-item">
                <h3>${this.note.id}</h3>
                  <br>
                <h2>${this.note.title}</h2>
                <br>
                <p>${this.note.body}</p>
                <div class="form-group">
                <button id="buttonDelete" class="btnDelete">Delete</button>
                <button id="buttonArchived" class="btnUpdate">Update</button>
            </div>
            </div>
          `;
    }
  }
  
customElements.define("note-item", NoteItem);  
customElements.define("note-list", NoteList);  
export default main;
