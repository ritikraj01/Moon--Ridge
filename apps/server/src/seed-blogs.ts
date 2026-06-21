import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "./models/Blog";

dotenv.config();

const blogsData = [
  {
    title: "Julley! Your Quick Guide to the Ladakhi Language",
    slug: "julley-ladakhi-language-guide",
    thumbnail: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop",
    seoTitle: "Julley! Your Quick Guide to the Ladakhi Language",
    seoDescription: "Learn essential Ladakhi phrases like 'Julley' for your trip to Ladakh. Connect with locals and experience the culture deeply.",
    status: "published",
    author: "MoonRidge Team",
    readTime: "5 min read",
    category: "Culture",
    excerpt: "Learn essential Ladakhi phrases like 'Julley' for your trip to Ladakh. Discover the heart of Ladakhi hospitality.",
    featured: true,
    contentBlocks: [
      {
        type: "hero",
        imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop",
        title: "Julley! Your Quick Guide to the Ladakhi Language",
        subtitle: "Learn the essential phrases to connect with the locals of Ladakh",
        readTime: "5 min read",
        author: "MoonRidge Team",
      },
      {
        type: "paragraph",
        content: "Ladakh is famous for its dramatic landscapes, ancient monasteries, and warm hospitality. While most people in Leh and major tourist areas can communicate in Hindi and English, learning a few Ladakhi words is one of the best ways to connect with local people and experience the culture more deeply.",
      },
      {
        type: "quote",
        content: "The most important word you need to know is 'Julley'. This simple greeting is the heart of Ladakhi hospitality and can mean hello, thank you, welcome, goodbye, and even please, depending on the situation.",
        attribution: "Local Wisdom",
      },
      {
        type: "heading",
        content: "About the Ladakhi Language",
        level: 2,
      },
      {
        type: "paragraph",
        content: "Ladakhi, also known as Bhoti or Bodhi, belongs to the Tibetic language family and has its own unique pronunciation, vocabulary, and cultural identity. Although it shares historical roots with Tibetan, it has evolved separately over centuries and is spoken differently across regions such as Leh, Nubra Valley, Zanskar, Changthang, and Kargil.",
      },
      {
        type: "highlightCard",
        variant: "tip",
        title: "Why Learn a Few Ladakhi Phrases?",
        content: "Learning even a handful of phrases can create meaningful interactions with local people, help you communicate in remote villages, show respect for Ladakh's culture, and make your journey more authentic.",
      },
      {
        type: "heading",
        content: "The Magic of 'Julley'",
        level: 2,
      },
      {
        type: "richText",
        html: "<p>Unlike many languages that require different words for greeting, thanking, and saying goodbye, Ladakhi often uses a single versatile expression: <strong>JULLEY!</strong></p><p>It means: Hello • Thank You • Goodbye • Welcome.</p>",
      },
      {
        type: "checklist",
        title: "You can use 'Julley' when:",
        items: [
          { text: "Meeting someone", checked: true },
          { text: "Thanking a shopkeeper", checked: true },
          { text: "Greeting your homestay host", checked: true },
          { text: "Leaving a restaurant", checked: true },
          { text: "Saying farewell to new friends", checked: true },
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "A Useful Cultural Tip",
        content: "You may notice that many Ladakhi phrases end with 'Ley'. This is often used to add politeness and respect while speaking. Using respectful language is highly valued in Ladakhi culture and helps create positive interactions with locals.",
      },
      {
        type: "divider",
        style: "mountains",
      },
      {
        type: "heading",
        content: "Ladakhi Phrasebook",
        level: 2,
      },
      {
        type: "languageGuide",
        title: "Greetings & Basic Courtesy",
        phrases: [
          { phrase: "JULLEY!", translation: "Hello / Thank you / Goodbye!", audioUrl: "" },
          { phrase: "O LEY.", translation: "Yes, thank you.", audioUrl: "" },
          { phrase: "MAN LEY.", translation: "No, thank you.", audioUrl: "" },
          { phrase: "KHAMZANG IN-A LEY?", translation: "How are you?", audioUrl: "" },
          { phrase: "KHAMZANG IN LEY.", translation: "I am fine.", audioUrl: "" },
          { phrase: "THUG-JE-CHE.", translation: "Thank you very much.", audioUrl: "" },
          { phrase: "THUG-JE-CHE NANG.", translation: "Many thanks.", audioUrl: "" },
          { phrase: "SORRY ZHU.", translation: "Sorry.", audioUrl: "" },
          { phrase: "GONGDAK ZHU.", translation: "Excuse me.", audioUrl: "" },
          { phrase: "NANG ROKS.", translation: "Please.", audioUrl: "" },
          { phrase: "OK LEY.", translation: "Okay.", audioUrl: "" },
          { phrase: "LEGSO.", translation: "Alright / Fine.", audioUrl: "" },
          { phrase: "LEGSO JULLEY.", translation: "Very good, thank you.", audioUrl: "" },
          { phrase: "JULLEY LEGSO.", translation: "Thank you very much.", audioUrl: "" },
          { phrase: "JULLEY, NYERANG LA JAL-YANG.", translation: "Goodbye, see you again.", audioUrl: "" },
        ],
      },
      {
        type: "languageGuide",
        title: "Introducing Yourself",
        phrases: [
          { phrase: "KHYERANG GI MING LA CI ZER?", translation: "What is your name?", audioUrl: "" },
          { phrase: "NGA GI MING _____ IN.", translation: "My name is _____.", audioUrl: "" },
          { phrase: "KHYERANG KANG NAS YIN?", translation: "Where are you from?", audioUrl: "" },
          { phrase: "NGA INDIA NAS YIN.", translation: "I am from India.", audioUrl: "" },
          { phrase: "NGA DROKPA YIN.", translation: "I am a traveler.", audioUrl: "" },
          { phrase: "NGA LADAKHI MA SHES.", translation: "I don't know Ladakhi.", audioUrl: "" },
          { phrase: "NGA LADAKHI SHES THOD.", translation: "I know a little Ladakhi.", audioUrl: "" },
        ],
      },
      {
        type: "languageGuide",
        title: "Communication & Understanding",
        phrases: [
          { phrase: "NGA MA GO.", translation: "I don't understand.", audioUrl: "" },
          { phrase: "KADAKPO ZER ROKS.", translation: "Please speak slowly.", audioUrl: "" },
          { phrase: "ENGLISH YOD PA?", translation: "Do you speak English?", audioUrl: "" },
          { phrase: "KHYERANG GI PHONE YOD PA?", translation: "Do you have a phone?", audioUrl: "" },
          { phrase: "HELP NANG ROKS.", translation: "Please help me.", audioUrl: "" },
          { phrase: "NYERANG GI DRUNG DU YONG.", translation: "I will come later.", audioUrl: "" },
        ],
      },
      {
        type: "languageGuide",
        title: "Food & Drink",
        phrases: [
          { phrase: "CHU YOD PA?", translation: "Is there water?", audioUrl: "" },
          { phrase: "CHU NANG ROKS.", translation: "Please give me water.", audioUrl: "" },
          { phrase: "ZA YOD PA?", translation: "Is there food?", audioUrl: "" },
          { phrase: "ZA THUKPO YOD PA?", translation: "Do you have food?", audioUrl: "" },
        ],
      },
      {
        type: "languageGuide",
        title: "Directions & Getting Around",
        phrases: [
          { phrase: "HOTEL GA PAR YOD?", translation: "Where is the hotel?", audioUrl: "" },
          { phrase: "MARKET GA PAR YOD?", translation: "Where is the market?", audioUrl: "" },
          { phrase: "TOILET GA PAR YOD?", translation: "Where is the toilet?", audioUrl: "" },
          { phrase: "ROAD DI LEH LA DRO-A?", translation: "Does this road go to Leh?", audioUrl: "" },
          { phrase: "TAXI YOD PA?", translation: "Is a taxi available?", audioUrl: "" },
          { phrase: "NGA LEH LA DRO GO.", translation: "I want to go to Leh.", audioUrl: "" },
          { phrase: "PANGONG LA DRO GO.", translation: "I want to go to Pangong Lake.", audioUrl: "" },
          { phrase: "NUBRA LA DRO GO.", translation: "I want to go to Nubra Valley.", audioUrl: "" },
          { phrase: "KAR-GIL LA DRO GO.", translation: "I want to go to Kargil.", audioUrl: "" },
        ],
      },
      {
        type: "languageGuide",
        title: "Shopping & Bargaining",
        phrases: [
          { phrase: "DI TSO TSE RAK?", translation: "How much is this?", audioUrl: "" },
          { phrase: "TSO CHE.", translation: "Too expensive.", audioUrl: "" },
          { phrase: "THOD CHUNG CHUNG NANG ROKS.", translation: "Please reduce the price.", audioUrl: "" },
        ],
      },
      {
        type: "languageGuide",
        title: "Health & Emergencies",
        phrases: [
          { phrase: "NGA NAYTSAK YIN.", translation: "I am tired.", audioUrl: "" },
          { phrase: "NGA NAD YOD.", translation: "I am sick.", audioUrl: "" },
          { phrase: "DOCTOR GA PAR YOD?", translation: "Where is the doctor?", audioUrl: "" },
          { phrase: "HOSPITAL GA PAR YOD?", translation: "Where is the hospital?", audioUrl: "" },
          { phrase: "ALTITUDE SICKNESS YOD.", translation: "I have altitude sickness.", audioUrl: "" },
        ],
      },
      {
        type: "languageGuide",
        title: "Useful Everyday Phrases",
        phrases: [
          { phrase: "DAKPO YOD PA?", translation: "Is it open?", audioUrl: "" },
          { phrase: "CHU YOD PA?", translation: "Is there water?", audioUrl: "" },
          { phrase: "ZA YOD PA?", translation: "Is there food?", audioUrl: "" },
          { phrase: "HELP NANG ROKS.", translation: "Please help me.", audioUrl: "" },
          { phrase: "NANG ROKS.", translation: "Please.", audioUrl: "" },
        ],
      },
      {
        type: "divider",
        style: "line",
      },
      {
        type: "heading",
        content: "Essential Ladakhi Numbers",
        level: 2,
      },
      {
        type: "travelInfoTable",
        title: "Numbers 1-1000",
        rows: [
          { label: "1", value: "CHIK" },
          { label: "2", value: "NYIS" },
          { label: "3", value: "SUM" },
          { label: "4", value: "ZHI" },
          { label: "5", value: "NGA" },
          { label: "6", value: "DRUK" },
          { label: "7", value: "DUN" },
          { label: "8", value: "GYAT" },
          { label: "9", value: "GU" },
          { label: "10", value: "CHU" },
          { label: "20", value: "NYISHU" },
          { label: "30", value: "SUMCHU" },
          { label: "40", value: "ZHIBCHU" },
          { label: "50", value: "NGAPCHU" },
          { label: "60", value: "DRUKCHU" },
          { label: "70", value: "DUNCHU" },
          { label: "80", value: "GYATCHU" },
          { label: "90", value: "GUPCHU" },
          { label: "100", value: "GYA" },
          { label: "200", value: "NYIS GYA" },
          { label: "500", value: "NGA GYA" },
          { label: "1000", value: "STONG" },
        ],
      },
      {
        type: "imageText",
        imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
        position: "right",
        content: "<p>Most hotels, cafés, travel agencies, and guesthouses in Leh communicate comfortably in English and Hindi. However, once you venture into remote valleys, traditional villages, or homestays, a few Ladakhi words can go a long way toward building genuine connections.</p><p>Many travelers discover that some of their most memorable moments in Ladakh come not from famous attractions, but from simple conversations shared over butter tea.</p>",
      },
      {
        type: "paragraph",
        content: "You don't need to become fluent in Ladakhi to enjoy your journey. Even learning a few phrases demonstrates curiosity, respect, and appreciation for the local culture. So before you set off to explore monasteries, mountain passes, and hidden valleys, remember the most important word in Ladakh: Julley!",
      },
    ],
  },
  {
    title: "10 Epic Treks in Ladakh You Must Experience",
    slug: "10-epic-treks-in-ladakh",
    thumbnail: "https://images.unsplash.com/photo-1626717197347-9091d3ce1bcb?q=80&w=2070&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1626717197347-9091d3ce1bcb?q=80&w=2070&auto=format&fit=crop",
    seoTitle: "10 Epic Treks in Ladakh You Must Experience",
    seoDescription: "Discover the 10 best treks in Ladakh ranging from the frozen Chadar Trek to the classic Markha Valley Trek.",
    status: "published",
    author: "MoonRidge Team",
    readTime: "8 min read",
    category: "Adventure",
    excerpt: "From high mountain passes to frozen rivers, Ladakh offers spectacular trekking routes. Explore our top 10 epic treks.",
    featured: true,
    contentBlocks: [
      {
        type: "hero",
        imageUrl: "https://images.unsplash.com/photo-1626717197347-9091d3ce1bcb?q=80&w=2070&auto=format&fit=crop",
        title: "10 Epic Treks in Ladakh You Must Experience",
        subtitle: "A paradise for trekkers offering spectacular routes for every level.",
        readTime: "8 min read",
        author: "MoonRidge Team",
      },
      {
        type: "paragraph",
        content: "Ladakh is a paradise for trekkers. From high mountain passes and remote Himalayan villages to frozen rivers and alpine lakes, the region offers some of the most spectacular trekking routes in India. Whether you're a beginner looking for a short hike or an experienced adventurer seeking a challenging expedition, Ladakh has a trek for every level.",
      },
      {
        type: "divider",
        style: "dots",
      },
      {
        type: "heading",
        content: "1. Markha Valley Trek",
        level: 2,
      },
      {
        type: "travelInfoTable",
        rows: [
          { label: "Difficulty", value: "Moderate" },
          { label: "Duration", value: "6–8 Days" },
          { label: "Best Time", value: "June to September" },
          { label: "Max Altitude", value: "5,260 m" },
        ],
      },
      {
        type: "paragraph",
        content: "The Markha Valley Trek is often considered the most iconic trek in Ladakh. It takes you through traditional villages, river crossings, prayer-flag-covered passes, and dramatic mountain landscapes within Hemis National Park.",
      },
      {
        type: "checklist",
        title: "Highlights",
        items: [
          { text: "Traditional Ladakhi homestays", checked: true },
          { text: "Hemis National Park", checked: true },
          { text: "Kongmaru La Pass", checked: true },
          { text: "Views of Kang Yatse Peak", checked: true },
          { text: "Ancient monasteries and remote villages", checked: true },
        ],
      },
      {
        type: "image",
        imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2070&auto=format&fit=crop",
        caption: "Markha Valley Trek landscapes",
      },
      {
        type: "heading",
        content: "2. Chadar Trek",
        level: 2,
      },
      {
        type: "travelInfoTable",
        rows: [
          { label: "Difficulty", value: "Challenging" },
          { label: "Duration", value: "8–9 Days" },
          { label: "Best Time", value: "January to February" },
          { label: "Max Altitude", value: "3,850 m" },
        ],
      },
      {
        type: "paragraph",
        content: "The Chadar Trek is one of the most unique winter adventures in the world. Instead of hiking on trails, trekkers walk across the frozen Zanskar River while surrounded by towering canyon walls and frozen waterfalls.",
      },
      {
        type: "checklist",
        title: "Highlights",
        items: [
          { text: "Frozen river trekking", checked: true },
          { text: "Ice formations and waterfalls", checked: true },
          { text: "Winter Ladakh landscapes", checked: true },
          { text: "Traditional Zanskari villages", checked: true },
        ],
      },
      {
        type: "highlightCard",
        variant: "warning",
        title: "Winter Extreme",
        content: "This trek is suitable only for physically fit trekkers prepared for extreme cold.",
      },
      {
        type: "heading",
        content: "3. Sham Valley Trek",
        level: 2,
      },
      {
        type: "travelInfoTable",
        rows: [
          { label: "Difficulty", value: "Easy" },
          { label: "Duration", value: "3 Days" },
          { label: "Best Time", value: "May to October" },
          { label: "Max Altitude", value: "3,874 m" },
        ],
      },
      {
        type: "paragraph",
        content: "Often called the 'Baby Trek,' Sham Valley Trek is ideal for beginners, families, and travelers who want a taste of trekking without extreme altitude challenges.",
      },
      {
        type: "checklist",
        title: "Highlights",
        items: [
          { text: "Likir Monastery", checked: true },
          { text: "Traditional villages", checked: true },
          { text: "Homestay experiences", checked: true },
          { text: "Gentle walking trails", checked: true },
        ],
      },
      {
        type: "heading",
        content: "4. Nubra Valley Trek",
        level: 2,
      },
      {
        type: "travelInfoTable",
        rows: [
          { label: "Difficulty", value: "Moderate" },
          { label: "Duration", value: "5 Days" },
          { label: "Best Time", value: "July to September" },
          { label: "Max Altitude", value: "5,438 m" },
        ],
      },
      {
        type: "paragraph",
        content: "Following an ancient trade route, this trek connects the Indus Valley with the Nubra Valley through high mountain passes and stunning alpine landscapes.",
      },
      {
        type: "checklist",
        title: "Highlights",
        items: [
          { text: "Lasermo La Pass", checked: true },
          { text: "Wildflower meadows", checked: true },
          { text: "Hunder Valley", checked: true },
          { text: "Sand dunes and Bactrian camels", checked: true },
        ],
      },
      {
        type: "heading",
        content: "5. Lamayuru to Chilling Trek",
        level: 2,
      },
      {
        type: "travelInfoTable",
        rows: [
          { label: "Difficulty", value: "Moderate" },
          { label: "Duration", value: "5–6 Days" },
          { label: "Best Time", value: "June to September" },
          { label: "Max Altitude", value: "4,950 m" },
        ],
      },
      {
        type: "paragraph",
        content: "This classic trek begins near the famous Lamayuru Monastery and passes through remote villages, mountain passes, and scenic valleys before ending in Chilling.",
      },
      {
        type: "checklist",
        title: "Highlights",
        items: [
          { text: "Lamayuru Monastery", checked: true },
          { text: "Traditional mountain villages", checked: true },
          { text: "Stunning Zanskar landscapes", checked: true },
          { text: "Rich Buddhist culture", checked: true },
        ],
      },
      {
        type: "heading",
        content: "6. Stok Kangri Region Trek",
        level: 2,
      },
      {
        type: "travelInfoTable",
        rows: [
          { label: "Difficulty", value: "Difficult" },
          { label: "Duration", value: "4–5 Days" },
          { label: "Best Time", value: "June to September" },
        ],
      },
      {
        type: "paragraph",
        content: "Although summit regulations and access may change, trekking in the Stok Kangri region remains one of the most dramatic adventures near Leh.",
      },
      {
        type: "checklist",
        title: "Highlights",
        items: [
          { text: "High-altitude camping", checked: true },
          { text: "Glacier views", checked: true },
          { text: "Panoramic Himalayan scenery", checked: true },
          { text: "Stunning sunrise landscapes", checked: true },
        ],
      },
      {
        type: "highlightCard",
        variant: "altitude",
        title: "Proper Acclimatization is Essential",
        content: "Ensure proper acclimatization before attempting any high-altitude trek in this area.",
      },
      {
        type: "heading",
        content: "7. Rumtse to Tso Moriri Trek",
        level: 2,
      },
      {
        type: "travelInfoTable",
        rows: [
          { label: "Difficulty", value: "Challenging" },
          { label: "Duration", value: "7–9 Days" },
          { label: "Best Time", value: "July to September" },
          { label: "Max Altitude", value: "Above 5,000 m" },
        ],
      },
      {
        type: "paragraph",
        content: "This trek crosses the vast Changthang Plateau before reaching the breathtaking Tso Moriri Lake.",
      },
      {
        type: "checklist",
        title: "Highlights",
        items: [
          { text: "Remote high-altitude wilderness", checked: true },
          { text: "Nomadic Changpa settlements", checked: true },
          { text: "Colorful mountain landscapes", checked: true },
          { text: "Tso Moriri Lake", checked: true },
        ],
      },
      {
        type: "heading",
        content: "8. Snow Leopard Trek",
        level: 2,
      },
      {
        type: "travelInfoTable",
        rows: [
          { label: "Difficulty", value: "Moderate to Difficult" },
          { label: "Duration", value: "7–10 Days" },
          { label: "Best Time", value: "January to March" },
        ],
      },
      {
        type: "paragraph",
        content: "This trek combines wildlife tracking with winter adventure in Hemis National Park. It is one of the most unique wildlife experiences in India.",
      },
      {
        type: "checklist",
        title: "Highlights",
        items: [
          { text: "Chance to spot snow leopards", checked: true },
          { text: "Himalayan blue sheep", checked: true },
          { text: "Frozen landscapes", checked: true },
          { text: "Wildlife photography", checked: true },
        ],
      },
      {
        type: "heading",
        content: "9. Zanskar Valley Trek",
        level: 2,
      },
      {
        type: "travelInfoTable",
        rows: [
          { label: "Difficulty", value: "Moderate" },
          { label: "Duration", value: "7–10 Days" },
          { label: "Best Time", value: "July to September" },
        ],
      },
      {
        type: "paragraph",
        content: "Zanskar remains one of the least explored regions of Ladakh. Trekking here offers dramatic scenery, remote villages, and a genuine sense of wilderness.",
      },
      {
        type: "checklist",
        title: "Highlights",
        items: [
          { text: "Ancient monasteries", checked: true },
          { text: "Deep valleys", checked: true },
          { text: "Traditional culture", checked: true },
          { text: "Spectacular mountain scenery", checked: true },
        ],
      },
      {
        type: "heading",
        content: "10. Kang Yatse Base Camp Trek",
        level: 2,
      },
      {
        type: "travelInfoTable",
        rows: [
          { label: "Difficulty", value: "Moderate to Difficult" },
          { label: "Duration", value: "5–7 Days" },
          { label: "Best Time", value: "June to September" },
          { label: "Max Altitude", value: "Around 5,000 m" },
        ],
      },
      {
        type: "paragraph",
        content: "This trek offers spectacular views of Kang Yatse and the surrounding peaks of the Markha Valley region. A great option for trekkers who want a Himalayan expedition feel without a technical summit.",
      },
      {
        type: "checklist",
        title: "Highlights",
        items: [
          { text: "High-altitude camping", checked: true },
          { text: "Glacier viewpoints", checked: true },
          { text: "Markha Valley scenery", checked: true },
          { text: "Stunning photography opportunities", checked: true },
        ],
      },
      {
        type: "divider",
        style: "line",
      },
      {
        type: "heading",
        content: "Best Trek for Your Experience Level",
        level: 2,
      },
      {
        type: "travelInfoTable",
        title: "Recommendations",
        rows: [
          { label: "Beginner", value: "Sham Valley Trek" },
          { label: "Intermediate", value: "Markha Valley Trek" },
          { label: "Experienced", value: "Rumtse to Tso Moriri Trek" },
          { label: "Winter Adventure", value: "Chadar Trek" },
          { label: "Wildlife Lovers", value: "Snow Leopard Trek" },
          { label: "Culture & Villages", value: "Lamayuru to Chilling Trek" },
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "Final Thoughts",
        content: "Trekking in Ladakh is more than just an adventure. It's a journey through ancient cultures, remote mountain villages, high-altitude deserts, and some of the most breathtaking landscapes on Earth.",
      },
    ],
  },
];

const seedBlogs = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/travel-booking";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for blog seeding...");

    let created = 0;
    let updated = 0;

    for (const blogData of blogsData) {
      const existing = await Blog.findOne({ slug: blogData.slug });
      if (existing) {
        await Blog.updateOne({ slug: blogData.slug }, blogData);
        console.log(`  ↻  Updated: ${blogData.title}`);
        updated++;
      } else {
        await Blog.create(blogData);
        console.log(`  ✓  Seeded:  ${blogData.title}`);
        created++;
      }
    }

    console.log(`\nBlog seeding completed!`);
    console.log(`  Created: ${created}  |  Updated: ${updated}`);
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedBlogs();
