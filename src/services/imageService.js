// Image service for fetching and validating city images

/**
 * Fetch city image from Unsplash API
 * @param {string} cityName - Name of the city
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<Object>} Image data object
 */
export const fetchCityImage = async (cityName, width = 800, height = 600) => {
  try {
    // Use Unsplash Source API for random city images
    const query = encodeURIComponent(`${cityName} city landscape`);
    const url = `https://source.unsplash.com/${width}x${height}/?${query}`;
    
    return {
      url: url,
      alt: `${cityName} cityscape`,
      width: width,
      height: height
    };
  } catch (error) {
    console.error('Error fetching city image:', error);
    // Return a fallback placeholder image
    return {
      url: `https://via.placeholder.com/${width}x${height}/e5e7eb/9ca3af?text=${encodeURIComponent(cityName)}`,
      alt: `${cityName} placeholder`,
      width: width,
      height: height
    };
  }
};

/**
 * Validate if an image URL is accessible
 * @param {string} url - Image URL to validate
 * @returns {Promise<boolean>} True if image is valid and accessible
 */
export const validateImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch (error) {
    console.error('Error validating image URL:', error);
    return false;
  }
};

/**
 * Get a fallback image URL for a city
 * @param {string} cityName - Name of the city
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Fallback image URL
 */
export const getFallbackImage = (cityName, width = 800, height = 600) => {
  return `https://via.placeholder.com/${width}x${height}/e5e7eb/9ca3af?text=${encodeURIComponent(cityName)}`;
};