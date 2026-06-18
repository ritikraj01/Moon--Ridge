import mongoose from "mongoose";
import dotenv from "dotenv";
import Location from "./models/Location";
dotenv.config();

const locationsData = [
  {
    name: "Leh",
    slug: "leh",
    category: "city",
    latitude: 34.1526,
    longitude: 77.5771,
    altitude: "3,524 m",
    distanceFromLeh: "0 km",
    shortDescription:
      "The high-altitude capital of Ladakh, gateway to all adventures with ancient palaces and vibrant bazaars.",
    longDescription:
      "Leh is the capital city of the Union Territory of Ladakh, perched at an altitude of 3,524 metres in the Himalayas. Once a major hub on the Silk Road, it is today a thriving traveller's base camp with a magnetic old-town quarter, colourful markets, and some of the finest Tibetan Buddhist heritage in India. The iconic Leh Palace towers above the city, offering panoramic views of the Zanskar range, while the shimmering white dome of Shanti Stupa lights up the hilltop to the west. Leh is also home to Hall of Fame, a museum honouring the Indian Army's courage in the Kargil conflict. The city's unique character comes from the confluence of Ladakhi, Tibetan, and Kashmiri influences felt in its food, architecture, and festivals.",
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584474486565-8b80e1a11a65?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "May to September",
    highlights: ["Leh Palace", "Shanti Stupa", "Main Bazaar", "Hall of Fame", "Magnetic Hill"],
    nearbyAttractions: ["Thiksey Monastery", "Shey Palace", "Hemis Monastery", "Stok Palace"],
    travelTips: [
      "Acclimatise for 2–3 days before venturing to high-altitude areas.",
      "Carry cash — ATMs can run dry in peak season.",
      "Permits are required for Pangong, Nubra and other restricted areas; apply via SDM office.",
      "Nights are cold even in summer — pack warm layers.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Kargil",
    slug: "kargil",
    category: "city",
    latitude: 34.5539,
    longitude: 76.1349,
    altitude: "2,676 m",
    distanceFromLeh: "234 km",
    shortDescription:
      "Historic town on the NH-1 road, famous for the 1999 Kargil War and its unique blend of Shia and Buddhist cultures.",
    longDescription:
      "Kargil is the second-largest town in Ladakh and the district headquarters of Kargil district. Situated on the banks of the Suru River at 2,676 m, it occupies a strategic position between Leh and Srinagar on National Highway 1. The town gained global prominence during the 1999 Indo-Pakistani conflict, and the Kargil War Memorial at Drass is a deeply moving tribute to the soldiers who fought there. Kargil is a predominantly Muslim town with a strong Shia tradition, giving it a distinct cultural personality compared to the rest of Ladakh. The surrounding landscape transitions from lush valleys near Srinagar to the rugged high-altitude desert of central Ladakh.",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "May to October",
    highlights: ["Kargil War Memorial", "Suru Valley Views", "Mulbekh Monastery", "Old Town Markets"],
    nearbyAttractions: ["Drass Valley", "Zanskar Valley", "Suru Valley", "Rangdum Monastery"],
    travelTips: [
      "Kargil is a convenient overnight stop on the Leh–Srinagar highway.",
      "The Drass sector near Kargil is the second coldest inhabited place on Earth — dress accordingly.",
      "Fuel up here — petrol stations are scarce beyond this point towards Zanskar.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Pangong Lake",
    slug: "pangong-lake",
    category: "lake",
    latitude: 33.7675,
    longitude: 78.6536,
    altitude: "4,350 m",
    distanceFromLeh: "160 km",
    shortDescription:
      "A stunning, ever-changing blue lake straddling the India–China border, stretching 134 km across the Himalayan plateau.",
    longDescription:
      "Pangong Tso (Lake) is one of the most extraordinary natural wonders in the world. Stretching 134 km from Ladakh, India into Tibet, China, only about 60 km of the lake lies in Indian territory. The lake sits at 4,350 m and its water shifts colour throughout the day from deep sapphire to turquoise to silver, depending on the sky and season. Despite its beauty, Pangong is a saline water lake in which no aquatic life can survive. The surrounding barren mountains create a dramatic contrast with the brilliant blue water. The lake became internationally famous after the blockbuster Bollywood film 3 Idiots was filmed on its shores. Overnight camping is available at Spangmik village on the lake's banks.",
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626717197347-9091d3ce1bcb?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "May to September",
    highlights: ["Colour-Changing Water", "Photography", "Camping", "Sunrise Point", "3 Idiots Point"],
    nearbyAttractions: ["Chang La Pass", "Spangmik Village", "Merak Village", "Lukung"],
    travelTips: [
      "Inner Line Permit is mandatory — obtain it in Leh before travel.",
      "The road via Chang La (5,360 m) is one of the world's highest motorable passes.",
      "Carry sunscreen, sunglasses, and windproof clothing — UV radiation is intense at this altitude.",
      "Book campsites in advance during peak season (Jul–Aug).",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Nubra Valley",
    slug: "nubra-valley",
    category: "valley",
    latitude: 34.5679,
    longitude: 77.5552,
    altitude: "3,048 m",
    distanceFromLeh: "150 km",
    shortDescription:
      "A lush river valley between the Karakoram and Ladakh ranges, famous for Bactrian camels and towering sand dunes.",
    longDescription:
      "Nubra Valley is a tri-armed valley formed by the Shyok and Nubra rivers, lying to the north of the Khardung La pass. The valley was once a branch of the ancient Silk Road and its name means 'valley of flowers'. At a relatively lower altitude of 3,048 m, Nubra enjoys a slightly milder climate than the rest of Ladakh, allowing poplars, apricot trees, and wild roses to thrive. The most iconic sight is the Hunder cold desert, where double-humped Bactrian camels — a relic of the Silk Road era — roam among sand dunes backed by snow-capped peaks. Diskit Monastery, the oldest and largest in the Nubra Valley, dominates a hilltop and houses a 32-metre statue of Maitreya (Future Buddha) surveying the valley.",
    images: [
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "June to September",
    highlights: ["Bactrian Camel Rides", "Hunder Sand Dunes", "Diskit Monastery", "Apricot Orchards", "Siachen Glacier Views"],
    nearbyAttractions: ["Diskit Monastery", "Khardung La", "Sumur Village", "Panamik Hot Springs"],
    travelTips: [
      "Cross Khardung La early morning to avoid afternoon clouds and possible road closures.",
      "Carry your Inner Line Permit — checkpoints are strictly enforced.",
      "The camel ride at Hunder is best enjoyed at sunrise or sunset.",
      "Panamik hot springs near Sumur are worth the detour.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Tso Moriri",
    slug: "tso-moriri",
    category: "lake",
    latitude: 32.8972,
    longitude: 78.3161,
    altitude: "4,595 m",
    distanceFromLeh: "240 km",
    shortDescription:
      "A pristine high-altitude lake in the Changthang plateau, a Ramsar wetland and breeding ground for rare bar-headed geese.",
    longDescription:
      "Tso Moriri (Mountain Lake) is the largest of the high-altitude lakes entirely within India, sitting at 4,595 m in the remote Changthang Wildlife Sanctuary. Covering 120 km², the lake is a designated Ramsar Wetland of International Importance, sheltering rare birds including the bar-headed goose, black-necked crane, Brahminii duck, and great crested grebe. The surrounding landscape of rolling hills, snow-capped peaks, and vast grasslands grazed by Tibetan wild ass (kiang) and blue sheep (bharal) creates an unparalleled wilderness experience. The tiny village of Korzok on the western bank, with its ancient monastery, is the only human settlement here. Far fewer tourists visit Tso Moriri than Pangong, making it ideal for those seeking solitude.",
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "June to September",
    highlights: ["Black-Necked Cranes", "Korzok Monastery", "Kiang (Wild Ass) Sightings", "Stargazing", "Solitude"],
    nearbyAttractions: ["Tso Kar Lake", "Puga Valley Hot Springs", "Thukje Village", "Korzok Village"],
    travelTips: [
      "Permit required — obtain Protected Area Permit (PAP) along with Inner Line Permit in Leh.",
      "Very basic accommodation in Korzok — camping is the best experience.",
      "No phone signal beyond Pang on the Manali–Leh highway.",
      "Extremely cold nights even in summer — sleeping bag rated to -10°C recommended.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Hanle",
    slug: "hanle",
    category: "town",
    latitude: 32.7724,
    longitude: 78.9741,
    altitude: "4,500 m",
    distanceFromLeh: "260 km",
    shortDescription:
      "Remote Changthang village hosting one of the world's highest astronomical observatories, with India's darkest skies.",
    longDescription:
      "Hanle is a remote village in the Changthang region at 4,500 m, close to the India–China Line of Actual Control. It is home to the Indian Astronomical Observatory — one of the world's highest optical observatories at 4,500 m — operated by the Indian Institute of Astrophysics. The skies above Hanle are among the darkest in Asia, making it one of the best stargazing destinations on the planet. In 2022, the Ladakh government officially declared Hanle as India's first 'Dark Sky Reserve'. The ancient Hanle Monastery (Urgelling Gonpa), built in the 17th century, perches on a hilltop and is a beautiful example of Ladakhi-Tibetan architecture.",
    images: [
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "June to October",
    highlights: ["Indian Astronomical Observatory", "Dark Sky Reserve Stargazing", "Hanle Monastery", "Changthang Wildlife"],
    nearbyAttractions: ["Tso Moriri", "Puga Hot Springs", "Nyoma Village", "Chushul"],
    travelTips: [
      "Hanle is in a Restricted Area — Inner Line Permit required.",
      "Very limited food and accommodation — carry extra supplies.",
      "The road from Leh via Mahe–Karu is better than the Tso Moriri route for vehicles.",
      "Telescopes are available for public viewing at the observatory on some evenings.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Khardung La",
    slug: "khardung-la",
    category: "pass",
    latitude: 34.2788,
    longitude: 77.6084,
    altitude: "5,359 m",
    distanceFromLeh: "39 km",
    shortDescription:
      "One of the world's highest motorable passes, gateway to the Nubra Valley with breathtaking 360° mountain views.",
    longDescription:
      "Khardung La (Khardung Pass) at 5,359 m is one of the highest motorable mountain passes in the world. It is the gateway to the Nubra Valley and serves as a vital supply route to the Siachen Glacier base camp. The pass offers spectacular 360-degree views of the Karakoram and Ladakh mountain ranges. The road is maintained by the Border Roads Organisation (BRO) and is generally open from May to November, though it can close suddenly due to snowfall or rockslides. A small army chai (tea) stall operates near the summit, where visitors can enjoy a hot drink at over 5,000 m. The pass is an iconic milestone for adventure motorcyclists and cyclists.",
    images: [
      "https://images.unsplash.com/photo-1612544409025-a1cd4af9be37?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "May to October",
    highlights: ["World's Highest Motorable Pass", "Karakoram Range Views", "BRO Signboards", "Summit Photography"],
    nearbyAttractions: ["Nubra Valley", "Diskit Monastery", "South Pullu Checkpost", "North Pullu Checkpost"],
    travelTips: [
      "Start early — roads are clearer in the morning and afternoon traffic can cause long queues.",
      "Altitude sickness is a real risk; don't rush and carry basic medicine.",
      "Fuel up in Leh — no fuel available at or beyond the pass.",
      "Inner Line Permit required for travel beyond to Nubra Valley.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Chang La",
    slug: "chang-la",
    category: "pass",
    latitude: 33.9928,
    longitude: 77.9269,
    altitude: "5,360 m",
    distanceFromLeh: "53 km",
    shortDescription:
      "The third-highest motorable pass in the world, the primary route connecting Leh to Pangong Lake.",
    longDescription:
      "Chang La is a high mountain pass in the Ladakh region at an elevation of approximately 5,360 m, making it one of the highest motorable passes in the world. It is the primary route from Leh to the Pangong Tso lake. The pass is managed by the Indian Army, with a small temple (Chang La Baba Mandir) dedicated to a soldier who served here. The pass is located in the Chang La mountain range, a sub-range of the Ladakh Range, and is characterised by dramatic terrain with snow-covered peaks on all sides. Like Khardung La, it is maintained by the BRO.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "May to September",
    highlights: ["Chang La Baba Mandir", "Snow-Covered Peaks", "Army Check Post", "Pangong Road Route"],
    nearbyAttractions: ["Pangong Lake", "Durbuk Village", "Tangtse Village"],
    travelTips: [
      "The pass frequently closes due to snowfall even in summer — check conditions in Leh.",
      "Carry warm clothes — temperatures can drop below freezing at the summit.",
      "Inner Line Permit for Pangong Tso is checked at Tangtse, beyond the pass.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Lamayuru",
    slug: "lamayuru",
    category: "monastery",
    latitude: 34.2688,
    longitude: 76.7719,
    altitude: "3,510 m",
    distanceFromLeh: "127 km",
    shortDescription:
      "Ladakh's oldest monastery perched on an eroded moonland landscape, offering one of the most surreal views in the Himalayas.",
    longDescription:
      "Lamayuru Monastery, also known as Yuru Gompa, is one of the oldest and largest monasteries in Ladakh, dating back to the 10th century. It is perched dramatically on an eroded hilltop above the Indus Valley in a lunar landscape known as 'Moonland' — where centuries of erosion have sculpted the earth into an otherworldly terrain of pale cliffs and crumbling towers. The monastery belongs to the Drikung Kagyu sect of Tibetan Buddhism and houses around 150 monks. It hosts the Yuru Kabgyat festival each summer, featuring dramatic masked Cham dances. The drive from Leh on the Srinagar highway passes through stunning gorges and is itself a highlight.",
    images: [
      "https://images.unsplash.com/photo-1568454537842-d933259bb258?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "May to September",
    highlights: ["Moonland Landscape", "Ancient Frescoes", "Yuru Kabgyat Festival", "Indus Valley Views"],
    nearbyAttractions: ["Alchi Monastery", "Basgo Palace", "Rizong Monastery", "Magnetic Hill"],
    travelTips: [
      "Best visited as a stop on the Leh–Kargil road.",
      "Photography inside the monastery requires permission.",
      "The Moonland landscape is best photographed in the soft light of early morning or late afternoon.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Magnetic Hill",
    slug: "magnetic-hill",
    category: "town",
    latitude: 34.2093,
    longitude: 77.3578,
    altitude: "3,287 m",
    distanceFromLeh: "30 km",
    shortDescription:
      "A gravity-defying optical illusion on the Leh–Kargil highway where vehicles appear to roll uphill on their own.",
    longDescription:
      "Magnetic Hill is a peculiar stretch of road on the Leh–Kargil–Srinagar National Highway, approximately 30 km from Leh, at an altitude of 3,287 m. The hill is famous for what appears to be a supernatural gravity-defying phenomenon — vehicles placed in neutral seem to roll uphill against the slope. In reality, this is an optical illusion caused by the surrounding landscape, where the layout of the hills and the sky tricks the eye into perceiving the slight downward slope as an uphill incline. Despite the scientific explanation, the spot draws thousands of tourists. Nearby is the Gurudwara Pathar Sahib, a Sikh shrine honouring Guru Nanak Dev Ji's visit to Ladakh, and the confluence of the Indus and Zanskar rivers (Sangam) is just a short drive away.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "May to October",
    highlights: ["Gravity-Defying Illusion", "Gurudwara Pathar Sahib", "Zanskar-Indus Sangam", "Rafting at Nimoo"],
    nearbyAttractions: ["Zanskar River Confluence", "Gurudwara Pathar Sahib", "Basgo Fort", "Alchi Monastery"],
    travelTips: [
      "Park on the designated yellow box on the road to experience the illusion.",
      "Combined with Zanskar Sangam and Pathar Sahib for a great half-day excursion from Leh.",
      "River rafting on the Zanskar near Nimoo is thrilling and bookable in Leh.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Diskit Monastery",
    slug: "diskit-monastery",
    category: "monastery",
    latitude: 34.5567,
    longitude: 77.5835,
    altitude: "3,050 m",
    distanceFromLeh: "150 km",
    shortDescription:
      "The oldest and largest monastery in Nubra Valley, crowned by a 32-metre Maitreya Buddha statue watching over the valley.",
    longDescription:
      "Diskit Monastery (Deskit Gompa) is the oldest and largest Buddhist monastery in the Nubra Valley, dating back to the 14th century. It belongs to the Gelugpa (Yellow Hat) sect of Tibetan Buddhism and is home to around 100 monks. The monastery is famous for its colossal 32-metre statue of Maitreya — the Future Buddha — which was built in 2010 and consecrated by the Dalai Lama. The statue faces down the Shyok Valley as a symbol of peace, and can be seen for miles. The monastery itself is perched on a hilltop and contains several prayer halls, temples, courtyards and a drum tower. It houses a terrifying papier-mâché effigy of the demon Chokyong, said to have been slain by a Buddhist master.",
    images: [
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "June to September",
    highlights: ["32m Maitreya Buddha Statue", "14th-Century Frescoes", "Dosmoche Festival", "Nubra Valley Panorama"],
    nearbyAttractions: ["Hunder Sand Dunes", "Nubra Valley", "Sumur Monastery", "Panamik Hot Springs"],
    travelTips: [
      "Combine with Hunder dunes and camel ride for a full Nubra Valley day.",
      "Modest clothing required — shoulders and knees should be covered.",
      "Photography is generally allowed outside but ask permission inside temple rooms.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Alchi Monastery",
    slug: "alchi-monastery",
    category: "monastery",
    latitude: 34.2291,
    longitude: 77.0801,
    altitude: "3,100 m",
    distanceFromLeh: "70 km",
    shortDescription:
      "A thousand-year-old monastic complex with some of the finest Kashmir-style Buddhist art in the entire Himalayas.",
    longDescription:
      "Alchi Monastery (Alchi Choskhor) is one of the most important and oldest Buddhist monasteries in Ladakh, founded in the 11th century by Lotsawa Rinchen Zangpo, the 'Great Translator'. Unlike most Ladakhi monasteries perched on hilltops, Alchi sits on flat ground beside the Indus River. It is renowned for its extraordinarily fine woodcarvings, clay sculptures, and Kashmiri-influenced wall paintings that date back 900–1,000 years, depicting mandalas, bodhisattvas, and narrative scenes in exquisite detail. The Sum-tsek (three-storeyed temple) contains some of the most beautifully preserved Kashmiri-style Buddhist art anywhere in the world. The complex is maintained by monks from Likir Monastery.",
    images: [
      "https://images.unsplash.com/photo-1550586338-e28d13a508d4?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "May to October",
    highlights: ["1,000-Year-Old Wall Paintings", "Sum-tsek Temple", "Kashmiri Buddhist Art", "Indus River Location"],
    nearbyAttractions: ["Likir Monastery", "Lamayuru Monastery", "Basgo Fort", "Magnetic Hill"],
    travelTips: [
      "The monastery is small — photography inside is strictly prohibited.",
      "A knowledgeable local guide greatly enhances the experience here.",
      "Alchi village has good cafes serving traditional Ladakhi food.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Thiksey Monastery",
    slug: "thiksey-monastery",
    category: "monastery",
    latitude: 33.9706,
    longitude: 77.6676,
    altitude: "3,600 m",
    distanceFromLeh: "19 km",
    shortDescription:
      "A magnificent 12-storey monastery complex resembling the Potala Palace in Lhasa, housing a 15-metre Maitreya Buddha statue.",
    longDescription:
      "Thiksey Monastery is a large Gelugpa Buddhist monastery in the Indus Valley, 19 km east of Leh. Rising 12 storeys on a hilltop, it is often compared to the Potala Palace in Lhasa for its commanding appearance and architectural grandeur. The monastery was founded in the 15th century and is home to approximately 60 monks. It houses a remarkable collection of Buddhist art — chortens (stupas), thangkas (scroll paintings), swords, statues, and wall paintings. The highlight is a two-storey-high Maitreya Buddha statue built in 1980 in honour of the Dalai Lama. The morning puja (prayer ceremony) at dawn is a deeply atmospheric experience open to respectful visitors.",
    images: [
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "Year round (best May–October)",
    highlights: ["12-Storey Architecture", "15m Maitreya Statue", "Dawn Puja Ceremony", "Indus Valley Panorama"],
    nearbyAttractions: ["Shey Palace", "Stok Palace", "Hemis Monastery", "Matho Monastery"],
    travelTips: [
      "Arrive by 6:30 AM to witness the dawn puja — monks in crimson robes chanting is unforgettable.",
      "The rooftop offers one of the finest views of the Indus Valley and Stok Kangri peak.",
      "Entry fee is nominal — contributes to monastery maintenance.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Druk White Lotus School",
    slug: "druk-white-lotus-school",
    category: "school",
    latitude: 33.9232,
    longitude: 77.6081,
    altitude: "3,505 m",
    distanceFromLeh: "15 km",
    shortDescription:
      "An award-winning sustainable school inspired by Shang-ri-La, designed by Arup Associates and opened in 2001 near Shey.",
    longDescription:
      "The Druk White Lotus School at Shey, near Leh, is an internationally celebrated educational institution that inspired the 2011 film Rockstar. Designed by Arup Associates and built in phases from 2001, the school uses traditional Ladakhi building materials and forms combined with modern structural engineering and sustainable technology — solar power, passive heating, earthquake resistance. It won the World Architecture Festival Award and RIBA Award. The school provides modern, English-medium education to local Ladakhi children while ensuring they remain rooted in their Buddhist and Ladakhi heritage. The beautifully harmonious campus, with its iconic lotus-shaped layout in the high-altitude desert, is a masterwork of contextual architecture.",
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "May to September",
    highlights: ["Award-Winning Architecture", "Sustainable Design", "Rockstar Film Location", "Lotus Campus Layout"],
    nearbyAttractions: ["Shey Palace", "Thiksey Monastery", "Stok Palace", "Leh"],
    travelTips: [
      "Visitors are welcome but should not disturb classes — school hours are 9 AM to 3 PM.",
      "Photography of students requires permission from school management.",
      "A short visit here is rewarding for those interested in architecture and education.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Zanskar Valley",
    slug: "zanskar-valley",
    category: "valley",
    latitude: 33.4667,
    longitude: 76.7667,
    altitude: "3,500 m",
    distanceFromLeh: "230 km",
    shortDescription:
      "One of India's most remote and spectacular valleys, accessible only in summer by road or in winter via the legendary Chadar frozen river trek.",
    longDescription:
      "Zanskar is a remote sub-district of Kargil district, largely cut off from the outside world by snow for 7–8 months of the year. The valley is encircled by some of the highest peaks of the Himalayas and Zanskar Range, and is accessed via the Pensi La pass (4,401 m) from Kargil during summer, or by the extraordinary Chadar Trek — a frozen Zanskar River walk — in January-February. The valley has its own royal lineage, ancient monasteries (Karsha, Phugtal, Zangla), and a distinct culture. The Zanskar River, a major tributary of the Indus, provides one of the most thrilling whitewater rafting routes in Asia. The dramatic gorge it cuts through the mountains on its way to join the Indus is one of Ladakh's most surreal landscapes.",
    images: [
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "July to September (road); January–February (Chadar Trek)",
    highlights: ["Chadar Frozen River Trek", "Whitewater Rafting", "Phugtal Monastery", "Remote Wilderness"],
    nearbyAttractions: ["Karsha Monastery", "Phugtal Monastery", "Padum Town", "Zangla Fort"],
    travelTips: [
      "The road via Pensi La from Kargil is open June–October; book a jeep from Kargil.",
      "Chadar Trek requires a specialised guide and operator — extremely challenging.",
      "Mobile connectivity is essentially zero in Zanskar — inform family of your plans.",
      "Carry all necessary medications, fuel, and food supplies.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
  {
    name: "Suru Valley",
    slug: "suru-valley",
    category: "valley",
    latitude: 34.2667,
    longitude: 76.1667,
    altitude: "2,800 m",
    distanceFromLeh: "250 km",
    shortDescription:
      "A scenic green valley winding from Kargil towards Zanskar, framed by glaciers and the twin peaks of Nun and Kun.",
    longDescription:
      "Suru Valley is one of Ladakh's most picturesque valleys, stretching south from Kargil towards the Pensi La pass and Zanskar. Unlike the barren landscapes typical of Ladakh, the Suru Valley is comparatively green and lush, with villages, willow trees, and barley fields nourished by the Suru River. The valley is framed by the dramatic twin peaks of Nun (7,135 m) and Kun (7,077 m), the highest peaks in the Ladakh region. The majority population is Muslim, and the cultural landscape is quite different from the Buddhist villages of central Ladakh. Rangdum Monastery, a remote 18th-century Gelugpa monastery perched on a conical hill in the mid-valley, is a highlight of the drive. The valley is the primary approach route to Zanskar from Kargil.",
    images: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2070&auto=format&fit=crop",
    ],
    bestTimeToVisit: "June to October",
    highlights: ["Nun-Kun Massif Views", "Rangdum Monastery", "Green River Valley", "Glacier Views"],
    nearbyAttractions: ["Rangdum Monastery", "Panikhar Village", "Nun-Kun Base Camp", "Pensi La Pass"],
    travelTips: [
      "The Suru Valley is best experienced as part of a Kargil–Zanskar journey.",
      "Rangdum is an excellent camping spot — basic homestays available.",
      "The road can be rough and slow — a sturdy 4WD vehicle is recommended.",
    ],
    relatedBlogs: [],
    relatedPackages: [],
  },
];

const seedLocations = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/travel-booking";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for location seeding...");

    let created = 0;
    let updated = 0;

    for (const locationData of locationsData) {
      const existing = await Location.findOne({ slug: locationData.slug });
      if (existing) {
        await Location.updateOne({ slug: locationData.slug }, locationData);
        console.log(`  ↻  Updated: ${locationData.name}`);
        updated++;
      } else {
        await Location.create(locationData);
        console.log(`  ✓  Seeded:  ${locationData.name}`);
        created++;
      }
    }

    console.log(`\nLocation seeding completed!`);
    console.log(`  Created: ${created}  |  Updated: ${updated}`);
  } catch (error) {
    console.error("Error seeding locations:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedLocations();
