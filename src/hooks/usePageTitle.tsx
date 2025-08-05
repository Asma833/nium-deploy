import { useState, useEffect, useRef } from 'react';
let currentTitle = '';
const listeners: ((newTitle: string) => void)[] = [];

const updateTitle = (newTitle: string) => {
  currentTitle = newTitle;
  listeners.forEach((listener) => listener(newTitle));
};

export function usePageTitle(initialTitle?: string) {
  const [title, setLocalTitle] = useState(currentTitle || initialTitle || '');
  const isInitialRender = useRef(true);

  useEffect(() => {
    const handleTitleChange = (newTitle: string) => {
      setLocalTitle(newTitle);
    };

    listeners.push(handleTitleChange);

    // Always update title on mount if initialTitle is provided
    if (isInitialRender.current && initialTitle) {
      updateTitle(initialTitle);
      isInitialRender.current = false;
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
