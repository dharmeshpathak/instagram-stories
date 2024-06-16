
export const fetchStories = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos');
    const data = await response.json();
    // Limit to first 10 stories for simplicity
    return data.slice(0, 10);
  };
    