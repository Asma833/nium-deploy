import { toast } from 'sonner';

/**
 * Copies the provided text to clipboard and shows a success toast
 * @param text Text to copy to clipboard
 * @param message Optional custom success message
 */
export const copyToClipboard = async (text: string, message: string = 'Copied to clipboard!') => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message);
  } catch (error) {
    toast.error('Failed to copy to clipboard');
  }
};
