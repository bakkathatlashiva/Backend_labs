# Lab 2: SQLite Database and CRUD Routes

## Course Information

| Field      | Details                          |
| ---------- | -------------------------------- |
| Course     | Backend Development Fundamentals |
| Year/Term  | Year II, Term II                 |
| University | Aurora Deemed to be University   |
| Faculty    | Mr. Joel Prashanth D             |

## Student Details

| Field               | Details           |
| ------------------- | ----------------- |
| Name                | Bakkathatla Shiva |
| Registration Number | 252U1R9175        |
| Section             | S-26              |

## Project Overview

This project connects an Express.js server to an SQLite database and exposes HTTP routes for performing Create, Read, Update, and Delete (CRUD) operations on book records.

**Live deployment URL:** `[Not deployed yet]`

## Project Objective

To connect an Express.js server to an SQLite database and implement CRUD operations over HTTP using asynchronous database operations, parameterized SQL queries, input validation, and appropriate HTTP status codes.

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- `sqlite3`
- `sqlite`
- [Nodemon](https://nodemon.io/)
- [Postman](https://www.postman.com/)

## Features

1. Initializes the SQLite database and creates the `book` table if it does not exist.
2. Inserts eight sample book records when the table is empty.
3. Retrieves all books.
4. Retrieves a single book by ID.
5. Adds a new book.
6. Updates an existing book.
7. Deletes a book.
8. Uses `async`/`await` for database operations.
9. Uses parameterized SQL queries with `?` placeholders to help prevent SQL injection.
10. Validates request data, returns appropriate HTTP status codes, and handles database errors.

## Database Schema

The `book` table contains the following columns:

| Column   | Type      | Description                     |
| -------- | --------- | ------------------------------- |
| `id`     | `INTEGER` | Primary key with auto-increment |
| `title`  | `TEXT`    | Book title; required            |
| `author` | `TEXT`    | Book author; required           |
| `price`  | `INTEGER` | Non-negative book price         |
| `pages`  | `INTEGER` | Positive number of pages        |

## API Endpoints

| Method   | Endpoint          | Description             | Success Status |
| -------- | ----------------- | ----------------------- | -------------: |
| `GET`    | `/books/`         | Retrieve all books      |          `200` |
| `GET`    | `/books/:bookId/` | Retrieve a book by ID   |          `200` |
| `POST`   | `/books/`         | Add a new book          |          `201` |
| `PUT`    | `/books/:bookId/` | Update an existing book |          `200` |
| `DELETE` | `/books/:bookId/` | Delete a book           |          `200` |

### Request Body

`POST /books/` and `PUT /books/:bookId/` require a JSON request body with the following fields:

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 500,
  "pages": 464
}
```

The `title` and `author` must be non-empty strings. The `price` must be a non-negative integer, and `pages` must be a positive integer.

### Response and Error Status Codes

| Situation                           |                 Status Code |
| ----------------------------------- | --------------------------: |
| Successful `GET` request            |                    `200 OK` |
| Successful `POST` request           |               `201 Created` |
| Successful `PUT` request            |                    `200 OK` |
| Successful `DELETE` request         |                    `200 OK` |
| Invalid input                       |           `400 Bad Request` |
| Book not found                      |             `404 Not Found` |
| Unexpected server or database error | `500 Internal Server Error` |

## Project Structure

```text
lab-02/
├── app.js
├── bookstore.db
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
└── screenshots/
    ├── get-all-books.png
    ├── get-single-book.png
    ├── post-book.png
    ├── put-book.png
    ├── delete-book.png
    └── database-view.png
```

## Installation and Running

### Prerequisites

- Node.js and npm installed on the system.
- Postman installed for API testing.

### Install dependencies

Open a terminal in the `lab-02` directory and run:

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

The SQLite database is initialized automatically by `app.js`. On startup, the application creates the `book` table if necessary and inserts the eight sample records only when the table is empty.

The `start` script can also be used to run the application without Nodemon:

```bash
npm start
```

## Postman Testing

1. Start the server with `npm run dev`.
2. Open Postman.
3. Create requests using `http://localhost:3000` as the base URL.
4. For `POST` and `PUT` requests, select **Body** → **raw** → **JSON** and use the sample request body shown below.
5. Send each request and verify the response body and status code.

### 1. Retrieve all books

- **Method:** `GET`
- **URL:** `http://localhost:3000/books/`
- **Expected status:** `200 OK`

### 2. Retrieve a single book

- **Method:** `GET`
- **URL:** `http://localhost:3000/books/1/`
- **Expected status:** `200 OK`

Replace `1` with the ID of the book to retrieve. An ID that does not exist returns `404 Not Found`.

### 3. Add a new book

- **Method:** `POST`
- **URL:** `http://localhost:3000/books/`
- **Header:** `Content-Type: application/json`
- **Expected status:** `201 Created`

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 500,
  "pages": 464
}
```

### 4. Update an existing book

- **Method:** `PUT`
- **URL:** `http://localhost:3000/books/1/`
- **Header:** `Content-Type: application/json`
- **Expected status:** `200 OK`

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 500,
  "pages": 464
}
```

Replace `1` with the ID of the book to update. The request body contains the complete updated book record.

### 5. Delete a book

- **Method:** `DELETE`
- **URL:** `http://localhost:3000/books/1/`
- **Expected status:** `200 OK`

Replace `1` with the ID of the book to delete. An ID that does not exist returns `404 Not Found`.

### Invalid-input testing

Send an incomplete or invalid request body to `POST /books/` or `PUT /books/:bookId/`, for example:

```json
{
  "title": "",
  "author": "Robert C. Martin",
  "price": -10,
  "pages": 0
}
```

The expected response status is `400 Bad Request`.

## REST Client Testing and Screenshot Capture

This project includes [`app.http`](./app.http), which can be used with the **REST Client** extension in VS Code. The six request blocks are separated with `###`, so each request can be executed independently.

### Run the requests

1. Open the `lab-02` folder in VS Code.
2. Make sure the server is running:

   ```bash
   npm run dev
   ```

3. Open [`app.http`](./app.http).
4. Hover over the request you want to test and select **Send Request**.
5. REST Client opens the response in a VS Code editor tab. Confirm the status line and response body before taking the screenshot.
6. To repeat a request, select **Send Request** for that request block again.

Run the request blocks in this order:

| Screenshot | Request block | Expected result |
| --- | --- | --- |
| `get-all-books.png` | `GET http://localhost:3000/books/` | `200 OK` and a JSON array |
| `get-single-book.png` | `GET http://localhost:3000/books/1/` | `200 OK` and one book object |
| `post-book.png` | `POST http://localhost:3000/books/` | `201 Created` and the created book |
| `put-book.png` | `PUT http://localhost:3000/books/1/` | `200 OK` and the updated book |
| `delete-book.png` | `DELETE http://localhost:3000/books/1/` | `200 OK` and a deletion confirmation |

The `POST` request includes the sample JSON body in `app.http`. The `PUT` request includes an updated JSON body. If the `PUT` or `DELETE` request is run after deleting book ID `1`, first recreate a test book or change the ID to an existing book so the response can be captured with the expected status.

### Capture and save the endpoint screenshots

The screenshots must show the actual REST Client response in VS Code, including the request URL, HTTP status, and response JSON. Do not create or edit an image to imitate a response.

1. Execute one request and verify its expected response.
2. Keep the REST Client response visible in VS Code.
3. Press **Win + Shift + S** to open Windows Snipping Tool.
4. Select the area containing the VS Code request/response and status line.
5. Select the notification preview to open the capture, then use **Save**.
6. Save the PNG in `lab-02/screenshots/` using exactly the corresponding filename from the table above.
7. If Windows asks whether to replace an existing file, choose **Cancel**. Use a different temporary name, verify that it is the real capture, and then replace the zero-byte placeholder only if you explicitly intend to do so.
8. Repeat for all five endpoint requests.

### Capture the SQLite database view

1. Stop or leave the server running; the database file is available at `lab-02/bookstore.db`.
2. Open `bookstore.db` in a SQLite viewer extension in VS Code, or use another local SQLite database viewer.
3. Open the `book` table and show the columns `id`, `title`, `author`, `price`, and `pages`, together with the records.
4. Press **Win + Shift + S** and save the capture as `lab-02/screenshots/database-view.png`.

The database view must be an actual view of this project's `bookstore.db`, not a recreated image or sample table.

## Screenshots

The following images must be captured from the running project and saved in the `screenshots/` directory before submission:

### Get all books

![REST Client response for retrieving all books](./screenshots/get-all-books.png)

### Get a single book

![REST Client response for retrieving a single book](./screenshots/get-single-book.png)

### Add a book

![REST Client response for adding a book](./screenshots/post-book.png)

### Update a book

![REST Client response for updating a book](./screenshots/put-book.png)

### Delete a book

![REST Client response for deleting a book](./screenshots/delete-book.png)

### Database view

![SQLite database table view](./screenshots/database-view.png)

## Problems Faced and Solutions

| Problem Faced                                                     | Solution                                    |
| ----------------------------------------------------------------- | ------------------------------------------- |
| `[Describe a problem encountered during setup or implementation]` | `[Describe the solution or debugging step]` |
| `[Describe a problem encountered while testing an endpoint]`      | `[Describe the solution or result]`         |
| `[Add another problem if applicable]`                             | `[Add the corresponding solution]`          |

## Submission Checklist

- [ ] Replace the student detail placeholders with accurate information.
- [ ] Add the required Postman and database screenshots to `screenshots/`.
- [ ] Test all five API endpoints.
- [ ] Verify the documented status codes and error responses.
- [ ] Add the live deployment URL, or keep `[Not deployed yet]` if the project has not been deployed.
- [ ] Confirm that `node_modules/` and `.env` are not committed.

## Git and Security Notes

Do not commit generated dependencies or environment-specific secrets. The following entries should be included in `.gitignore`:

```gitignore
node_modules/
.env
```

The `node_modules/` directory is recreated by running `npm install`. The `.env` file is reserved for local environment variables and must not contain committed credentials, API keys, or other secrets.
