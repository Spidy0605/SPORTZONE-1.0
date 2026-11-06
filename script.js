const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const store = {
  get(key, fallback){try{return JSON.parse(localStorage.getItem('sportzone_'+key)) ?? fallback}catch{return fallback}},
  set(key,value){localStorage.setItem('sportzone_'+key,JSON.stringify(value))}
};
const seed = {
 matches:[
  {id:1,sport:'cricket',competition:'INTERNATIONAL · T20',home:'India',away:'Australia',homeIcon:'🇮🇳',awayIcon:'🇦🇺',score:'Upcoming',status:'UPCOMING',detail:'Demo fixture · not live'},
  {id:2,sport:'football',competition:'PREMIER LEAGUE · EXAMPLE',home:'Man United',away:'Man City',homeIcon:'🔴',awayIcon:'🔵',score:'2 : 1',status:'DEMO',detail:'Illustrative score only'},
  {id:3,sport:'cricket',competition:'LEAGUE · EXAMPLE',home:'Team Titans',away:'Team Warriors',homeIcon:'🟣',awayIcon:'🟡',score:'168/6 · 154/9',status:'RESULT',detail:'Example result · demo data'}
 ],
 players:[
  {id:1,sport:'cricket',name:'Virat Kohli',team:'India',role:'Batter',rating:'890',metric:'Runs',value:'13,900',extra:'ODI profile · sample stats'},
  {id:2,sport:'cricket',name:'Jasprit Bumrah',team:'India',role:'Bowler',rating:'875',metric:'Wickets',value:'150+',extra:'International profile · sample stats'},
  {id:3,sport:'football',name:'Lionel Messi',team:'Inter Miami',role:'Forward',rating:'920',metric:'Goals',value:'800+',extra:'Career profile · sample stats'},
  {id:4,sport:'football',name:'Kylian Mbappé',team:'Real Madrid',role:'Forward',rating:'905',metric:'Goals',value:'250+',extra:'Career profile · sample stats'}
 ],
 news:[
  {id:1,category:'CRICKET',title:'Big matches. Bigger moments.',body:'Match previews, recaps and player stories for cricket fans.'},
  {id:2,category:'FOOTBALL',title:'Every league has a story.',body:'Club news, league battles and matchday talking points.'},
  {id:3,category:'ANALYSIS',title:'Numbers behind the game.',body:'Explore stats and performance data from across sport.'}
 ], users:[]
};
let data={};
for(const [k,v] of Object.entries(seed)) data[k]=store.get(k,v);
let currentUser=store.get('session',null), authMode='login', adminTab='matches';
const teams=['India','Australia','England','South Africa','New Zealand','Pakistan','Arsenal','Chelsea','Manchester City','Real Madrid','Barcelona','Liverpool'];
const safe = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function persist(){for(const [k,v] of Object.entries(data))store.set(k,v)}
function renderMatches(filter='all'){
 const grid=$('#matchGrid'); if(!grid)return;
 const matches=data.matches.filter(m=>filter==='all'||m.sport===filter);
 grid.innerHTML=matches.map(m=>`<article class="match-card" data-sport="${safe(m.sport)}"><div class="match-top"><span class="sport-tag ${m.sport==='cricket'?'cricket-tag':'football-tag'}">${m.sport==='cricket'?'🏏 CRICKET':'⚽ FOOTBALL'}</span><span class="status">${safe(m.status)}</span></div><div class="competition">${safe(m.competition)}</div><div class="teams"><div class="team"><span class="flag">${safe(m.homeIcon||'🏅')}</span><b>${safe(m.home)}</b></div><div class="score">${safe(m.score||'VS')}</div><div class="team"><span class="flag">${safe(m.awayIcon||'🏅')}</span><b>${safe(m.away)}</b></div></div><div class="match-detail"><span>${safe(m.detail||'Match information')}</span><span>${m.status==='LIVE'?'● LIVE':'SPORTZONE'}</span></div></article>`).join('')||'<div class="empty-state">No matches here yet. Admin can add a match.</div>';
}
function renderPlayers(){
 const q=($('#playerSearch')?.value||'').toLowerCase(), sport=$('#playerSport')?.value||'all';
 const list=data.players.filter(p=>(sport==='all'||p.sport===sport)&&`${p.name} ${p.team} ${p.role}`.toLowerCase().includes(q));
 $('#playerGrid').innerHTML=list.map(p=>`<article class="player-card"><div class="player-card-top"><span class="player-avatar">${safe(p.name.split(' ').map(x=>x[0]).slice(0,2).join(''))}</span><span class="sport-tag ${p.sport==='cricket'?'cricket-tag':'football-tag'}">${safe(p.sport.toUpperCase())}</span></div><h3>${safe(p.name)}</h3><p>${safe(p.team)} · ${safe(p.role)}</p><div class="player-metrics"><div><b>${safe(p.rating)}</b><small>RATING</small></div><div><b>${safe(p.value)}</b><small>${safe(p.metric)}</small></div><div><b>${safe(p.role)}</b><small>ROLE</small></div></div><p class="player-meta">${safe(p.extra||'Player profile')}</p><button class="small-action" data-fav-player="${p.id}">${favourites().includes(p.id)?'★ Saved':'☆ Add to favourites'}</button></article>`).join('')||'<div class="empty-state">No players match your search.</div>';
}
function favourites(){return store.get('favouritePlayers',[])}
function renderFavourites(){
 const selected=store.get('favouriteTeams',[]);
 $('#teamChoices').innerHTML=teams.map(t=>`<button class="choice-chip ${selected.includes(t)?'selected':''}" data-team="${safe(t)}">${selected.includes(t)?'★':'+'} ${safe(t)}</button>`).join('');
 const saved=data.players.filter(p=>favourites().includes(p.id));
 $('#savedPlayers').innerHTML=saved.length?saved.map(p=>`<span class="saved-player">${safe(p.name)} <button class="small-action" data-fav-player="${p.id}">Remove</button></span>`).join(''):'No saved players yet.';
}
function renderNews(){const n=$('.news-grid');if(!n)return;n.innerHTML=data.news.map((x,i)=>`<article class="news-card"><div class="news-image ${i%3===0?'news-cricket':i%3===1?'news-football':'news-stats'}">${x.category==='CRICKET'?'🏏':x.category==='FOOTBALL'?'⚽':'📊'}<span>${safe(x.category)}</span></div><div class="news-body"><small>SPORTZONE NEWS / ${String(i+1).padStart(2,'0')}</small><h3>${safe(x.title)}</h3><p>${safe(x.body)}</p></div></article>`).join('')||'<p>No news published yet.</p>'}
function renderAccount(){ $('#accountMessage').textContent=currentUser?`Signed in as ${currentUser.name} (${currentUser.email}). Your favourites are saved on this device.`:'Sign in to save your favourite teams and players.';$('#loginOpen').textContent=currentUser?'My account / Logout':'Login / Sign up'; }
function openAuth(){if(currentUser){if(confirm('Log out of SPORTZONE?')){currentUser=null;store.set('session',null);renderAccount()}return}$('#authModal').classList.add('open');$('#authModal').setAttribute('aria-hidden','false')}
function setAuthMode(mode){authMode=mode;$('#authTitle').innerHTML=mode==='login'?'FAN <em>LOGIN</em>':'JOIN <em>SPORTZONE</em>';$('#authName').parentElement.style.display=mode==='register'?'grid':'none';$('#authSubmit').textContent=mode==='login'?'Login':'Create account';$('#authSwitch').textContent=mode==='login'?'New here? Create an account':'Already registered? Login'}
function isAdmin(){return currentUser?.role==='admin'}
function adminOpen(){if(!isAdmin()){alert('Admin access required. Sign in with the demo admin account: admin@sportzone.demo / Admin@123');return}$('#adminPanel').hidden=false;renderAdmin();$('#adminPanel').scrollIntoView({behavior:'smooth'})}
function renderAdmin(){
 $('#adminStats').innerHTML=[['MATCHES',data.matches.length],['PLAYERS',data.players.length],['NEWS POSTS',data.news.length],['REGISTERED USERS',data.users.length]].map(x=>`<div class="admin-stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('');
 $$('.admin-tab').forEach(b=>b.classList.toggle('active',b.dataset.adminTab===adminTab));
 const forms={
 matches:`<form class="admin-form" id="matchForm"><select name="sport"><option value="cricket">Cricket</option><option value="football">Football</option></select><input name="competition" placeholder="Competition" required><input name="home" placeholder="Home team" required><input name="away" placeholder="Away team" required><input name="score" placeholder="Score / VS" value="Upcoming"><input name="status" placeholder="Status" value="UPCOMING"><input name="detail" placeholder="Match details"><button class="button button-primary">+ Add match</button></form><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>SPORT</th><th>FIXTURE</th><th>SCORE</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>${data.matches.map(m=>`<tr><td>${safe(m.sport)}</td><td>${safe(m.home)} vs ${safe(m.away)}</td><td>${safe(m.score)}</td><td>${safe(m.status)}</td><td><button class="small-action" data-delete="matches" data-id="${m.id}">Delete</button></td></tr>`).join('')}</tbody></table></div>`,
 players:`<form class="admin-form" id="playerForm"><select name="sport"><option value="cricket">Cricket</option><option value="football">Football</option></select><input name="name" placeholder="Player name" required><input name="team" placeholder="Team / club" required><input name="role" placeholder="Role" required><input name="rating" placeholder="Rating"><input name="metric" placeholder="Stat label (e.g. Runs)"><input name="value" placeholder="Stat value"><button class="button button-primary">+ Add player</button></form><table class="admin-table"><thead><tr><th>PLAYER</th><th>SPORT</th><th>TEAM</th><th>ACTION</th></tr></thead><tbody>${data.players.map(p=>`<tr><td>${safe(p.name)}</td><td>${safe(p.sport)}</td><td>${safe(p.team)}</td><td><button class="small-action" data-delete="players" data-id="${p.id}">Delete</button></td></tr>`).join('')}</tbody></table>`,
 news:`<form class="admin-form" id="newsForm"><select name="category"><option>CRICKET</option><option>FOOTBALL</option><option>ANALYSIS</option></select><input name="title" placeholder="News headline" required><textarea name="body" placeholder="News summary" required></textarea><button class="button button-primary">+ Publish news</button></form><table class="admin-table"><thead><tr><th>CATEGORY</th><th>HEADLINE</th><th>ACTION</th></tr></thead><tbody>${data.news.map(n=>`<tr><td>${safe(n.category)}</td><td>${safe(n.title)}</td><td><button class="small-action" data-delete="news" data-id="${n.id}">Delete</button></td></tr>`).join('')}</tbody></table>`,
 users:`<div class="empty-state">User accounts created in this browser are listed here. For real user management, connect a secure backend and database.</div><table class="admin-table"><thead><tr><th>NAME</th><th>EMAIL</th><th>ROLE</th></tr></thead><tbody>${data.users.map(u=>`<tr><td>${safe(u.name)}</td><td>${safe(u.email)}</td><td>${safe(u.role||'fan')}</td></tr>`).join('')||'<tr><td colspan="3">No registered users yet.</td></tr>'}</tbody></table>`
 };
 $('#adminContent').innerHTML=forms[adminTab];
 $('#matchForm')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);data.matches.unshift({id:Date.now(),sport:f.get('sport'),competition:f.get('competition'),home:f.get('home'),away:f.get('away'),homeIcon:'🏅',awayIcon:'🏅',score:f.get('score'),status:f.get('status').toUpperCase(),detail:f.get('detail')||'Added by admin'});persist();renderMatches();renderAdmin()});
 $('#playerForm')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);data.players.push({id:Date.now(),sport:f.get('sport'),name:f.get('name'),team:f.get('team'),role:f.get('role'),rating:f.get('rating')||'—',metric:f.get('metric')||'Stats',value:f.get('value')||'—'});persist();renderPlayers();renderAdmin()});
 $('#newsForm')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);data.news.unshift({id:Date.now(),category:f.get('category'),title:f.get('title'),body:f.get('body')});persist();renderNews();renderAdmin()});
}
$('#menuToggle').addEventListener('click',()=>{const nav=$('#mainNav');nav.classList.toggle('open');$('#menuToggle').textContent=nav.classList.contains('open')?'✕':'☰'});
$$('.nav-link').forEach(a=>a.addEventListener('click',()=>{$('#mainNav').classList.remove('open');$('#menuToggle').textContent='☰';$$('.nav-link').forEach(x=>x.classList.remove('active'));a.classList.add('active')}));
$$('.filter-btn').forEach(b=>b.addEventListener('click',()=>{$$('.filter-btn').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');renderMatches(b.dataset.filter)}));
$('#playerSearch').addEventListener('input',renderPlayers);$('#playerSport').addEventListener('change',renderPlayers);
$('#playerGrid').addEventListener('click',e=>{const b=e.target.closest('[data-fav-player]');if(!b)return;const id=Number(b.dataset.favPlayer),f=favourites();store.set('favouritePlayers',f.includes(id)?f.filter(x=>x!==id):[...f,id]);renderPlayers();renderFavourites()});
$('#teamChoices').addEventListener('click',e=>{const b=e.target.closest('[data-team]');if(!b)return;const t=b.dataset.team,f=store.get('favouriteTeams',[]);store.set('favouriteTeams',f.includes(t)?f.filter(x=>x!==t):[...f,t]);renderFavourites()});
$('#savedPlayers').addEventListener('click',e=>{const b=e.target.closest('[data-fav-player]');if(!b)return;const id=Number(b.dataset.favPlayer);store.set('favouritePlayers',favourites().filter(x=>x!==id));renderPlayers();renderFavourites()});
$('#loginOpen').addEventListener('click',openAuth);$('#adminOpen').addEventListener('click',adminOpen);$('#adminClose').addEventListener('click',()=>$('#adminPanel').hidden=true);$('#authClose').addEventListener('click',()=>$('#authModal').classList.remove('open'));$('#authSwitch').addEventListener('click',()=>setAuthMode(authMode==='login'?'register':'login'));
async function hashPassword(value){const bytes=new TextEncoder().encode(value);const digest=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')}
$('#authForm').addEventListener('submit',async e=>{e.preventDefault();const email=$('#authEmail').value.trim().toLowerCase(),password=$('#authPassword').value,name=$('#authName').value.trim()||email.split('@')[0];if(email==='admin@sportzone.demo'&&password==='Admin@123'){currentUser={name:'SPORTZONE Admin',email,role:'admin'};}else if(authMode==='register'){if(data.users.some(u=>u.email===email)){alert('This email is already registered on this browser.');return}currentUser={name,email,role:'fan'};data.users.push({name,email,role:'fan',passwordHash:await hashPassword(password)});persist();}else{const passwordHash=await hashPassword(password);const user=data.users.find(u=>u.email===email&&u.passwordHash===passwordHash);if(!user){alert('Account not found. Register first, or use the demo admin credentials.');return}currentUser={name:user.name,email:user.email,role:user.role||'fan'};}store.set('session',currentUser);$('#authModal').classList.remove('open');renderAccount();if(isAdmin())adminOpen();});
$('#adminContent').addEventListener('click',e=>{const tab=e.target.closest('[data-admin-tab]');if(tab){adminTab=tab.dataset.adminTab;renderAdmin();return}const del=e.target.closest('[data-delete]');if(del&&confirm('Delete this item?')){const key=del.dataset.delete,id=Number(del.dataset.id);data[key]=data[key].filter(x=>x.id!==id);persist();renderMatches();renderPlayers();renderNews();renderAdmin()}});
// Optional live-data bridge: set window.SPORTZONE_API_BASE to your own backend URL.
async function loadRemote(){const base=window.SPORTZONE_API_BASE;if(!base)return;try{const [m,p,n]=await Promise.all(['matches','players','news'].map(path=>fetch(`${base}/${path}`).then(r=>{if(!r.ok)throw Error('API request failed');return r.json()})));if(Array.isArray(m))data.matches=m;if(Array.isArray(p))data.players=p;if(Array.isArray(n))data.news=n;renderMatches();renderPlayers();renderNews()}catch(err){console.warn('SPORTZONE API unavailable; showing saved demo content.',err)}}
renderMatches();renderPlayers();renderFavourites();renderNews();renderAccount();setAuthMode('login');loadRemote();
