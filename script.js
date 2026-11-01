
/* THEME DATA */
const themes = [
 {name:"Slate Purple",primary:"#191D23",accent:"#8B5CF6",secondary:"#57707A",light:"#C7B3FF",surface:"#EDE9FE",background:"#FAF9FF",card:"#FFFFFF",text:"#191D23"},
 {name:"Purple Dream",primary:"#5B21B6",accent:"#8B5CF6",secondary:"#7C3AED",light:"#C7B3FF",surface:"#EDE9FE",background:"#FAF9FF",card:"#FFFFFF",text:"#191D23"},
 {name:"Emerald Green",primary:"#064E3B",accent:"#10B981",secondary:"#047857",light:"#A7F3D0",surface:"#D1FAE5",background:"#ECFDF5",card:"#FFFFFF",text:"#064E3B"},
 {name:"Ocean Blue",primary:"#0F172A",accent:"#0EA5E9",secondary:"#64748B",light:"#7DD3FC",surface:"#E0F2FE",background:"#F0F9FF",card:"#FFFFFF",text:"#0F172A"},
 {name:"Rose Pink",primary:"#881337",accent:"#F43F5E",secondary:"#BE123C",light:"#FDA4AF",surface:"#FFE4E6",background:"#FFF1F2",card:"#FFFFFF",text:"#881337"},
 {name:"Luxury Gold",primary:"#78350F",accent:"#F59E0B",secondary:"#B45309",light:"#FDE68A",surface:"#FEF3C7",background:"#FFFBEB",card:"#FFFFFF",text:"#78350F"},
 {name:"Cyan Ocean",primary:"#164E63",accent:"#06B6D4",secondary:"#0E7490",light:"#A5F3FC",surface:"#CFFAFE",background:"#ECFEFF",card:"#FFFFFF",text:"#164E63"},
 {name:"Indigo Night",primary:"#312E81",accent:"#6366F1",secondary:"#818CF8",light:"#C7D2FE",surface:"#E0E7FF",background:"#EEF2FF",card:"#FFFFFF",text:"#312E81"},
 {name:"Sunny Yellow",primary:"#713F12",accent:"#EAB308",secondary:"#A16207",light:"#FDE68A",surface:"#FEF9C3",background:"#FEFCE8",card:"#FFFFFF",text:"#713F12"},
 {name:"Pink Dream",primary:"#701A75",accent:"#D946EF",secondary:"#A21CAF",light:"#F0ABFC",surface:"#FAE8FF",background:"#FDF4FF",card:"#FFFFFF",text:"#701A75"}
];

const root=document.documentElement;
const themeButtons=document.querySelectorAll(".theme");
const themeName=document.getElementById("themeName");
let currentTheme=0;

function setTheme(index,save=true){
 const t=themes[index];
 if(!t)return;
 currentTheme=index;
 Object.keys(t).forEach(key=>root.style.setProperty("--"+key,t[key]));
 themeName.textContent="Current Theme: "+t.name;
 themeButtons.forEach((button,i)=>button.classList.toggle("selected",i===index));
 if(save){try{localStorage.setItem("kbp-theme",index);}catch(e){}}
}

let savedTheme=0;
try{
 const stored=localStorage.getItem("kbp-theme");
 if(stored!==null&&Number.isInteger(Number(stored))&&themes[Number(stored)])savedTheme=Number(stored);
}catch(e){}
setTheme(savedTheme,false);

themeButtons.forEach((button,index)=>button.addEventListener("click",()=>{
 setTheme(index);
 showToast(themes[index].name+" Theme Activated!");
}));

document.getElementById("randomTheme").onclick=()=>{
 let index=Math.floor(Math.random()*themes.length);
 if(themes.length>1&&index===currentTheme)index=(index+1)%themes.length;
 setTheme(index);
 showToast("🎲 "+themes[index].name+" Activated!");
};

document.getElementById("resetTheme").onclick=()=>{
 setTheme(0);
 showToast("Default Theme Restored!");
};

/* MOBILE MENU */
const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("nav");

menuBtn.addEventListener("click",()=>{
 const opened=nav.classList.toggle("open");
 menuBtn.textContent=opened?"✕":"☰";
 menuBtn.setAttribute("aria-expanded",opened);
});

nav.querySelectorAll("a").forEach(link=>{
 link.addEventListener("click",()=>{
  nav.classList.remove("open");
  menuBtn.textContent="☰";
  menuBtn.setAttribute("aria-expanded","false");
 });
});

/* SLIDER */
const slides=document.getElementById("slides");
const dots=document.querySelectorAll(".dot");
let currentSlide=0;
let autoSlide;
let startX=0;

function goSlide(index){
 currentSlide=(index+3)%3;
 slides.style.transform=`translateX(-${currentSlide*100}%)`;
 dots.forEach((dot,i)=>dot.classList.toggle("active",i===currentSlide));
}

function moveSlide(direction){
 goSlide(currentSlide+direction);
 restartSlider();
}

document.getElementById("prevSlide").onclick=()=>moveSlide(-1);
document.getElementById("nextSlide").onclick=()=>moveSlide(1);

dots.forEach((dot,index)=>{
 dot.onclick=()=>{
  goSlide(index);
  restartSlider();
 };
});

function startSlider(){
 clearInterval(autoSlide);
 autoSlide=setInterval(()=>goSlide(currentSlide+1),5000);
}

function restartSlider(){
 clearInterval(autoSlide);
 startSlider();
}

slides.addEventListener("touchstart",e=>{
 startX=e.touches[0].clientX;
 clearInterval(autoSlide);
},{passive:true});

slides.addEventListener("touchend",e=>{
 const difference=startX-e.changedTouches[0].clientX;
 if(Math.abs(difference)>45)goSlide(currentSlide+(difference>0?1:-1));
 startSlider();
},{passive:true});

document.querySelector(".hero").addEventListener("mouseenter",()=>clearInterval(autoSlide));
document.querySelector(".hero").addEventListener("mouseleave",startSlider);
startSlider();

/* CLOCK */
function updateClock(){
 const now=new Date();
 document.getElementById("clock").textContent=now.toLocaleTimeString("en-IN");
 document.getElementById("date").textContent=now.toLocaleDateString("en-IN",{
  day:"2-digit",month:"short",year:"numeric"
 });
}
updateClock();
setInterval(updateClock,1000);

/* SCROLL PROGRESS */
const progress=document.getElementById("progress");
const topBtn=document.getElementById("topBtn");

window.addEventListener("scroll",()=>{
 const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
 const percent=maxScroll>0?(window.scrollY/maxScroll)*100:0;
 progress.style.width=percent+"%";
 topBtn.classList.toggle("show",window.scrollY>400);
});

topBtn.onclick=()=>{
 window.scrollTo({top:0,behavior:"smooth"});
};

/* REVEAL */
const observer=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  if(entry.isIntersecting){
   entry.target.classList.add("show");
   observer.unobserve(entry.target);
  }
 });
},{threshold:.12});

document.querySelectorAll(".reveal,.card,.project,.stat").forEach(el=>observer.observe(el));

/* COUNTERS */
const counterObserver=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  if(entry.isIntersecting){
   const el=entry.target;
   const target=Number(el.dataset.target);
   let value=0;
   const step=Math.max(1,Math.ceil(target/35));

   const timer=setInterval(()=>{
    value=Math.min(value+step,target);
    el.textContent=value+"+";
    if(value>=target)clearInterval(timer);
   },35);

   counterObserver.unobserve(el);
  }
 });
},{threshold:.5});

document.querySelectorAll(".counter").forEach(el=>counterObserver.observe(el));

/* CLIPBOARD FALLBACK */
async function copyText(text){
 try{
  if(navigator.clipboard&&window.isSecureContext){
   await navigator.clipboard.writeText(text);
  }else{
   const area=document.createElement("textarea");
   area.value=text;
   area.style.position="fixed";
   area.style.opacity="0";
   document.body.appendChild(area);
   area.select();
   const success=document.execCommand("copy");
   area.remove();
   if(!success)throw new Error("Copy failed");
  }
  return true;
 }catch(e){
  showToast("Copy unavailable in this browser");
  return false;
 }
}

/* FAVOURITES */
let favorites=[];

try{
 favorites=JSON.parse(localStorage.getItem("kbp-favorites")||"[]");
 if(!Array.isArray(favorites))favorites=[];
}catch(e){favorites=[];}

const swatches=[...document.querySelectorAll(".swatch")];

function saveFavorites(){
 try{localStorage.setItem("kbp-favorites",JSON.stringify(favorites));}catch(e){}
}

function updateHearts(){
 swatches.forEach(swatch=>{
  const color=swatch.dataset.color;
  const heart=swatch.querySelector(".heart");
  const saved=favorites.includes(color);
  heart.textContent=saved?"♥":"♡";
  heart.setAttribute("aria-label",saved?"Remove favourite":"Save favourite");
 });
}
updateHearts();

/* PALETTE FILTER + SEARCH */
let activeFilter="all";
const searchInput=document.getElementById("colorSearch");
const paletteCount=document.getElementById("paletteCount");

function filterColors(){
 const query=searchInput.value.toLowerCase().trim();
 let visible=0;

 swatches.forEach(swatch=>{
  const color=swatch.dataset.color.toLowerCase();
  const name=swatch.dataset.name.toLowerCase();
  const category=swatch.dataset.category;
  const favorite=favorites.includes(swatch.dataset.color);

  const matchesQuery=name.includes(query)||color.includes(query);
  const matchesFilter=
   activeFilter==="all"||
   (activeFilter==="favorites"&&favorite)||
   category===activeFilter;

  const show=matchesQuery&&matchesFilter;
  swatch.classList.toggle("hide",!show);
  if(show)visible++;
 });

 paletteCount.textContent=visible+" Colours Showing";
}

searchInput.addEventListener("input",filterColors);

document.querySelectorAll(".filter-btn").forEach(button=>{
 button.addEventListener("click",()=>{
  activeFilter=button.dataset.filter;
  document.querySelectorAll(".filter-btn").forEach(btn=>{
   btn.classList.toggle("active",btn===button);
  });
  filterColors();
 });
});

/* COLOUR TAP + FAVOURITE */
swatches.forEach(swatch=>{
 swatch.addEventListener("click",async e=>{
  if(e.target.classList.contains("heart")){
   e.stopPropagation();
   const color=swatch.dataset.color;

   if(favorites.includes(color)){
    favorites=favorites.filter(c=>c!==color);
    showToast("Removed from Favourites");
   }else{
    favorites.push(color);
    showToast("⭐ Added to Favourites");
   }

   saveFavorites();
   updateHearts();
   filterColors();
   return;
  }

  const color=swatch.dataset.color;
  if(await copyText(color))showToast(color+" Copied!");
 });
});

/* COPY ALL */
document.getElementById("copyAll").onclick=async()=>{
 const text=swatches.map(s=>s.dataset.name+" : "+s.dataset.color).join("\n");
 if(await copyText(text))showToast("All Colour Codes Copied!");
};

/* SHOW ALL */
document.getElementById("showAll").onclick=()=>{
 searchInput.value="";
 activeFilter="all";

 document.querySelectorAll(".filter-btn").forEach(btn=>{
  btn.classList.toggle("active",btn.dataset.filter==="all");
 });

 filterColors();
 showToast("All Colours Displayed");
};

/* FEATURE CARD ACTIONS */
document.querySelectorAll(".card-action").forEach(button=>{
 button.addEventListener("click",()=>{
  const action=button.dataset.action;

  if(action==="colors"){
   document.getElementById("colors").scrollIntoView({behavior:"smooth"});
  }

  if(action==="theme"){
   document.getElementById("theme").scrollIntoView({behavior:"smooth"});
  }

  if(action==="random"){
   document.getElementById("randomTheme").click();
   document.getElementById("theme").scrollIntoView({behavior:"smooth"});
  }

  if(action==="favorites"){
   activeFilter="favorites";
   document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.filter==="favorites");
   });
   filterColors();
   document.getElementById("colors").scrollIntoView({behavior:"smooth"});
  }

  if(action==="projects"){
   document.getElementById("projects").scrollIntoView({behavior:"smooth"});
  }

  if(action==="top"){
   window.scrollTo({top:0,behavior:"smooth"});
   showToast("Welcome to KumarBuildsPro!");
  }

  if(action==="touch"){
   showToast("✨ Touch Interaction is Active!");
  }
 });
});

/* RIPPLE EFFECT */
document.addEventListener("click",e=>{
 const target=e.target.closest("button,.btn,.swatch");
 if(!target)return;

 const rect=target.getBoundingClientRect();
 const size=Math.max(rect.width,rect.height);
 const ripple=document.createElement("span");

 ripple.className="ripple";
 ripple.style.width=size+"px";
 ripple.style.height=size+"px";
 ripple.style.left=(e.clientX-rect.left-size/2)+"px";
 ripple.style.top=(e.clientY-rect.top-size/2)+"px";

 if(getComputedStyle(target).position==="static"){
  target.style.position="relative";
 }

 target.style.overflow="hidden";
 target.appendChild(ripple);

 setTimeout(()=>ripple.remove(),650);
});

/* TOAST */
let toastTimer;

function showToast(message){
 const toast=document.getElementById("toast");
 toast.textContent=message;
 toast.classList.add("show");

 clearTimeout(toastTimer);

 toastTimer=setTimeout(()=>{
  toast.classList.remove("show");
 },2200);
}
