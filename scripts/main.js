import "../styles/main.css";
import "./note-item";
import "./note-list";
import dummyNotes from "./data/data";

const notesData = "https://notes-api.dicoding.dev/v2";

function main() {
  const getNotes = async () => {
    try {
      const response = await fetch(`${notesData}/notes`);
      if (!response.ok) throw new Error(response.statusText);
      const notes = await response.json();
      renderNotes(notes);
    } catch (error) {
      showErrorResponse(error);
    }
  };

  const createNotes = async (title, body) => {
    try {
      const response = await fetch(`${notesData}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });
      if (!response.ok) throw new Error(response.statusText);
      const createdNote = await response.json();
      renderNotes([createdNote]);
    } catch (error) {
      showErrorResponse(error);
    }
  };

  const removeNotes = async (notesId) => {
    try {
      const response = await fetch(`${notesData}/delete/${notesId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(response.statusText);
      getNotes();
    } catch (error) {
      showErrorResponse(error);
    }
  };

  const ArchivedNotes = async (notes) => {
    try {
      archivedNotes = archivedNotes.concat(notes);
      notes = notes.filter((note) => note.id !== notesId);
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

  const showErrorResponse = (message = "Reload this page") => {
    alert(message);
  };

  const renderNotes = (notes) => {
    const noteItem = Array.from(document.querySelectorAll("note-item"));
  
    noteItem.forEach((noteItem, index) => {
      noteItem.note = notes;
  
      // Add a null check before calling querySelector on shadowRoot
      if (noteItem.shadowRoot) {
        const notesItem = noteItem.shadowRoot.querySelector("note-item");
        notesItem.forEach((notesItem, index) => {
          const deleteButton = notesItem.querySelector(".btnDelete");
  
          if (deleteButton) {
            deleteButton.addEventListener("click", () => {
              removeNotes(noteItem.getNotes[index].id);
            });
          }
        });
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    const noteList = document.getElementById("note-list");
    const nomerInput = document.getElementById("inputNotesNum");
    const judulInput = document.getElementById("inputNotesTitle");
    const descInput = document.getElementById("inputNotesBody");
    const btnSubmit = document.getElementById("buttonSave");

    getNotes();
    loadNotesFromStorage();

    noteList.addEventListener("submit", (event) => {
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

        nomerInput.value = "";
        judulInput.value = "";
        descInput.value = "";

        renderNotes(dummyNotes);
        saveNoteToStorage(number, title, body);
      }
    });

    btnSubmit.addEventListener("click", function () {
      const number = nomerInput.value.trim();
      const title = judulInput.value.trim();
      const body = descInput.value.trim();

      if (number && title && body) {
        const note = { number, title, body };
        dummyNotes.unshift(note);

        const noteElement = createNotes(number, title, body);
        const noteListShadow = noteList.shadowRoot;
        noteListShadow.prepend(noteElement);

        nomerInput.value = "";
        judulInput.value = "";
        descInput.value = "";

        saveNoteToStorage(number, title, body);
      }
    });

    function saveNoteToStorage(number, title, body) {
      const notes = JSON.parse(localStorage.getItem("notes")) || [];
      notes.push({ nomer: number, judul: title, deskripsi: body });
      localStorage.setItem("notes", JSON.stringify(notes));

      console.log(
        `new notes with number '${number}' and title '${title}' added.`,
      );
    }

    function loadNotesFromStorage() {
      const notes = JSON.parse(localStorage.getItem("notes")) || [];
      notes.forEach((notes) => {
        const noteElement = document.createElement("note-item");
        noteElement.setNote({
          number: notes.nomer,
          title: notes.judul,
          body: notes.deskripsi,
        });
        noteList.appendChild(noteElement);
      });
    }

    function createNoteDummyElement(notesData) {
      const { number, title, body } = notesData;

      const ElementNote = document.createElement("note-item");
      ElementNote.setNote({ number, title, body });

      const ElementNotesData = document.createElement("div");
      ElementNotesData.classList.add("note-list");
      ElementNotesData.setAttribute("data-number", number);
      ElementNotesData.setAttribute("data-title", title);
      ElementNotesData.setAttribute("data-desc", body);

      const elementNote = document.createElement("div");
      elementNote.classList.add("note");

      const numberElement = document.createElement("h5");
      numberElement.textContent = number;

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
}

export default main;
