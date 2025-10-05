# 🧠 PDF Transaction Extractor (Node.js + OpenAI)

This project extracts **transaction details** such as date, description, amount, type, category, and balance from **bank statement PDFs** using **AI (OpenRouter/OpenAI)** and saves them to a PostgreSQL database.

---

## 📂 Folder Structure

TEXT/
├── api/
│ ├── routes/
│ │ └── uploadRoutes.js # PDF upload endpoint
│ └── app.js # Express app logic (optional)
│
├── config/
│ ├── db.js # PostgreSQL connection file
│ └── dbConfig.js # Database URL configuration
│
├── data/
│ ├── hdfc-demo.pdf # Sample input PDFs
│ ├── Indian Bank.pdf
│ └── extracted/ # Folder for processed results
│
├── helpers/
│ └── pdfParse.js # Handles PDF text extraction
│
├── services/
│ ├── pdfExtractor.js # Uses AI to extract transaction data
│ ├── databaseService.js # Handles DB queries
│ └── llmService.js # Optional AI service helper
│
├── uploads/ # Temporary uploaded files
│
├── .env # Environment variables (ignored by Git)
├── server.js # Entry point to start the backend
├── package.json # Node dependencies
├── README.md # Project documentation
└── .gitignore # Files ignored by Git

yaml
Copy code

---

## ⚙️ Setup Instructions

### 1️⃣ Install dependencies
Run the following command inside your project folder:

```bash
npm install
2️⃣ Configure Environment Variables
Create a file named .env in the root directory with the following content:

env
Copy code
OPENROUTER_API_KEY=your_openrouter_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
PORT=3000
💡 Replace the above values with your actual PostgreSQL credentials and OpenRouter API key.

3️⃣ Start the Server
Run the backend:

bash
Copy code
node server.js
If successful, you’ll see:

arduino
Copy code
✅ Server running on port 3000
The server will be available at:
👉 http://localhost:3000

📤 Upload PDF Endpoint
POST /upload

Upload a PDF file for AI-based transaction extraction.

Field	Type	Description
file	File	Bank statement PDF

Example (using curl):
bash
Copy code
curl -X POST -F "file=@data/hdfc-demo.pdf" http://localhost:3000/upload
Example (using fetch in JavaScript):
js
Copy code
const formData = new FormData();
formData.append("file", fileInput.files[0]);

fetch("http://localhost:3000/upload", {
  method: "POST",
  body: formData
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
🧠 Output Example
If extraction is successful:

json
Copy code
{
  "message": "Transactions extracted and saved successfully",
  "count": 20
}
Database Record Example
json
Copy code
{
  "id": "uuid",
  "userId": "user_123",
  "date": "2024-07-15",
  "description": "UPI Payment to Swiggy",
  "amount": 350.75,
  "type": "Debit",
  "category": "Food",
  "balance": 12400.25
}
🧹 Cleanup Behavior
Uploaded files are automatically deleted after extraction.

Invalid or malformed JSON responses from the AI are repaired or logged for debugging.

🧑‍💻 Tech Stack
Node.js + Express.js

OpenRouter / OpenAI API

PostgreSQL

pdf-parse

multer

dotenv

⚠️ Notes
.env must never be uploaded to GitHub.

node_modules, uploads, and venv folders are ignored by Git.

Use jsonrepair or fallback parsing in pdfExtractor.js to handle malformed AI outputs.

✅ Future Enhancements
Add authentication (userId support)

Add dashboard for viewing extracted transactions

Export results to CSV / Excel

yaml
Copy code
