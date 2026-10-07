import { db } from '@/lib/db';

export async function GET() {
  await db.execute(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);

  const { rows } = await db.execute('SELECT * FROM notes ORDER BY updated_at DESC');
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();

  await db.execute(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);

  const result = await db.execute({
    sql: 'INSERT INTO notes (title, content) VALUES (?, ?)',
    args: [body.title ?? 'Sin título', body.content ?? '']
  });

  const { rows } = await db.execute({
    sql: 'SELECT * FROM notes WHERE id = ?',
    args: [result.lastInsertRowid]
  });

  return Response.json(rows[0]);
}
