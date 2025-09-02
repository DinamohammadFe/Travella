// Wikimedia Commons API service for fetching city attraction images

// In-memory cache for consistent results
const imageCache = new Map();

/**
 * Fetch city attraction images from Wikimedia Commons API
 * @param {string} cityName - Name of the city
 * @param {number} limit - Number of images to fetch (default: 6)
 * @returns {Promise<Array>} Array of image objects
 */
export const fetchCityAttractionImages = async (cityName, limit = 6) => {
  const cacheKey = `${cityName.toLowerCase()}_${limit}`;
  
  // Return cached results if available
  if (imageCache.has(cacheKey)) {
    console.log('Returning cached images for:', cityName);
    return imageCache.get(cacheKey);
  }

  try {
    // Search for images related to city attractions
    const searchQueries = [
      `${cityName} attractions`,
      `${cityName} landmarks`,
      `${cityName} tourism`,
      `${cityName} monuments`,
      `${cityName} architecture`
    ];

    const allImages = [];
    
    for (const query of searchQueries) {
      if (allImages.length >= limit) break;
      
      try {
        const response = await fetch(
          `https://commons.wikimedia.org/w/api.php?` +
          `action=query&` +
          `format=json&` +
          `origin=*&` +
          `list=search&` +
          `srsearch=${encodeURIComponent(query)}&` +
          `srnamespace=6&` +
          `srlimit=${Math.min(10, limit - allImages.length)}&` +
          `srinfo=suggestion&` +
          `srprop=size|wordcount|timestamp|snippet`
        );

        if (!response.ok) continue;
        
        const data = await response.json();
        
        if (data.query && data.query.search) {
          for (const item of data.query.search) {
            if (allImages.length >= limit) break;
            
            // Get image info to construct proper URLs
            const imageTitle = item.title;
            const imageUrl = await getImageUrl(imageTitle);
            
            if (imageUrl) {
              allImages.push({
                id: `wikimedia_${allImages.length + 1}`,
                title: imageTitle.replace('File:', '').replace(/\.[^/.]+$/, ''),
                url: imageUrl,
                thumbnail: imageUrl.replace('/commons/', '/commons/thumb/') + '/300px-' + imageTitle.split('/').pop(),
                source: 'Wikimedia Commons',
                description: item.snippet || `${cityName} attraction`,
                alt: `${cityName} attraction image`
              });
            }
          }
        }
      } catch (error) {
        console.warn(`Error fetching images for query "${query}":`, error);
        continue;
      }
    }

    // If we don't have enough images, add some fallback images
    while (allImages.length < limit) {
      allImages.push({
        id: `fallback_${allImages.length + 1}`,
        title: `${cityName} Attraction`,
        url: `https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=${encodeURIComponent(cityName + ' Attraction')}`,
        thumbnail: `https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=${encodeURIComponent(cityName)}`,
        source: 'Placeholder',
        description: `${cityName} attraction placeholder`,
        alt: `${cityName} attraction placeholder`
      });
    }

    // Cache the results
    imageCache.set(cacheKey, allImages);
    console.log(`Cached ${allImages.length} images for:`, cityName);
    
    return allImages;
    
  } catch (error) {
    console.error('Error fetching Wikimedia images:', error);
    
    // Return fallback images on error
    const fallbackImages = Array.from({ length: limit }, (_, index) => ({
      id: `fallback_${index + 1}`,
      title: `${cityName} Attraction`,
      url: `https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=${encodeURIComponent(cityName + ' Attraction')}`,
      thumbnail: `https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=${encodeURIComponent(cityName)}`,
      source: 'Placeholder',
      description: `${cityName} attraction placeholder`,
      alt: `${cityName} attraction placeholder`
    }));
    
    // Cache fallback results too
    imageCache.set(cacheKey, fallbackImages);
    return fallbackImages;
  }
};

/**
 * Get the actual image URL from Wikimedia Commons
 * @param {string} imageTitle - The image title from search results
 * @returns {Promise<string|null>} The image URL or null if not found
 */
const getImageUrl = async (imageTitle) => {
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?` +
      `action=query&` +
      `format=json&` +
      `origin=*&` +
      `titles=${encodeURIComponent(imageTitle)}&` +
      `prop=imageinfo&` +
      `iiprop=url&` +
      `iiurlwidth=400`
    );

    if (!response.ok) return null;
    
    const data = await response.json();
    const pages = data.query?.pages;
    
    if (pages) {
      const pageId = Object.keys(pages)[0];
      const imageInfo = pages[pageId]?.imageinfo?.[0];
      return imageInfo?.thumburl || imageInfo?.url || null;
    }
    
    return null;
  } catch (error) {
    console.warn('Error getting image URL for:', imageTitle, error);
    return null;
  }
};

/**
 * Clear the image cache (useful for development/testing)
 */
export const clearImageCache = () => {
  imageCache.clear();
  console.log('Image cache cleared');
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return {
    size: imageCache.size,
    keys: Array.from(imageCache.keys())
  };
};