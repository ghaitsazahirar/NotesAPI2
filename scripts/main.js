// import './data/data.js';
import dummyNotes from './data/data.js';
import dataAPI from "./data/dataAPI.js";

let displayNotesOutside;
document.addEventListener('DOMContentLoaded', function () {
  const noteList = document.getElementById('note-list');
  const inputId = document.querySelector('#inputNoteNum');
  const inputTitle = document.getElementById('inputNotesTitle');
  const inputDesc = document.getElementById('inputNotesBody');
  const btnSubmit = document.getElementById('buttonSave');

  
function displayNotes(notes) {
  console.log('displayNotes function is called with notes:', notes);
  noteList.innerHTML = ''; // Kosongkan noteList sebelum menampilkan catatan baru
  notes.forEach(note => {
    const noteElement = createNoteElement(note.id, note.title, note.body); // Menggunakan createNoteElement
    noteList.appendChild(noteElement);
  });
}

displayNotesOutside = displayNotes;

  const api = dataAPI(); // Panggil dataAPI() dan simpan instance-nya
  api.getNotes().then(notes => { // Gunakan then di sini
    displayNotes(notes);
  });


  const customValidationHandler = (event) => {
    event.target.setCustomValidity('');
  
    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Fill this.');
      return;
    }
  };
  
  const handleValidation = (event) => {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;
  
    const connectedValidationId = event.target.getAttribute('aria-describedby');
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;
  
    if (connectedValidationEl) {
      if (errorMessage && !isValid) {
        connectedValidationEl.innerText = errorMessage;
      } else {
        connectedValidationEl.innerText = '';
      }
    }
  }
  
  inputId.addEventListener('change', customValidationHandler);
  inputId.addEventListener('invalid', customValidationHandler);
  
  inputTitle.addEventListener('change', customValidationHandler);
  inputTitle.addEventListener('invalid', customValidationHandler);
  
  inputDesc.addEventListener('change', customValidationHandler);
  inputDesc.addEventListener('invalid', customValidationHandler);
  
  inputTitle.addEventListener('blur', handleValidation);
  inputDesc.addEventListener('blur', handleValidation);
  inputId.addEventListener('blur', handleValidation);

  noteList.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = inputId.value.trim();
    const title = inputTitle.value.trim();
    const body = inputDesc.value.trim();

    if (id && title && body) {
        dataAPI().createNotes(id, title, body)
            .then(() => {
                // Setelah berhasil menambahkan catatan, panggil API untuk mendapatkan catatan yang diperbarui
                return dataAPI().getNotes();
            })
            .then(notes => {
                // Setelah mendapatkan catatan yang diperbarui, perbarui tampilan
                displayNotes(notes);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Tambahkan catatan baru ke dalam tampilan
        const noteElement = createNoteElement(id, title, body);
        noteList.appendChild(noteElement);

        inputId.value = '';
        inputTitle.value = '';
        inputDesc.value = '';
    }
});


btnSubmit.addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const id = inputId.value.trim();
  const title = inputTitle.value.trim();
  const body = inputDesc.value.trim();
  if (id && title && body) {
    dataAPI().createNotes(id, title, body)
      .then(() => {
        return dataAPI().getNotes();
      })
      .then(notes => {
        displayNotes(notes);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    inputId.value = '';
    inputTitle.value = '';
    inputDesc.value = '';
  }
});



function createNoteElement(id, title, body) {
  const ElementNotesData = document.createElement('div');
  ElementNotesData.classList.add('note-list');
  ElementNotesData.setAttribute('data-id', id);
  ElementNotesData.setAttribute('data-title', title);
  ElementNotesData.setAttribute('data-desc', body);

  const ElementNote = document.createElement('div');
  ElementNote.classList.add('note');

  const idElement = document.createElement('h2');
  idElement.textContent = id;

  const titleElement = document.createElement('h2');
  titleElement.textContent = title;

  const bodyElement = document.createElement('p');
  bodyElement.textContent = body;

  ElementNote.appendChild(idElement);
  ElementNote.appendChild(titleElement);
  ElementNote.appendChild(bodyElement);

  ElementNotesData.appendChild(ElementNote);

  noteList.appendChild(ElementNotesData); // Menambahkan catatan baru ke dalam tampilan DOM
  console.log('New note element added to noteList:', ElementNotesData);
  return ElementNotesData;
}

console.log(createNoteElement);

function createNoteDummyElement(noteData) {
  const { id, title, body } = noteData;

  const ElementNote = document.createElement('note-item');
  ElementNote.setNote({ id, title, body });

  const ElementNotesData = document.createElement('div');
  ElementNotesData.classList.add('note-list');
  ElementNotesData.setAttribute('data-id', id);
  ElementNotesData.setAttribute('data-title', title);
  ElementNotesData.setAttribute('data-desc', body);

  const elementNote = document.createElement('div');
  elementNote.classList.add('note');

  const idElement = document.createElement('h2');
  idElement.textContent = id;

  const titleElement = document.createElement('h2');
  titleElement.textContent = title;

  const bodyElement = document.createElement('p');
  bodyElement.textContent = body;

  elementNote.appendChild(idElement);
  elementNote.appendChild(titleElement);
  elementNote.appendChild(bodyElement);

  ElementNotesData.appendChild(ElementNote);

  return ElementNotesData;
}


  function loadNotesFromDummyData() {
    dummyNotes.forEach(note => {
      const noteElement = createNoteDummyElement(note);
      const noteListShadow = noteList.shadowRoot;
      noteListShadow.appendChild(noteElement);
    });
  }
  console.log(dummyNotes);
  console.log(noteList);
  loadNotesFromDummyData();
}); 

function removeNoteFromList(noteElement) {
  noteElement.remove();
  // Panggil getNotes untuk mengambil data terbaru dari API setelah menghapus catatan
  dataAPI().getNotes().then(notes => {
    displayNotesOutside(notes);
  });
}

class NoteItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.handleDelete = this.handleDelete.bind(this);
    }
  
    setNote(note) {
      this.note = note;
      this.render();
    }
  
    handleDelete() {
      const note_Id = this.note.id;
      dataAPI().removeNotes(note_Id);
      this.remove();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
      <style>
      .note-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }
    
      .note-item {
          flex: 1;
          padding: 10px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 10px;
      }
    
      .note-item h5, .note-item p {
          margin: 0;
          font-size: 16px;
      }
    
      .note-item h5 {
          margin-bottom: 5px; /* Tambahkan margin-bottom di sini */
      }
      </style>
    
      <div class="col-lg-2 col-md-3 col-sm-4 col-6" style="margin-top: 12px;">
          <div class="card">
              <div class="card-body">
                  <div class="note-column">
                      <div class="note-item">
                          <h5>(${this.note.id}) ${this.note.title}</h5>
                          <p>${this.note.body}</p>
                      </div>
                      <button type="button" class="btn btn-danger button-delete">Delete</button>
                      <button type="button" class="btn btn-danger button-update">Update</button>
                  </div>
              </div>
          </div>
      </div>
      `;
    
      
const buttonDelete = this.shadowRoot.querySelector('.button-delete');
buttonDelete.addEventListener('click', () => {
    removeNoteFromList(this.parentNode); // Menghapus catatan dari DOM
    this.handleDelete();
});

    }
  }
  

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

}
customElements.define('note-item', NoteItem);
customElements.define('note-list', NoteList);
