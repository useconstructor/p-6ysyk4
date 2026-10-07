import { db } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const updates: string[] = [];
  const args: (string | number)[] = [];

  if (body.title !== undefined) {
    updates.push('title = ?');
    args.push(body.title);
  }
  if (body.content !== undefined) {
    updates.push('content = ?');
    args.push(body.content);
  }

  updates.push("updated_at = datetime('now')");
  args.push(id);

  await db.execute({
    sql: `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`,
    args
  });

  const { rows } = await db.execute({
    sql: 'SELECT * FROM notes WHERE id = ?',
    args: [id]
  });

  return Response.json(rows[0] ?? null);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await db.execute({
    sql: 'DELETE FROM notes WHERE id = ?',
    args: [id]
  });

  return Response.json({ ok: true });
}
