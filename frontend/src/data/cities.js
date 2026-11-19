// CPCB India Historical Averages from city_day.csv (2015-2020)
export const INDIAN_CITIES = [
  {
    name: "Delhi",
    state: "Delhi NCT",
    pm25: 121.6,
    pm10: 235.2,
    no2: 51.3,
    co: 2.1,
    so2: 15.9,
    o3: 51.8,
    typicalCategory: "Poor / Very Poor"
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    pm25: 35.5,
    pm10: 96.2,
    no2: 25.5,
    co: 1.2,
    so2: 14.3,
    o3: 31.8,
    typicalCategory: "Moderate"
  },
  {
    name: "Bengaluru",
    state: "Karnataka",
    pm25: 36.1,
    pm10: 84.3,
    no2: 29.9,
    co: 1.0,
    so2: 5.5,
    o3: 34.1,
    typicalCategory: "Satisfactory"
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    pm25: 65.0,
    pm10: 116.7,
    no2: 40.9,
    co: 0.8,
    so2: 8.2,
    o3: 30.5,
    typicalCategory: "Moderate / Poor"
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    pm25: 49.7,
    pm10: 113.6,
    no2: 72.5,
    co: 17.8,
    so2: 66.0,
    o3: 45.4,
    typicalCategory: "Very Poor"
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    pm25: 36.4,
    pm10: 62.8,
    no2: 14.7,
    co: 0.8,
    so2: 8.4,
    o3: 38.9,
    typicalCategory: "Satisfactory"
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    pm25: 46.2,
    pm10: 91.9,
    no2: 30.9,
    co: 0.6,
    so2: 9.7,
    o3: 35.4,
    typicalCategory: "Moderate"
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    pm25: 54.8,
    pm10: 123.9,
    no2: 32.5,
    co: 0.8,
    so2: 11.1,
    o3: 47.2,
    typicalCategory: "Moderate"
  },
  {
    name: "Patna",
    state: "Bihar",
    pm25: 65.8,
    pm10: 126.7,
    no2: 34.2,
    co: 1.2,
    so2: 8.6,
    o3: 24.6,
    typicalCategory: "Moderate / Poor"
  },
  {
    name: "Gurugram",
    state: "Haryana",
    pm25: 99.8,
    pm10: 192.1,
    no2: 26.9,
    co: 1.0,
    so2: 11.7,
    o3: 39.0,
    typicalCategory: "Poor"
  },
  {
    name: "Chandigarh",
    state: "Chandigarh UT",
    pm25: 40.6,
    pm10: 84.4,
    no2: 12.1,
    co: 0.6,
    so2: 10.1,
    o3: 19.6,
    typicalCategory: "Satisfactory"
  },
  {
    name: "Amritsar",
    state: "Punjab",
    pm25: 56.3,
    pm10: 117.6,
    no2: 18.7,
    co: 0.6,
    so2: 8.7,
    o3: 22.4,
    typicalCategory: "Moderate"
  },
  {
    name: "Bhopal",
    state: "Madhya Pradesh",
    pm25: 50.2,
    pm10: 119.7,
    no2: 31.4,
    co: 0.9,
    so2: 13.1,
    o3: 59.8,
    typicalCategory: "Moderate"
  },
  {
    name: "Kochi",
    state: "Kerala",
    pm25: 31.7,
    pm10: 67.0,
    no2: 14.5,
    co: 1.3,
    so2: 17.4,
    o3: 3.9,
    typicalCategory: "Moderate"
  },
  {
    name: "Coimbatore",
    state: "Tamil Nadu",
    pm25: 29.3,
    pm10: 38.8,
    no2: 27.7,
    co: 1.0,
    so2: 8.8,
    o3: 28.7,
    typicalCategory: "Satisfactory"
  },
  {
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    pm25: 47.3,
    pm10: 106.9,
    no2: 37.2,
    co: 0.9,
    so2: 12.8,
    o3: 37.0,
    typicalCategory: "Moderate"
  },
  {
    name: "Thiruvananthapuram",
    state: "Kerala",
    pm25: 28.3,
    pm10: 53.3,
    no2: 9.5,
    co: 1.0,
    so2: 5.7,
    o3: 35.3,
    typicalCategory: "Satisfactory"
  },
  {
    name: "Shillong",
    state: "Meghalaya",
    pm25: 24.9,
    pm10: 36.3,
    no2: 2.9,
    co: 0.3,
    so2: 7.0,
    o3: 28.5,
    typicalCategory: "Good / Satisfactory"
  },
  {
    name: "Aizawl",
    state: "Mizoram",
    pm25: 18.1,
    pm10: 24.6,
    no2: 0.4,
    co: 0.3,
    so2: 7.1,
    o3: 3.7,
    typicalCategory: "Good"
  }
];

export const CPCB_THRESHOLDS = {
  pm25: { limit: 60, unit: "µg/m³", name: "PM2.5 (Fine Particulate)" },
  pm10: { limit: 100, unit: "µg/m³", name: "PM10 (Coarse Particulate)" },
  no2: { limit: 80, unit: "µg/m³", name: "NO2 (Nitrogen Dioxide)" },
  co: { limit: 2.0, unit: "mg/m³", name: "CO (Carbon Monoxide)" },
  so2: { limit: 80, unit: "µg/m³", name: "SO2 (Sulfur Dioxide)" },
  o3: { limit: 100, unit: "µg/m³", name: "O3 (Ground Ozone)" },
};
