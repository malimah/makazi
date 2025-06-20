import { account, ID } from '../utils/appwrite';

export const sendOtpForSignUp = async (phone: string) => {
  const userId = ID.unique(); // Generate a unique user ID
  await account.createPhoneToken(userId, phone); // Send OTP for phone verification
};

export const verifyOtpAndSetPassword = async (phone: string, otp: string, password: string) => {
  await account.createSession(phone, otp); // Verify OTP and create a session
  await account.updatePassword(password); // Set the user's password
};

export const handleEmailSignUp = async (email: string, password: string, username: string) => {
  const userId = ID.unique();
  await account.create(userId, email, password, username);
  await account.createEmailPasswordSession(email, password); // <-- use this for login
};

export const handleLogin = async (email: string, password: string) => {
  await account.createEmailPasswordSession(email, password); // <-- use this for login
};