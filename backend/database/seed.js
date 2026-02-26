
require('dotenv').config();

const { sequelize, User, Category, Product } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // ⚠️ Drops and recreates all tables
    console.log('✅ Database synced');

    // Create admin user
    await User.create({
      firstName: 'System',
      lastName: 'Developer',
      email: process.env.ADMIN_EMAIL || 'admin@codebuddy.com',
      password: process.env.ADMIN_DEFAULT_PASSWORD || '34345656712',
      role: 'admin',
      isEmailVerified: true,
    });
    console.log('✅ Admin user created');

    // Sample categories
    const categories = [
      { name: 'Smartphones', slug: 'smartphones', description: 'Mobile phones and accessories' },
      { name: 'Laptops', slug: 'laptops', description: 'Laptops and notebooks' },
      { name: 'Tablets', slug: 'tablets', description: 'Tablets and iPads' },
      { name: 'Accessories', slug: 'accessories', description: 'Phone and computer accessories' },
      { name: 'Audio', slug: 'audio', description: 'Headphones, speakers and earbuds' },
    ];

    await Category.bulkCreate(categories);
    console.log('✅ Sample categories created');

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL || 'admin@codebuddy.com'}`);
    console.log(`🔑 Admin Password: ${process.env.ADMIN_DEFAULT_PASSWORD || '34345656712'}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
