
import { useState, useEffect } from "react";

// module-level variable to store the current title
let currentTitle = "";
const listeners: Function[] = [];

// Function to update title and notify listeners
const updateTitle = (newTitle: string) => {
  currentTitle = newTitle;
  // Notify all listeners about the title change
  listeners.forEach(listener => listener(newTitle));
};

// Hook to get and set the title
export function usePageTitle(initialTitle?: string) {
  // Initialize local state with the current title or initial title
  const [title, setLocalTitle] = useState(currentTitle || initialTitle || "");
  
  // Set up listener for title changes
  useEffect(() => {
    // Update local state when the shared title changes
    const handleTitleChange = (newTitle: string) => {
      setLocalTitle(newTitle);
    };
    
    // Register this component as a listener
    listeners.push(handleTitleChange);
    
    // If this component has an initial title and no title is set, use it
    if (initialTitle && !currentTitle) {
      updateTitle(initialTitle);
    }
    
    // Clean up listener when component unmounts
    return () => {
      const index = listeners.indexOf(handleTitleChange);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [initialTitle]);
  
  // Function to set the title
  const setTitle = (newTitle: string) => {
    updateTitle(newTitle);
  };
  
  return { title, setTitle };
}