"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BuddyTip, BuddyCelebrate } from "./BuddyTip";

const objects=[
  {id:"apple",picture:"🍎",label:"Apple"},{id:"ball",picture:"⚽",label:"Ball"},{id:"book",picture:"📕",label:"Book"},
  {id:"car",picture:"🚗",label:"Car"},{id:"clock",picture:"⏰",label:"Clock"},{id:"umbrella",picture:"☂️",label:"Umbrella"},
];
const orders=[[0,7,2,9,4,11,6,1,8,3,10,5],[5,0,8,2,7,10,1,9,4,6,3,11],[8,3,0,10,5,7,2,11,6,4,9,1]];

function MemoryGame(){
  const themes={fruits:{label:"🍎 Yummy Fruits",items:["🍎","🍌","🍇","🍊","🍓","🥑","🍍","🍒","🍑","🍐"]},animals:{label:"🦁 Friendly Animals",items:["🐶","🐱","🦁","🐷","🦊","🐼","🐯","🦒","🦓","🐘"]},space:{label:"🚀 Silly Space",items:["🚀","🛸","🪐","👨‍🚀","👾","🛰️","☄️","🌌","🔭","🌍"]}} as const;
  type Theme=keyof typeof themes;
  const [theme,setTheme]=useState<Theme>("fruits");const [seed,setSeed]=useState(0);const [open,setOpen]=useState<number[]>([]);const [matched,setMatched]=useState<number[]>([]);const [moves,setMoves]=useState(0);const [seconds,setSeconds]=useState(0);const [started,setStarted]=useState(false);const [locked,setLocked]=useState(false);const [won,setWon]=useState(false);
  const unshuffled=useMemo(()=>[...themes[theme].items,...themes[theme].items].map((icon,index)=>({icon,id:index})),[theme,seed]);
  const [cards,setCards]=useState(unshuffled);
  const [best,setBest]=useState<string|null>(null);
  // Shuffle only after mount so the server-rendered order matches the client's first paint (avoids hydration mismatch).
  useEffect(()=>{setCards([...unshuffled].sort(()=>Math.random()-.5));},[unshuffled]);
  useEffect(()=>{setBest(localStorage.getItem("basha-match-best-"+theme));},[theme]);
  useEffect(()=>{if(!started||won)return;const timer=window.setInterval(()=>setSeconds(value=>value+1),1000);return()=>window.clearInterval(timer);},[started,won]);
  function reset(nextTheme:Theme=theme){setTheme(nextTheme);setSeed(value=>value+1);setOpen([]);setMatched([]);setMoves(0);setSeconds(0);setStarted(false);setLocked(false);setWon(false);}
  function flip(index:number){if(locked||open.includes(index)||matched.includes(index))return;setStarted(true);const next=[...open,index];setOpen(next);if(next.length!==2)return;setMoves(value=>value+1);setLocked(true);const [first,second]=next;if(cards[first].icon===cards[second].icon){window.setTimeout(()=>{const completed=[...matched,first,second];setMatched(completed);setOpen([]);setLocked(false);if(completed.length===cards.length){setWon(true);const current=Number(localStorage.getItem("basha-match-best-"+theme)||0);if(!current||moves+1<current){localStorage.setItem("basha-match-best-"+theme,String(moves+1));setBest(String(moves+1));}}},350);}else window.setTimeout(()=>{setOpen([]);setLocked(false);},800);}
  const total=themes[theme].items.length;const minutes=String(Math.floor(seconds/60)).padStart(2,"0"),secs=String(seconds%60).padStart(2,"0");
  return <article className="mini-game memory-game match-adventure"><div className="match-top"><div><small>GAME 5 · PICK A THEME</small><h3>Happy <em>Match</em> Adventure</h3><p>Tap two cards. Can you find the matching pictures? 🌈</p><b className="match-best">Best: {best?best+" moves":"--"}</b><BuddyTip name="gaja" message="I never forget a pair — see if you can beat me!" /></div><div className="match-stats"><span><small>Moves</small><b>{moves}</b></span><span><small>Time</small><b>{minutes}:{secs}</b></span></div></div><div className="match-theme-tabs">{(Object.keys(themes) as Theme[]).map(key=><button key={key} className={theme===key?"active":""} onClick={()=>reset(key)}>{themes[key].label}</button>)}</div><div className="match-progress"><i style={{width:String(matched.length/cards.length*100)+"%"}}/></div><div className="memory-grid adventure-grid">{cards.map((card,index)=>{const visible=open.includes(index)||matched.includes(index);return <button key={card.id} className={(visible?"open ":"")+(matched.includes(index)?"matched":"")} onClick={()=>flip(index)} aria-label={visible?card.icon:"Hidden card"}><span className="card-back">⭐</span><span className="card-face"><b>{card.icon}</b></span></button>})}</div><div className="memory-status"><b>⭐ {matched.length/2} / {total} pairs</b><button onClick={()=>reset()}>Mix Again ↻</button></div>{won&&<BuddyCelebrate name="gaja" title="You did it! 🎉" message={`You found every pair in ${moves} moves. Gaja is proud of your memory!`} onAction={()=>reset()} actionLabel="Play again 🎉" />}</article>;
}

type SortCategory="fruits"|"vegetables"|"animals"|"household"|"school"|"vehicles";
type SortItem={id:string;picture:string;label:string;category:SortCategory};

const sortCategories:{id:SortCategory;label:string;telugu:string;hindi:string;icon:string}[]=[
  {id:"fruits",label:"Fruits",telugu:"పండ్లు",hindi:"फल",icon:"🍎"},
  {id:"vegetables",label:"Vegetables",telugu:"కూరగాయలు",hindi:"सब्ज़ियाँ",icon:"🥕"},
  {id:"animals",label:"Animals",telugu:"జంతువులు",hindi:"जानवर",icon:"🐘"},
  {id:"household",label:"Household",telugu:"ఇంటి వస్తువులు",hindi:"घर की चीज़ें",icon:"🪑"},
  {id:"school",label:"School",telugu:"పాఠశాల వస్తువులు",hindi:"स्कूल की चीज़ें",icon:"🎒"},
  {id:"vehicles",label:"Vehicles",telugu:"వాహనాలు",hindi:"वाहन",icon:"🚗"},
];
const sortItems:SortItem[]=[
  {id:"apple",picture:"🍎",label:"Apple",category:"fruits"},{id:"banana",picture:"🍌",label:"Banana",category:"fruits"},{id:"grapes",picture:"🍇",label:"Grapes",category:"fruits"},{id:"orange",picture:"🍊",label:"Orange",category:"fruits"},{id:"mango",picture:"🥭",label:"Mango",category:"fruits"},{id:"watermelon",picture:"🍉",label:"Watermelon",category:"fruits"},{id:"strawberry",picture:"🍓",label:"Strawberry",category:"fruits"},{id:"pear",picture:"🍐",label:"Pear",category:"fruits"},
  {id:"carrot",picture:"🥕",label:"Carrot",category:"vegetables"},{id:"corn",picture:"🌽",label:"Corn",category:"vegetables"},{id:"eggplant",picture:"🍆",label:"Eggplant",category:"vegetables"},{id:"tomato",picture:"🍅",label:"Tomato",category:"vegetables"},{id:"broccoli",picture:"🥦",label:"Broccoli",category:"vegetables"},{id:"cucumber",picture:"🥒",label:"Cucumber",category:"vegetables"},{id:"pepper",picture:"🫑",label:"Pepper",category:"vegetables"},{id:"potato",picture:"🥔",label:"Potato",category:"vegetables"},
  {id:"elephant",picture:"🐘",label:"Elephant",category:"animals"},{id:"turtle",picture:"🐢",label:"Turtle",category:"animals"},{id:"butterfly",picture:"🦋",label:"Butterfly",category:"animals"},{id:"lion",picture:"🦁",label:"Lion",category:"animals"},{id:"rabbit",picture:"🐇",label:"Rabbit",category:"animals"},{id:"dog",picture:"🐕",label:"Dog",category:"animals"},{id:"fish",picture:"🐟",label:"Fish",category:"animals"},{id:"owl",picture:"🦉",label:"Owl",category:"animals"},
  {id:"chair",picture:"🪑",label:"Chair",category:"household"},{id:"bed",picture:"🛏️",label:"Bed",category:"household"},{id:"lamp",picture:"💡",label:"Lamp",category:"household"},{id:"clock",picture:"⏰",label:"Clock",category:"household"},{id:"cup",picture:"🥤",label:"Cup",category:"household"},{id:"spoon",picture:"🥄",label:"Spoon",category:"household"},{id:"key",picture:"🔑",label:"Key",category:"household"},{id:"telephone",picture:"☎️",label:"Telephone",category:"household"},
  {id:"book",picture:"📕",label:"Book",category:"school"},{id:"pencil",picture:"✏️",label:"Pencil",category:"school"},{id:"backpack",picture:"🎒",label:"Backpack",category:"school"},{id:"ruler",picture:"📏",label:"Ruler",category:"school"},{id:"scissors",picture:"✂️",label:"Scissors",category:"school"},{id:"crayon",picture:"🖍️",label:"Crayon",category:"school"},{id:"notebook",picture:"📓",label:"Notebook",category:"school"},{id:"globe",picture:"🌐",label:"Globe",category:"school"},
  {id:"car",picture:"🚗",label:"Car",category:"vehicles"},{id:"bus",picture:"🚌",label:"Bus",category:"vehicles"},{id:"bicycle",picture:"🚲",label:"Bicycle",category:"vehicles"},{id:"train",picture:"🚂",label:"Train",category:"vehicles"},{id:"airplane",picture:"✈️",label:"Airplane",category:"vehicles"},{id:"boat",picture:"⛵",label:"Boat",category:"vehicles"},{id:"truck",picture:"🚚",label:"Truck",category:"vehicles"},{id:"scooter",picture:"🛴",label:"Scooter",category:"vehicles"},
];

function PictureSortingGame(){
  const [round,setRound]=useState(0);const [placed,setPlaced]=useState<Record<string,SortCategory>>({});const [feedback,setFeedback]=useState("Drag a picture into its matching group.");const [dragId,setDragId]=useState<string|null>(null);const [dragDelta,setDragDelta]=useState({x:0,y:0});const [hoverBin,setHoverBin]=useState<SortCategory|null>(null);const [wrongBin,setWrongBin]=useState<SortCategory|null>(null);const [landed,setLanded]=useState<string|null>(null);
  const dragOrigin=useRef({x:0,y:0});const binRefs=useRef<Map<SortCategory,HTMLDivElement>>(new Map());
  const items=useMemo(()=>{const chosen=sortCategories.flatMap((category,categoryIndex)=>{const group=sortItems.filter(item=>item.category===category.id);const start=(round*2+categoryIndex)%group.length;return [group[start],group[(start+3)%group.length]];});return chosen.map((_,index,array)=>array[(index*5+round*7)%array.length]);},[round]);const finished=Object.keys(placed).length===items.length;
  function binAt(x:number,y:number):SortCategory|null{for(const [category,el] of binRefs.current){const rect=el.getBoundingClientRect();if(x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom)return category;}return null;}
  function onItemDown(event:React.PointerEvent<HTMLButtonElement>,id:string){if(placed[id])return;event.currentTarget.setPointerCapture(event.pointerId);dragOrigin.current={x:event.clientX,y:event.clientY};setDragId(id);setDragDelta({x:0,y:0});setFeedback("Drop it in the matching group!");}
  function onItemMove(event:React.PointerEvent<HTMLButtonElement>,id:string){if(dragId!==id)return;setDragDelta({x:event.clientX-dragOrigin.current.x,y:event.clientY-dragOrigin.current.y});setHoverBin(binAt(event.clientX,event.clientY));}
  function onItemUp(event:React.PointerEvent<HTMLButtonElement>,id:string){if(dragId!==id)return;setDragId(null);setDragDelta({x:0,y:0});setHoverBin(null);const item=sortItems.find(entry=>entry.id===id);if(!item)return;const target=binAt(event.clientX,event.clientY);if(!target)return;if(target===item.category){setPlaced(value=>({...value,[id]:target}));setLanded(id);window.setTimeout(()=>setLanded(null),450);setFeedback(`✓ ${item.label} belongs in ${sortCategories.find(group=>group.id===target)?.label}.`);}else{setWrongBin(target);window.setTimeout(()=>setWrongBin(null),450);setFeedback("Not this group—try another one.");}}
  function reset(){setRound(value=>value+1);setPlaced({});setFeedback("Drag a picture into its matching group.");setDragId(null);setDragDelta({x:0,y:0});setHoverBin(null);setWrongBin(null);}
  return <article className="mini-game sorting-game"><div className="sorting-head"><div><small>GAME 6 · PICTURE SORTING</small><h3>Which Group?</h3><p>Drag each picture into its matching group — fruits, vegetables, animals, household items, school items, or vehicles. Every round brings a new mix.</p></div><b>⭐ {Object.keys(placed).length} / {items.length}</b></div><div className="sorting-items" aria-label="Pictures to sort">{items.map(item=>!placed[item.id]&&<button key={`${round}-${item.id}`} className={`sorting-item ${dragId===item.id?"dragging":""}`} style={dragId===item.id?{transform:`translate(${dragDelta.x}px, ${dragDelta.y}px)`}:undefined} onPointerDown={event=>onItemDown(event,item.id)} onPointerMove={event=>onItemMove(event,item.id)} onPointerUp={event=>onItemUp(event,item.id)} onPointerCancel={()=>{setDragId(null);setDragDelta({x:0,y:0});setHoverBin(null);}}><span>{item.picture}</span><b>{item.label}</b></button>)}</div><div className="sorting-bins">{sortCategories.map(category=><div key={category.id} ref={el=>{if(el)binRefs.current.set(category.id,el);else binRefs.current.delete(category.id);}} className={`sorting-bin cat-${category.id} ${hoverBin===category.id?"hover":""} ${wrongBin===category.id?"wrong":""}`}><span className="sorting-bin-icon">{category.icon}</span><strong>{category.label}</strong><small>{category.telugu} · {category.hindi}</small><span className="sorting-placed">{items.filter(item=>placed[item.id]===category.id).map(item=><i key={item.id} className={landed===item.id?"landed":""} title={item.label}>{item.picture}</i>)}</span></div>)}</div><div className={`sorting-feedback ${finished?"complete":""}`} aria-live="polite">{finished?"Great sorting! Every picture is in the right group.":feedback}</div><button className="sorting-reset" onClick={reset}>{finished?"New round →":"New picture mix ↻"}</button></article>;
}

type ColoringPage={label:string;src:string};
const coloringPages:Record<string,ColoringPage>={
  bees:{label:"Dancing Bees",src:"/assets/coloring/original/bees.png"},
  flower:{label:"Friendly Flower",src:"/assets/coloring/original/flower.png"},
  squirrel:{label:"Squirrel & Acorn",src:"/assets/coloring/original/squirrel.png"},
  rainy_days:{label:"Rainy Day Puddles",src:"/assets/coloring/original/rainy_days.png"},
  parade:{label:"Musical Parade",src:"/assets/coloring/original/parade.png"},
  monkey:{label:"Playful Monkey",src:"/assets/coloring/original/monkey.png"},
  frog:{label:"Frog on a Lily Pad",src:"/assets/coloring/original/frog.png"},
  owl:{label:"Owl at Night",src:"/assets/coloring/original/owl.png"},
  seahorse:{label:"Seahorse",src:"/assets/coloring/original/seahorse.png"},
  dino_flower:{label:"Dino with a Flower",src:"/assets/coloring/original/dino_flower.png"},
  snake:{label:"Spotty Snake",src:"/assets/coloring/original/snake.png"},
  jellyfish:{label:"Jellyfish Reef",src:"/assets/coloring/original/jellyfish.png"},
  shark:{label:"Friendly Shark",src:"/assets/coloring/original/shark.png"},
  sloth:{label:"Sleepy Sloth",src:"/assets/coloring/original/sloth.png"},
  turtle_family:{label:"Turtle Family",src:"/assets/coloring/original/turtle_family.png"},
  tiger:{label:"Tiger Cub",src:"/assets/coloring/original/tiger.png"},
  giraffe:{label:"Baby Giraffe",src:"/assets/coloring/original/giraffe.png"},
  cow:{label:"Baby Cow",src:"/assets/coloring/original/cow.png"},
};
const coloringPageOrder=["bees","flower","squirrel","rainy_days","parade","monkey","frog","owl","seahorse","dino_flower","snake","jellyfish","shark","sloth","turtle_family","tiger","giraffe","cow"];
const crayonColors=["#2c2118","#e63946","#ff9f1c","#ffd23f","#8ac926","#1b998b","#159a90","#3a86ff","#5e60ce","#b5179e","#ff6f9c","#ffb4a2","#a5714a","#6c584c","#adb5bd","#ffffff"];

function hexToRgb(hex:string):[number,number,number]{const v=parseInt(hex.slice(1),16);return [(v>>16)&255,(v>>8)&255,v&255];}

function floodFill(ctx:CanvasRenderingContext2D,startX:number,startY:number,fillHex:string):boolean{
  const canvas=ctx.canvas;const w=canvas.width,h=canvas.height;
  const imageData=ctx.getImageData(0,0,w,h);const data=imageData.data;
  const idxOf=(x:number,y:number)=>(y*w+x)*4;
  const si=idxOf(startX,startY);const sr=data[si],sg=data[si+1],sb=data[si+2];
  if(sr<60&&sg<60&&sb<60)return false;
  const [fr,fg,fb]=hexToRgb(fillHex);
  if(Math.abs(sr-fr)<12&&Math.abs(sg-fg)<12&&Math.abs(sb-fb)<12)return false;
  const tol=40;const visited=new Uint8Array(w*h);const stack:[number,number][]=[[startX,startY]];
  while(stack.length){
    const [x,y]=stack.pop()!;
    if(x<0||x>=w||y<0||y>=h)continue;
    const pos=y*w+x;if(visited[pos])continue;
    const idx=pos*4;const dr=data[idx]-sr,dg=data[idx+1]-sg,db=data[idx+2]-sb;
    if(Math.abs(dr)>tol||Math.abs(dg)>tol||Math.abs(db)>tol)continue;
    visited[pos]=1;data[idx]=fr;data[idx+1]=fg;data[idx+2]=fb;data[idx+3]=255;
    stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
  }
  ctx.putImageData(imageData,0,0);return true;
}

function ColoringStudio(){
  const [pageId,setPageId]=useState(coloringPageOrder[0]);
  const [reloadKey,setReloadKey]=useState(0);
  const [color,setColor]=useState(crayonColors[1]);
  const [canUndo,setCanUndo]=useState(false);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const undoStackRef=useRef<ImageData[]>([]);
  const colorRef=useRef(color);
  useEffect(()=>{colorRef.current=color;},[color]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});if(!ctx)return;
    const img=new Image();
    img.onload=()=>{canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;ctx.drawImage(img,0,0);};
    img.src=coloringPages[pageId].src;
  },[pageId,reloadKey]);

  function tapAt(clientX:number,clientY:number){
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});if(!ctx)return;
    const rect=canvas.getBoundingClientRect();
    const x=Math.floor((clientX-rect.left)*(canvas.width/rect.width));
    const y=Math.floor((clientY-rect.top)*(canvas.height/rect.height));
    if(x<0||y<0||x>=canvas.width||y>=canvas.height)return;
    const snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);
    const changed=floodFill(ctx,x,y,colorRef.current);
    if(changed){undoStackRef.current.push(snapshot);if(undoStackRef.current.length>20)undoStackRef.current.shift();setCanUndo(true);}
  }

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const onTouchStart=(event:TouchEvent)=>{event.preventDefault();const touch=event.touches[0];if(touch)tapAt(touch.clientX,touch.clientY);};
    canvas.addEventListener("touchstart",onTouchStart,{passive:false});
    return ()=>canvas.removeEventListener("touchstart",onTouchStart);
  },[]);

  function selectPage(id:string){setPageId(id);undoStackRef.current=[];setCanUndo(false);}
  function resetPage(){undoStackRef.current=[];setCanUndo(false);setReloadKey(value=>value+1);}
  function undoPage(){
    const canvas=canvasRef.current;const ctx=canvas?.getContext("2d");
    const snapshot=undoStackRef.current.pop();
    if(snapshot&&ctx){ctx.putImageData(snapshot,0,0);setCanUndo(undoStackRef.current.length>0);}
  }

  return <article className="mini-game coloring-game"><div className="mini-game-head"><div><small>GAME 11 · MAGIC ART STUDIO</small><h3>Vani's <em>Magic Art Studio</em></h3><p>Pick a picture, choose a color, then tap inside the lines to fill it in.</p><BuddyTip name="vani" message="Pick any page — I'll cheer while you color!" /></div></div>
    <div className="coloring-strip">{coloringPageOrder.map(id=><button key={id} className={"coloring-thumb"+(id===pageId?" active":"")} onClick={()=>selectPage(id)}><img src={coloringPages[id].src} alt="" /><span>{coloringPages[id].label}</span></button>)}</div>
    <div className="coloring-canvas-card">
      <div className="coloring-canvas-toolbar"><button onClick={undoPage} disabled={!canUndo} aria-label="Undo">↺</button><button onClick={resetPage} aria-label="Clear page">✕</button></div>
      <canvas ref={canvasRef} onClick={event=>tapAt(event.clientX,event.clientY)} />
    </div>
    <div className="coloring-tray">{crayonColors.map(value=><button key={value} className={"coloring-crayon"+(color===value?" active":"")} style={{"--crayon-color":value} as React.CSSProperties} onClick={()=>setColor(value)} aria-label={`Choose ${value} crayon`} />)}</div>
  </article>;
}

type FoodCard={english:string;roman:string;telugu:string;picture:string};
const foodCards:Record<"Vegetables"|"Fruits",FoodCard[]>={
  Vegetables:[
    {english:"Potato",roman:"algadda",telugu:"ఆల్గడ్డ",picture:"🥔"},{english:"Tindora",roman:"donadakaaya",telugu:"దొండకాయ",picture:"🥒"},{english:"Yellow cucumber",roman:"dosakaaya / budamakaaya",telugu:"దోసకాయ / బుదమకాయ",picture:"🥒"},{english:"Drumstick",roman:"munagakaaya",telugu:"మునగకాయ",picture:"🌿"},{english:"Corn",roman:"makkajonna / jonnakankulu",telugu:"కంకి / కంకులు / జొన్నలు / మక్కబుట్ట / మక్కజొన్న",picture:"🌽"},{english:"Onion",roman:"ulligadda",telugu:"ఉల్లిగడ్డ",picture:"🧅"},{english:"Okra",roman:"bendakaaya",telugu:"బెండకాయ",picture:"🌱"},{english:"Bottle gourd",roman:"sorakaaya",telugu:"సొరకాయ",picture:"🍐"},{english:"Bitter gourd",roman:"kaakarkaaya",telugu:"కాకరకాయ",picture:"🥒"},{english:"Snake gourd",roman:"potlakaaya",telugu:"పొట్లకాయ",picture:"🥒"},{english:"Ridge gourd",roman:"beerakaaya",telugu:"బీరకాయ",picture:"🥒"},{english:"Pumpkin",roman:"gummadikaaya",telugu:"గుమ్మడికాయ",picture:"🎃"},{english:"Yam",roman:"kandagadda",telugu:"కందగడ్డ",picture:"🍠"},{english:"Cabbage",roman:"kyaabej",telugu:"క్యాబేజీ",picture:"🥬"},{english:"Chilli pepper",roman:"mirapakaaya",telugu:"మిరపకాయ",picture:"🌶️"},{english:"Eggplant",roman:"vankaaya",telugu:"వంకాయ",picture:"🍆"},{english:"Cauliflower",roman:"kaaliphlavar",telugu:"కాలీఫ్లవర్",picture:"🥦"},{english:"Green beans",roman:"chikkudukaaya",telugu:"చిక్కుడుకాయ",picture:"🫛"},{english:"Bell pepper",roman:"kyapsicum / capsicum",telugu:"క్యాప్సికం",picture:"🫑"},
  ],
  Fruits:[
    {english:"Apple",roman:"apple pandu",telugu:"ఆపిల్ పండు",picture:"🍎"},{english:"Banana",roman:"arati pandu",telugu:"అరటి పండు",picture:"🍌"},{english:"Orange",roman:"naranja",telugu:"నారింజ",picture:"🍊"},{english:"Mango",roman:"maamidi pandu",telugu:"మామిడి పండు",picture:"🥭"},{english:"Custard apple",roman:"seethaphalam",telugu:"సీతాఫలం",picture:"🍈"},{english:"Grapes",roman:"draksha pallu",telugu:"ద్రాక్ష పళ్ళు",picture:"🍇"},{english:"Pomegranate",roman:"danimma",telugu:"దానిమ్మ",picture:"🔴"},{english:"Lemon",roman:"nimma kaaya",telugu:"నిమ్మకాయ",picture:"🍋"},{english:"Lime",roman:"nimma kaaya",telugu:"నిమ్మకాయ",picture:"🟢"},{english:"Chikoo",roman:"sapota",telugu:"చీకూ",picture:"🥝"},{english:"Strawberry",roman:"straberri",telugu:"స్ట్రాబెర్రీ",picture:"🍓"},{english:"Tomato",roman:"tamata",telugu:"టమాటా",picture:"🍅"},{english:"Jackfruit",roman:"panasa pandu",telugu:"పనస పండు",picture:"🍈"},{english:"Jamun",roman:"neredu pallu",telugu:"నేరేడు పళ్ళు",picture:"🫐"},{english:"Papaya",roman:"boppayi",telugu:"బొప్పాయి",picture:"🧡"},{english:"Guava",roman:"jaama kaaya",telugu:"జామకాయ",picture:"🍐"},{english:"Coconut",roman:"kobbari kaaya",telugu:"కొబ్బరికాయ",picture:"🥥"},{english:"Watermelon",roman:"pucchakaaya",telugu:"పుచ్చకాయ",picture:"🍉"},{english:"Batai",roman:"batai",telugu:"బటాయి / బటై",picture:"🍊"},{english:"Mulberry",roman:"malbari",telugu:"మల్బరీ",picture:"🫐"},{english:"Lychee",roman:"lichi",telugu:"లీచీ",picture:"🔴"},{english:"Cantaloupe",roman:"karbooza",telugu:"కర్బూజా",picture:"🍈"},{english:"Plantain",roman:"arati kaaya",telugu:"అరటికాయ",picture:"🍌"},
  ],
};

function FoodDeck({category}:{category:"Vegetables"|"Fruits"}){
  const [round,setRound]=useState(0);const [solved,setSolved]=useState<string[]>([]);const [score,setScore]=useState(0);const [dragId,setDragId]=useState<string|null>(null);const [dragDelta,setDragDelta]=useState({x:0,y:0});const [hoverWord,setHoverWord]=useState<string|null>(null);const [wrongWord,setWrongWord]=useState<string|null>(null);const [landed,setLanded]=useState<string|null>(null);
  const dragOrigin=useRef({x:0,y:0});const wordRefs=useRef<Map<string,HTMLDivElement>>(new Map());
  const source=foodCards[category];
  const items=useMemo(()=>{const picked:FoodCard[]=[];for(let step=0;picked.length<4;step++){const candidate=source[(round*5+step*7)%source.length];if(!picked.some(entry=>entry.english===candidate.english))picked.push(candidate);}return picked;},[category,round,source]);
  const wordOrder=useMemo(()=>{const order=[...items];for(let i=order.length-1;i>0;i--){const j=(i*7+round*3)%(i+1);[order[i],order[j]]=[order[j],order[i]];}return order;},[items,round]);
  const finished=solved.length===items.length;
  function wordAt(x:number,y:number):string|null{for(const [english,el] of wordRefs.current){const rect=el.getBoundingClientRect();if(x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom)return english;}return null;}
  function onCardDown(event:React.PointerEvent<HTMLButtonElement>,id:string){if(solved.includes(id))return;event.currentTarget.setPointerCapture(event.pointerId);dragOrigin.current={x:event.clientX,y:event.clientY};setDragId(id);setDragDelta({x:0,y:0});}
  function onCardMove(event:React.PointerEvent<HTMLButtonElement>,id:string){if(dragId!==id)return;setDragDelta({x:event.clientX-dragOrigin.current.x,y:event.clientY-dragOrigin.current.y});setHoverWord(wordAt(event.clientX,event.clientY));}
  function onCardUp(event:React.PointerEvent<HTMLButtonElement>,id:string){if(dragId!==id)return;setDragId(null);setDragDelta({x:0,y:0});setHoverWord(null);const target=wordAt(event.clientX,event.clientY);if(!target)return;if(target===id){setSolved(value=>[...value,id]);setLanded(id);setScore(value=>value+1);window.setTimeout(()=>setLanded(null),450);}else{setWrongWord(target);window.setTimeout(()=>setWrongWord(null),450);}}
  function newRound(){setRound(value=>value+1);setSolved([]);setDragId(null);setDragDelta({x:0,y:0});setHoverWord(null);setWrongWord(null);}
  return <section className={`food-deck match-pairs ${category.toLowerCase()}`} aria-label={`${category} Telugu matching game`}><div className="food-deck-head"><div><span>{category==="Vegetables"?"🥕":"🍎"}</span><div><small>{category.toUpperCase()} MATCHING GAME</small><h4>{category==="Vegetables"?"కూరగాయలు":"పండ్లు"}</h4></div></div><b>⭐ {score} stars</b></div><p className="match-pairs-hint">Drag each picture onto its matching Telugu word.</p><div className="match-pairs-board"><div className="match-pairs-source">{items.map(item=>!solved.includes(item.english)&&<button key={`${round}-${item.english}`} className={`match-pairs-card ${dragId===item.english?"dragging":""}`} style={dragId===item.english?{transform:`translate(${dragDelta.x}px, ${dragDelta.y}px)`}:undefined} onPointerDown={event=>onCardDown(event,item.english)} onPointerMove={event=>onCardMove(event,item.english)} onPointerUp={event=>onCardUp(event,item.english)} onPointerCancel={()=>{setDragId(null);setDragDelta({x:0,y:0});setHoverWord(null);}}><span>{item.picture}</span><b>{item.english}</b><i>[{item.roman}]</i></button>)}</div><div className="match-pairs-targets">{wordOrder.map(item=><div key={item.english} ref={el=>{if(el)wordRefs.current.set(item.english,el);else wordRefs.current.delete(item.english);}} className={`match-pairs-target ${solved.includes(item.english)?"solved":""} ${hoverWord===item.english?"hover":""} ${wrongWord===item.english?"wrong":""}`}><b>{item.telugu}</b>{solved.includes(item.english)&&<i className={landed===item.english?"landed":""}>{item.picture}</i>}</div>)}</div></div><div className={`match-pairs-feedback ${finished?"complete":""}`} aria-live="polite">{finished?"✨ All matched! Great reading.":"Drag a picture card onto its matching Telugu word."}</div><div className="vocab-actions"><span>Round {round+1}</span><button onClick={newRound}>{finished?"New round →":"Shuffle picks ↻"}</button></div></section>;
}

function VocabularyShuffle(){return <article className="vocab-game"><div className="vocab-head"><div><small>GAME 7 · WORD MATCH-UP</small><h3>Drag, Match &amp; Learn</h3><p>Drag each picture card onto the Telugu word it matches. All four pairs must be solved to win the round.</p><BuddyTip name="vani" message="Match all four pairs and I'll cheer for you!" /></div></div><FoodDeck category="Vegetables"/><FoodDeck category="Fruits"/></article>}

type ActionCard={english:string;emoji:string;telugu:string;teluguPhonetic:string;hindi:string;hindiPhonetic:string;group:"Daily routine"|"Play & move"|"Learn & create";image:string};
const actionCards:ActionCard[]=[
  {english:"Eat",emoji:"🍎",telugu:"తిను",teluguPhonetic:"Tinu",hindi:"खाना",hindiPhonetic:"Khana",group:"Daily routine",image:"/assets/images/actions/vageesh-eat.png"},
  {english:"Drink",emoji:"🥛",telugu:"తాగు",teluguPhonetic:"Taagu",hindi:"पीना",hindiPhonetic:"Peena",group:"Daily routine",image:"/assets/images/actions/vageesh-drink.png"},
  {english:"Sleep",emoji:"😴",telugu:"పడుకో / నిద్రపో",teluguPhonetic:"Paduko / Nidrapo",hindi:"सोना",hindiPhonetic:"Sona",group:"Daily routine",image:"/assets/images/actions/vageesh-sleep.png"},
  {english:"Wash",emoji:"🧼",telugu:"కడుగు",teluguPhonetic:"Kadugu",hindi:"धोना",hindiPhonetic:"Dhona",group:"Daily routine",image:"/assets/images/actions/vageesh-wash.png"},
  {english:"Run",emoji:"🏃",telugu:"పరిగెత్తు",teluguPhonetic:"Parigettu",hindi:"दौड़ना",hindiPhonetic:"Daudna",group:"Play & move",image:"/assets/images/actions/vageesh-run.png"},
  {english:"Jump",emoji:"🦘",telugu:"దూకు",teluguPhonetic:"Dooku",hindi:"कूदना",hindiPhonetic:"Koodna",group:"Play & move",image:"/assets/images/actions/vageesh-jump.png"},
  {english:"Play",emoji:"🧩",telugu:"ఆడుకో",teluguPhonetic:"Aaduko",hindi:"खेलना",hindiPhonetic:"Khelna",group:"Play & move",image:"/assets/images/actions/vageesh-play.png"},
  {english:"Sing",emoji:"🎤",telugu:"పాడు",teluguPhonetic:"Paadu",hindi:"गाना",hindiPhonetic:"Gaana",group:"Play & move",image:"/assets/images/actions/vageesh-sing.png"},
  {english:"Dance",emoji:"💃",telugu:"నాట్యం చేయి",teluguPhonetic:"Naatyam cheyi",hindi:"नाचना",hindiPhonetic:"Naachna",group:"Play & move",image:"/assets/images/actions/vani-dance.png"},
  {english:"Laugh",emoji:"😄",telugu:"నవ్వు",teluguPhonetic:"Navvu",hindi:"हंसना",hindiPhonetic:"Hansna",group:"Play & move",image:"/assets/images/actions/vageesh-laugh.png"},
  {english:"Read",emoji:"📚",telugu:"చదువు",teluguPhonetic:"Chaduvu",hindi:"पढ़ना",hindiPhonetic:"Padhna",group:"Learn & create",image:"/assets/images/actions/vani-read.png"},
  {english:"Write",emoji:"✏️",telugu:"రాయి",teluguPhonetic:"Raayi",hindi:"लिखना",hindiPhonetic:"Likhna",group:"Learn & create",image:"/assets/images/actions/vani-write.png"},
  {english:"Draw",emoji:"🎨",telugu:"బొమ్మ గీయి",teluguPhonetic:"Bomma geeyi",hindi:"चित्र बनाना",hindiPhonetic:"Chitra banana",group:"Learn & create",image:"/assets/images/actions/vani-draw.png"},
  {english:"Listen",emoji:"👂",telugu:"విను",teluguPhonetic:"Vinu",hindi:"सुनना",hindiPhonetic:"Sunna",group:"Learn & create",image:"/assets/images/actions/vani-listen.png"},
  {english:"Speak",emoji:"🗣️",telugu:"మాట్లాడు",teluguPhonetic:"Maatlaadu",hindi:"बोलना",hindiPhonetic:"Bolna",group:"Learn & create",image:"/assets/images/actions/vani-speak.png"},
];

const actionGroupSlug:Record<ActionCard["group"],string>={"Daily routine":"daily","Play & move":"play","Learn & create":"learn"};

const QUIZ_MS=6000;

function ActionFlashcards(){
  const [language,setLanguage]=useState<"Telugu"|"Hindi">("Telugu");const [round,setRound]=useState(0);const [score,setScore]=useState(0);const [streak,setStreak]=useState(0);const [best,setBest]=useState(0);const [status,setStatus]=useState<"idle"|"correct"|"wrong"|"timeout">("idle");const [pickedId,setPickedId]=useState<string|null>(null);const [celebrated,setCelebrated]=useState(false);const [brokenImages,setBrokenImages]=useState<Set<string>>(new Set());
  const target=actionCards[(round*7+3)%actionCards.length];
  const choices=useMemo(()=>{const pool=actionCards.filter(card=>card.english!==target.english);const picks=[target];for(let step=1;picks.length<4&&step<pool.length*2;step++){const candidate=pool[(round*11+step*5)%pool.length];if(!picks.some(pick=>pick.english===candidate.english))picks.push(candidate);}for(let i=picks.length-1;i>0;i--){const j=(i*9+round*3)%(i+1);[picks[i],picks[j]]=[picks[j],picks[i]];}return picks;},[round,target]);
  useEffect(()=>{setStatus("idle");setPickedId(null);const timer=window.setTimeout(()=>{setStatus(current=>current==="idle"?"timeout":current);},QUIZ_MS);return()=>window.clearTimeout(timer);},[round]);
  useEffect(()=>{if(status==="idle")return;if(status==="correct"){setScore(value=>value+1);setStreak(value=>{const next=value+1;setBest(prev=>Math.max(prev,next));if(next>0&&next%5===0)setCelebrated(true);return next;});}else setStreak(0);const advance=window.setTimeout(()=>setRound(value=>value+1),status==="correct"?750:1150);return()=>window.clearTimeout(advance);},[status]);
  function choose(card:ActionCard){if(status!=="idle")return;setPickedId(card.english);setStatus(card.english===target.english?"correct":"wrong");}
  function restart(){setRound(0);setScore(0);setStreak(0);setBest(0);setStatus("idle");setPickedId(null);}
  function changeLanguage(next:"Telugu"|"Hindi"){setLanguage(next);restart();}
  const prompt=language==="Telugu"?{word:target.telugu,phonetic:target.teluguPhonetic}:{word:target.hindi,phonetic:target.hindiPhonetic};
  return <article className="action-game"><div className="action-head"><div><small>GAME 8 · BEAT THE CLOCK</small><h3>Quick, Tap the Action!</h3><p>Read the Telugu or Hindi word before the ring runs out, then tap the matching picture.</p><BuddyTip name="mayuri" message="Keep your streak going and I'll fan my feathers!" /></div><b>⭐ {score} · 🔥 {streak} · best {best}</b></div><div className="action-filters" role="group" aria-label="Choose language"><button className={language==="Telugu"?"active":""} onClick={()=>changeLanguage("Telugu")}>తెలుగు</button><button className={language==="Hindi"?"active":""} onClick={()=>changeLanguage("Hindi")}>हिन्दी</button><button className="quiz-restart" onClick={restart}>↻ Restart</button></div><div className={`quiz-prompt group-${actionGroupSlug[target.group]} ${status}`}><svg className="quiz-ring" viewBox="0 0 60 60" aria-hidden="true"><circle className="quiz-ring-track" cx="30" cy="30" r="26"/><circle key={round} className="quiz-ring-progress" cx="30" cy="30" r="26" style={{animationPlayState:status==="idle"?"running":"paused"}}/></svg><div className="quiz-prompt-copy"><small>WHAT ACTION IS THIS?</small><b lang={language==="Telugu"?"te":"hi"}>{prompt.word}</b><i>[{prompt.phonetic}]</i></div></div><div className="quiz-choices">{choices.map(card=>{const isTarget=card.english===target.english;const isPicked=pickedId===card.english;const revealed=status!=="idle"&&isTarget;const missed=status!=="idle"&&isPicked&&!isTarget;return <button key={`${round}-${card.english}`} className={`${revealed?"correct":""} ${missed?"wrong":""}`} onClick={()=>choose(card)} aria-label={card.english}>{brokenImages.has(card.english)?<i>{card.emoji}</i>:<img src={card.image} alt="" onError={()=>setBrokenImages(value=>new Set(value).add(card.english))}/>}</button>})}</div><div className={`quiz-feedback ${status}`} aria-live="polite">{status==="idle"?"Tap the picture for this action.":status==="timeout"?`⏰ Time's up! ${target.english} = ${target.telugu} / ${target.hindi}`:status==="correct"?`✓ ${target.english} = ${target.telugu} / ${target.hindi}`:`✗ Not quite. ${target.english} = ${target.telugu} / ${target.hindi}`}</div>{celebrated&&<BuddyCelebrate name="mayuri" title="On fire! 🦚" message={`A ${streak}-answer streak — Mayuri is fanning her feathers for you!`} onAction={()=>setCelebrated(false)} actionLabel="Keep going" />}</article>;
}

type RainLanguage="Telugu"|"Hindi";
type RainGroup="Vowels"|"Consonants";
const rainLetters:Record<RainLanguage,Record<RainGroup,string[]>>={
  Telugu:{Vowels:["అ","ఆ","ఇ","ఈ","ఉ","ఊ","ఋ","ఎ","ఏ","ఐ","ఒ","ఓ","ఔ","అం","అః"],Consonants:["క","ఖ","గ","ఘ","చ","ఛ","జ","ఝ","ట","ఠ","డ","ఢ","త","థ","ద","ధ","న","ప","ఫ","బ","భ","మ","య","ర","ల","వ","శ","ష","స","హ"]},
  Hindi:{Vowels:["अ","आ","इ","ई","उ","ऊ","ऋ","ए","ऐ","ओ","औ","अं","अः"],Consonants:["क","ख","ग","घ","च","छ","ज","झ","ट","ठ","ड","ढ","त","थ","द","ध","न","प","फ","ब","भ","म","य","र","ल","व","श","ष","स","ह"]},
};

function LetterRain(){
  const [language,setLanguage]=useState<RainLanguage>("Telugu");const [group,setGroup]=useState<RainGroup>("Vowels");const [round,setRound]=useState(0);const [score,setScore]=useState(0);const [feedback,setFeedback]=useState("Tap the matching falling letter.");
  const source=rainLetters[language][group];const target=source[(round*5+2)%source.length];const targetIndex=(round*3+1)%6;
  const drops=useMemo(()=>Array.from({length:6},(_,index)=>index===targetIndex?target:source[(round*7+index*3+4)%source.length]),[language,group,round,target,targetIndex,source]);
  function restart(nextLanguage=language,nextGroup=group){setLanguage(nextLanguage);setGroup(nextGroup);setRound(0);setScore(0);setFeedback("Tap the matching falling letter.");}
  function next(message:string){setFeedback(message);setTimeout(()=>{setRound(value=>value+1);setFeedback("Tap the matching falling letter.");},500);}
  function choose(letter:string){if(feedback!=="Tap the matching falling letter.")return;if(letter===target){setScore(value=>value+1);next("✓ Correct!");}else{setFeedback("Try another falling letter.");setTimeout(()=>setFeedback("Tap the matching falling letter."),450);}}
  function missed(){if(feedback==="Tap the matching falling letter.")next("The letter passed—try the next one.");}
  return <article className="letter-rain-game"><div className="letter-rain-head"><div><small>GAME 9 · SILENT LETTER RECOGNITION</small><h3>Letter Rain</h3><p>Find and tap the requested letter before it reaches the bottom.</p></div><b>⭐ {score} points</b></div><div className="rain-controls"><div>{(["Telugu","Hindi"] as const).map(item=><button key={item} className={language===item?"active":""} onClick={()=>restart(item,group)}>{item==="Telugu"?"తెలుగు":"हिन्दी"}</button>)}</div><div>{(["Vowels","Consonants"] as const).map(item=><button key={item} className={group===item?"active":""} onClick={()=>restart(language,item)}>{item}</button>)}</div></div><div className="rain-target">Tap <strong>{target}</strong></div><div className="rain-sky" key={`${language}-${group}-${round}`} aria-label={`Tap the falling letter ${target}`}>{drops.map((letter,index)=><button key={`${round}-${index}-${letter}`} style={{"--rain-left":`${8+index*16}%`,"--rain-delay":`${(index%3)*.35}s`,"--rain-speed":`${5.8+(index%2)*.7}s`} as React.CSSProperties} onClick={()=>choose(letter)} onAnimationEnd={index===targetIndex?missed:undefined} aria-label={`Falling letter ${letter}`}>{letter}</button>)}</div><div className="rain-feedback" aria-live="polite">{feedback}</div><button className="rain-next" onClick={()=>{setRound(value=>value+1);setFeedback("Tap the matching falling letter.");}}>New letter →</button></article>;
}

type LetterMatchLanguage="Telugu"|"Hindi";
type LetterMatchEntry={word:string;letter:string;roman:string};
type LetterMatchWord={id:string;emoji:string;english:string;Telugu:LetterMatchEntry;Hindi:LetterMatchEntry};

const letterMatchWords:LetterMatchWord[]=[
  {id:"mango",emoji:"🥭",english:"Mango",Telugu:{word:"మామిడి",letter:"మా",roman:"Māmidi"},Hindi:{word:"आम",letter:"आ",roman:"Aam"}},
  {id:"banana",emoji:"🍌",english:"Banana",Telugu:{word:"అరటిపండు",letter:"అ",roman:"Aratipandu"},Hindi:{word:"केला",letter:"के",roman:"Kela"}},
  {id:"apple",emoji:"🍎",english:"Apple",Telugu:{word:"ఆపిల్",letter:"ఆ",roman:"Āpil"},Hindi:{word:"सेब",letter:"से",roman:"Seb"}},
  {id:"orange",emoji:"🍊",english:"Orange",Telugu:{word:"నారింజ",letter:"నా",roman:"Nāriṃja"},Hindi:{word:"संतरा",letter:"सं",roman:"Santara"}},
  {id:"watermelon",emoji:"🍉",english:"Watermelon",Telugu:{word:"పుచ్చకాయ",letter:"పు",roman:"Pucchakāya"},Hindi:{word:"तरबूज़",letter:"त",roman:"Tarbooz"}},
  {id:"guava",emoji:"🍐",english:"Guava",Telugu:{word:"జామకాయ",letter:"జా",roman:"Jāmakāya"},Hindi:{word:"अमरूद",letter:"अ",roman:"Amrud"}},
  {id:"carrot",emoji:"🥕",english:"Carrot",Telugu:{word:"క్యారెట్",letter:"క్యా",roman:"Kyāreṭ"},Hindi:{word:"गाजर",letter:"गा",roman:"Gajar"}},
  {id:"tomato",emoji:"🍅",english:"Tomato",Telugu:{word:"టమాటా",letter:"ట",roman:"Ṭamāṭā"},Hindi:{word:"टमाटर",letter:"ट",roman:"Ṭamāṭar"}},
  {id:"potato",emoji:"🥔",english:"Potato",Telugu:{word:"బంగాళదుంప",letter:"బం",roman:"Baṅgāḷaduṃpa"},Hindi:{word:"आलू",letter:"आ",roman:"Aloo"}},
  {id:"onion",emoji:"🧅",english:"Onion",Telugu:{word:"ఉల్లిగడ్డ",letter:"ఉ",roman:"Ulligadda"},Hindi:{word:"प्याज़",letter:"प्या",roman:"Pyaz"}},
  {id:"eggplant",emoji:"🍆",english:"Eggplant",Telugu:{word:"వంకాయ",letter:"వం",roman:"Vankāya"},Hindi:{word:"बैंगन",letter:"बैं",roman:"Baingan"}},
  {id:"corn",emoji:"🌽",english:"Corn",Telugu:{word:"మొక్కజొన్న",letter:"మొ",roman:"Mokkajonna"},Hindi:{word:"मक्का",letter:"म",roman:"Makka"}},
  {id:"elephant",emoji:"🐘",english:"Elephant",Telugu:{word:"ఏనుగు",letter:"ఏ",roman:"Ēnugu"},Hindi:{word:"हाथी",letter:"हा",roman:"Hathi"}},
  {id:"lion",emoji:"🦁",english:"Lion",Telugu:{word:"సింహం",letter:"సిం",roman:"Siṃhaṃ"},Hindi:{word:"शेर",letter:"शे",roman:"Sher"}},
  {id:"dog",emoji:"🐶",english:"Dog",Telugu:{word:"కుక్క",letter:"కు",roman:"Kukka"},Hindi:{word:"कुत्ता",letter:"कु",roman:"Kutta"}},
  {id:"cat",emoji:"🐱",english:"Cat",Telugu:{word:"పిల్లి",letter:"పి",roman:"Pilli"},Hindi:{word:"बिल्ली",letter:"बि",roman:"Billi"}},
  {id:"cow",emoji:"🐄",english:"Cow",Telugu:{word:"ఆవు",letter:"ఆ",roman:"Āvu"},Hindi:{word:"गाय",letter:"गा",roman:"Gay"}},
  {id:"rabbit",emoji:"🐰",english:"Rabbit",Telugu:{word:"కుందేలు",letter:"కుం",roman:"Kundēlu"},Hindi:{word:"खरगोश",letter:"ख",roman:"Khargosh"}},
];

function FirstLetterMatch(){
  const [language,setLanguage]=useState<LetterMatchLanguage>("Telugu");const [round,setRound]=useState(0);const [seed,setSeed]=useState(0);const [score,setScore]=useState(0);const [status,setStatus]=useState<"idle"|"correct"|"wrong">("idle");const [dropped,setDropped]=useState<string|null>(null);const [dragId,setDragId]=useState<string|null>(null);const [dragDelta,setDragDelta]=useState({x:0,y:0});const [celebrated,setCelebrated]=useState(false);
  const dragOrigin=useRef({x:0,y:0});const dropRef=useRef<HTMLDivElement>(null);
  const target=letterMatchWords[(round+seed*3)%letterMatchWords.length];const entry=target[language];const targetLetter=entry.letter;
  const choices=useMemo(()=>{const pool=letterMatchWords.filter(word=>word.id!==target.id);const picks:string[]=[];for(let step=1;picks.length<5&&step<pool.length*3;step++){const candidate=pool[(round*7+seed*11+step*5)%pool.length][language].letter;if(candidate!==targetLetter&&!picks.includes(candidate))picks.push(candidate);}const all=[targetLetter,...picks];for(let i=all.length-1;i>0;i--){const j=(i*9+round*5+seed*7)%(i+1);[all[i],all[j]]=[all[j],all[i]];}return all.map((letter,index)=>({id:`${round}-${seed}-${index}-${letter}`,letter}));},[target,targetLetter,language,round,seed]);
  function changeLanguage(next:LetterMatchLanguage){setLanguage(next);setRound(0);setSeed(value=>value+1);setStatus("idle");setDropped(null);}
  function skip(){setRound(value=>value+1);setStatus("idle");setDropped(null);}
  function onTileDown(event:React.PointerEvent<HTMLButtonElement>,id:string){if(status==="correct")return;event.currentTarget.setPointerCapture(event.pointerId);dragOrigin.current={x:event.clientX,y:event.clientY};setDragId(id);setDragDelta({x:0,y:0});}
  function onTileMove(event:React.PointerEvent<HTMLButtonElement>,id:string){if(dragId!==id)return;setDragDelta({x:event.clientX-dragOrigin.current.x,y:event.clientY-dragOrigin.current.y});}
  function onTileUp(event:React.PointerEvent<HTMLButtonElement>,id:string,letter:string){if(dragId!==id)return;setDragId(null);setDragDelta({x:0,y:0});const zone=dropRef.current;if(!zone)return;const rect=zone.getBoundingClientRect();const inside=event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;if(!inside)return;if(letter===targetLetter){setDropped(letter);setStatus("correct");setScore(value=>{const next=value+1;if(next%5===0)setCelebrated(true);return next;});window.setTimeout(()=>{setRound(value=>value+1);setStatus("idle");setDropped(null);},1100);}else{setStatus("wrong");window.setTimeout(()=>setStatus("idle"),450);}}
  return <article className="letter-match-game"><div className="letter-match-head"><div><small>GAME 10 · FIRST LETTER MATCH</small><h3>Drag the <em>First Letter!</em></h3><p>Look at the picture and its name, then drag the letter it starts with into the answer box.</p><BuddyTip name="chintu" message="Listen for the first sound and drag it home!" /></div><b>⭐ {score} points</b></div><div className="letter-match-lang" role="group" aria-label="Choose language">{(["Telugu","Hindi"] as const).map(item=><button key={item} className={language===item?"active":""} onClick={()=>changeLanguage(item)}>{item==="Telugu"?"తెలుగు":"हिन्दी"}</button>)}</div><div className="letter-match-board"><div className="letter-match-card"><span>{target.emoji}</span><b>{target.english}</b><i lang={language==="Telugu"?"te":"hi"}>{entry.word}</i><small>{entry.roman}</small></div><div className="letter-match-drop-wrap"><small>Drag the first letter here</small><div ref={dropRef} className={`letter-match-drop ${status}`}>{dropped??"?"}</div></div></div><div className="letter-match-tiles" aria-label="Letter choices">{choices.map(choice=><button key={choice.id} className={`letter-match-tile ${dragId===choice.id?"dragging":""}`} style={dragId===choice.id?{transform:`translate(${dragDelta.x}px, ${dragDelta.y}px)`}:undefined} onPointerDown={event=>onTileDown(event,choice.id)} onPointerMove={event=>onTileMove(event,choice.id)} onPointerUp={event=>onTileUp(event,choice.id,choice.letter)} onPointerCancel={()=>{setDragId(null);setDragDelta({x:0,y:0});}} lang={language==="Telugu"?"te":"hi"}>{choice.letter}</button>)}</div><div className={`letter-match-feedback ${status}`} aria-live="polite">{status==="correct"?`✓ Yes! ${entry.word} starts with ${targetLetter}.`:status==="wrong"?"Not quite—try another letter.":"Drag a letter tile onto the answer box."}</div><button className="letter-match-skip" onClick={skip}>New picture →</button>{celebrated&&<BuddyCelebrate name="chintu" title="Sharp ears! 🐒" message="You've matched 5 first letters — Chintu is swinging with excitement!" onAction={()=>setCelebrated(false)} actionLabel="Keep going" />}</article>;
}

export default function MoreGames(){return <section className="more-games" id="more-games"><div className="section-title"><p className="kicker"><b>✦</b> More playful practice</p><h2>Remember it.<br/><em>Sort it correctly.</em></h2><p>Short games for visual memory, word recognition, language practice, and careful thinking.</p></div><div className="more-games-grid"><MemoryGame/><PictureSortingGame/></div><VocabularyShuffle/><ActionFlashcards/><LetterRain/><FirstLetterMatch/><ColoringStudio/></section>}
