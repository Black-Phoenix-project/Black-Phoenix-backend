const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,   
  },
  role: [
    {
      admin: {
        type: String,                                                                                                       
        required: true,                                                                                                                                                                                                                                 
      },
      moderator: {
        type: String,
        required: true,
      }
    }
  ],
  lastname: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
  },
});

userSchema.index({ phoneNumber: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
