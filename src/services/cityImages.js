// src/services/cityImages.js
// Static mapping of city names to image URLs
// This ensures consistent images that don't change on refresh

const cityImages = {
  Cairo: "https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg",
  Paris: "https://i.postimg.cc/nrFy2hBt/pexels-thorsten-technoman-109353-338515.jpg",
  NewYork: "https://i.postimg.cc/W19HWrg4/pexels-chris-schippers-139261-421927.jpg",
  "New York": "https://i.postimg.cc/W19HWrg4/pexels-chris-schippers-139261-421927.jpg", // Alternative spelling
  London: "https://i.postimg.cc/3JdnYhxJ/london-eye-4962522-1920.jpg",
  Tokyo: "https://i.postimg.cc/26Tbhzgg/pexels-apasaric-2372739.jpg",
  Sydney: "https://via.placeholder.com/800x600/dc2626/ffffff?text=Sydney",
  Rome: "https://via.placeholder.com/800x600/7c3aed/ffffff?text=Rome",
  Barcelona: "https://via.placeholder.com/800x600/ea580c/ffffff?text=Barcelona",
  Amsterdam: "https://via.placeholder.com/800x600/0891b2/ffffff?text=Amsterdam",
  Dubai: "https://i.postimg.cc/d1DnxtGc/dubai.jpg",
};

// Specific attraction images
const attractionImages = {
  "Statue of Liberty": "https://i.postimg.cc/RFdBVNj6/us.jpg",
  "Central Park": "https://i.postimg.cc/4nk5W7kL/new-york-4352072-1280.jpg",
  "Eiffel Tower": "https://i.postimg.cc/nrFy2hBt/pexels-thorsten-technoman-109353-338515.jpg",
  "Louvre Museum": "https://i.postimg.cc/W3vLDn4z/pexels-pixabay-2363.jpg",
  "Notre Dame Cathedral": "https://i.postimg.cc/FRVt0LfZ/notre-dame-490222_1280.jpg",
  "Tokyo Skytree": "https://i.postimg.cc/k4jGDTbm/skytree-1024x682-1.jpg",
  "Senso-ji Temple": "https://i.postimg.cc/ryrzqNwv/pexels-tonywuphotography-21792360.jpg",
  "Big Ben": "https://i.postimg.cc/fTm5JKm6/westminster-5055507-1920.jpg",
  "British Museum": "https://i.postimg.cc/Wz2pgStX/british-museum-5200528-1920.jpg",
  "Buckingham Palace": "https://i.postimg.cc/hPtPGCkG/london-8835826-1280.jpg",
  "Tower Bridge": "https://i.postimg.cc/T24j49HF/pexels-manualman32-726484.jpg",
  "Dubai Mall": "https://i.postimg.cc/3wtn1D4Z/dubai-mall.jpg",
  "Burj Khalifa": "https://i.postimg.cc/W4N50733/pexels-evonics-2086765.jpg",
};

/**
 * Get image URL for a city or attraction
 * @param {string} cityName - Name of the city or attraction
 * @param {string} fallbackUrl - Default image URL if city not found
 * @returns {string} Image URL
 */
export const getCityImage = (cityName, fallbackUrl = "/assets/placeholder.jpg") => {
  if (!cityName) return fallbackUrl;
  
  // Check for specific attraction images first
  if (attractionImages[cityName]) {
    return attractionImages[cityName];
  }
  
  // Try case-insensitive match for attractions
  const attractionKey = Object.keys(attractionImages).find(
    key => key.toLowerCase() === cityName.toLowerCase()
  );
  
  if (attractionKey) {
    return attractionImages[attractionKey];
  }
  
  // Try exact match for cities
  if (cityImages[cityName]) {
    return cityImages[cityName];
  }
  
  // Try case-insensitive match for cities
  const cityKey = Object.keys(cityImages).find(
    key => key.toLowerCase() === cityName.toLowerCase()
  );
  
  if (cityKey) {
    return cityImages[cityKey];
  }
  
  // Return fallback if no match found
  return fallbackUrl;
};

export default cityImages;