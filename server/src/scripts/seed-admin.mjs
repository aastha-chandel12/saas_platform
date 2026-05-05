import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', UserSchema);

async function seedAdmin() {
  const url = process.env.DATABASE_URL || 'mongodb+srv://aasthachandel_db_user:6Oi7avDoccUkrzFU@cluster0.zao7i9c.mongodb.net/nextstep_careers';
  
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@nextstep.com';
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      console.log('Admin already exists. Updating role...');
      existing.role = 'admin';
      await existing.save();
    } else {
      console.log('Creating new admin...');
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
    }

    console.log('Admin setup complete!');
    console.log('Email: admin@nextstep.com');
    console.log('Password: Admin123!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
