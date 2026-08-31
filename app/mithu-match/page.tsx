"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./mithu-match.css";

type Language = "Telugu" | "Hindi";
type Mode = "tap" | "feed" | "bring" | "surprise";
type Item = { id:string; emoji:string; english:string; telugu:string; hindi:string; category:string; color?:string };

const ITEMS: Item[] = [
  {id:"mango",emoji:"🥭",english:"Mango",telugu:"మామిడి",hindi:"आम",category:"fruit",color:"yellow"},
  {id:"apple",emoji:"🍎",english:"Apple",telugu:"ఆపిల్",hindi:"सेब",category:"fruit",color:"red"},
  {id:"banana",emoji:"🍌",english:"Banana",telugu:"అరటి పండు",hindi:"केला",category:"fruit",color:"yellow"},
  {id:"grapes",emoji:"🍇",english:"Grapes",telugu:"ద్రాక్ష",hindi:"अंगूर",category:"fruit",color:"purple"},
  {id:"orange",emoji:"🍊",english:"Orange",telugu:"నారింజ",hindi:"संतरा",category:"fruit",color:"orange"},
  {id:"carrot",emoji:"🥕",english:"Carrot",telugu:"క్యారెట్",hindi:"गाजर",category:"vegetable",color:"orange"},
  {id:"potato",emoji:"🥔",english:"Potato",telugu:"బంగాళాదుంప",hindi:"आलू",category:"vegetable",color:"brown"},
  {id:"tomato",emoji:"🍅",english:"Tomato",telugu:"టమాటా",hindi:"टमाटर",category:"vegetable",color:"red"},
  {id:"lion",emoji:"🦁",english:"Lion",telugu:"సింహం",hindi:"शेर",category:"animal"},
  {id:"rabbit",emoji:"🐰",english:"Rabbit",telugu:"కుందేలు",hindi:"खरगोश",category:"animal"},
  {id:"elephant",emoji:"🐘",english:"Elephant",telugu:"ఏనుగు",hindi:"हाथी",category:"animal"},
  {id:"ball",emoji:"⚽",english:"Ball",telugu:"బంతి",hindi:"गेंद",category:"toy"},
  {id:"car",emoji:"🚗",english:"Car",telugu:"కారు",hindi:"गाड़ी",category:"vehicle",color:"red"},
  {id:"duck",emoji:"🦆",english:"Duck",telugu:"బాతు",hindi:"बतख",category:"animal",color:"yellow"},
  {id:"flower",emoji:"🌸",english:"Flower",telugu:"పువ్వు",hindi:"फूल",category:"flower"},
];

const MODE_ORDER:Mode[]=["tap","feed","bring","tap","surprise"];
const MODE_LABEL:Record<Mode,string>={tap:"TAP IT",feed:"FEED MITHU",bring:"FIND & BRING",surprise:"SURPRISE ROUND"};

function shuffled<T>(items:T[], seed:number){return [...items].sort((a,b)=>(((seed+1)*31+items.indexOf(a)*17)%97)-(((seed+1)*31+items.indexOf(b)*17)%97));}

export default function MithuMatchPage(){
  const [language,setLanguage]=useState<Language>("Telugu");
  const [round,setRound]=useState(0);
  const [stars,setStars]=useState(0);
  const [feedback,setFeedback]=useState("Listen to Mithu!");
  const [status,setStatus]=useState<"idle"|"correct"|"wrong"|"done">("idle");
  const [dragId,setDragId]=useState<string|null>(null);
  const [dragDelta,setDragDelta]=useState({x:0,y:0});
  const dragStart=useRef({x:0,y:0});
  const targetRef=useRef<HTMLDivElement>(null);
  const mode=MODE_ORDER[Math.min(round,4)];
  const target=useMemo(()=>{
    if(mode==="surprise") return ITEMS.find(item=>item.id==="apple")!;
    const ids=["mango","grapes","carrot","rabbit","apple"];
    return ITEMS.find(item=>item.id===ids[round])!;
  },[round,mode]);
  const choices=useMemo(()=>{
    if(mode==="surprise") return [ITEMS.find(x=>x.id==="car")!,ITEMS.find(x=>x.id==="apple")!,ITEMS.find(x=>x.id==="duck")!];
    const pool=ITEMS.filter(item=>item.id!==target.id);
    return shuffled([target,...pool.slice(round*2,round*2+2)],round).slice(0,3);
  },[round,target,mode]);

  const word=language==="Telugu"?target.telugu:target.hindi;
  const prompt=mode==="surprise"?(language==="Telugu"?"ఎరుపు రంగు ఉన్నది ఏది?":"लाल रंग वाली चीज़ कौन सी है?"):
    mode==="feed"?(language==="Telugu"?`${word} మిథుకి ఇవ్వు!`:`${word} मिथु को दो!`):
    mode==="bring"?(language==="Telugu"?`${word} మిథు దగ్గరకు తీసుకురా!`:`${word} मिथु के पास लाओ!`):
    (language==="Telugu"?`${word} ఎక్కడ?`:`${word} कहाँ है?`);

  function speak(text=prompt){
    if(typeof window==="undefined"||!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);
    utterance.lang=language==="Telugu"?"te-IN":"hi-IN";
    utterance.rate=.82;utterance.pitch=1.12;
    window.speechSynthesis.speak(utterance);
  }

  useEffect(()=>{const t=window.setTimeout(()=>speak(),250);return()=>window.clearTimeout(t);},[round,language]);

  function celebrate(){
    if(status!=="idle")return;
    setStatus("correct");setStars(round+1);setFeedback(language==="Telugu"?`చాలా బాగా చేశావు! ${word}!`:`बहुत बढ़िया! ${word}!`);
    speak(word);
    window.setTimeout(()=>{
      if(round===4){setStatus("done");setFeedback(language==="Telugu"?"నువ్వు 5 నక్షత్రాలు సంపాదించావు!":"तुमने 5 सितारे जीते!");}
      else {setRound(value=>value+1);setStatus("idle");setFeedback("Listen to Mithu!");}
    },900);
  }

  function wrong(){if(status!=="idle")return;setStatus("wrong");setFeedback(language==="Telugu"?"అది కాదు — మళ్ళీ ప్రయత్నించు!":"यह नहीं — फिर से कोशिश करो!");window.setTimeout(()=>setStatus("idle"),650);}
  function choose(item:Item){if(mode==="feed"||mode==="bring")return;if(mode==="surprise"){item.color==="red"?celebrate():wrong();return;}item.id===target.id?celebrate():wrong();}
  function onDown(e:React.PointerEvent<HTMLButtonElement>,item:Item){if(!(mode==="feed"||mode==="bring")||status!=="idle")return;e.currentTarget.setPointerCapture(e.pointerId);dragStart.current={x:e.clientX,y:e.clientY};setDragId(item.id);setDragDelta({x:0,y:0});}
  function onMove(e:React.PointerEvent<HTMLButtonElement>,item:Item){if(dragId!==item.id)return;setDragDelta({x:e.clientX-dragStart.current.x,y:e.clientY-dragStart.current.y});}
  function onUp(e:React.PointerEvent<HTMLButtonElement>,item:Item){if(dragId!==item.id)return;setDragId(null);setDragDelta({x:0,y:0});const rect=targetRef.current?.getBoundingClientRect();const inside=!!rect&&e.clientX>=rect.left&&e.clientX<=rect.right&&e.clientY>=rect.top&&e.clientY<=rect.bottom;if(!inside)return;item.id===target.id?celebrate():wrong();}
  function restart(){setRound(0);setStars(0);setStatus("idle");setFeedback("Listen to Mithu!");setDragId(null);setDragDelta({x:0,y:0});}

  if(status==="done")return <main className="mithu-page"><section className="mithu-shell mithu-finish"><div className="confetti">✨ 🎉 ⭐ 🎉 ✨</div><div className="mithu-big">🦜</div><h1>{language==="Telugu"?"నువ్వు సాధించావు!":"तुमने कर दिखाया!"}</h1><p>{feedback}</p><div className="finish-stars">⭐⭐⭐⭐⭐</div><div className="treasure">🧰 🥭 🍎 🍇 🥕</div><button onClick={restart}>↻ Play Again</button><a href="/">⌂ Home</a></section></main>;

  return <main className="mithu-page">
    <section className="mithu-shell">
      <header className="mithu-head">
        <a href="/" className="home-btn" aria-label="Home">⌂</a>
        <div><small>HELP MITHU!</small><h1>Find the Right Picture</h1></div>
        <button className="sound-btn" onClick={()=>speak()} aria-label="Hear Mithu">🔊</button>
      </header>
      <div className="language-switch"><button className={language==="Telugu"?"active":""} onClick={()=>setLanguage("Telugu")}>తెలుగు</button><button className={language==="Hindi"?"active":""} onClick={()=>setLanguage("Hindi")}>हिन्दी</button></div>
      <div className="game-top"><span className="mode-pill">{round+1} · {MODE_LABEL[mode]}</span><span className="progress">{round+1} / 5</span><span className="stars">{[0,1,2,3,4].map(i=><i key={i}>{i<stars?"⭐":"☆"}</i>)}</span></div>
      <div className="mithu-row"><div className={`mithu-character ${status==="correct"?"celebrate":""}`}>🦜</div><button className="speech" onClick={()=>speak()}><span>🔊</span><b lang={language==="Telugu"?"te":"hi"}>{prompt}</b><small>{mode==="surprise"?"Find the red one!":mode==="feed"?`Bring the ${target.english.toLowerCase()}!`:mode==="bring"?`Bring me the ${target.english.toLowerCase()}!`:`Where is the ${target.english.toLowerCase()}?`}</small></button></div>
      <div className="play-zone">
        <div className="choices">{choices.map(item=><button key={`${round}-${item.id}`} className={`choice ${status==="wrong"?"wiggle":""} ${dragId===item.id?"dragging":""}`} style={dragId===item.id?{transform:`translate(${dragDelta.x}px,${dragDelta.y}px)`}:undefined} onClick={()=>choose(item)} onPointerDown={e=>onDown(e,item)} onPointerMove={e=>onMove(e,item)} onPointerUp={e=>onUp(e,item)} onPointerCancel={()=>{setDragId(null);setDragDelta({x:0,y:0});}}><span>{item.emoji}</span><b>{item.english}</b></button>)}</div>
        {(mode==="feed"||mode==="bring")&&<div ref={targetRef} className="drop-target"><span>{mode==="feed"?"🧺":"🦜"}</span><b>{mode==="feed"?"Mithu's Basket":"Bring it to Mithu"}</b></div>}
      </div>
      <div className={`feedback ${status}`} aria-live="polite">{status==="correct"?"✨ ":status==="wrong"?"↻ ":""}{feedback}</div>
      <footer><span>Big pictures · short rounds · gentle retries</span><button onClick={restart}>↻ Restart</button></footer>
    </section>
  </main>;
}
