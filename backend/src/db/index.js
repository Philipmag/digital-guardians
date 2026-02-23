/**
 * Database configuration and connection pooling
 */

const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.DATABASE_POOL_SIZE || 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err, client) => {
  logger.error('Unexpected database error:', err);
});

// Query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug({
        event: 'db_query',
        text: text.substring(0, 100),
        duration_ms: duration,
        rows: result.rowCount,
      });
    }
    
    return result;
  } catch (error) {
    logger.error({
      event: 'db_error',
      text: text.substring(0, 100),
      error: error.message,
    });
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Get a client for streaming
const getClient = async () => {
  return await pool.connect();
};

module.exports = {
  query,
  transaction,
  getClient,
  pool,
};
