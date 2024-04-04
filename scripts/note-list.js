class NoteList extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }
      }

      customElements.define('note-list', NoteList);