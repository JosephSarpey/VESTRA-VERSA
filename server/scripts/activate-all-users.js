require('dotenv').config(); // Load your .env variables
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path if needed

async function activateAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Update all users who do NOT have isActivated set to true
    const result = await User.updateMany(
      { isActivated: { $ne: true } },
      { $set: { isActivated: true, activationOtp: undefined, activationOtpExpires: undefined } }
    );
    console.log(`Updated ${result.nModified || result.modifiedCount} users as activated.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

activateAllUsers();