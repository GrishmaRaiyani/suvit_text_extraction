// services/pdfExtractor.js
import OpenAI from "openai";
import { jsonrepair } from "jsonrepair";
import db from "../config/db.js";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function extractTransactionsFromText(text) {
  try {
    const prompt = `
You are a financial data extraction assistant.
Extract all financial transactions from the following text and return ONLY valid JSON.

The JSON should look like this:
{
  "transactions": [
    {
      "id": "unique-id-string",
      "userId": "user123",
      "date": "YYYY-MM-DD",
      "description": "string",
      "amount": 123.45,
      "type": "Credit" or "Debit",
      "category": "Food | Bills | Shopping | etc.",
      "balance": 5000.75
    }
  ]
}

Text:
"""${text}"""
`;

    const completion = await openai.chat.completions.create({
      model: "qwen/qwen3-235b-a22b-2507",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const raw = completion.choices[0].message?.content?.trim();
    console.log(" LLM Raw Output:\n", raw);

    // --- Extract JSON safely ---
    const jsonMatch = raw?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found in LLM response");

    let data;
    try {
      data = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error(" JSON parse failed:", err.message);
      throw new Error("Failed to parse JSON from LLM output");
    }

    // --- Save to DB ---
    if (Array.isArray(data.transactions)) {
      for (const tx of data.transactions) {
        await db.query(
          `INSERT INTO transactions 
            (userId, date, description, amount, type, category, balance)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            tx.userId || "user123", // Default if missing
            tx.date || null,
            tx.description || "",
            tx.amount || 0,
            tx.type || "Debit",
            tx.category || "Uncategorized",
            tx.balance || 0,
          ]
        );
      }
    }

    return { success: true, count: data.transactions?.length || 0 };
  } catch (error) {
    console.error(" extractTransactionsFromText Error:", error.message);
    return { success: false, error: error.message };
  }
}