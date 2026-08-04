import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LanguageCode = 'en' | 'hi' | 'te' | 'ta';

type Translations = Record<string, string>;

const translations: Record<LanguageCode, Translations> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.tool': 'Recommendation Tool',
    'nav.about': 'About Project',
    'nav.contact': 'Contact',
    'nav.language': 'Language',

    // Home
    'home.hero.title': 'Smart Farming with',
    'home.hero.titleHighlight': 'AI Precision',
    'home.hero.subtitle':
      'Maximize your yield by choosing the right crop. Our machine learning model analyzes your soil and climate data to provide expert recommendations in seconds.',
    'home.hero.cta': 'Start Prediction',
    'home.why.title': 'Why Use AgroSmart?',
    'home.feature.soil.title': 'Soil Analysis',
    'home.feature.soil.desc':
      'Deep analysis of Nitrogen, Phosphorus, and Potassium levels for precise matching.',
    'home.feature.climate.title': 'Climatic Factors',
    'home.feature.climate.desc':
      'Considers temperature, humidity, and rainfall patterns for optimal growth.',
    'home.feature.accuracy.title': 'High Accuracy',
    'home.feature.accuracy.desc':
      'Powered by advanced Random Forest logic to ensure the best possible crop fit.',

    // Tool page
    'tool.title': 'Farmer-Friendly Crop Tool',
    'tool.subtitle':
      'Select your local conditions below to get the best crop recommendations.',
    'tool.form.title': 'Farm Conditions',
    'tool.season.label': 'Season',
    'tool.season.summer': '☀️ Summer',
    'tool.season.winter': '❄️ Winter',
    'tool.season.monsoon': '🌧️ Monsoon',
    'tool.soil.label': 'Soil Type',
    'tool.soil.sandy': '🏖️ Sandy Soil',
    'tool.soil.clay': '🧱 Clay Soil',
    'tool.soil.loamy': '🌱 Loamy Soil',
    'tool.soil.black': '🌑 Black Soil',
    'tool.rainfall.label': 'Rainfall Level',
    'tool.rainfall.low': '💧 Low Rainfall',
    'tool.rainfall.medium': '🌧️ Medium Rainfall',
    'tool.rainfall.high': '🌊 High Rainfall',
    'tool.temperature.label': 'Temperature',
    'tool.temperature.cold': '🥶 Cold',
    'tool.temperature.moderate': '🌡️ Moderate',
    'tool.temperature.hot': '🔥 Hot',
    'tool.submit': 'Predict Best Crops',
    'tool.loading.title': 'Analyzing Conditions...',
    'tool.loading.subtitle':
      'Finding the top 3 most suitable crops for your farm',
    'tool.error.title': 'Prediction Error',
    'tool.results.title': 'Recommended Crops',
    'tool.results.reset': 'Reset Prediction',
    'tool.results.rank': 'Rank',
    'tool.results.match': 'Match',
    'tool.results.expertTitle': 'Expert Insight',
    'tool.results.expertText':
      'The top recommendation is the statistically best fit for your land. However, the other two crops are also viable alternatives depending on market demand and seed availability.',
    'tool.empty.title': 'Awaiting Your Input',
    'tool.empty.subtitle':
      'Select your farm conditions on the left to see the best crops for your land.',

    // About
    'about.title': 'About the Project',
    'about.p1':
      'The Agricultural Crop Recommendation System is a state-of-the-art solution designed to bridge the gap between traditional farming and modern data science. By leveraging advanced machine learning algorithms, we help farmers make informed decisions that directly impact their productivity and sustainability.',
    'about.tech.title': 'The Technology',
    'about.tech.body':
      'Our system utilizes a high-performance Random Forest Classifier. This ensemble learning method is renowned for its high accuracy in agricultural datasets because it handles non-linear relationships between soil nutrients (N, P, K) and climatic conditions (Temperature, Humidity, Rainfall) exceptionally well.',
    'about.keyParams.title': 'Key Parameters Analyzed:',
    'about.keyParams.soil': 'Nitrogen, Phosphorus, Potassium (Soil Health)',
    'about.keyParams.climate': 'Temperature & Humidity (Climate)',
    'about.keyParams.ph': 'Soil pH (Acidity/Alkalinity)',
    'about.keyParams.rainfall': 'Annual Rainfall (Water Availability)',
    'about.mission.title': 'Our Mission',
    'about.mission.body':
      'Our mission is to empower small-scale and commercial farmers with AI tools that were previously only available to large industrial operations. By optimizing crop selection, we aim to reduce resource waste, prevent crop failure, and increase global food security.',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle':
      "Have questions about our AI model or how to use the tool? We're here to help.",
    'contact.supportEmail': 'support@agrosmart.ai',
    'contact.github': 'github.com/agrosmart',
    'contact.form.name': 'Name',
    'contact.form.name.placeholder': 'John Doe',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'john@example.com',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'How can we help you?',
    'contact.form.submit': 'Send Message',

    // Footer
    'footer.tagline':
      'Empowering farmers with AI-driven insights for sustainable and productive agriculture.',
    'footer.quickLinks': 'Quick Links',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.docs': 'Documentation',
    'footer.connect': 'Connect',
    'footer.copyright': '© 2026 AgroSmart AI. All rights reserved.',
  },
  hi: {
    'nav.home': 'होम',
    'nav.tool': 'सिफारिश टूल',
    'nav.about': 'परियोजना के बारे में',
    'nav.contact': 'संपर्क',
    'nav.language': 'भाषा',

    'home.hero.title': 'स्मार्ट खेती',
    'home.hero.titleHighlight': 'एआई सटीकता के साथ',
    'home.hero.subtitle':
      'सही फसल चुनकर अपनी पैदावार बढ़ाएँ। हमारा मशीन लर्निंग मॉडल आपकी मिट्टी और मौसम के डेटा का विश्लेषण करके कुछ ही सेकंड में विशेषज्ञ सिफारिशें देता है।',
    'home.hero.cta': 'भविष्यवाणी शुरू करें',
    'home.why.title': 'एग्रोस्मार्ट क्यों?',
    'home.feature.soil.title': 'मिट्टी विश्लेषण',
    'home.feature.soil.desc':
      'नाइट्रोजन, फॉस्फोरस और पोटैशियम स्तरों का गहन विश्लेषण सटीक मिलान के लिए।',
    'home.feature.climate.title': 'जलवायु कारक',
    'home.feature.climate.desc':
      'उत्तम वृद्धि के लिए तापमान, आर्द्रता और वर्षा पैटर्न को ध्यान में रखता है।',
    'home.feature.accuracy.title': 'उच्च सटीकता',
    'home.feature.accuracy.desc':
      'उन्नत रैंडम फॉरेस्ट लॉजिक द्वारा संचालित, ताकि सर्वोत्तम फसल मेल सुनिश्चित हो सके।',

    'tool.title': 'किसान अनुकूल फसल टूल',
    'tool.subtitle':
      'सर्वोत्तम फसल सिफारिशें पाने के लिए नीचे अपने स्थानीय परिस्थितियों का चयन करें।',
    'tool.form.title': 'खेत की परिस्थितियाँ',
    'tool.season.label': 'मौसम',
    'tool.season.summer': '☀️ गर्मी',
    'tool.season.winter': '❄️ सर्दी',
    'tool.season.monsoon': '🌧️ मानसून',
    'tool.soil.label': 'मिट्टी का प्रकार',
    'tool.soil.sandy': '🏖️ रेतीली मिट्टी',
    'tool.soil.clay': '🧱 चिकनी मिट्टी',
    'tool.soil.loamy': '🌱 दोमट मिट्टी',
    'tool.soil.black': '🌑 काली मिट्टी',
    'tool.rainfall.label': 'वर्षा स्तर',
    'tool.rainfall.low': '💧 कम वर्षा',
    'tool.rainfall.medium': '🌧️ मध्यम वर्षा',
    'tool.rainfall.high': '🌊 अधिक वर्षा',
    'tool.temperature.label': 'तापमान',
    'tool.temperature.cold': '🥶 ठंडा',
    'tool.temperature.moderate': '🌡️ मध्यम',
    'tool.temperature.hot': '🔥 गर्म',
    'tool.submit': 'सर्वोत्तम फसल अनुमान',
    'tool.loading.title': 'परिस्थितियों का विश्लेषण हो रहा है...',
    'tool.loading.subtitle':
      'आपके खेत के लिए सबसे उपयुक्त 3 फसलों की खोज कर रहे हैं',
    'tool.error.title': 'भविष्यवाणी त्रुटि',
    'tool.results.title': 'अनुशंसित फसलें',
    'tool.results.reset': 'भविष्यवाणी रीसेट करें',
    'tool.results.rank': 'क्रम',
    'tool.results.match': 'मिलान',
    'tool.results.expertTitle': 'विशेषज्ञ की राय',
    'tool.results.expertText':
      'शीर्ष सिफारिश आपकी भूमि के लिए सांख्यिकीय रूप से सबसे उपयुक्त है। हालाँकि, अन्य दो फसलें भी बाजार की माँग और बीज उपलब्धता के अनुसार उपयुक्त विकल्प हैं।',
    'tool.empty.title': 'आपके इनपुट की प्रतीक्षा',
    'tool.empty.subtitle':
      'सर्वोत्तम फसलें देखने के लिए बाएँ तरफ अपने खेत की परिस्थितियाँ चुनें।',

    'about.title': 'परियोजना के बारे में',
    'about.p1':
      'कृषि फसल सिफारिश प्रणाली एक अत्याधुनिक समाधान है, जो पारंपरिक खेती और आधुनिक डेटा विज्ञान के बीच की खाई को पाटने के लिए बनाई गई है। उन्नत मशीन लर्निंग एल्गोरिद्म का उपयोग करके हम किसानों को सूचित निर्णय लेने में मदद करते हैं, जो सीधे उनकी उत्पादकता और स्थिरता को प्रभावित करते हैं।',
    'about.tech.title': 'प्रौद्योगिकी',
    'about.tech.body':
      'हमारी प्रणाली एक उच्च प्रदर्शन रैंडम फॉरेस्ट क्लासिफायर का उपयोग करती है। यह एन्सेम्बल लर्निंग विधि कृषि डेटा सेट में उच्च सटीकता के लिए जानी जाती है, क्योंकि यह मिट्टी के पोषक तत्वों (N, P, K) और जलवायु स्थितियों (तापमान, आर्द्रता, वर्षा) के बीच गैर-रैखिक संबंधों को अच्छी तरह संभालती है।',
    'about.keyParams.title': 'विश्लेषित मुख्य पैरामीटर:',
    'about.keyParams.soil': 'नाइट्रोजन, फॉस्फोरस, पोटैशियम (मिट्टी स्वास्थ्य)',
    'about.keyParams.climate': 'तापमान और आर्द्रता (जलवायु)',
    'about.keyParams.ph': 'मिट्टी pH (अम्लता/क्षारता)',
    'about.keyParams.rainfall': 'वार्षिक वर्षा (जल उपलब्धता)',
    'about.mission.title': 'हमारा उद्देश्य',
    'about.mission.body':
      'हमारा उद्देश्य छोटे और व्यावसायिक दोनों किसानों को एआई टूल्स से सशक्त बनाना है, जो पहले केवल बड़ी औद्योगिक इकाइयों के लिए उपलब्ध थे। फसल चयन को अनुकूलित करके, हम संसाधन बर्बादी को कम करना, फसल विफलता को रोकना और वैश्विक खाद्य सुरक्षा बढ़ाना चाहते हैं।',

    'contact.title': 'संपर्क करें',
    'contact.subtitle':
      'हमारे एआई मॉडल या टूल का उपयोग करने के बारे में प्रश्न हैं? हम मदद के लिए यहाँ हैं।',
    'contact.supportEmail': 'support@agrosmart.ai',
    'contact.github': 'github.com/agrosmart',
    'contact.form.name': 'नाम',
    'contact.form.name.placeholder': 'राम कुमार',
    'contact.form.email': 'ईमेल',
    'contact.form.email.placeholder': 'ram@example.com',
    'contact.form.message': 'संदेश',
    'contact.form.message.placeholder': 'हम आपकी कैसे मदद कर सकते हैं?',
    'contact.form.submit': 'संदेश भेजें',

    'footer.tagline':
      'सतत और उत्पादक कृषि के लिए एआई आधारित जानकारियों से किसानों को सशक्त बनाना।',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.privacy': 'प्राइवेसी नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.docs': 'प्रलेखन',
    'footer.connect': 'कनेक्ट',
    'footer.copyright': '© 2026 एग्रोस्मार्ट एआई. सर्वाधिकार सुरक्षित।',
  },
  te: {
    'nav.home': 'హోమ్',
    'nav.tool': 'పంట సూచన సాధనం',
    'nav.about': 'ప్రాజెక్టు గురించి',
    'nav.contact': 'సంప్రదించండి',
    'nav.language': 'భాష',

    'home.hero.title': 'స్మార్ట్ వ్యవసాయం',
    'home.hero.titleHighlight': 'ఏఐ ఖచ్చితత్వంతో',
    'home.hero.subtitle':
      'సరైన పంటను ఎంచుకొని మీ దిగుబడిని పెంచుకోండి. మా మెషిన్ లెర్నింగ్ మోడల్ మీ నేల మరియు వాతావరణ డేటాను విశ్లేషించి కొన్ని సెకన్లలో నిపుణుల సూచనలను ఇస్తుంది.',
    'home.hero.cta': 'అంచనాను ప్రారంభించండి',
    'home.why.title': 'ఎందుకు అగ్రోస్మార్ట్?',
    'home.feature.soil.title': 'నేల విశ్లేషణ',
    'home.feature.soil.desc':
      'నైట్రజన్, ఫాస్ఫరస్ మరియు పొటాషియం స్థాయిలను లోతుగా విశ్లేషించి ఖచ్చితమైన సరిపోలిక ఇవ్వబడుతుంది.',
    'home.feature.climate.title': 'వాతావరణ కారకాలు',
    'home.feature.climate.desc':
      'ఉత్తమ పెరుగుదల కోసం ఉష్ణోగ్రత, ఆర్ద్రత మరియు వర్షపాతం నమూనాలను పరిగణనలోకి తీసుకుంటుంది.',
    'home.feature.accuracy.title': 'అత్యధిక ఖచ్చితత్వం',
    'home.feature.accuracy.desc':
      'అత్యధునిక రాండమ్ ఫారెస్ట్ లాజిక్ చేత నడపబడుతుంది, తద్వారా మీకు అత్యుత్తమ పంట సరిపోలిక లభిస్తుంది.',

    'tool.title': 'రైతువారికి అనుకూలమైన పంట సాధనం',
    'tool.subtitle':
      'క్రింది మీ స్థానిక పరిస్థితులను ఎంచుకుని ఉత్తమ పంట సూచనలను పొందండి.',
    'tool.form.title': 'పొలం పరిస్థితులు',
    'tool.season.label': 'ఋతువు',
    'tool.season.summer': '☀️ వేసవి',
    'tool.season.winter': '❄️ శీతాకాలం',
    'tool.season.monsoon': '🌧️ వర్షాకాలం',
    'tool.soil.label': 'నేల రకం',
    'tool.soil.sandy': '🏖️ ఇసుక నేల',
    'tool.soil.clay': '🧱 మట్టినేలు',
    'tool.soil.loamy': '🌱 లోమి నేల',
    'tool.soil.black': '🌑 నల్ల నేల',
    'tool.rainfall.label': 'వర్షపాతం స్థాయి',
    'tool.rainfall.low': '💧 తక్కువ వర్షపాతం',
    'tool.rainfall.medium': '🌧️ మధ్యస్థ వర్షపాతం',
    'tool.rainfall.high': '🌊 అధిక వర్షపాతం',
    'tool.temperature.label': 'ఉష్ణోగ్రత',
    'tool.temperature.cold': '🥶 చల్లగా',
    'tool.temperature.moderate': '🌡️ మితంగా',
    'tool.temperature.hot': '🔥 వేడిగా',
    'tool.submit': 'ఉత్తమ పంటలను అంచనా వేయండి',
    'tool.loading.title': 'పరిస్థితులను విశ్లేషిస్తున్నాం...',
    'tool.loading.subtitle':
      'మీ పొలానికి అత్యంత అనుకూలమైన 3 పంటలను కనుగొంటున్నాం',
    'tool.error.title': 'అంచనా లోపం',
    'tool.results.title': 'సిఫార్సు చేసిన పంటలు',
    'tool.results.reset': 'అంచనాను రీసెట్ చేయండి',
    'tool.results.rank': 'క్రమం',
    'tool.results.match': 'సరిపోలిక',
    'tool.results.expertTitle': 'నిపుణుల సూచన',
    'tool.results.expertText':
      'పై సిఫార్సు గణాంకపరంగా మీ భూమికి అత్యుత్తమంగా సరిపోతుంది. అయితే, మిగతా రెండు పంటలు కూడా మార్కెట్ డిమాండ్ మరియు విత్తనాల లభ్యతను బట్టి మంచి ప్రత్యామ్నాయాలు.',
    'tool.empty.title': 'మీ ఇన్‌పుట్ కోసం ఎదురుచూస్తున్నాం',
    'tool.empty.subtitle':
      'మీ పొలంలోని పరిస్థితులను ఎడమవైపున ఎంచుకుని ఉత్తమ పంటలను చూడండి.',

    'about.title': 'ప్రాజెక్టు గురించి',
    'about.p1':
      'వ్యవసాయ పంట సూచన వ్యవస్థ సాంప్రదాయ వ్యవసాయం మరియు ఆధునిక డేటా సైన్స్ మధ్య గల అంతరాన్ని తగ్గించడానికి రూపొందించబడిన ఆధునిక పరిష్కారం. ఆధునిక మెషిన్ లెర్నింగ్ ఆల్గోరిదమ్‌లను ఉపయోగించడం ద్వారా రైతులు తమ ఉత్పాదకత మరియు స్థిరత్వంపై నేరుగా ప్రభావం చూపే నిర్ణయాలు తీసుకోవడంలో మేము సహాయపడతాము.',
    'about.tech.title': 'సాంకేతికత',
    'about.tech.body':
      'మా వ్యవస్థ అధిక పనితీరు గల రాండమ్ ఫారెస్ట్ క్లాసిఫియర్‌ను ఉపయోగిస్తుంది. నేల పోషకాలు (N, P, K) మరియు వాతావరణ పరిస్థితులు (ఉష్ణోగ్రత, ఆర్ద్రత, వర్షపాతం) మధ్య రేఖీయేతర సంబంధాలను బాగా నిర్వహించగలదని ఇది వ్యవసాయ డేటా సెట్లలో అధిక ఖచ్చితత్వానికి ప్రసిద్ధి చెందింది.',
    'about.keyParams.title': 'విశ్లేషించిన కీలక పారామీటర్లు:',
    'about.keyParams.soil': 'నైట్రజన్, ఫాస్ఫరస్, పొటాషియం (నేల ఆరోగ్యం)',
    'about.keyParams.climate': 'ఉష్ణోగ్రత & ఆర్ద్రత (వాతావరణం)',
    'about.keyParams.ph': 'నేల pH (ఆమ్లత్వం/క్షారత్వం)',
    'about.keyParams.rainfall': 'వార్షిక వర్షపాతం (నీటి అందుబాటు)',
    'about.mission.title': 'మా లక్ష్యం',
    'about.mission.body':
      'మా లక్ష్యం చిన్న మరియు వాణిజ్య రైతులను పెద్ద పారిశ్రామిక సంస్థలకు మాత్రమే అందుబాటులో ఉన్న ఏఐ సాధనాలతో శక్తివంతం చేయడం. పంట ఎంపికను ఆప్టిమైజ్ చేయడం ద్వారా, మేము వనరుల వృథాను తగ్గించడం, పంట వైఫల్యాన్ని నిరోధించడం మరియు గ్లోబల్ ఆహార భద్రతను పెంచాలని లక్ష్యంగా పెట్టుకున్నాం.',

    'contact.title': 'మమ్మల్ని సంప్రదించండి',
    'contact.subtitle':
      'మా ఏఐ మోడల్ గురించి లేదా సాధనాన్ని ఎలా ఉపయోగించాలో ప్రశ్నలున్నాయా? మేము సహాయం చేయడానికి సిద్ధంగా ఉన్నాము.',
    'contact.supportEmail': 'support@agrosmart.ai',
    'contact.github': 'github.com/agrosmart',
    'contact.form.name': 'పేరు',
    'contact.form.name.placeholder': 'రామ్ కుమార్',
    'contact.form.email': 'ఇమెయిల్',
    'contact.form.email.placeholder': 'ram@example.com',
    'contact.form.message': 'సందేశం',
    'contact.form.message.placeholder': 'మేము మీకు ఎలా సహాయపడగలం?',
    'contact.form.submit': 'సందేశాన్ని పంపండి',

    'footer.tagline':
      'స్థిరమైన మరియు అధిక ఉత్పాదకత గల వ్యవసాయానికి ఏఐ ఆధారిత జ్ఞానంతో రైతులను శక్తివంతం చేయడం.',
    'footer.quickLinks': 'క్విక్ లింక్స్',
    'footer.privacy': 'గోప్యతా విధానం',
    'footer.terms': 'సేవా నిబంధనలు',
    'footer.docs': 'డాక్యుమెంటేషన్',
    'footer.connect': 'కనెక్ట్',
    'footer.copyright':
      '© 2026 అగ్రోస్మార్ట్ ఏఐ. అన్ని హక్కులుสงచుకోబడ్డాయి.',
  },
  ta: {
    'nav.home': 'முகப்பு',
    'nav.tool': 'பயிர் பரிந்துரை கருவி',
    'nav.about': 'திட்டம் பற்றி',
    'nav.contact': 'தொடர்பு',
    'nav.language': 'மொழி',

    'home.hero.title': 'ச마트் விவசாயம்',
    'home.hero.titleHighlight': 'ஏஐ துல்லியத்துடன்',
    'home.hero.subtitle':
      'சரியான பயிரை தேர்வு செய்து உங்கள் விளைச்சலை அதிகரிக்கவும். எங்கள் மெஷின் லெர்னிங் மாடல் உங்கள் மண் மற்றும் காலநிலை தரவுகளை பகுப்பாய்வு செய்து சில வினாடிகளில் நிபுணர் பரிந்துரைகளை வழங்கும்.',
    'home.hero.cta': 'முன்னறிவு தொடங்கவும்',
    'home.why.title': 'ஏன் அக்கிரோஸ்மார்ட்?',
    'home.feature.soil.title': 'மண் பகுப்பாய்வு',
    'home.feature.soil.desc':
      'நைட்ரஜன், பாஸ்பரஸ், பொட்டாசியம் மட்டங்களை ஆழமாக பகுப்பாய்வு செய்து துல்லியமான பொருத்தத்தை வழங்குகிறது.',
    'home.feature.climate.title': 'காலநிலை காரணிகள்',
    'home.feature.climate.desc':
      'சிறந்த வளர்ச்சிக்காக வெப்பநிலை, ஈரப்பதம் மற்றும் மழைப்பொழிவு முறைமைகளைக் கருத்தில் கொள்ளுகிறது.',
    'home.feature.accuracy.title': 'அதிக துல்லியம்',
    'home.feature.accuracy.desc':
      'அதிநவீன ரேண்டம் ஃபாரெஸ்ட் லாஜிக் மூலம் இயக்கப்படுகிறது, இது உங்களுக்கு மிகச்சிறந்த பயிர் பொருத்தத்தை உறுதிப்படுத்துகிறது.',

    'tool.title': 'விவசாயிக்கு ஏற்ற பயிர் கருவி',
    'tool.subtitle':
      'சிறந்த பயிர் பரிந்துரைகளைப் பெற கீழே உங்கள் உள்ளூர் நிலைகளைத் தேர்ந்தெடுக்கவும்.',
    'tool.form.title': 'வயல் நிலைகள்',
    'tool.season.label': 'பருவம்',
    'tool.season.summer': '☀️ கோடை',
    'tool.season.winter': '❄️ குளிர்காலம்',
    'tool.season.monsoon': '🌧️ மழைக்காலம்',
    'tool.soil.label': 'மண் வகை',
    'tool.soil.sandy': '🏖️ மணல் மண்',
    'tool.soil.clay': '🧱 களிமண்',
    'tool.soil.loamy': '🌱 லோமி மண்',
    'tool.soil.black': '🌑 கருப்பு மண்',
    'tool.rainfall.label': 'மழைப்பொழிவு அளவு',
    'tool.rainfall.low': '💧 குறைந்த மழை',
    'tool.rainfall.medium': '🌧️ நடுத்தர மழை',
    'tool.rainfall.high': '🌊 அதிக மழை',
    'tool.temperature.label': 'வெப்பநிலை',
    'tool.temperature.cold': '🥶 குளிர்',
    'tool.temperature.moderate': '🌡️ மிதமான',
    'tool.temperature.hot': '🔥 சூடு',
    'tool.submit': 'சிறந்த பயிர்களை கணிக்கவும்',
    'tool.loading.title': 'நிலைகளை பகுப்பாய்வு செய்கிறோம்...',
    'tool.loading.subtitle':
      'உங்கள் வயலுக்கு மிகவும் பொருத்தமான 3 பயிர்களை கண்டறிகிறோம்',
    'tool.error.title': 'முன்னறிவு பிழை',
    'tool.results.title': 'பரிந்துரைக்கப்பட்ட பயிர்கள்',
    'tool.results.reset': 'முன்னறிவை மீட்டமைக்கவும்',
    'tool.results.rank': 'இடம்',
    'tool.results.match': 'பொருத்தம்',
    'tool.results.expertTitle': 'நிபுணர் பார்வை',
    'tool.results.expertText':
      'மேல் பரிந்துரைக்கப்பட்ட பயிர் புள்ளிவிவர ரீதியாக உங்கள் நிலத்திற்கு மிகவும் பொருத்தமானது. ஆனால் மற்ற இரண்டு பயிர்களும் சந்தை தேவை மற்றும் விதை கிடைப்பதன் அடிப்படையில் சிறந்த மாற்றுகளாகும்.',
    'tool.empty.title': 'உங்கள் உள்ளீட்டை எதிர்நோக்குகிறோம்',
    'tool.empty.subtitle':
      'சிறந்த பயிர்களைப் பார்க்க இடது பக்கத்தில் உள்ள உங்கள் வயல் நிலைகளைத் தேர்ந்தெடுக்கவும்.',

    'about.title': 'திட்டம் பற்றி',
    'about.p1':
      'விவசாய பயிர் பரிந்துரை அமைப்பு என்பது பாரம்பரிய விவசாயம் மற்றும் தற்போதைய தரவு அறிவியல் இடையேயான இடைவெளியை குறைக்க வடிவமைக்கப்பட்ட நவீன தீர்வாகும். மேம்பட்ட மெஷின் லெர்னிங் ஆல்காரிதம்களைப் பயன்படுத்துவதன் மூலம், விவசாயிகள் தங்களின் விளைச்சல் மற்றும் நீடித்த வளர்ச்சியை நேரடியாக பாதிக்கும் முடிவுகளை எடுக்க நாங்கள் உதவுகிறோம்.',
    'about.tech.title': 'தொழில்நுட்பம்',
    'about.tech.body':
      'எங்கள் அமைப்பு அதிக செயல்திறன் கொண்ட ரேண்டம் ஃபாரெஸ்ட் வகைப்பாட்டை பயன்படுத்துகிறது. இது மண் ஊட்டச்சத்துக்கள் (N, P, K) மற்றும் காலநிலை நிலைகள் (வெப்பநிலை, ஈரப்பதம், மழைப்பொழிவு) ஆகியவற்றுக்கிடையிலான நேர்மையற்ற தொடர்புகளை சிறப்பாக கையாளுவதால், இது விவசாய தரவுத்தொகுதிகளில் அதிக துல்லியத்திற்காக அறியப்படுகிறது.',
    'about.keyParams.title': 'பகுப்பாய்வு செய்யப்பட்ட முக்கிய அளவுருக்கள்:',
    'about.keyParams.soil': 'நைட்ரஜன், பாஸ்பரஸ், பொட்டாசியம் (மண் ஆரோக்கியம்)',
    'about.keyParams.climate': 'வெப்பநிலை & ஈரப்பதம் (காலநிலை)',
    'about.keyParams.ph': 'மண் pH (அமிலம்/அல்கலின்)',
    'about.keyParams.rainfall': 'வருடாந்திர மழைப்பொழிவு (நீர் கிடைக்கும் அளவு)',
    'about.mission.title': 'எங்கள் இலக்கு',
    'about.mission.body':
      'பெரிய தொழில்துறை நிறுவனங்களுக்கு மட்டுமே கிடைத்த ஏஐ கருவிகளை சிறு மற்றும் வாணிப விவசாயிகளுக்கும் வழங்குவது எங்கள் இலக்கு. பயிர் தேர்வை மேம்படுத்துவதன் மூலம், வள வீணாவதை குறைத்து, பயிர் சேதத்தைக் காக்கவும், உலக உணவு பாதுகாப்பை உயர்த்தவும் நாங்கள் முயல்கிறோம்.',

    'contact.title': 'எங்களை தொடர்பு கொள்ள',
    'contact.subtitle':
      'எங்கள் ஏஐ மாடல் பற்றி அல்லது கருவியை எப்படி பயன்படுத்துவது பற்றி கேள்விகள் உள்ளதா? உதவ நாங்கள் தயாராக உள்ளோம்.',
    'contact.supportEmail': 'support@agrosmart.ai',
    'contact.github': 'github.com/agrosmart',
    'contact.form.name': 'பெயர்',
    'contact.form.name.placeholder': 'ராம் குமார்',
    'contact.form.email': 'மின்னஞ்சல்',
    'contact.form.email.placeholder': 'ram@example.com',
    'contact.form.message': 'செய்தி',
    'contact.form.message.placeholder': 'நாங்கள் எவ்வாறு உதவலாம்?',
    'contact.form.submit': 'செய்தியை அனுப்பவும்',

    'footer.tagline':
      'நிலைத்த மற்றும் அதிக உற்பத்தி கொண்ட விவசாயத்திற்காக ஏஐ அடிப்படையிலான அறிவுரைகளால் விவசாயிகளை வலுப்படுத்துகிறோம்.',
    'footer.quickLinks': 'விரைவான இணைப்புகள்',
    'footer.privacy': 'தனியுரிமை கொள்கை',
    'footer.terms': 'சேவை விதிமுறைகள்',
    'footer.docs': 'ஆவணங்கள்',
    'footer.connect': 'இணைப்பு',
    'footer.copyright':
      '© 2026 அக்கிரோஸ்மார்ட் ஏஐ. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
  },
};

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string) => {
    const langTable = translations[language] || translations.en;
    return langTable[key] ?? translations.en[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

