import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = "mongodb+srv://vicdevman:Vic_devman123@cluster0.fszr5og.mongodb.net/legal_system?retryWrites=true&w=majority&appName=Cluster0";

// Define the User schema directly in the script
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'STAFF', 'CLIENT'],
    required: true
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel = mongoose.model('User', userSchema);

async function createSampleUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Sample users data
    const sampleUsers = [
      {
        name: 'System Administrator',
        email: 'admin@legal.com',
        password: 'admin123',
        role: 'ADMIN'
      },
      {
        name: 'John Lawyer',
        email: 'lawyer@legal.com',
        password: 'lawyer123',
        role: 'STAFF'
      },
      {
        name: 'Jane Client',
        email: 'client@legal.com',
        password: 'client123',
        role: 'CLIENT'
      }
    ];

    console.log('🧹 Clearing existing users...');
    await UserModel.deleteMany({});
    console.log('✅ Cleared existing users');

    console.log('👥 Creating sample users...');
    for (const userData of sampleUsers) {
      const newUser = new UserModel({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      });

      await newUser.save();
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log('🎉 All sample users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@legal.com / admin123');
    console.log('Lawyer: lawyer@legal.com / lawyer123');
    console.log('Client: client@legal.com / client123');

  } catch (error) {
    console.error('❌ Error creating sample users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
createSampleUsers();
