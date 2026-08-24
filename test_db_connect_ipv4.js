const { Client } = require('pg');

// Force IPv4 by using IP address directly (need to resolve first)
const dns = require('dns').promises;

async function connectWithIPv4() {
  try {
    // Try to get IPv4 address
    const addresses = await dns.resolve4('db.mkrtkssypeqjauftaxzt.supabase.co');
    console.log('Resolved IPv4 addresses:', addresses);
    
    const client = new Client({
      host: addresses[0],
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: '12345678AAZZHK@@',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });

    await client.connect();
    console.log('Connected successfully to Supabase via IPv4!');
    await client.end();
    process.exit(0);
  } catch (err) {
    if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
      console.error('No IPv4 address found for this Supabase instance.');
      console.error('Supabase only provides IPv6 address.');
      console.error('Your network environment does not support IPv6 connectivity.');
    } else {
      console.error('Connection failed:', err.message);
    }
    process.exit(1);
  }
}

connectWithIPv4();
