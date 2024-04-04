import './note-item';
import './note-list';
import dummyNotes from "./data/data";

function main (){
    const notesData = 'https://notes-api.dicoding.dev/v2#/';
    const getNotes = () => {
        fetch(notesData + '/notes')
           .then(response => response.json())
           .then(notes => {
                dummyNotes.unshift(createNotes());
                renderNotes(notes);
            })
           .catch(error => {
                showErrorResponse(error);
            });
    };

    const createNotes = () => {
        fetch(`${notesData}/notes`, {
            method: 'POST', 
            title: JSON.stringify(inputNotesTitle),
            body: JSON.stringify(inputNotesBody)
        })
        .then(response => {
            return response.json();
        })
        .then(responeJson => {
            if(responeJson.error){
                showErrorResponse(responseJson.message);
            }
            else{
                renderNotes(responeJson.notes)
            }
        })
        .catch(error => {
            showErrorResponse(error);
        });
    };

    const removeNotes = (NotesId) => {
        fetch(`${notesData}/delete/${NotesId}`, {
          method: 'DELETE'
        })
        .then(response => {
          return response.json();
        })
        .then(responseJson => {
          showErrorResponse(responseJson.message);
          getNotes();
        })
        .catch(error => {
          showErrorResponse(error);
        });
      };

      const ArchivedNotes = async (notes) => {
        try {
          archivedNotes = archivedNotes.concat(notes);
          notes = notes.filter((note) => note.id !== notesId);
          await fetch(`https://notes-api.dicoding.dev/v2/notes/archived`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': '12345'
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

    const showErrorResponse = (message = 'Reload this page') => {
        alert(message);
    };

    const renderNotes = (notes) => {
        const noteItem = document.querySelectorAll('note-item');

        noteItem.forEach((noteItem, index) => {
            noteItem.note = notes;
            const shadowRoot = noteItem.shadowRoot;

            const notesItem = shadowRoot.querySelector('note-item');
            notesItem.forEach((notesItem, index) => {
                const deleteButton = notesItem.querySelector('.btnDelete');

                if(deleteButton){
                    deleteButton.addEventListener("click", () => {
                        removeNotes(noteItem.getNotes[index].id);
                    })
                }
            })
        })
    }

    document.addEventListener('DOMContentLoaded', function () {
        const noteList = document.getElementById('note-list');
        const nomerInput = document.getElementById('inputNotesNum')
        const judulInput = document.getElementById('inputNotesTitle');
        const descInput = document.getElementById('inputNotesBody');
        const btnSubmit = document.getElementById('buttonSave');
      
        loadNotesFromStorage();
      
        noteList.addEventListener('submit', (event) => {
          event.preventDefault();
          const number = nomerInput.value.trim();
          const title = judulInput.value.trim();
          const body = descInput.value.trim();
      
          if (number && title && body) {
            const note = { number, title, body };
            dummyNotes.unshift(note);
      
            const noteElement = createNotes(number, title, body);
            const noteListShadow = noteList.shadowRoot;
            noteListShadow.prepend(noteElement);
      
            nomerInput.value = '';
            judulInput.value = '';
            descInput.value = '';
      
            saveNoteToStorage(number, title, body);
          }
        });
      
        btnSubmit.addEventListener('click', function(){
            const number = nomerInput.value.trim();
            const title = judulInput.value.trim();
            const body = descInput.value.trim();
      
          if (number && title && body) {
            const note = { number, title, body };
            dummyNotes.unshift(note);
      
            const noteElement = createNotes(number, title, body);
            const noteListShadow = noteList.shadowRoot;
            noteListShadow.prepend(noteElement);
      
            nomerInput.value = '';
            judulInput.value = '';
            descInput.value = '';
      
            saveNoteToStorage(number, title, body);
          }
        });
      
        function saveNoteToStorage(number, title, body) {
          const notes = JSON.parse(localStorage.getItem('notes')) || [];
          notes.push({ nomer: number, judul: title, deskripsi: body });
          localStorage.setItem('notes', JSON.stringify(notes));
      
          console.log(`new notes with number '${number}' and title '${title}' added.`);
        }
      
        function loadNotesFromStorage() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.forEach(note => {
    const noteElement = document.createElement('note-item');
    noteElement.setNote({ number: note.nomer, title: note.judul, body: note.deskripsi });
    noteList.appendChild(noteElement);
  });
}
      
    function createNoteDummyElement(notesData) {
          const { number, title, body } = notesData;
      
          const ElementNote = document.createElement('note-item');
          ElementNote.setNote({ title, body });
      
          const ElementNotesData = document.createElement('div');
          ElementNotesData.classList.add('note-list');
          ElementNotesData.setAttribute('data-number', number);
          ElementNotesData.setAttribute('data-title', title);
          ElementNotesData.setAttribute('data-desc', body);
      
          const elementNote = document.createElement('div');
          elementNote.classList.add('note');
      
          const numberElement = document.createElement('h5');
          numberElement.textContent = number;

          const titleElement = document.createElement('h2');
          titleElement.textContent = title;
      
          const bodyElement = document.createElement('p');
          bodyElement.textContent = body;

      
          elementNote.appendChild(numberElement);
          elementNote.appendChild(titleElement);
          elementNote.appendChild(bodyElement);
      
          ElementNotesData.appendChild(ElementNote);
      
          return ElementNotesData;
        }
      
        function loadNotesFromDummyData() {
            dummyNotes.forEach(note => {
            const noteElement = createNoteDummyElement(note);
            // const noteListShadow = noteList.shadowRoot;
            noteList.appendChild(noteElement);
          });
        }
        console.log(notesData);
        loadNotesFromDummyData();
      
      });
}

export default main;
