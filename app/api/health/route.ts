import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    return Response.json({
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0]?.now,
    });
  } catch (error) {
    console.error('[health] Database connection failed:', error);
    return Response.json(
      {
        status: 'error',
        database: 'disconnected',
        message:
          error instanceof Error ? error.message : 'Unknown database error',
      },
      { status: 503 }
    );
  }
}
