

import crypto from "crypto";
import redis from "./redis";

//import { OTPVerificationEmail } from "../components/email-templates/otp-verification";
import { sendEmail } from "./sendMail";

export const generateOTP = () => crypto.randomInt(100000, 1000000).toString();

export const sendOTP = async (email: string, otp: string) => {
  // Envoyer l'email avec l'OTP
  await sendEmail(email, "Vérification de votre email", "otp-verification", { 
    name: email.split('@')[0], 
    otp 
  });
  
  // Stocker l'OTP dans Redis avec expiration
  await redis.set(`otp:${email}`, otp, "EX", 300); // 5 minutes
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60); // 1 minute cooldown
};

export const verifyOTP = async (email: string, userOTP: string) => {
  const storedOTP = await redis.get(`otp:${email}`);
  if (!storedOTP) {
    throw new Error("OTP invalide ou expiré!");
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  if (storedOTP !== userOTP) {
    if (failedAttempts >= 5) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); // 30 minutes lock
      await redis.del(`otp:${email}`, failedAttemptsKey);
      throw new Error("Trop de tentatives échouées. Votre compte est bloqué pour 30 minutes!");
    }
    
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
    throw new Error(`OTP incorrect. ${4 - failedAttempts} tentatives restantes.`);
  }

  await redis.del(`otp:${email}`, failedAttemptsKey);
};

export const checkOTPRestrictions = async (email: string) => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new Error("Compte bloqué suite à plusieurs tentatives échouées! Réessayez après 30 minutes");
  }
  
  if (await redis.get(`otp_spam_lock:${email}`)) {
    throw new Error("Trop de demandes OTP! Veuillez attendre 1 heure avant de demander à nouveau.");
  }
  
  if (await redis.get(`otp_cooldown:${email}`)) {
    throw new Error("Veuillez attendre 1 minute avant de demander un nouveau OTP!");
  }
};

export const trackOTPRequests = async (email: string) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 15) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
    throw new Error("Trop de demandes OTP. Veuillez attendre 1 heure avant de demander à nouveau.");
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600);
};