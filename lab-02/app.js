const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "bookstore.db");
let db;

const isValidBook = ({ title, author, price, pages }) =>
  typeof title === "string" &&
  title.trim().length > 0 &&
  typeof author === "string" &&
  author.trim().length > 0 &&
  Number.isInteger(price) &&
  price >= 0 &&
  Number.isInteger(pages) &&
  pages > 0;

// GET /books/ - Get all books
app.get("/books/", async (request, response) => {
  try {
    const books = await db.all("SELECT * FROM book ORDER BY id");
    response.status(200).send(books);
  } catch (error) {
    console.error("GET /books/ failed:", error.message);
    response.status(500).send({ error: "Unable to fetch books" });
  }
});

// GET /books/:bookId/ - Get one book
app.get("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const book = await db.get("SELECT * FROM book WHERE id = ?", [bookId]);

    if (!book) {
      return response.status(404).send({ error: "Book not found" });
    }

    response.status(200).send(book);
  } catch (error) {
    console.error("GET /books/:bookId/ failed:", error.message);
    response.status(500).send({ error: "Unable to fetch book" });
  }
});

// POST /books/ - Add a book
app.post("/books/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body ?? {};

    if (!isValidBook({ title, author, price, pages })) {
      return response.status(400).send({
        error:
          "Provide a non-empty title and author, a non-negative integer price, and a positive integer pages value",
      });
    }

    const result = await db.run(
      "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
      [title.trim(), author.trim(), price, pages],
    );

    const newBook = await db.get("SELECT * FROM book WHERE id = ?", [
      result.lastID,
    ]);
    response.status(201).send(newBook);
  } catch (error) {
    console.error("POST /books/ failed:", error.message);
    response.status(500).send({ error: "Unable to add book" });
  }
});

// PUT /books/:bookId/ - Update a book
app.put("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body ?? {};

    if (!isValidBook({ title, author, price, pages })) {
      return response.status(400).send({
        error:
          "Provide a non-empty title and author, a non-negative integer price, and a positive integer pages value",
      });
    }

    const existingBook = await db.get("SELECT * FROM book WHERE id = ?", [
      bookId,
    ]);
    if (!existingBook) {
      return response.status(404).send({ error: "Book not found" });
    }

    await db.run(
      "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?",
      [title.trim(), author.trim(), price, pages, bookId],
    );

    const updatedBook = await db.get("SELECT * FROM book WHERE id = ?", [
      bookId,
    ]);
    response.status(200).send(updatedBook);
  } catch (error) {
    console.error("PUT /books/:bookId/ failed:", error.message);
    response.status(500).send({ error: "Unable to update book" });
  }
});

// DELETE /books/:bookId/ - Delete a book
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const existingBook = await db.get("SELECT * FROM book WHERE id = ?", [
      bookId,
    ]);

    if (!existingBook) {
      return response.status(404).send({ error: "Book not found" });
    }

    await db.run("DELETE FROM book WHERE id = ?", [bookId]);
    response.status(200).send({
      message: "Book deleted successfully",
      book: existingBook,
    });
  } catch (error) {
    console.error("DELETE /books/:bookId/ failed:", error.message);
    response.status(500).send({ error: "Unable to delete book" });
  }
});

async function initializeDBAndServer() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL CHECK (price >= 0),
        pages INTEGER NOT NULL CHECK (pages > 0)
      );
    `);

    const result = await db.get("SELECT COUNT(*) AS count FROM book");
    if (result.count === 0) {
      const initialBooks = [
        ["The Alchemist", "Paulo Coelho", 250, 208],
        ["Wings of Fire", "A. P. J. Abdul Kalam", 300, 180],
        ["Atomic Habits", "James Clear", 450, 320],
        ["The Hobbit", "J. R. R. Tolkien", 350, 310],
        ["Rich Dad Poor Dad", "Robert Kiyosaki", 280, 336],
        ["1984", "George Orwell", 220, 328],
        ["Deep Work", "Cal Newport", 400, 296],
        ["Ikigai", "Hector Garcia", 200, 194],
      ];

      const insert = await db.prepare(
        "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
      );
      try {
        for (const book of initialBooks) {
          await insert.run(book);
        }
      } finally {
        await insert.finalize();
      }
    }

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (error) {
    console.error("Database/server initialization failed:", error.message);
    process.exit(1);
  }
}

initializeDBAndServer();
