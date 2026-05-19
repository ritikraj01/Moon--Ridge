import mongoose from "mongoose";
import dotenv from "dotenv";
import Package from "./models/Package";

dotenv.config();

const dummyPackages = [
  {
    title: "6 Days 5 Nights Ladakh Adventure",
    slug: "ladakh-adventure-6d-5n",
    destination: "Ladakh",
    duration: 6,
    description:
      "Experience the breathtaking beauty of Ladakh with mountains, monasteries, lakes, and thrilling adventures.",
    highlights: [
      "Pangong Lake Visit",
      "Khardung La Pass",
      "Camel Safari",
      "Monastery Tour",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Leh",
        activities: [
          "Airport Pickup",
          "Hotel Check-in",
          "Local Market Visit",
        ],
      },
      {
        day: 2,
        title: "Leh Sightseeing",
        activities: [
          "Shanti Stupa",
          "Leh Palace",
          "Hall of Fame",
        ],
      },
      {
        day: 3,
        title: "Nubra Valley",
        activities: [
          "Khardung La Pass",
          "Camel Safari",
          "Camp Stay",
        ],
      },
      {
        day: 4,
        title: "Pangong Lake",
        activities: [
          "Lake Visit",
          "Photography",
          "Camping",
        ],
      },
      {
        day: 5,
        title: "Return to Leh",
        activities: [
          "Shopping",
          "Cafe Visit",
        ],
      },
      {
        day: 6,
        title: "Departure",
        activities: [
          "Breakfast",
          "Airport Drop",
        ],
      },
    ],
    inclusions: [
      "Hotel Stay",
      "Breakfast & Dinner",
      "Private Transport",
      "Guide",
    ],
    exclusions: [
      "Flights",
      "Personal Expenses",
      "Travel Insurance",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090",
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2",
    ],
    FAQs: [
      {
        question: "What is the best time to visit Ladakh?",
        answer: "May to September is the best time to visit Ladakh.",
      },
      {
        question: "Is oxygen support available?",
        answer: "Yes, emergency oxygen support is available during the trip.",
      },
    ],
    plans: [
      {
        name: "Budget",
        price: 25000,
        features: [
          "3 Star Hotel",
          "Breakfast",
          "Shared Transport",
        ],
      },
      {
        name: "Standard",
        price: 42000,
        features: [
          "4 Star Hotel",
          "Breakfast & Dinner",
          "Semi-Private Transport",
        ],
      },
      {
        name: "Premium",
        price: 68000,
        features: [
          "5 Star Hotel",
          "All Meals",
          "Private SUV",
        ],
      },
    ],
    pricing: 25000,
    availability: true,
  },

  {
    title: "Kashmir Paradise Tour",
    slug: "kashmir-paradise-tour",
    destination: "Kashmir",
    duration: 5,
    description:
      "Enjoy the heaven on earth with beautiful valleys, gardens, and houseboats in Kashmir.",
    highlights: [
      "Dal Lake",
      "Gulmarg Gondola",
      "Sonmarg Excursion",
      "Houseboat Stay",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar",
        activities: [
          "Houseboat Check-in",
          "Shikara Ride",
        ],
      },
      {
        day: 2,
        title: "Gulmarg Tour",
        activities: [
          "Gondola Ride",
          "Snow Activities",
        ],
      },
      {
        day: 3,
        title: "Sonmarg Excursion",
        activities: [
          "Sightseeing",
          "River Rafting",
        ],
      },
      {
        day: 4,
        title: "Pahalgam Visit",
        activities: [
          "Betaab Valley",
          "Horse Riding",
        ],
      },
      {
        day: 5,
        title: "Departure",
        activities: [
          "Shopping",
          "Airport Drop",
        ],
      },
    ],
    inclusions: [
      "Hotel Stay",
      "Breakfast",
      "Sightseeing",
    ],
    exclusions: [
      "Flights",
      "Lunch & Dinner",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
    ],
    FAQs: [
      {
        question: "Is snowfall available?",
        answer: "Snowfall depends on the season, mainly from December to February.",
      },
    ],
    plans: [
      {
        name: "Budget",
        price: 18000,
        features: [
          "3 Star Hotel",
          "Breakfast",
        ],
      },
      {
        name: "Premium",
        price: 50000,
        features: [
          "Luxury Resort",
          "All Meals",
          "Private Cab",
        ],
      },
    ],
    pricing: 18000,
    availability: true,
  },

  {
    title: "Goa Beach Escape",
    slug: "goa-beach-escape",
    destination: "Goa",
    duration: 4,
    description:
      "Relax on Goa’s stunning beaches with nightlife, water sports, and beachside resorts.",
    highlights: [
      "Baga Beach",
      "Water Sports",
      "Nightlife",
      "Cruise Party",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Beach Relaxation",
        activities: [
          "Beach Walk",
          "Sunset View",
        ],
      },
      {
        day: 2,
        title: "Water Sports Day",
        activities: [
          "Parasailing",
          "Jet Ski",
          "Banana Ride",
        ],
      },
      {
        day: 3,
        title: "North Goa Tour",
        activities: [
          "Fort Aguada",
          "Chapora Fort",
          "Night Club",
        ],
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "Breakfast",
          "Airport Drop",
        ],
      },
    ],
    inclusions: [
      "Resort Stay",
      "Breakfast",
      "Water Sports",
    ],
    exclusions: [
      "Flights",
      "Personal Expenses",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
    ],
    FAQs: [
      {
        question: "Are water sports included?",
        answer: "Yes, selected water sports are included in premium plans.",
      },
    ],
    plans: [
      {
        name: "Budget",
        price: 12000,
        features: [
          "3 Star Resort",
          "Breakfast",
        ],
      },
      {
        name: "Standard",
        price: 22000,
        features: [
          "4 Star Resort",
          "Breakfast + Water Sports",
        ],
      },
      {
        name: "Premium",
        price: 40000,
        features: [
          "Beachfront Luxury Resort",
          "All Meals",
          "Private Transfers",
        ],
      },
    ],
    pricing: 12000,
    availability: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/travel-booking");
    console.log("Connected to MongoDB for seeding");

    await Package.deleteMany(); // Clear existing packages
    console.log("Cleared existing packages");

    await Package.insertMany(dummyPackages);
    console.log("Dummy packages seeded successfully");

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
