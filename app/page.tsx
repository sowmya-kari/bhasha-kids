"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import StoryGarden from "./story-garden";
import AksharaBuilder from "./akshara-builder";
import MoreGames from "./more-games";
import OpeningScreen from "./opening-screen";
import "./story-garden.css";
import "./akshara-builder.css";
import "./more-games.css";
import "./coloring-pencils.css";
import "./action-card-motion.css";
import "./opening-screen.css";
import "./illustrated-letters.css";

type Language = "Telugu" | "Hindi";
type LetterGroup = "Vowels" | "Consonants";
type LetterItem = { letter: string; roman: string };
type Example = { word: string; wordRoman: string; meaning: string; icon: string; audio?: string };

const letterSets: Record<Language, Record<LetterGroup, LetterItem[]>> = {
  Telugu: {
    Vowels: [
      ["అ", "A"], ["ఆ", "Aa"], ["ఇ", "I"], ["ఈ", "Ee"], ["ఉ", "U"], ["ఊ", "Oo"],
      ["ఋ", "Ru"], ["ౠ", "Roo"], ["ఎ", "E"], ["ఏ", "Ae"], ["ఐ", "Ai"], ["ఒ", "O"],
      ["ఓ", "Oa"], ["ఔ", "Au"], ["అం", "Am"], ["అః", "Aha"],
    ].map(([letter, roman]) => ({ letter, roman })),
    Consonants: [
      ["క", "Ka"], ["ఖ", "Kha"], ["గ", "Ga"], ["ఘ", "Gha"], ["ఙ", "Nga"],
      ["చ", "Cha"], ["ఛ", "Chha"], ["జ", "Ja"], ["ఝ", "Jha"], ["ఞ", "Nya"],
      ["ట", "Ta"], ["ఠ", "Tha"], ["డ", "Da"], ["ఢ", "Dha"], ["ణ", "Na"],
      ["త", "Ta"], ["థ", "Tha"], ["ద", "Da"], ["ధ", "Dha"], ["న", "Na"],
      ["ప", "Pa"], ["ఫ", "Pha"], ["బ", "Ba"], ["భ", "Bha"], ["మ", "Ma"],
      ["య", "Ya"], ["ర", "Ra"], ["ల", "La"], ["వ", "Va"], ["శ", "Sha"],
      ["ష", "Ssa"], ["స", "Sa"], ["హ", "Ha"], ["ళ", "Lla"], ["క్ష", "Ksha"], ["ఱ", "Bandi Ra"],
    ].map(([letter, roman]) => ({ letter, roman })),
  },
  Hindi: {
    Vowels: [
      ["अ", "A"], ["आ", "Aa"], ["इ", "I"], ["ई", "Ee"], ["उ", "U"], ["ऊ", "Oo"],
      ["ऋ", "Ri"], ["ए", "E"], ["ऐ", "Ai"], ["ओ", "O"], ["औ", "Au"], ["अं", "Am"], ["अः", "Aha"],
    ].map(([letter, roman]) => ({ letter, roman })),
    Consonants: [
      ["क", "Ka"], ["ख", "Kha"], ["ग", "Ga"], ["घ", "Gha"], ["ङ", "Nga"],
      ["च", "Cha"], ["छ", "Chha"], ["ज", "Ja"], ["झ", "Jha"], ["ञ", "Nya"],
      ["ट", "Ta"], ["ठ", "Tha"], ["ड", "Da"], ["ढ", "Dha"], ["ण", "Na"],
      ["त", "Ta"], ["थ", "Tha"], ["द", "Da"], ["ध", "Dha"], ["न", "Na"],
      ["प", "Pa"], ["फ", "Pha"], ["ब", "Ba"], ["भ", "Bha"], ["म", "Ma"],
      ["य", "Ya"], ["र", "Ra"], ["ल", "La"], ["व", "Va"], ["श", "Sha"],
      ["ष", "Ssa"], ["स", "Sa"], ["ह", "Ha"], ["क्ष", "Ksha"], ["त्र", "Tra"], ["ज्ञ", "Gya"],
    ].map(([letter, roman]) => ({ letter, roman })),
  },
};

const examples: Record<Language, Record<string, Example>> = {
  Telugu: {
    "అ": { word: "అమ్మ", wordRoman: "Amma", meaning: "Mother", icon: "👩🏽", audio: "/audio/telugu-amma.wav" },
    "ఆ": { word: "ఆకులు", wordRoman: "Aakulu", meaning: "Leaves", icon: "🌿", audio: "/audio/telugu-aakulu.wav" },
    "ఇ": { word: "ఇల్లు", wordRoman: "Illu", meaning: "Home", icon: "🏡", audio: "/audio/telugu-illu.wav" },
    "ఈ": { word: "ఈగ", wordRoman: "Eega", meaning: "Fly", icon: "🪰", audio: "/audio/telugu-eega.wav" },
    "ఉ": { word: "ఉడుత", wordRoman: "Udutha", meaning: "Squirrel", icon: "🐿️", audio: "/audio/telugu-udutha.wav" },
    "ఊ": { word: "ఊయల", wordRoman: "Ooyala", meaning: "Swing", icon: "swing", audio: "/audio/telugu-ooyala.wav" },
    "ఋ": { word: "ఋషి", wordRoman: "Rushi", meaning: "Sage", icon: "🧘🏽", audio: "/audio/telugu-rushi.wav" },
    "ౠ": { word: "రూక", wordRoman: "Rooka", meaning: "Coin / money", icon: "🪙", audio: "/audio/telugu-rooka.wav" },
    "ఎ": { word: "ఎలుక", wordRoman: "Eluka", meaning: "Mouse", icon: "🐭", audio: "/audio/telugu-eluka.wav" },
    "ఏ": { word: "ఏనుగు", wordRoman: "Aenugu", meaning: "Elephant", icon: "🐘", audio: "/audio/telugu-aenugu.wav" },
    "ఐ": { word: "ఐదు", wordRoman: "Aidu", meaning: "Five", icon: "5️⃣", audio: "/audio/telugu-aidu.wav" },
    "ఒ": { word: "ఒంటె", wordRoman: "Onte", meaning: "Camel", icon: "🐪", audio: "/audio/telugu-onte.wav" },
    "ఓ": { word: "ఓడ", wordRoman: "Oada", meaning: "Boat", icon: "⛵", audio: "/audio/telugu-oada.wav" },
    "ఔ": { word: "ఔషధం", wordRoman: "Aushadham", meaning: "Medicine", icon: "💊", audio: "/audio/telugu-aushadham.wav" },
    "అం": { word: "అంకె", wordRoman: "Anke", meaning: "Number", icon: "🔢", audio: "/audio/telugu-anke.wav" },
    "అః": { word: "అంతఃపురం", wordRoman: "Anthaapuram", meaning: "Inner palace", icon: "🏰", audio: "/audio/telugu-anthaapuram.wav" },
    "క": { word: "కమలం", wordRoman: "Kamalam", meaning: "Lotus", icon: "🪷", audio: "/audio/telugu-kamalam.wav" },
    "ఖ": { word: "ఖడ్గం", wordRoman: "Khadgam", meaning: "Sword", icon: "⚔️", audio: "/audio/telugu-khadgam.wav" },
    "గ": { word: "గడియారం", wordRoman: "Gadiyaaram", meaning: "Clock", icon: "⏰", audio: "/audio/telugu-gadiyaaram.wav" },
    "ఘ": { word: "ఘటం", wordRoman: "Ghatam", meaning: "Pot", icon: "🏺", audio: "/audio/telugu-ghatam.wav" },
    "ఙ": { word: "విఙ్ఞానం", wordRoman: "Vignaanam", meaning: "Knowledge", icon: "🧠", audio: "/audio/telugu-vignaanam.wav" },
    "చ": { word: "చందమామ", wordRoman: "Chandamama", meaning: "Moon", icon: "🌙", audio: "/audio/telugu-chandamama.wav" },
    "ఛ": { word: "ఛత్రం", wordRoman: "Chhatram", meaning: "Umbrella", icon: "☂️", audio: "/audio/telugu-chhatram.wav" },
    "జ": { word: "జింక", wordRoman: "Jinka", meaning: "Deer", icon: "🦌", audio: "/audio/telugu-jinka.wav" },
    "ఝ": { word: "ఝరి", wordRoman: "Jhari", meaning: "Waterfall", icon: "🌊", audio: "/audio/telugu-jhari.wav" },
    "ఞ": { word: "ఞకారం", wordRoman: "Nyakaaram", meaning: "Nya sound", icon: "🔤" },
    "ట": { word: "టమాటా", wordRoman: "Tamaata", meaning: "Tomato", icon: "🍅", audio: "/audio/telugu-tamaata.wav" },
    "ఠ": { word: "ఠకారం", wordRoman: "Thakaaram", meaning: "Tha sound", icon: "🔤" },
    "డ": { word: "డబ్బా", wordRoman: "Dabbaa", meaning: "Box", icon: "📦", audio: "/audio/telugu-dabbaa.wav" },
    "ఢ": { word: "ఢంకా", wordRoman: "Dhankaa", meaning: "Drum", icon: "🥁", audio: "/audio/telugu-dhankaa.wav" },
    "ణ": { word: "వీణ", wordRoman: "Veena", meaning: "Musical instrument", icon: "/images/veena.png", audio: "/audio/telugu-veena.wav" },
    "త": { word: "తల", wordRoman: "Tala", meaning: "Head", icon: "👤", audio: "/audio/telugu-tala.wav" },
    "థ": { word: "థర్మామీటర్", wordRoman: "Thermometer", meaning: "Thermometer", icon: "🌡️", audio: "/audio/telugu-thermometer.wav" },
    "ద": { word: "దానిమ్మ", wordRoman: "Daanimma", meaning: "Pomegranate", icon: "/images/pomegranate.png", audio: "/audio/telugu-daanimma.wav" },
    "ధ": { word: "ధనుస్సు", wordRoman: "Dhanussu", meaning: "Bow", icon: "🏹", audio: "/audio/telugu-dhanussu.wav" },
    "న": { word: "నక్క", wordRoman: "Nakka", meaning: "Fox", icon: "🦊", audio: "/audio/telugu-nakka.wav" },
    "ప": { word: "పాప", wordRoman: "Paapa", meaning: "Child", icon: "👧", audio: "/audio/telugu-paapa.wav" },
    "ఫ": { word: "ఫలం", wordRoman: "Phalam", meaning: "Fruit", icon: "🍇", audio: "/audio/telugu-phalam.wav" },
    "బ": { word: "బంతి", wordRoman: "Banthi", meaning: "Ball", icon: "⚽", audio: "/audio/telugu-banthi.wav" },
    "భ": { word: "భవనం", wordRoman: "Bhavanam", meaning: "Building", icon: "🏢", audio: "/audio/telugu-bhavanam.wav" },
    "మ": { word: "మామిడి", wordRoman: "Maamidi", meaning: "Mango", icon: "🥭", audio: "/audio/telugu-maamidi.wav" },
    "య": { word: "యంత్రం", wordRoman: "Yanthram", meaning: "Machine", icon: "⚙️", audio: "/audio/telugu-yanthram.wav" },
    "ర": { word: "రథం", wordRoman: "Ratham", meaning: "Chariot", icon: "🛞", audio: "/audio/telugu-ratham.wav" },
    "ల": { word: "లడ్డు", wordRoman: "Laddu", meaning: "Sweet", icon: "🍬", audio: "/audio/telugu-laddu.wav" },
    "వ": { word: "వంకాయ", wordRoman: "Vankaaya", meaning: "Eggplant", icon: "🍆", audio: "/audio/telugu-vankaaya.wav" },
    "శ": { word: "శంఖం", wordRoman: "Shankham", meaning: "Conch", icon: "🐚", audio: "/audio/telugu-shankham.wav" },
    "ష": { word: "షడ్రుచులు", wordRoman: "Shadruchulu", meaning: "Six tastes", icon: "6️⃣", audio: "/audio/telugu-shadruchulu.wav" },
    "స": { word: "సీతాకోకచిలుక", wordRoman: "Seethakokachiluka", meaning: "Butterfly", icon: "🦋", audio: "/audio/telugu-seethakokachiluka.wav" },
    "హ": { word: "హంస", wordRoman: "Hamsa", meaning: "Swan", icon: "🦢", audio: "/audio/telugu-hamsa.wav" },
    "ళ": { word: "కళ", wordRoman: "Kala", meaning: "Art", icon: "🎨", audio: "/audio/telugu-kala.wav" },
    "క్ష": { word: "క్షమ", wordRoman: "Kshama", meaning: "Forgiveness", icon: "🤝", audio: "/audio/telugu-kshama.wav" },
    "ఱ": { word: "గుఱ్ఱము", wordRoman: "Gurramu", meaning: "Horse", icon: "🐎", audio: "/audio/telugu-gurramu.wav" },
  },
  Hindi: {
    "अ": { word: "अनार", wordRoman: "Anaar", meaning: "Pomegranate", icon: "/images/pomegranate.png", audio: "/audio/hindi-anaar.wav" },
    "आ": { word: "आम", wordRoman: "Aam", meaning: "Mango", icon: "🥭", audio: "/audio/hindi-aam.wav" },
    "इ": { word: "इमली", wordRoman: "Imli", meaning: "Tamarind", icon: "🌿", audio: "/audio/hindi-imli.wav" },
    "ई": { word: "ईख", wordRoman: "Eekh", meaning: "Sugarcane", icon: "🎋", audio: "/audio/hindi-eekh.wav" },
    "उ": { word: "उल्लू", wordRoman: "Ullu", meaning: "Owl", icon: "🦉", audio: "/audio/hindi-ullu.wav" },
    "ऊ": { word: "ऊन", wordRoman: "Oon", meaning: "Wool", icon: "🧶", audio: "/audio/hindi-oon.wav" },
    "ऋ": { word: "ऋषि", wordRoman: "Rishi", meaning: "Sage", icon: "🧘🏽", audio: "/audio/hindi-rishi.wav" },
    "ए": { word: "एक", wordRoman: "Ek", meaning: "One", icon: "1️⃣", audio: "/audio/hindi-ek.wav" },
    "ऐ": { word: "ऐनक", wordRoman: "Ainak", meaning: "Glasses", icon: "👓", audio: "/audio/hindi-ainak.wav" },
    "ओ": { word: "ओखली", wordRoman: "Okhli", meaning: "Mortar", icon: "🥣", audio: "/audio/hindi-okhli.wav" },
    "औ": { word: "औरत", wordRoman: "Aurat", meaning: "Woman", icon: "👩🏽", audio: "/audio/hindi-aurat.wav" },
    "अं": { word: "अंगूर", wordRoman: "Angoor", meaning: "Grapes", icon: "🍇", audio: "/audio/hindi-angoor.wav" },
    "अः": { word: "नामः", wordRoman: "Naamaha", meaning: "Name", icon: "🏷️", audio: "/audio/hindi-naamah.wav" },
    "क": { word: "कबूतर", wordRoman: "Kabootar", meaning: "Pigeon", icon: "🕊️", audio: "/audio/hindi-kabootar.wav" },
    "ख": { word: "खरगोश", wordRoman: "Khargosh", meaning: "Rabbit", icon: "🐇", audio: "/audio/hindi-khargosh.wav" },
    "ग": { word: "गमला", wordRoman: "Gamla", meaning: "Flowerpot", icon: "🪴", audio: "/audio/hindi-gamla.wav" },
    "घ": { word: "घर", wordRoman: "Ghar", meaning: "Home", icon: "🏠", audio: "/audio/hindi-ghar.wav" },
    "ङ": { word: "ङकार", wordRoman: "Ngakaar", meaning: "Nga sound", icon: "🔤" },
    "च": { word: "चम्मच", wordRoman: "Chammach", meaning: "Spoon", icon: "🥄", audio: "/audio/hindi-chammach.wav" },
    "छ": { word: "छतरी", wordRoman: "Chhatri", meaning: "Umbrella", icon: "☂️", audio: "/audio/hindi-chhatri.wav" },
    "ज": { word: "जहाज", wordRoman: "Jahaaz", meaning: "Ship", icon: "🚢", audio: "/audio/hindi-jahaaz.wav" },
    "झ": { word: "झंडा", wordRoman: "Jhanda", meaning: "Flag", icon: "🚩", audio: "/audio/hindi-jhanda.wav" },
    "ञ": { word: "ञकार", wordRoman: "Nyakaar", meaning: "Nya sound", icon: "🔤" },
    "ट": { word: "टमाटर", wordRoman: "Tamaatar", meaning: "Tomato", icon: "🍅", audio: "/audio/hindi-tamaatar.wav" },
    "ठ": { word: "ठेला", wordRoman: "Thela", meaning: "Cart", icon: "🛒", audio: "/audio/hindi-thela.wav" },
    "ड": { word: "डमरू", wordRoman: "Damru", meaning: "Drum", icon: "🥁", audio: "/audio/hindi-damru.wav" },
    "ढ": { word: "ढक्कन", wordRoman: "Dhakkan", meaning: "Lid", icon: "🫙", audio: "/audio/hindi-dhakkan.wav" },
    "ण": { word: "णकार", wordRoman: "Nakaar", meaning: "Na sound", icon: "🔤" },
    "त": { word: "तरबूज", wordRoman: "Tarbooz", meaning: "Watermelon", icon: "🍉", audio: "/audio/hindi-tarbooz.wav" },
    "थ": { word: "थर्मस", wordRoman: "Thermos", meaning: "Flask", icon: "🧴", audio: "/audio/hindi-thermos.wav" },
    "द": { word: "दरवाज़ा", wordRoman: "Darwaaza", meaning: "Door", icon: "🚪", audio: "/audio/hindi-darwaaza.wav" },
    "ध": { word: "धनुष", wordRoman: "Dhanush", meaning: "Bow", icon: "🏹", audio: "/audio/hindi-dhanush.wav" },
    "न": { word: "नल", wordRoman: "Nal", meaning: "Tap", icon: "🚰", audio: "/audio/hindi-nal.wav" },
    "प": { word: "पतंग", wordRoman: "Patang", meaning: "Kite", icon: "🪁", audio: "/audio/hindi-patang.wav" },
    "फ": { word: "फल", wordRoman: "Phal", meaning: "Fruit", icon: "🍎", audio: "/audio/hindi-phal.wav" },
    "ब": { word: "बकरी", wordRoman: "Bakri", meaning: "Goat", icon: "🐐", audio: "/audio/hindi-bakri.wav" },
    "भ": { word: "भालू", wordRoman: "Bhaalu", meaning: "Bear", icon: "🐻", audio: "/audio/hindi-bhaalu.wav" },
    "म": { word: "मछली", wordRoman: "Machhli", meaning: "Fish", icon: "🐟", audio: "/audio/hindi-machhli.wav" },
    "य": { word: "यज्ञ", wordRoman: "Yagya", meaning: "Sacred fire", icon: "🔥" },
    "र": { word: "रथ", wordRoman: "Rath", meaning: "Chariot", icon: "🛞" },
    "ल": { word: "लड्डू", wordRoman: "Laddu", meaning: "Sweet", icon: "🍬" },
    "व": { word: "वन", wordRoman: "Van", meaning: "Forest", icon: "🌳", audio: "/audio/hindi-van.wav" },
    "श": { word: "शेर", wordRoman: "Sher", meaning: "Lion", icon: "🦁", audio: "/audio/hindi-sher.wav" },
    "ष": { word: "षट्कोण", wordRoman: "Shatkon", meaning: "Hexagon", icon: "🔷", audio: "/audio/hindi-shatkon.wav" },
    "स": { word: "सूरज", wordRoman: "Sooraj", meaning: "Sun", icon: "☀️", audio: "/audio/hindi-sooraj.wav" },
    "ह": { word: "हाथी", wordRoman: "Haathi", meaning: "Elephant", icon: "🐘", audio: "/audio/hindi-haathi.wav" },
    "क्ष": { word: "क्षमा", wordRoman: "Kshama", meaning: "Forgiveness", icon: "🤝", audio: "/audio/hindi-kshama.wav" },
    "त्र": { word: "त्रिशूल", wordRoman: "Trishul", meaning: "Trident", icon: "🔱", audio: "/audio/hindi-trishul.wav" },
    "ज्ञ": { word: "ज्ञान", wordRoman: "Gyaan", meaning: "Knowledge", icon: "📚", audio: "/audio/hindi-gyaan.wav" },
  },
};

function TracePad({ letter, roman }: { letter: string; roman: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  function paintGuide() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, rect.width);
    const height = 310;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.height = `${height}px`;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(ratio, ratio);
    context.fillStyle = "#fffdf9";
    context.fillRect(0, 0, width, height);
    context.setLineDash([10, 10]);
    context.lineWidth = 3;
    context.strokeStyle = "#cbc3ef";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `220px "Noto Sans Telugu", "Noto Sans Devanagari", Arial, sans-serif`;
    context.strokeText(letter, width / 2, height / 2 + 8);
    context.setLineDash([]);
  }

  useEffect(() => {
    paintGuide();
    const onResize = () => paintGuide();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [letter]);

  function point(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function startDrawing(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    drawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    const p = point(event);
    context.beginPath();
    context.moveTo(p.x, p.y);
  }

  function draw(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const p = point(event);
    context.lineWidth = 11;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#6d5ce8";
    context.lineTo(p.x, p.y);
    context.stroke();
  }

  function stopDrawing() {
    drawing.current = false;
  }

  return (
    <section className="trace-section" id="trace-pad" aria-label={`Trace ${letter}`}>
      <div className="trace-heading">
        <div><small>STEP 2 · PRACTICE</small><h3>Trace {letter}</h3><p>Follow the dotted shape with your finger or mouse.</p></div>
        <span>{roman}</span>
      </div>
      <div className="trace-board"><canvas ref={canvasRef} onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={stopDrawing} onPointerCancel={stopDrawing} onPointerLeave={stopDrawing} /></div>
      <div className="trace-actions"><button onClick={paintGuide}>↻ Clear and try again</button><small>Tip: Start at the top and move slowly.</small></div>
    </section>
  );
}

const gameLetters: Record<Language, string[]> = {
  Telugu: ["క", "మ", "అ", "చ", "ప", "ఆ", "గ", "త"],
  Hindi: ["अ", "क", "म", "ग", "आ", "प", "च", "त"],
};

function BubblePopGame() {
  const [gameLanguage, setGameLanguage] = useState<Language>("Telugu");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [popped, setPopped] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const letters = gameLetters[gameLanguage];
  const target = letters[round % letters.length];
  const bubbleOrders = [
    [3, 0, 5, 1, 6], [1, 5, 0, 6, 3], [6, 3, 1, 0, 5], [5, 1, 6, 3, 0], [0, 6, 3, 5, 1],
  ];
  const bubbles = bubbleOrders[round % bubbleOrders.length].map((offset) => letters[(round + offset) % letters.length]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function chooseLanguage(next: Language) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGameLanguage(next);
    setRound(0);
    setScore(0);
    setPopped(null);
    setWrong(null);
  }

  function popLetter(letter: string) {
    if (popped) return;
    if (letter !== target) {
      setWrong(letter);
      timerRef.current = setTimeout(() => setWrong(null), 450);
      return;
    }
    setWrong(null);
    setPopped(letter);
    setScore((value) => value + 1);
    timerRef.current = setTimeout(() => {
      setPopped(null);
      setRound((value) => value + 1);
    }, 850);
  }

  return (
    <section className="games-section" id="games">
      <div className="game-intro">
        <p className="kicker"><b>✦</b> Game 3 · Bubble Pop Letters</p>
        <h2>Find it. Tap it.<br /><em>Pop it!</em></h2>
        <p>Letters float inside colorful bubbles. Children find the letter in the instruction and tap the correct bubble.</p>
        <div className="game-language" role="group" aria-label="Choose game language">
          <button className={gameLanguage === "Telugu" ? "active" : ""} onClick={() => chooseLanguage("Telugu")}>తెలుగు</button>
          <button className={gameLanguage === "Hindi" ? "active" : ""} onClick={() => chooseLanguage("Hindi")}>हिन्दी</button>
        </div>
        <div className="game-score"><span>⭐</span><div><b>{score} correct</b><small>Keep popping!</small></div></div>
      </div>
      <div className="bubble-game" aria-label={`Pop ${target} game`}>
        <div className="game-cloud cloud-one" /><div className="game-cloud cloud-two" />
        <div className="game-prompt"><small>LOOK FOR THE LETTER</small><strong>Pop <b>{target}</b></strong></div>
        <div className="bubble-field">
          {bubbles.map((letter, index) => <button key={`${round}-${letter}-${index}`} className={`letter-bubble bubble-${index + 1} ${popped === letter ? "popped" : ""} ${wrong === letter ? "wrong" : ""}`} onClick={() => popLetter(letter)} disabled={Boolean(popped)} aria-label={`Bubble ${letter}`}><span>{letter}</span>{popped === letter && <i aria-hidden="true">✦ ✨ ✦</i>}</button>)}
        </div>
        <p className={`game-feedback ${popped ? "show" : ""}`} aria-live="polite">{popped ? `Wonderful! You popped ${target}!` : "Tap the matching bubble"}</p>
      </div>
    </section>
  );
}

const features = [
  ["✨", "Letters come alive", "Tap, trace, and connect each akshara with a familiar word and picture.", "violet"],
  ["📖", "A garden of stories", "Warm bilingual stories about sharing, helping, courage, and friendship.", "coral"],
  ["🎮", "Playful practice", "Picture matching, letter rain, tracing, and tiny celebrations.", "mint"],
  ["🌙", "Made for families", "Calm pacing, tablet-friendly controls, and simple progress views.", "gold"],
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [language, setLanguage] = useState<Language>("Telugu");
  const [group, setGroup] = useState<LetterGroup>("Vowels");
  const [selected, setSelected] = useState(0);
  const [learnOpen, setLearnOpen] = useState(false);
  const [learnStage, setLearnStage] = useState<"choose" | "letters">("choose");
  const [audioState, setAudioState] = useState<"idle" | "playing" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement>(null);
  const lessons = letterSets[language][group];
  const lesson = lessons[selected] ?? lessons[0];
  const example = examples[language][lesson.letter] ?? { word: lesson.letter, wordRoman: lesson.roman, meaning: `${lesson.roman} sound`, icon: "🔤" };

  useEffect(() => {
    document.body.style.overflowY = started && !learnOpen ? "auto" : "hidden";
    return () => { document.body.style.overflowY = "auto"; };
  }, [started, learnOpen]);

  useEffect(() => {
    audioRef.current?.pause();
  }, [language, group, selected]);

  async function playRecording() {
    const player = audioRef.current;
    if (!player || !example.audio) return;
    player.currentTime = 0;
    try {
      await player.play();
      setAudioState("playing");
    } catch {
      setAudioState("error");
    }
  }

  function pickLanguage(next: Language) {
    setAudioState("idle");
    setLanguage(next);
    setSelected(0);
  }

  function pickGroup(next: LetterGroup) {
    setAudioState("idle");
    setGroup(next);
    setSelected(0);
  }

  function pickLesson(index: number) {
    setAudioState("idle");
    setSelected(index);
  }

  function openLearn() { setLearnStage("choose"); setLearnOpen(true); }
  function beginLetters(nextLanguage: Language, nextGroup: LetterGroup) { setLanguage(nextLanguage); setGroup(nextGroup); setSelected(0); setLearnStage("letters"); }

  return (
    <><main>
      <header className="nav-wrap">
        <a href="#top" className="logo"><span>🦚</span>Basha Kids</a>
        <nav aria-label="Main navigation"><a href="#stories">Stories</a><a href="#lessons" onClick={(event) => { event.preventDefault(); openLearn(); }}>Letters</a><a href="#guninthalu">Guninthalu</a><a href="#games">Games</a></nav>
        <a href="#lessons" className="nav-button" onClick={(event) => { event.preventDefault(); openLearn(); }}>Try a lesson <b>→</b></a>
      </header>

      {!started ? <OpeningScreen onEnter={(openingLanguage) => { setLanguage(openingLanguage); setStarted(true); window.scrollTo({ top: 0 }); }} /> : <section className="hero" id="top">
        <span className="float-letter fl-one">అ</span><span className="float-letter fl-two">क</span><span className="float-letter fl-three">ఆ</span><span className="float-letter fl-four">म</span>
        <div className="hero-copy">
          <p className="kicker"><b>✦</b> Telugu + Hindi learning for little explorers</p>
          <h1>Every word begins<br />with a little <em>wonder.</em></h1>
          <p className="lead">Animated letters, warm stories, and playful practice - made for curious children ages 4-8.</p>
          <div className="hero-actions"><a href="#lessons" className="primary" onClick={(event) => { event.preventDefault(); openLearn(); }}>Start exploring <b>→</b></a><a href="#features" className="secondary"><i>✦</i> See what is inside</a></div>
          <div className="checks"><span>✓ Child-friendly</span><span>✓ Tablet-ready</span><span>✓ Parent-guided</span></div>
        </div>

        <div className="hero-art" aria-label="Basha Kids app preview">
          <div className="blob" />
          <div className="phone">
            <div className="phone-status"><span>9:41</span><span>● ●</span></div>
            <div className="hello"><div><small>Namaskaram, little explorer!</small><strong>What shall we learn?</strong></div><span>🦚</span></div>
            <div className="streak"><b>4</b><div><strong>Day streak!</strong><small>Keep your sparkle going</small></div><span>⭐</span></div>
            <div className="phone-title"><b>Today&apos;s letters</b><small>See all</small></div>
            <div className="phone-letters"><article className="active"><b>అ</b><small>అమ్మ</small></article><article><b>ఆ</b><small>ఆకులు</small></article><article><b>ఇ</b><small>ఇల్లు</small></article></div>
            <div className="story"><span>🦁</span><div><small>STORY OF THE DAY</small><b>The Lion and the Mouse</b><i>3 min · Telugu + Hindi</i></div><button aria-label="Open story preview">→</button></div>
            <div className="phone-tabs"><span>⌂<small>Home</small></span><span>✦<small>Learn</small></span><span>♡<small>Stories</small></span><span>★<small>Rewards</small></span></div>
          </div>
          <div className="sticker sticker-one"><span>🌟</span><b>Little wins,<br />every day</b></div>
          <div className="sticker sticker-two"><span>🪄</span><b>Playful<br />practice</b></div>
        </div>
      </section>}

      <section className="features" id="features">
        <div className="section-title"><p className="kicker"><b>✦</b> A complete little learning world</p><h2>Built for <em>how children learn.</em></h2><p>See it. Trace it. Match it. Play with it. Meet it again tomorrow.</p></div>
        <div className="feature-grid">
          {features.map(([icon, title, copy, color], index) => index === 0 ? <button className={`feature feature-button ${color}`} key={title} onClick={openLearn}><small>0{index + 1}</small><span>{icon}</span><h3>{title}</h3><p>{copy}</p><b>Open letter lessons →</b></button> : <article className={`feature ${color}`} key={title}><small>0{index + 1}</small><span>{icon}</span><h3>{title}</h3><p>{copy}</p><b>Preview feature ↗</b></article>)}
        </div>
      </section>

      <StoryGarden />

      {learnOpen && <div className="learn-experience" role="dialog" aria-modal="true" aria-label="Letters Come Alive lessons"><div className="learn-shell"><header className="learn-header"><button onClick={() => learnStage === "letters" ? setLearnStage("choose") : setLearnOpen(false)}>{learnStage === "letters" ? "← Back to choices" : "← Back to home"}</button><a href="#top" className="logo"><span>🦚</span>Basha Kids</a><button className="learn-close" onClick={() => setLearnOpen(false)} aria-label="Close letter lessons">✕</button></header>{learnStage === "choose" ? <section className="learn-chooser" id="lessons"><p className="kicker"><b>✦</b> Letters Come Alive</p><h2>What would you<br/><em>like to learn?</em></h2><p>First choose a language, then choose vowels or consonants.</p><div className="learn-language" role="group" aria-label="Choose lesson language"><button className={language === "Telugu" ? "active" : ""} onClick={() => pickLanguage("Telugu")}><b>తెలుగు</b><small>Telugu</small></button><button className={language === "Hindi" ? "active" : ""} onClick={() => pickLanguage("Hindi")}><b>हिन्दी</b><small>Hindi</small></button></div><div className="learn-paths"><button onClick={() => beginLetters(language, "Vowels")}><span>☀️</span><small>START WITH</small><b>Vowels</b><i>{language === "Telugu" ? "అచ్చులు · Acchulu" : "स्वर · Swar"}</i><strong>{letterSets[language].Vowels.length} letters →</strong></button><button onClick={() => beginLetters(language, "Consonants")}><span>🌱</span><small>EXPLORE</small><b>Consonants</b><i>{language === "Telugu" ? "హల్లులు · Hallulu" : "व्यंजन · Vyanjan"}</i><strong>{letterSets[language].Consonants.length} letters →</strong></button></div></section> : <><section className="lessons learn-lessons">
        <div className="lesson-copy">
          <p className="kicker"><b>✦</b> Explore the full alphabet</p><h2>Choose a group.<br /><em>Tap any letter.</em></h2>
          <p className="description">Learn vowels and consonants separately in Telugu or Hindi. Every letter card opens a large practice view.</p>
          <div className="switch" role="group" aria-label="Choose a language"><button className={language === "Telugu" ? "active" : ""} onClick={() => pickLanguage("Telugu")}>తెలుగు <small>Telugu</small></button><button className={language === "Hindi" ? "active" : ""} onClick={() => pickLanguage("Hindi")}>हिन्दी <small>Hindi</small></button></div>
          <div className="group-switch" role="group" aria-label="Choose vowels or consonants">
            <button className={group === "Vowels" ? "active" : ""} onClick={() => pickGroup("Vowels")}><span>☀️</span><b>Vowels</b><small>Acchulu · {language === "Telugu" ? "అచ్చులు" : "स्वर"}</small></button>
            <button className={group === "Consonants" ? "active" : ""} onClick={() => pickGroup("Consonants")}><span>🌱</span><b>Consonants</b><small>Hallulu · {language === "Telugu" ? "హల్లులు" : "व्यंजन"}</small></button>
          </div>
          <div className="alphabet-heading"><div><b>{group}</b><small>{language} · {group === "Vowels" ? `${lessons[0].letter} to ${lessons[lessons.length - 1].letter}` : `${lessons[0].letter} to ${lessons[lessons.length - 1].letter}`}</small></div><span>{lessons.length} letters</span></div>
          <div className="alphabet-grid">
            {lessons.map((item, index) => <button key={`${language}-${group}-${item.letter}-${index}`} className={selected === index ? "active" : ""} onClick={() => pickLesson(index)} aria-label={`${item.letter}, ${item.roman}`} aria-pressed={selected === index}><b>{item.letter}</b><small>{item.roman}</small></button>)}
          </div>
        </div>
        <div className="lesson-art illustrated-letter-art">
          <div className="illustrated-letter-scene" aria-hidden="true" />
          <div className="illustrated-letter-bubble"><strong>{lesson.letter}</strong></div>
          <div className="illustrated-object-bubble" aria-label={example.meaning}>
            {example.icon === "swing" ? <span className="swing-icon" aria-label="Swing"><i /><i /><b /></span> : example.icon.startsWith("/") ? <img src={example.icon} alt={example.meaning} /> : example.icon}
          </div>
          <div className="illustrated-lesson-panel">
            <small>{language === "Telugu" ? `ఇది “${lesson.letter}”` : `यह “${lesson.letter}” है`}</small>
            <h3>{language === "Telugu" ? `${lesson.letter} అంటే ${example.word}` : `${lesson.letter} से ${example.word}`}</h3>
            <p>{example.wordRoman} · {example.meaning}</p>
            <div className="voice-row"><audio ref={audioRef} src={example.audio} onEnded={() => setAudioState("idle")} onError={() => setAudioState("error")} /><button className={example.audio ? "voice-button ready" : "voice-button missing"} onClick={playRecording} disabled={!example.audio}>{example.audio ? (audioState === "playing" ? "◼ Playing audio…" : `🔊 Hear ${example.wordRoman}`) : "＋ Recording needed"}</button><small>{example.audio ? "Original voice" : `Add ${language} WAV`}</small></div>
            {audioState === "error" && <small className="audio-error">Recording could not play. Please try again.</small>}
            <button className="trace-button" onClick={() => document.getElementById("trace-pad")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Continue to trace &nbsp; →</button>
          </div>
        </div>
      </section><TracePad letter={lesson.letter} roman={lesson.roman.toUpperCase()} /></>}</div></div>}

      <AksharaBuilder />

      <BubblePopGame />

      <MoreGames />

      <footer><a href="#top" className="logo"><span>🦚</span>Basha Kids</a><p>Little words. Big worlds.</p><a href="#top">Back to top ↑</a></footer>
    </main></>
  );
}
