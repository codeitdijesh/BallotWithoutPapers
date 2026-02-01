const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { query } = require('./config/database');
const bcrypt = require('bcryptjs');

async function checkAndFixAdmin() {
  try {
    console.log('Checking admin users in database...');
    
    // Check if admin exists
    const result = await query('SELECT id, email, full_name, password_hash FROM admins');
    
    if (result.rows.length === 0) {
      console.log('❌ No admin users found in database!');
      console.log('Creating default admin user...');
      
      // Create admin with password 'admin123'
      const passwordHash = await bcrypt.hash('admin123', 10);
      await query(
        'INSERT INTO admins (email, password_hash, full_name) VALUES ($1, $2, $3)',
        ['admin@example.com', passwordHash, 'System Administrator']
      );
      
      console.log('✅ Created admin user:');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
    } else {
      console.log(`Found ${result.rows.length} admin user(s):`);
      result.rows.forEach((admin, index) => {
        console.log(`\n${index + 1}. ID: ${admin.id}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Name: ${admin.full_name}`);
        console.log(`   Password Hash: ${admin.password_hash.substring(0, 20)}...`);
      });
      
      // Test password comparison
      console.log('\n--- Testing password verification ---');
      const testPassword = 'admin123';
      
      for (const admin of result.rows) {
        const isMatch = await bcrypt.compare(testPassword, admin.password_hash);
        console.log(`\nTesting '${testPassword}' for ${admin.email}:`);
        console.log(`   Result: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
        
        if (!isMatch) {
          console.log('   Resetting password to "admin123"...');
          const newHash = await bcrypt.hash('admin123', 10);
          await query(
            'UPDATE admins SET password_hash = $1 WHERE id = $2',
            [newHash, admin.id]
          );
          console.log('   ✅ Password reset successfully!');
        }
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAndFixAdmin();
