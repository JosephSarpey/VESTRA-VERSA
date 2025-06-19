/**
 * Calculate password strength based on various criteria
 * @param {string} password - The password to evaluate
 * @returns {number} Strength score from 0 to 4
 */
export function getPasswordStrength(password) {
  if (!password) return 0;
  
  let strength = 0;
  // Length check
  if (password.length >= 8) strength++;
  // Has uppercase letters
  if (/[A-Z]/.test(password)) strength++;
  // Has numbers
  if (/[0-9]/.test(password)) strength++;
  // Has special characters
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return Math.min(strength, 4); // Cap at 4 for very strong
}

/**
 * Get a human-readable description of password strength
 * @param {number} strength - The strength score from getPasswordStrength
 * @returns {string} Description of the strength
 */
export function getPasswordStrengthText(strength) {
  const strengthTexts = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  return strengthTexts[Math.min(Math.max(0, strength), 4)];
}

/**
 * Get Tailwind color class based on password strength
 * @param {number} strength - The strength score from getPasswordStrength
 * @returns {string} Tailwind color class
 */
export function getPasswordStrengthColor(strength) {
  const colors = [
    "bg-red-500",  // Very weak
    "bg-orange-500", // Weak
    "bg-yellow-500", // Fair
    "bg-blue-500",  // Strong
    "bg-green-500"  // Very strong
  ];
  return colors[Math.min(Math.max(0, strength), 4)];
}
