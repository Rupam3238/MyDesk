import sqlite3 from 'sqlite3';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'mydesk.db');
const schemaPath = join(__dirname, 'schema.sql');

// Read the schema file
const schema = fs.readFileSync(schemaPath, 'utf8');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Execute the entire schema file
db.exec(schema, (err) => {
  if (err) {
    console.error('❌ Error creating schema:', err);
    process.exit(1);
  }
  console.log('✅ Database schema initialized successfully!');
  console.log('\nTables created:');
  console.log('  • users');
  console.log('  • sessions');
  console.log('  • session_events');
  console.log('  • notes');
  console.log('  • tags');
  console.log('  • note_tags');
  console.log('  • habits');
  console.log('  • habit_logs');
  console.log('  • workspaces');
  console.log('  • workspace_items');
  console.log('\n✅ Ready to go! Start with: npm run dev');
  
  db.close();
});