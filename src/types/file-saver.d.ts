declare module 'file-saver' {
  export function saveAs(
    data: Blob | File | URL,
    filename?: string,
    options?: {
      type?: string;
      endings?: string;
    }
  ): void;
}
