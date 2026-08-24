const { Client } = require('pg');

const client = new Client({
  host: 'db.mkrtkssypeqjauftaxzt.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '12345678AAZZHK@@',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

client.connect()
  .then(() => {
    console.log('Connected successfully to Supabase!');
    return client.end();
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
