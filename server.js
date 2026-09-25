const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const notesFile = path.join(__dirname, "notes.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Read notes from JSON file
function readNotes() {
    try {
        const data = fs.readFileSync(notesFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save notes to JSON file
function saveNotes(notes) {
    fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
}

// GET all notes
app.get("/notes", (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

// POST a new note
app.post("/notes", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            error: "Title and content are required"
        });
    }

    const notes = readNotes();

    const newNote = {
        id: Date.now().toString(),
        title,
        content
    };

    notes.push(newNote);
    saveNotes(notes);

    res.status(201).json(newNote);
});

// DELETE a note
app.delete("/notes/:id", (req, res) => {
    const notes = readNotes();

    const filteredNotes = notes.filter(
        note => note.id !== req.params.id
    );

    if (filteredNotes.length === notes.length) {
        return res.status(404).json({
            error: "Note not found"
        });
    }

    saveNotes(filteredNotes);

    res.json({
        message: "Note deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
