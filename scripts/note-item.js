class NoteItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
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

  customElements.define('note-item', NoteItem);