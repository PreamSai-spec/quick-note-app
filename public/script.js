const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");

// Get notes from backend
async function loadNotes() {
    try {
        const response = await fetch("/notes");

        const notes = await response.json();

        displayNotes(notes);

    } catch (error) {
        console.error("Error loading notes:", error);
    }
}


// Display notes on the page
function displayNotes(notes) {

    notesContainer.innerHTML = "";

    if (notes.length === 0) {
        notesContainer.innerHTML =
            "<p>No notes yet. Create your first note!</p>";

        return;
    }

    notes.forEach(note => {

        const noteElement = document.createElement("div");

        noteElement.className = "note";

        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>

            <button
                class="delete-btn"
                onclick="deleteNote('${note.id}')"
            >
                Delete
            </button>
        `;

        notesContainer.appendChild(noteElement);

    });
}


// Add a new note
async function addNote() {

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {

        alert("Please enter both title and content.");

        return;
    }

    try {

        const response = await fetch("/notes", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                content
            })

        });

        if (!response.ok) {
            throw new Error("Failed to create note");
        }

        titleInput.value = "";
        contentInput.value = "";

        loadNotes();

    } catch (error) {

        console.error("Error adding note:", error);

    }
}


// Delete a note
async function deleteNote(id) {

    try {

        const response = await fetch(`/notes/${id}`, {

            method: "DELETE"

        });

        if (!response.ok) {
            throw new Error("Failed to delete note");
        }

        loadNotes();

    } catch (error) {

        console.error("Error deleting note:", error);

    }
}


// Button event
addNoteBtn.addEventListener("click", addNote);


// Load notes when page opens
loadNotes();
