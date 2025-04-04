import { useState, useEffect } from 'react';
let currentTitle = '';
const listeners: ((newTitle: string) => void)[] = [];

const updateTitle = (newTitle: string) => {
  currentTitle = newTitle;

  listeners.forEach((listener) => listener(newTitle));
};

export function usePageTitle(initialTitle?: string) {
  const [title, setLocalTitle] = useState(currentTitle || initialTitle || '');
  useEffect(() => {
    const handleTitleChange = (newTitle: string) => {
      setLocalTitle(newTitle);
    };
    listeners.push(handleTitleChange);
    if (initialTitle && !currentTitle) {
      updateTitle(initialTitle);
    }
    return () => {
      const index = listeners.indexOf(handleTitleChange);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [initialTitle]);

  const setTitle = (newTitle: string) => {
    updateTitle(newTitle);
  };

  return { title, setTitle };
}
