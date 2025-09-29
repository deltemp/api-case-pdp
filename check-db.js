const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'pdp_ecommerce'
});

async function checkDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Check if products table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);
    console.log('Products table exists:', tableExists.rows[0].exists);
    
    // Count products
    const count = await client.query('SELECT COUNT(*) FROM products');
    console.log('Number of products:', count.rows[0].count);
    
    // List all products
    const products = await client.query('SELECT sku, name FROM products LIMIT 10');
    console.log('Products:');
    products.rows.forEach(product => {
      console.log(`- ${product.sku}: ${product.name}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();