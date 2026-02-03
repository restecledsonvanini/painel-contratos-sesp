#!/usr/bin/env node
/**
 * Script to execute SQL migrations against Supabase
 * Usage: DATABASE_URL="..." node scripts/execute-migrations.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function executeMigrations() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found. Set it before running this script.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }, // Supabase uses SSL
  });

  try {
    await client.connect();
    console.log('✓ Connected to Supabase');

    // Read and execute init migration
    const initPath = path.join(__dirname, '..', 'packages', 'db', 'prisma', 'migrations', '00000000000000_init.sql');
    const initSQL = fs.readFileSync(initPath, 'utf8');
    
    console.log('\n📝 Executing init migration...');
    await client.query(initSQL);
    console.log('✓ Init migration applied');

    // Read and execute post migration
    const postPath = path.join(__dirname, '..', 'packages', 'db', 'prisma', 'migrations', '00000000000001_post.sql');
    const postSQL = fs.readFileSync(postPath, 'utf8');

    console.log('\n📝 Executing post migration (triggers, extensions, seed)...');
    await client.query(postSQL);
    console.log('✓ Post migration applied');

    // Verify tables exist
    console.log('\n✓ Verifying tables...');
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    console.log('Tables created:', tables.rows.map(r => r.table_name).join(', '));

    console.log('\n✓✓✓ All migrations successfully applied to Supabase!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

executeMigrations();
