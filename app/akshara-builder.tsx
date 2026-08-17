"use client";

import { useState } from "react";
import { BuddyTip } from "./BuddyTip";

type Language = "Telugu" | "Hindi";
type Vowel = { letter: string; sign: string; sound: string };

const consonants: Record<Language, string[]> = {
  Telugu: ["క","ఖ","గ","ఘ","ఙ","చ","ఛ","జ","ఝ","ఞ","ట","ఠ","డ","ఢ","ణ","త","థ","ద","ధ","న","ప","ఫ","బ","భ","మ","య","ర","ల","వ","శ","ష","స","హ"],
  Hindi: ["क","ख","ग","घ","ङ","च","छ","ज","झ","ञ","ट","ठ","ड","ढ","ण","त","थ","द","ध","न","प","फ","ब","भ","म","य","र","ल","व","श","ष","स","ह"],
};
const vowels: Record<Language, Vowel[]> = {
  Telugu: [
    {letter:"అ",sign:"",sound:"a"},{letter:"ఆ",sign:"ా",sound:"aa"},{letter:"ఇ",sign:"ి",sound:"i"},{letter:"ఈ",sign:"ీ",sound:"ee"},{letter:"ఉ",sign:"ు",sound:"u"},{letter:"ఊ",sign:"ూ",sound:"oo"},{letter:"ఋ",sign:"ృ",sound:"ru"},{letter:"ౠ",sign:"ౄ",sound:"roo"},{letter:"ఎ",sign:"ె",sound:"e"},{letter:"ఏ",sign:"ే",sound:"ae"},{letter:"ఐ",sign:"ై",sound:"ai"},{letter:"ఒ",sign:"ొ",sound:"o"},{letter:"ఓ",sign:"ో",sound:"oa"},{letter:"ఔ",sign:"ౌ",sound:"au"},{letter:"అం",sign:"ం",sound:"am"},{letter:"అః",sign:"ః",sound:"aha"},
  ],
  Hindi: [
    {letter:"अ",sign:"",sound:"a"},{letter:"आ",sign:"ा",sound:"aa"},{letter:"इ",sign:"ि",sound:"i"},{letter:"ई",sign:"ी",sound:"ee"},{letter:"उ",sign:"ु",sound:"u"},{letter:"ऊ",sign:"ू",sound:"oo"},{letter:"ऋ",sign:"ृ",sound:"ri"},{letter:"ए",sign:"े",sound:"e"},{letter:"ऐ",sign:"ै",sound:"ai"},{letter:"ओ",sign:"ो",sound:"o"},{letter:"औ",sign:"ौ",sound:"au"},{letter:"अं",sign:"ं",sound:"am"},{letter:"अः",sign:"ः",sound:"aha"},
  ],
};
const virama: Record<Language,string> = {Telugu:"్",Hindi:"्"};
const anusvara: Record<Language,string> = {Telugu:"ం",Hindi:"ं"};
const consonantPatterns: Record<Language,RegExp> = {Telugu:/[క-హఱ]/,Hindi:/[क-ह]/};

const romanVowelsByLanguage:Record<Language,Record<string,{independent:string;sign:string}>>={
  Telugu:{aa:{independent:"ఆ",sign:"ా"},ae:{independent:"ఏ",sign:"ే"},ee:{independent:"ఈ",sign:"ీ"},ii:{independent:"ఈ",sign:"ీ"},oo:{independent:"ఊ",sign:"ూ"},uu:{independent:"ఊ",sign:"ూ"},ai:{independent:"ఐ",sign:"ై"},au:{independent:"ఔ",sign:"ౌ"},ow:{independent:"ఔ",sign:"ౌ"},ri:{independent:"ఋ",sign:"ృ"},a:{independent:"అ",sign:""},i:{independent:"ఇ",sign:"ి"},u:{independent:"ఉ",sign:"ు"},e:{independent:"ఎ",sign:"ె"},o:{independent:"ఒ",sign:"ొ"}},
  Hindi:{aa:{independent:"आ",sign:"ा"},ee:{independent:"ई",sign:"ी"},ii:{independent:"ई",sign:"ी"},oo:{independent:"ऊ",sign:"ू"},uu:{independent:"ऊ",sign:"ू"},ai:{independent:"ऐ",sign:"ै"},au:{independent:"औ",sign:"ौ"},ow:{independent:"औ",sign:"ौ"},ri:{independent:"ऋ",sign:"ृ"},a:{independent:"अ",sign:""},i:{independent:"इ",sign:"ि"},u:{independent:"उ",sign:"ु"},e:{independent:"ए",sign:"े"},o:{independent:"ओ",sign:"ो"}},
};
const romanConsonantsByLanguage:Record<Language,Record<string,string>>={
  Telugu:{ksh:"క్ష",chh:"ఛ",kh:"ఖ",gh:"ఘ",ng:"ఙ",ch:"చ",jh:"ఝ",ny:"ఞ",th:"థ",dh:"ధ",ph:"ఫ",bh:"భ",sh:"శ",tr:"త్ర",gn:"జ్ఞ",k:"క",g:"గ",c:"చ",j:"జ",t:"త",d:"ద",n:"న",p:"ప",f:"ఫ",b:"బ",m:"మ",y:"య",r:"ర",l:"ల",v:"వ",w:"వ",s:"స",h:"హ"},
  Hindi:{ksh:"क्ष",chh:"छ",kh:"ख",gh:"घ",ng:"ङ",ch:"च",jh:"झ",ny:"ञ",th:"थ",dh:"ध",ph:"फ",bh:"भ",sh:"श",tr:"त्र",gn:"ज्ञ",k:"क",g:"ग",c:"च",j:"ज",t:"त",d:"द",n:"न",p:"प",f:"फ",b:"ब",m:"म",y:"य",r:"र",l:"ल",v:"व",w:"व",s:"स",h:"ह"},
};
type WordPart = { formed:string; formula:string; kind:"gunintham"|"conjunct"|"letter" };

function vowelNamesFor(language:Language):Record<string,string>{
  return Object.fromEntries(vowels[language].map(v=>[v.sign,v.letter]));
}

function analyseWord(value:string,language:Language):WordPart[]{
  const consonantPattern=consonantPatterns[language];
  const viramaChar=virama[language];
  const vowelNames=vowelNamesFor(language);
  const signs=new Set(Object.keys(vowelNames).filter(Boolean));
  const chars=Array.from(value.replace(/\s+/g,""));
  const parts:WordPart[]=[];
  for(let i=0;i<chars.length;){
    const current=chars[i];
    if(!consonantPattern.test(current)){parts.push({formed:current,formula:current,kind:"letter"});i+=1;continue;}
    if(chars[i+1]===viramaChar&&chars[i+2]&&consonantPattern.test(chars[i+2])){
      let formed=current+viramaChar+chars[i+2];
      let formula=`${current}${viramaChar} + ${chars[i+2]} = ${formed}`;
      i+=3;
      if(chars[i]&&signs.has(chars[i])){formed+=chars[i];formula=`${current}${viramaChar} + ${chars[i-1]} + ${vowelNames[chars[i]]} = ${formed}`;i+=1;}
      parts.push({formed,formula,kind:"conjunct"});continue;
    }
    const sign=chars[i+1]&&signs.has(chars[i+1])?chars[i+1]:"";
    const formed=current+sign;
    parts.push({formed,formula:`${current}${viramaChar} + ${vowelNames[sign]} = ${formed}`,kind:sign?"gunintham":"letter"});
    i+=sign?2:1;
  }
  return parts;
}

function transliterateWord(value:string,language:Language){
  const romanConsonants=romanConsonantsByLanguage[language];
  const romanVowels=romanVowelsByLanguage[language];
  const viramaChar=virama[language];
  const text=value.toLowerCase().replace(/[^a-z\s]/g,"");
  const consonantKeys=Object.keys(romanConsonants).sort((a,b)=>b.length-a.length);
  const vowelKeys=Object.keys(romanVowels).sort((a,b)=>b.length-a.length);
  let output="",i=0;
  while(i<text.length){
    if(text[i]===" "){output+=" ";i+=1;continue;}
    const consonant=consonantKeys.find(key=>text.startsWith(key,i));
    if(consonant){
      const letter=romanConsonants[consonant];
      const next=i+consonant.length;
      if(consonant==="m"&&next===text.length&&output){output+=anusvara[language];i=next;continue;}
      if(text.startsWith(consonant,next)){output+=letter+viramaChar;i=next;continue;}
      const vowel=vowelKeys.find(key=>text.startsWith(key,next));
      const joinedConsonant=consonantKeys.find(key=>text.startsWith(key,next));
      if(!vowel&&joinedConsonant){output+=letter+viramaChar;i=next;continue;}
      output+=letter+(vowel?romanVowels[vowel].sign:"");
      i=next+(vowel?.length||0);continue;
    }
    const vowel=vowelKeys.find(key=>text.startsWith(key,i));
    if(vowel){output+=romanVowels[vowel].independent;i+=vowel.length;continue;}
    i+=1;
  }
  return output;
}

const wordLab:Record<Language,{title:string;intro:string;kindLabels:Record<"gunintham"|"conjunct"|"letter",string>;examples:[string,string][];defaultRoman:string;defaultWord:string;noteWord:string;noteRest:string}> = {
  Telugu:{
    title:"Telugu Word Builder",
    intro:"Type a Telugu word to separate its గుణింతాలు and joined letters.",
    kindLabels:{gunintham:"గుణింతం",conjunct:"సంయుక్తాక్షరం",letter:"అక్షరం"},
    examples:[["pilla","పిల్ల"],["sowmya","సౌమ్య"],["kamalam","కమలం"],["maamidi","మామిడి"],["aenugu","ఏనుగు"]],
    defaultRoman:"pilla",
    defaultWord:"పిల్ల",
    noteWord:"పిల్ల",
    noteRest:"పి is a గుణింతం; ల్ల is a సంయుక్తాక్షరం (joined consonant).",
  },
  Hindi:{
    title:"Hindi Word Builder",
    intro:"Type a Hindi word to separate its बारहखड़ी and joined letters.",
    kindLabels:{gunintham:"मात्रा",conjunct:"संयुक्ताक्षर",letter:"अक्षर"},
    examples:[["billi","बिल्ली"],["sowmya","सौम्या"],["kamal","कमल"],["aam","आम"],["hathi","हाथी"]],
    defaultRoman:"billi",
    defaultWord:"बिल्ली",
    noteWord:"बिल्ली",
    noteRest:"बि is a मात्रा; ल्ली is a संयुक्ताक्षर (joined consonant).",
  },
};

export default function AksharaBuilder(){
  const [language,setLanguage]=useState<Language>("Telugu");
  const [ci,setCi]=useState(0); const [vi,setVi]=useState(0); const [score,setScore]=useState(0); const [challenge,setChallenge]=useState(false); const [feedback,setFeedback]=useState("");
  const [word,setWord]=useState(wordLab.Telugu.defaultWord);
  const [romanWord,setRomanWord]=useState(wordLab.Telugu.defaultRoman);
  const consonant=consonants[language][ci]; const vowel=vowels[language][vi]; const result=consonant+vowel.sign; const dead=consonant+virama[language];
  const targetIndex=(ci*3+score+5)%vowels[language].length; const target=vowels[language][targetIndex]; const targetResult=consonant+target.sign;
  const wl=wordLab[language];
  function changeLanguage(next:Language){setLanguage(next);setCi(0);setVi(0);setScore(0);setChallenge(false);setFeedback("");setWord(wordLab[next].defaultWord);setRomanWord(wordLab[next].defaultRoman);}
  function chooseVowel(index:number){setVi(index);if(!challenge)return;if(index===targetIndex){setScore(v=>v+1);setFeedback(`Wonderful! ${dead} + ${target.letter} = ${targetResult}`);setChallenge(false);}else setFeedback("Try another vowel sign");}
  const wordParts=analyseWord(word||wl.defaultWord,language);
  return <section className="akshara-section" id="guninthalu">
    <div className="akshara-heading"><div><p className="kicker"><b>✦</b> Game 4 · Akshara Builder</p><h2>Build every<br/><em>Gunintham.</em></h2><p>Choose a consonant through హ/ह, then add a vowel. The pieces join visibly to form a new sound.</p><BuddyTip name="vageesh" message="I love puzzles like this — let's build a new sound!" className="on-dark" /></div><div className="builder-language" role="group" aria-label="Choose builder language"><button className={language==="Telugu"?"active":""} onClick={()=>changeLanguage("Telugu")}>తెలుగు</button><button className={language==="Hindi"?"active":""} onClick={()=>changeLanguage("Hindi")}>हिन्दी</button></div></div>
    <div className="builder-shell">
      <div className="builder-label"><b>1. Pick a consonant</b><span>{consonants[language].length} letters · {consonants[language][0]} to {consonants[language].at(-1)}</span></div>
      <div className="consonant-strip">{consonants[language].map((letter,index)=><button key={letter} className={ci===index?"active":""} onClick={()=>{setCi(index);setFeedback("");setChallenge(false)}}>{letter}</button>)}</div>
      <div className="builder-label"><b>2. Add a vowel</b><span>{vowels[language].length} forms</span></div>
      <div className="vowel-strip">{vowels[language].map((item,index)=><button key={item.letter} className={`${vi===index?"active":""} ${challenge&&index===vi&&feedback.startsWith("Try")?"wrong":""}`} onClick={()=>chooseVowel(index)}><b>{item.letter}</b><small>{item.sign||"—"}</small></button>)}</div>
      <div className="formation-board"><div><small>CONSONANT</small><strong>{dead}</strong></div><i>＋</i><div><small>VOWEL</small><strong>{vowel.letter}</strong></div><i>＝</i><div className="formed"><small>NEW SOUND · {vowel.sound.toUpperCase()}</small><strong key={`${ci}-${vi}`}>{result}</strong></div></div>
      <div className="builder-challenge"><div><small>MINI CHALLENGE</small><b>{challenge?<>Which vowel builds <strong>{targetResult}</strong>?</>:<>You built <strong>{result}</strong>!</>}</b><span aria-live="polite">{feedback||"Tap a vowel above to explore every combination."}</span></div><button onClick={()=>{setChallenge(true);setFeedback("")}}>{challenge?"Challenge active":"Play a challenge →"}</button><em>⭐ {score}</em></div>
    </div>
    <div className="word-lab">
      <div className="word-lab-title"><p className="kicker"><b>✦</b> {wl.title}</p><h3>See how a word is formed.</h3><p>{wl.intro}</p></div>
      <div className="word-lab-grid">
        <div className="word-panel word-entry"><small>1 · ENTER A WORD</small><label htmlFor="roman-word">Type with English letters (example: {wl.examples[0][0]} or {wl.examples[1][0]})</label><input id="roman-word" className="roman-input" value={romanWord} onChange={event=>{setRomanWord(event.target.value);setWord(transliterateWord(event.target.value,language))}} lang="en" maxLength={24}/><label htmlFor="script-word">{language} word — you can edit this too</label><input id="script-word" value={word} onChange={event=>{setWord(event.target.value);setRomanWord("")}} lang={language==="Telugu"?"te":"hi"} maxLength={18}/><div className="example-words">{wl.examples.map(([roman,example])=><button key={example} onClick={()=>{setRomanWord(roman);setWord(example)}}>{example}</button>)}</div></div>
        <div className="word-panel word-split"><small>2 · SPLIT THE WORD</small><strong>{wordParts.map(part=>part.formed).join(" + ")}</strong><span>＝</span><b>{word||wl.defaultWord}</b></div>
        <div className="word-panel word-formation"><small>3 · HOW IT IS FORMED</small><div>{wordParts.map((part,index)=><article key={`${part.formed}-${index}`}><b>{part.formula}</b><span className={part.kind}>{wl.kindLabels[part.kind]}</span></article>)}</div></div>
      </div>
      <p className="word-note"><b>{wl.noteWord}:</b> {wl.noteRest}</p>
    </div>
  </section>;
}
