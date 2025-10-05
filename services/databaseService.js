// services/databaseService.js
import pkg from "pg";
import { dbConfig } from "../config/dbConfig.js";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: dbConfig.connectionString,
});

export async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      date DATE,
      description TEXT,
      amount NUMERIC,
      type TEXT,
      category TEXT,
      merchant TEXT,
      source TEXT,
      confidence NUMERIC,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function saveTransactions(transactions = []) {
  if (!transactions.length) return { inserted: 0 };
  await ensureTable();

  const client = await pool.connect();
  try {
    const insertText = `
      INSERT INTO transactions (date, description, amount, type, category, merchant, source, confidence)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `;
    let count = 0;
    for (const tx of transactions) {
      await client.query(insertText, [
        tx.date,
        tx.description,
        tx.amount,
        tx.type,
        tx.category,
        tx.merchant,
        tx.source,
        tx.confidence ?? 1.0,
      ]);
      count++;
    }
    return { inserted: count };
  } finally {
    client.release();
  }
}

export async function getTransactions(filters = {}) {
  const { startDate, endDate, category, q, limit = 100, offset = 0 } = filters;
  const values = [];
  const where = [];

  if (startDate) {
    values.push(startDate);
    where.push(`date >= $${values.length}`);
  }
  if (endDate) {
    values.push(endDate);
    where.push(`date <= $${values.length}`);
  }
  if (category) {
    values.push(category);
    where.push(`category = $${values.length}`);
  }
  if (q) {
    values.push(`%${q}%`);
    where.push(`(description ILIKE $${values.length} OR merchant ILIKE $${values.length})`);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const query = `
    SELECT * FROM transactions
    ${whereClause}
    ORDER BY date DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  const { rows } = await pool.query(query, values);
  return rows;
}
