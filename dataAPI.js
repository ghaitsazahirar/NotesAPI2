import '../loading-indicator';
import '../main';

const notesData = 'https://notes-api.dicoding.dev/v2';

function dataAPI() {
    //getNotes non archived
    const getNotes = () => {
        const loadingIndicator = document.querySelector("loading-indicator");
        loadingIndicator.style.display = "block";
    
        let noteList = document.getElementById("note-list");
    
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
    const removeNotes = (note_Id) => {
        fetch(`${notesData}/notes/${note_Id}`, {
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
    //archivedNotes

    //unarchived
    

    const renderNotes = (notes, noteList) => {
        if (!noteList) {
            console.error("Cannot find note list element.");
            return; // Stop execution if noteList is null or undefined
        }
    
        if (notes && Array.isArray(notes)) {
            notes.forEach(note => {
                const noteItem = document.createElement("div");
                noteItem.classList.add("note-item");
                noteItem.innerHTML += `
                <style>
                    /* CSS styles */
                </style>
                <div class="col-lg-2 col-md-3 col-sm-4 col-6" style="margin-top: 12px;">
                    <div class="card">
                        <div class="card-body">
                            <div class="note-column">
                                <div class="note-item">
                                    <h5>(${note.id}) ${note.title}</h5>
                                    <p>${note.body}</p>
                                </div>
                                <button type="button" class="btn btn-danger button-delete" id="${note.id}">Delete</button>
                                <button type="button" class="btn btn-danger button-update" id="${note.id}">Update</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                noteList.appendChild(noteItem);
            });
        }
    };    
    
    const showErrorResponse = (errorMessage) => {
        console.error(errorMessage);
        alert(message);
    };
    

    const showResponseMessage = (message = 'Reload Your Page.') => {
        alert(message);
      };
      
    //    // Define noteList outside DOMContentLoaded
    //   console.log("noteList:", noteList);

    return {
        getNotes,
        createNotes,
        removeNotes,
        renderNotes,
        showResponseMessage
    };

}

export default dataAPI;