document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');
    const offlineStatus = document.getElementById('offline-status');
    
    // Проверка онлайн-статуса
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Загрузка заметок при запуске
    loadNotes();
    
    // Обработчик добавления заметки
    addNoteBtn.addEventListener('click', addNote);
    
    function addNote() {
      const noteText = noteInput.value.trim();
      if (noteText) {
        const newNote = {
          id: Date.now(),
          text: noteText,
          createdAt: new Date().toISOString()
        };
        
        saveNote(newNote);
        renderNote(newNote);
        noteInput.value = '';
      }
    }
    
    function saveNote(note) {
      let notes = getNotes();
      notes.push(note);
      localStorage.setItem('notes', JSON.stringify(notes));
    }
    
    function getNotes() {
      const notes = localStorage.getItem('notes');
      return notes ? JSON.parse(notes) : [];
    }
    
    function loadNotes() {
      const notes = getNotes();
      notes.forEach(note => renderNote(note));
    }
    
    function renderNote(note) {
      const noteElement = document.createElement('div');
      noteElement.className = 'note';
      noteElement.innerHTML = `
        <p>${note.text}</p>
        <div class="note-actions">
          <button class="delete-btn" data-id="${note.id}">Удалить</button>
        </div>
      `;
      
      notesList.appendChild(noteElement);
      
      // Добавляем обработчик удаления
      noteElement.querySelector('.delete-btn').addEventListener('click', () => {
        deleteNote(note.id);
        noteElement.remove();
      });
    }
    
    function deleteNote(noteId) {
      let notes = getNotes();
      notes = notes.filter(note => note.id !== noteId);
      localStorage.setItem('notes', JSON.stringify(notes));
    }
    
    function updateOnlineStatus() {
      if (navigator.onLine) {
        offlineStatus.classList.add('hidden');
      } else {
        offlineStatus.classList.remove('hidden');
      }
    }
  });