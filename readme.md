# Suvit Text Extraction (PDF → Transaction Data)

This project extracts transaction details (date, description, amount, type, category, balance, etc.) from bank statement PDFs using AI (OpenAI / OpenRouter) and persists them into a PostgreSQL database.

---

## Introduction

Bank statements are often in PDF format and don’t have structured data. This project uses AI to “read” the PDF, identify transaction fields, and convert them into structured records. It is especially useful for financial analysis, budgeting, or automating bookkeeping tasks.

---

## Features

- Upload PDF bank statements via HTTP endpoint  
- Parse raw PDF text (using `pdf-parse`)  
- Use AI (OpenAI / OpenRouter) to interpret the text into transaction fields  
- Repair or fallback on malformed AI output using `jsonrepair` / fallback logic  
- Save extracted transactions to a PostgreSQL database  
- Automatically clean up uploaded files  
- Return the count of inserted records in the response  

---

## Folder Structure
```bash
suvit_text_extraction/
├── api/
│ ├── routes/
│ │ └── uploadRoutes.js # PDF upload and extraction endpoint
│ └── app.js # Express app (optionally)
├── config/
│ ├── db.js # PostgreSQL connection setup
│ └── dbConfig.js # DB URL / config wrapper
├── data/
│ ├── hdfc-demo.pdf # Sample PDF(s) for testing
│ ├── Indian Bank.pdf
│ └── extracted/ # Output folder (for debug / local)
├── helpers/
│ └── pdfParse.js # Raw PDF parsing logic
├── services/
│ ├── pdfExtractor.js # Logic combining parsed text + AI to extract transactions
│ ├── databaseService.js # Insert / query DB logic
│ └── llmService.js # Wrapper around AI calls (OpenAI / OpenRouter)
├── uploads/ # Temporary uploaded PDF files
├── .env # Environment variable file (ignored in Git)
├── server.js # App entry point
├── package.json # Dependencies and scripts
└── .gitignore


```
## Tech Stack

- **Node.js** + **Express.js** – for backend HTTP API  
- **OpenAI** / **OpenRouter** – for AI-based interpretation  
- **PostgreSQL** – for storing transaction records  
- **pdf-parse** – to extract raw text from PDF  
- **multer** – to handle file uploads  
- **dotenv** – environment variable management  
- **jsonrepair** (or fallback logic) – to fix malformed JSON from AI output  

---


## Setup & Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/GrishmaRaiyani/suvit_text_extraction.git
   cd suvit_text_extraction
   ```

2. Install dependencies:
  ```bash
  npm install
```

3. Create a .env file in the root directory with the following:
  ```bash
  OPENROUTER_API_KEY=your_openrouter_api_key_here
  DATABASE_URL=postgresql://user:password@localhost:5432/your_database
  PORT=3000
```


4. Start the server:
```bash
node server.js
```
