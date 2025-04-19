import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true }, 
  phone: { type: String }, 
  contact: { type: String },
  education: { type: String },
  aadhar: { type: String }, 
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['mcp', 'partner'],
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: function () {
      return this.role === 'partner'; // MCPs need approval
    },
  },
  inviteToken: { type: String }, // for future MCP invite-based logic
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
