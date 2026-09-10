const fs = require('fs');

const cities = {
  "Hyderabad": ["Madhapur", "Kondapur", "Gachibowli", "Kukatpally", "Hitech City", "Miyapur"],
  "Bengaluru": ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "Bellandur"],
  "Chennai": ["Adyar", "Velachery", "T Nagar", "Anna Nagar", "OMR"],
  "Mumbai": ["Andheri", "Bandra", "Juhu", "Powai", "Goregaon"],
  "Pune": ["Hinjewadi", "Kharadi", "Viman Nagar", "Kothrud", "Wakad"]
};

const propTypes = ['1 BHK', '2 BHK', '3 BHK', 'Apartment', 'Villa', 'PG', 'Independent House', 'Shared Room', 'Single Room'];
const amenities = ['wifi', 'parking', 'ac', 'tv', 'washing_machine', 'geyser', 'kitchen', 'balcony', 'lift', 'security', 'power_backup', 'water'];
const tenantPrefs = [['Family', 'Couple'], ['Bachelor', 'Student'], ['Any'], ['Working Professional', 'Bachelor'], ['Family', 'Working Professional']];
const furnishings = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomItems = (arr, count) => {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const properties = [];

for (let i = 1; i <= 40; i++) {
  const city = randomItem(Object.keys(cities));
  const locality = randomItem(cities[city]);
  const type = randomItem(propTypes);
  const rent = randomInt(8, 45) * 1000;
  const deposit = rent * randomInt(2, 4);
  const beds = type.includes('3') ? 3 : type.includes('2') ? 2 : type.includes('1') ? 1 : type.includes('Villa') ? 4 : 1;
  const baths = Math.max(1, beds - randomInt(0, 1));
  const area = beds * randomInt(400, 600);

  const images = [];
  // Dummy images from unsplash or generic placeholders
  for(let j=1; j<=4; j++) {
    images.push(`https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80`);
  }

  properties.push({
    id: `PROP${String(i).padStart(3, '0')}`,
    title: `Beautiful ${type} in ${locality}`,
    propertyType: type,
    tenantPreference: randomItem(tenantPrefs),
    city: city,
    locality: locality,
    address: `${randomInt(1, 100)}, Main Road, ${locality}, ${city}`,
    rent: rent,
    deposit: deposit,
    bedrooms: beds,
    bathrooms: baths,
    areaSqFt: area,
    furnishing: randomItem(furnishings),
    availableFrom: new Date(Date.now() + randomInt(1, 30) * 86400000).toISOString().split('T')[0],
    images: images,
    amenities: randomItems(amenities, randomInt(3, 8)),
    description: `A stunning ${type.toLowerCase()} located in the heart of ${locality}. Perfect for ${randomItem(tenantPrefs).join(' and ')}. Enjoy comfortable living with top-class amenities.`,
    owner: {
      name: `Owner ${i}`,
      verified: Math.random() > 0.3,
      contact: "owner@example.com"
    },
    isPopular: Math.random() > 0.8,
    isNew: Math.random() > 0.7
  });
}

// ensure data folder exists
if (!fs.existsSync('data')) fs.mkdirSync('data');
fs.writeFileSync('data/properties.json', JSON.stringify(properties, null, 2));
console.log('Generated 40 mock properties');
