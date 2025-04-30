import bcrypt from 'bcryptjs';

/**
 * A custom hook for hashing passwords using bcrypt
 */
const usePasswordHash = () => {
  const saltRounds = Number(import.meta.env.VITE_SALT_ROUNDS) || 10;

  const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  };

  const comparePassword = async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  };

  return { hashPassword, comparePassword };
};

export default usePasswordHash;
