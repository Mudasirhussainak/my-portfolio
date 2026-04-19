
// ══ AUDIO ENGINE ══
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let audioCtx=null,soundOn=true;
function getCtx(){if(!audioCtx){try{audioCtx=new AudioCtx();}catch(e){}}return audioCtx;}
function beep(freq=440,dur=0.1,type='sine',vol=0.3){
  if(!soundOn)return;
  const ctx=getCtx();if(!ctx)return;
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.connect(g);g.connect(ctx.destination);
  o.type=type;o.frequency.value=freq;
  g.gain.setValueAtTime(vol,ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur);
  o.start();o.stop(ctx.currentTime+dur);
}
function playWin(){if(!soundOn)return;[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,0.2,'sine',0.4),i*120));}
function playClick(){beep(300,0.05,'square',0.15);}
function playCorrect(){beep(660,0.15,'sine',0.3);setTimeout(()=>beep(880,0.15,'sine',0.3),120);}
function playWrong(){beep(200,0.25,'sawtooth',0.3);}
function playEat(){beep(600,0.08,'sine',0.2);}
function toggleSound(){
  soundOn=!soundOn;
  document.getElementById('sound-btn').textContent=soundOn?'🎵':'🔇';
  document.getElementById('sound-wave').classList.toggle('active',soundOn);
  if(soundOn)beep(440,0.1);
}

// ══ WELCOME SCREEN ══
setTimeout(()=>{
  document.getElementById('welcome').classList.add('hide');
  setTimeout(()=>{document.getElementById('welcome').style.display='none';},900);
  startTyping();
},3000);

// ══ TYPING EFFECT ══
const phrases=['Full-Stack Developer','Django Developer','Python Enthusiast','Data Science Explorer','Problem Solver'];
let phraseIdx=0,charIdx=0,deleting=false;
function startTyping(){typeStep();}
function typeStep(){
  const el=document.getElementById('typing-text');
  if(!el)return;
  const phrase=phrases[phraseIdx];
  if(!deleting){
    el.textContent=phrase.slice(0,charIdx+1);
    charIdx++;
    if(charIdx===phrase.length){setTimeout(()=>{deleting=true;typeStep();},1800);return;}
  }else{
    el.textContent=phrase.slice(0,charIdx-1);
    charIdx--;
    if(charIdx===0){deleting=false;phraseIdx=(phraseIdx+1)%phrases.length;}
  }
  setTimeout(typeStep,deleting?60:90);
}

// ══ THEME TOGGLE ══
let isDark=true;
function toggleTheme(){
  isDark=!isDark;
  document.documentElement.setAttribute('data-theme',isDark?'dark':'light');
  document.getElementById('theme-btn').textContent=isDark?'🌙':'☀️';
  playClick();
}

// ══ SCROLL STUFF ══
window.addEventListener('scroll',()=>{
  const prog=document.getElementById('scroll-prog');
  const pct=window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;
  prog.style.width=pct+'%';
  const btt=document.getElementById('btt');
  btt.classList.toggle('show',window.scrollY>400);
});

// ══ CURSOR ══
const cur=document.getElementById('cursor'),ring=document.getElementById('ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function animR(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animR);})();
document.querySelectorAll('a,button,.dbtn,.mcard,.qopt,.ttt-cell,.gtab,.sudoku-cell,.snum').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.transform='translate(-50%,-50%) scale(2.5)';cur.style.background='var(--lime)';});
  el.addEventListener('mouseleave',()=>{cur.style.transform='translate(-50%,-50%) scale(1)';cur.style.background='var(--sky)';});
});

// ══ NAV ══
function toggleNav(){document.getElementById('navLinks').classList.toggle('open');}
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open')));

// ══ SCROLL REVEAL ══
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('shown');}),{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ══ VISITOR COUNT ══
const base=Math.floor(Math.random()*80)+200;
document.getElementById('vis-count').textContent=base;

// ══ WIN CELEBRATION ══
const WIN_GIFS=['🎉','🏆','🥳','🎊','🚀','😎','🔥','👑'];
function showWin(title,msg){
  playWin();
  document.getElementById('win-gif').textContent=WIN_GIFS[Math.floor(Math.random()*WIN_GIFS.length)];
  document.getElementById('win-title').textContent=title;
  document.getElementById('win-msg').textContent=msg;
  document.getElementById('win-overlay').classList.add('show');
  spawnConfetti();
}
function closeWin(){document.getElementById('win-overlay').classList.remove('show');document.getElementById('confetti-container').innerHTML='';}
function spawnConfetti(){
  const c=document.getElementById('confetti-container');c.innerHTML='';
  const colors=['#38bdf8','#a3e635','#fbbf24','#fb7185','#a78bfa','#fb923c'];
  for(let i=0;i<80;i++){
    const d=document.createElement('div');
    d.className='conf';
    d.style.cssText=`left:${Math.random()*100}%;background:${colors[Math.floor(Math.random()*colors.length)]};width:${Math.random()*10+5}px;height:${Math.random()*10+5}px;border-radius:${Math.random()>0.5?'50%':'2px'};animation-duration:${Math.random()*2+2}s;animation-delay:${Math.random()*0.5}s;`;
    c.appendChild(d);
  }
  setTimeout(()=>{c.innerHTML='';},4000);
}

// ══ GAME SWITCHER ══
function switchGame(id){
  ['snake','ttt','sudoku','memory','quiz'].forEach((g,i)=>{
    document.getElementById('game-'+g).style.display=g===id?'block':'none';
    document.querySelectorAll('.gtab')[i].classList.toggle('active',g===id);
  });
  playClick();
  if(id==='memory')initMem();
  if(id==='quiz')startQuiz();
  if(id==='ttt')resetTTT();
  if(id==='sudoku')newSudoku();
}

// ══ SNAKE ══
const cv2=document.getElementById('snake-canvas'),cx=cv2.getContext('2d');
const CS=20,COLS=18,ROWS=18;
let sn,dr,ndr,fd,sRunning,sPaused,sInt,sScore,sBest=0;
function startSnake(){sn=[{x:9,y:9},{x:8,y:9},{x:7,y:9}];dr={x:1,y:0};ndr={x:1,y:0};sScore=0;sRunning=true;sPaused=false;document.getElementById('ss').textContent=0;spawnF();clearInterval(sInt);sInt=setInterval(tick,115);}
function pauseSnake(){if(!sRunning)return;sPaused=!sPaused;sPaused?clearInterval(sInt):sInt=setInterval(tick,115);drawS();}
function sd(d){const m={UP:{x:0,y:-1},DOWN:{x:0,y:1},LEFT:{x:-1,y:0},RIGHT:{x:1,y:0}};const nd=m[d];if(nd.x!==-dr.x||nd.y!==-dr.y)ndr=nd;}
document.addEventListener('keydown',e=>{const m={ArrowUp:'UP',ArrowDown:'DOWN',ArrowLeft:'LEFT',ArrowRight:'RIGHT'};if(m[e.key]){e.preventDefault();sd(m[e.key]);}});
function spawnF(){do{fd={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};}while(sn&&sn.some(s=>s.x===fd.x&&s.y===fd.y));}
function tick(){
  dr=ndr;const h={x:sn[0].x+dr.x,y:sn[0].y+dr.y};
  if(h.x<0||h.x>=COLS||h.y<0||h.y>=ROWS||sn.some(s=>s.x===h.x&&s.y===h.y)){clearInterval(sInt);sRunning=false;playWrong();drawS(true);return;}
  sn.unshift(h);
  if(h.x===fd.x&&h.y===fd.y){sScore+=10;playEat();if(sScore>sBest){sBest=sScore;document.getElementById('sb').textContent=sBest;}document.getElementById('ss').textContent=sScore;spawnF();if(sScore>=100){clearInterval(sInt);sRunning=false;setTimeout(()=>showWin('🐍 Snake Master!','You scored '+sScore+' points! Incredible!'),300);}}else{sn.pop();}
  drawS();
}
function drawS(dead=false){
  cx.clearRect(0,0,cv2.width,cv2.height);
  const ox=(cv2.width-COLS*CS)/2,oy=(cv2.height-ROWS*CS)/2;
  cx.strokeStyle='rgba(56,189,248,0.06)';
  for(let i=0;i<=COLS;i++){cx.beginPath();cx.moveTo(ox+i*CS,oy);cx.lineTo(ox+i*CS,oy+ROWS*CS);cx.stroke();}
  for(let j=0;j<=ROWS;j++){cx.beginPath();cx.moveTo(ox,oy+j*CS);cx.lineTo(ox+COLS*CS,oy+j*CS);cx.stroke();}
  cx.fillStyle='#a3e635';cx.beginPath();cx.arc(ox+fd.x*CS+CS/2,oy+fd.y*CS+CS/2,CS/2-2,0,Math.PI*2);cx.fill();
  sn.forEach((s,i)=>{cx.fillStyle=dead?'#fb7185':i===0?'#7dd3fc':'#38bdf8';rr(cx,ox+s.x*CS+1,oy+s.y*CS+1,CS-2,CS-2,i===0?5:3);cx.fill();});
  if(dead){cx.fillStyle='rgba(4,6,15,0.75)';cx.fillRect(0,0,cv2.width,cv2.height);cx.fillStyle='#fb7185';cx.font='bold 22px Outfit,sans-serif';cx.textAlign='center';cx.fillText('Game Over! Score: '+sScore,cv2.width/2,cv2.height/2-10);cx.fillStyle='#64748b';cx.font='12px JetBrains Mono,monospace';cx.fillText('Press Start to play again',cv2.width/2,cv2.height/2+16);}
  if(sPaused){cx.fillStyle='rgba(4,6,15,0.65)';cx.fillRect(0,0,cv2.width,cv2.height);cx.fillStyle='#38bdf8';cx.font='bold 20px Outfit,sans-serif';cx.textAlign='center';cx.fillText('Paused',cv2.width/2,cv2.height/2);}
}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();}
cx.fillStyle='#64748b';cx.font='14px JetBrains Mono,monospace';cx.textAlign='center';cx.fillText('Press Start to Play',cv2.width/2,cv2.height/2);

// ══ TIC TAC TOE ══
let tttBoard=Array(9).fill(null),tttTurn='X',tttDone=false,tttMode='ai';
let tttScores={X:0,O:0,D:0};
const WINS=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function setTTTMode(m,btn){tttMode=m;document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.getElementById('ttt-o-lbl').textContent=m==='ai'?'AI (O)':'Friend (O)';resetTTT();}
function resetTTT(){tttBoard=Array(9).fill(null);tttTurn='X';tttDone=false;for(let i=0;i<9;i++){const c=document.getElementById('c'+i);c.textContent='';c.className='ttt-cell';}document.getElementById('ttt-status').textContent=tttMode==='ai'?'Your turn (X)':'Player X turn';document.getElementById('ttt-status').style.color='var(--sky)';}
function resetTTTScores(){tttScores={X:0,O:0,D:0};document.getElementById('ttt-x-score').textContent=0;document.getElementById('ttt-o-score').textContent=0;document.getElementById('ttt-draw').textContent=0;resetTTT();}
function tttClick(i){if(tttDone||tttBoard[i])return;if(tttMode==='ai'&&tttTurn==='O')return;playClick();makeMove(i,tttTurn);if(!tttDone&&tttMode==='ai'&&tttTurn==='O'){setTimeout(()=>{if(!tttDone)makeMove(aiMove(),'O');},400);}}
function makeMove(i,player){
  tttBoard[i]=player;const cell=document.getElementById('c'+i);cell.textContent=player;cell.classList.add(player==='X'?'x-cell':'o-cell','taken');
  const win=checkWin();
  if(win){
    tttDone=true;tttScores[player]++;
    document.getElementById('ttt-'+(player==='X'?'x':'o')+'-score').textContent=tttScores[player];
    win.forEach(idx=>document.getElementById('c'+idx).classList.add('win-cell'));
    const isHuman=player==='X'||(tttMode==='human');
    document.getElementById('ttt-status').textContent=player==='X'?'🎉 You Win!':(tttMode==='ai'?'🤖 AI Wins!':'🎉 Player O Wins!');
    document.getElementById('ttt-status').style.color=player==='X'?'var(--lime)':'var(--rose)';
    if(player==='X')setTimeout(()=>showWin('🏆 Tic Tac Toe!','You beat the AI! Well played!'),300);
    else playWrong();
  }else if(tttBoard.every(c=>c)){
    tttDone=true;tttScores.D++;document.getElementById('ttt-draw').textContent=tttScores.D;
    document.getElementById('ttt-status').textContent="🤝 It's a Draw!";document.getElementById('ttt-status').style.color='var(--amber)';
  }else{
    tttTurn=player==='X'?'O':'X';
    document.getElementById('ttt-status').textContent=tttMode==='ai'?(tttTurn==='X'?'Your turn (X)':'AI thinking...'):'Player '+tttTurn+' turn';
    document.getElementById('ttt-status').style.color=tttTurn==='X'?'var(--sky)':'var(--rose)';
  }
}
function checkWin(){for(const[a,b,c] of WINS){if(tttBoard[a]&&tttBoard[a]===tttBoard[b]&&tttBoard[a]===tttBoard[c])return[a,b,c];}return null;}
function aiMove(){
  for(const[a,b,c] of WINS){if(tttBoard[a]==='O'&&tttBoard[b]==='O'&&!tttBoard[c])return c;if(tttBoard[a]==='O'&&tttBoard[c]==='O'&&!tttBoard[b])return b;if(tttBoard[b]==='O'&&tttBoard[c]==='O'&&!tttBoard[a])return a;}
  for(const[a,b,c] of WINS){if(tttBoard[a]==='X'&&tttBoard[b]==='X'&&!tttBoard[c])return c;if(tttBoard[a]==='X'&&tttBoard[c]==='X'&&!tttBoard[b])return b;if(tttBoard[b]==='X'&&tttBoard[c]==='X'&&!tttBoard[a])return a;}
  if(!tttBoard[4])return 4;
  const corners=[0,2,6,8].filter(i=>!tttBoard[i]);if(corners.length)return corners[Math.floor(Math.random()*corners.length)];
  const empty=tttBoard.map((v,i)=>v?null:i).filter(v=>v!==null);return empty[Math.floor(Math.random()*empty.length)];
}

// ══ SUDOKU ══
let sudGrid=Array(81).fill(0),sudSolution=Array(81).fill(0),sudGiven=Array(81).fill(false);
let sudSelected=-1,sudErrors=0,sudTimer=0,sudTimerInt=null,sudDiff='easy';
const sudRemove={easy:35,medium:48,hard:58};

function setSudokuDiff(d,btn){sudDiff=d;document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');newSudoku();}

function newSudoku(){
  clearInterval(sudTimerInt);sudTimer=0;sudErrors=0;
  document.getElementById('sud-err').textContent=0;document.getElementById('sud-time').textContent='0:00';
  sudSelected=-1;
  generateSudoku();
  renderSudoku();
  renderNumpad();
  sudTimerInt=setInterval(()=>{sudTimer++;const m=Math.floor(sudTimer/60),s=sudTimer%60;document.getElementById('sud-time').textContent=m+':'+(s<10?'0':'')+s;},1000);
}

function generateSudoku(){
  sudSolution=Array(81).fill(0);
  fillBoard(sudSolution);
  sudGrid=[...sudSolution];
  sudGiven=Array(81).fill(true);
  let rem=sudRemove[sudDiff];
  const idxs=[...Array(81).keys()].sort(()=>Math.random()-0.5);
  for(let i=0;i<rem;i++){sudGrid[idxs[i]]=0;sudGiven[idxs[i]]=false;}
}

function fillBoard(b){
  const empty=b.indexOf(0);if(empty===-1)return true;
  const nums=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-0.5);
  for(const n of nums){if(canPlace(b,empty,n)){b[empty]=n;if(fillBoard(b))return true;b[empty]=0;}}
  return false;
}

function canPlace(b,idx,n){
  const r=Math.floor(idx/9),c=idx%9;
  for(let i=0;i<9;i++){if(b[r*9+i]===n||b[i*9+c]===n)return false;}
  const br=Math.floor(r/3)*3,bc=Math.floor(c/3)*3;
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){if(b[(br+i)*9+(bc+j)]===n)return false;}
  return true;
}

function renderSudoku(){
  const g=document.getElementById('sudoku-grid');g.innerHTML='';
  for(let i=0;i<81;i++){
    const cell=document.createElement('button');
    cell.className='sudoku-cell'+(sudGiven[i]?' given':'');
    cell.textContent=sudGrid[i]||'';
    cell.dataset.idx=i;
    if(!sudGiven[i]&&sudGrid[i]){
      cell.classList.add(sudGrid[i]===sudSolution[i]?'correct-fill':'wrong');
    }
    cell.onclick=()=>selectSudokuCell(i);
    g.appendChild(cell);
  }
}

function selectSudokuCell(i){
  if(sudGiven[i])return;
  sudSelected=i;
  renderSudoku();
  document.querySelectorAll('.sudoku-cell')[i].classList.add('selected');
  // highlight same numbers
  const val=sudGrid[i];
  if(val){document.querySelectorAll('.sudoku-cell').forEach((c,j)=>{if(sudGrid[j]===val&&j!==i)c.classList.add('same-num');});}
  playClick();
}

function renderNumpad(){
  const np=document.getElementById('sudoku-numpad');np.innerHTML='';
  for(let i=1;i<=9;i++){const b=document.createElement('button');b.className='snum';b.textContent=i;b.onclick=()=>placeNum(i);np.appendChild(b);}
  const del=document.createElement('button');del.className='snum';del.style.fontSize='1.2rem';del.textContent='⌫';del.onclick=()=>placeNum(0);np.appendChild(del);
}

function placeNum(n){
  if(sudSelected<0||sudGiven[sudSelected])return;
  if(n===0){sudGrid[sudSelected]=0;}else{
    if(n===sudSolution[sudSelected]){playCorrect();sudGrid[sudSelected]=n;}
    else{playWrong();sudErrors++;document.getElementById('sud-err').textContent=sudErrors;sudGrid[sudSelected]=n;
      if(sudErrors>=3){clearInterval(sudTimerInt);setTimeout(()=>showWin('😅 Game Over','3 mistakes! Try again on Easy mode.'),200);}
    }
  }
  renderSudoku();document.querySelectorAll('.sudoku-cell')[sudSelected].classList.add('selected');
  if(sudGrid.every((v,i)=>v===sudSolution[i])){clearInterval(sudTimerInt);const m=Math.floor(sudTimer/60),s=sudTimer%60;setTimeout(()=>showWin('🔢 Sudoku Solved!','Completed in '+m+'m '+s+'s with '+sudErrors+' mistakes!'),300);}
}

function solveSudokuHelper(){
  const empty=sudGrid.findIndex((v,i)=>!sudGiven[i]&&!v);
  if(empty>=0){sudGrid[empty]=sudSolution[empty];playCorrect();renderSudoku();}
}

// ══ MEMORY ══
const EMOJIS=['🐍','🐍','🎯','🎯','💻','💻','🧠','🧠','⚡','⚡','🔥','🔥','📊','📊','🎲','🎲'];
let mfl=[],mmov=0,mpairs=0,mlock=false;
function initMem(){
  mmov=0;mpairs=0;mfl=[];mlock=false;
  document.getElementById('mm').textContent=0;document.getElementById('mp').textContent=0;
  const sh=[...EMOJIS].sort(()=>Math.random()-0.5);
  const g=document.getElementById('mgrid');g.innerHTML='';
  sh.forEach(e=>{const c=document.createElement('div');c.className='mcard';c.dataset.e=e;c.innerHTML='<span class="mf">?</span><span class="mb">'+e+'</span>';c.onclick=()=>flipM(c);g.appendChild(c);});
}
function flipM(c){
  if(mlock||c.classList.contains('flipped')||c.classList.contains('matched'))return;
  playClick();c.classList.add('flipped');mfl.push(c);
  if(mfl.length===2){mmov++;document.getElementById('mm').textContent=mmov;mlock=true;const[a,b]=mfl;
    if(a.dataset.e===b.dataset.e){playCorrect();setTimeout(()=>{a.classList.add('matched');b.classList.add('matched');mpairs++;document.getElementById('mp').textContent=mpairs;mfl=[];mlock=false;if(mpairs===8)setTimeout(()=>showWin('🧠 Memory Master!','All 8 pairs found in '+mmov+' moves!'),200);},300);}
    else{playWrong();setTimeout(()=>{a.classList.remove('flipped');b.classList.remove('flipped');mfl=[];mlock=false;},900);}
  }
}
initMem();

// ══ QUIZ ══
const QS=[
  {q:"What does HTML stand for?",opts:["HyperText Markup Language","High-Level Text Machine","HyperText Making Language","Hyper Transfer Markup"],ans:0,cat:"Web Dev"},
  {q:"Which CSS property controls text size?",opts:["font-weight","text-size","font-size","letter-size"],ans:2,cat:"CSS"},
  {q:"Time complexity of binary search?",opts:["O(n)","O(n²)","O(log n)","O(1)"],ans:2,cat:"Algorithms"},
  {q:"Python keyword to define a function?",opts:["function","def","define","func"],ans:1,cat:"Python"},
  {q:"SQL command to retrieve data?",opts:["INSERT","UPDATE","SELECT","DELETE"],ans:2,cat:"SQL"},
  {q:"SQL clause that filters rows?",opts:["ORDER BY","GROUP BY","WHERE","HAVING"],ans:2,cat:"SQL"},
  {q:"In Django, a Model is a...?",opts:["Design template","Python class for a DB table","JS framework","CSS tool"],ans:1,cat:"Django"},
  {q:"C++ operator for dynamic memory?",opts:["malloc","new","alloc","create"],ans:1,cat:"C++"},
  {q:"What does OOP stand for?",opts:["Object-Oriented Programming","Open-Operation Program","Operator-Ordered Process","Object-On-Processing"],ans:0,cat:"Concepts"},
  {q:"Python library for numerical computing?",opts:["NumPy","Flask","Django","Requests"],ans:0,cat:"Data Science"},
];
let qi=0,qsc=0,qans=false;
function startQuiz(){qi=0;qsc=0;qans=false;document.getElementById('qs').textContent=0;document.getElementById('qend').style.display='none';showQ();}
function showQ(){const q=QS[qi];document.getElementById('qnum').textContent='Q '+(qi+1)+'/'+QS.length;document.getElementById('qcat').textContent=q.cat;document.getElementById('qfill').style.width=((qi+1)/QS.length*100)+'%';document.getElementById('qq').textContent=q.q;const o=document.getElementById('qopts');o.innerHTML='';q.opts.forEach((op,i)=>{const b=document.createElement('button');b.className='qopt';b.textContent=op;b.onclick=()=>ansQ(i,b);o.appendChild(b);});document.getElementById('qnxt').style.display='none';qans=false;}
function ansQ(i,btn){if(qans)return;qans=true;const q=QS[qi];document.querySelectorAll('.qopt')[q.ans].classList.add('correct');if(i!==q.ans){btn.classList.add('wrong');playWrong();}else{qsc++;playCorrect();document.getElementById('qs').textContent=qsc;}document.querySelectorAll('.qopt').forEach(o=>o.disabled=true);qi<QS.length-1?document.getElementById('qnxt').style.display='block':setTimeout(endQ,800);}
function nextQ(){qi++;showQ();}
function endQ(){document.getElementById('qopts').innerHTML='';document.getElementById('qnxt').style.display='none';document.getElementById('qq').textContent='';const p=Math.round(qsc/QS.length*100);document.getElementById('qfinal').textContent=qsc+'/'+QS.length+' ('+p+'%)';const m=['Keep studying! 💪','Review the basics 📚','Good progress! 👍','Great CS knowledge! 🎯','CS genius! 🏆'];document.getElementById('qmsg').textContent=m[Math.min(4,Math.floor(p/20))];document.getElementById('qend').style.display='block';if(p>=70)setTimeout(()=>showWin('💻 Quiz Champion!',qsc+'/10 correct — '+p+'% score! Brilliant!'),300);}
startQuiz();

// ══ CONTACT ══
function sendViaEmail(e){
  e.preventDefault();
  const name=document.getElementById('fn').value.trim();
  const email=document.getElementById('fe').value.trim();
  const msg=document.getElementById('fm').value.trim();
  if(!name||!email||!msg)return;
  const sub=encodeURIComponent('Portfolio Contact from '+name);
  const body=encodeURIComponent('Hi Mudasir,\n\nMy name is '+name+'\nEmail: '+email+'\n\nMessage:\n'+msg+'\n\n(Sent from your portfolio)');
  window.location.href='mailto:hussainmudasir098@gmail.com?subject='+sub+'&body='+body;
  const ok=document.getElementById('fok');ok.style.display='block';setTimeout(()=>ok.style.display='none',4000);
  playCorrect();
}
// </>
