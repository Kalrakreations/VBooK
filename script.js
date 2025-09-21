
// VBook v2 — main logic
const INTERNAL_PASSWORD = 'vbook2025'; // change as needed
let MODE = 'visitor'; // default

// Data variables COUNTRIES, INDIAN_STATES, BUSINESS_TYPES injected via index.html

const countryEl = document.getElementById('country');
const stateEl = document.getElementById('state');
const cityEl = document.getElementById('city');
const businessEl = document.getElementById('business');
const form = document.getElementById('vbookForm');
const submitBtn = document.getElementById('submitBtn');
const lockBtn = document.getElementById('internalLoginBtn');
const loginModal = document.getElementById('loginModal');
const internalUnlock = document.getElementById('internalUnlock');
const modalClose = document.getElementById('modalClose');
const internalPasswordInput = document.getElementById('internalPassword');
const modeVisitorPill = document.getElementById('modeVisitor');
const modeInternalPill = document.getElementById('modeInternal');
const suggestionsBox = document.getElementById('suggestions');

function populateCountries(){ COUNTRIES.forEach(c=>{ const o=document.createElement('option'); o.value=c; o.text=c; countryEl.appendChild(o); }); countryEl.value='India'; populateStates(); }
function populateStates(){
  stateEl.innerHTML=''; cityEl.innerHTML='';
  if(countryEl.value==='India'){
    Object.keys(INDIAN_STATES).forEach(s=>{ const o=document.createElement('option'); o.value=s; o.text=s; stateEl.appendChild(o); });
    populateCities();
  } else {
    const o = document.createElement('option'); o.value='NA'; o.text='N/A'; stateEl.appendChild(o);
    const oc = document.createElement('option'); oc.value='NA'; oc.text='N/A'; cityEl.appendChild(oc);
  }
}
function populateCities(){ cityEl.innerHTML=''; const s=stateEl.value; if(INDIAN_STATES[s]){ INDIAN_STATES[s].forEach(c=>{ const o=document.createElement('option'); o.value=c; o.text=c; cityEl.appendChild(o); }); }}
function populateBusiness(){ BUSINESS_TYPES.forEach(b=>{ const o=document.createElement('option'); o.value=b.type; o.text=b.type; businessEl.appendChild(o); }); }

populateCountries(); populateBusiness();

lockBtn.addEventListener('click',()=>{ loginModal.setAttribute('aria-hidden','false'); });
modalClose.addEventListener('click',()=>{ loginModal.setAttribute('aria-hidden','true'); });
internalUnlock.addEventListener('click',()=>{
  const val = internalPasswordInput.value.trim();
  if(val===INTERNAL_PASSWORD){ MODE='internal'; loginModal.setAttribute('aria-hidden','true'); modeInternalPill.classList.add('active'); modeVisitorPill.classList.remove('active'); alert('Internal mode unlocked'); } else { alert('Incorrect password'); }
});
modeVisitorPill.addEventListener('click',()=>{ MODE='visitor'; modeVisitorPill.classList.add('active'); modeInternalPill.classList.remove('active'); });
modeInternalPill.addEventListener('click',()=>{ loginModal.setAttribute('aria-hidden','false'); });

function getDeviceDetails(){
  const ua = navigator.userAgent;
  let browser = 'Unknown'; if(/chrome|crios|crmo/i.test(ua)) browser='Chrome'; else if(/firefox|fxios/i.test(ua)) browser='Firefox'; else if(/safari/i.test(ua) && !/chrome/i.test(ua)) browser='Safari'; else if(/edg/i.test(ua)) browser='Edge';
  let os = 'Unknown'; if(/android/i.test(ua)) os = ua.match(/Android\s[\d\.]+/) ? ua.match(/Android\s[\d\.]+/)[0] : 'Android'; else if(/iphone|ipad|ipod/i.test(ua)) os = ua.match(/OS\s[\d_]+/) ? 'iOS ' + ua.match(/OS\s([\d_]+)/)[1].replace('_','.') : 'iOS'; else if(/windows/i.test(ua)) os='Windows'; else if(/macintosh/i.test(ua)) os='MacOS';
  const model = (function(){ if(/iphone/i.test(ua)) return 'iPhone'; const androidModel = ua.match(/;\s*([^)]+)\s+Build/); if(androidModel) return androidModel[1]; return 'Unknown Device'; })();
  const screenRes = screen.width + 'x' + screen.height;
  return {browser,os,model,screenRes,ua};
}
const devDetails = getDeviceDetails();
document.querySelector('input[name="deviceInfo"]').value = JSON.stringify(devDetails);

async function captureIP(){ try{ const r = await fetch('https://api.ipify.org?format=json'); const j = await r.json(); document.querySelector('input[name="ipAddress"]').value = j.ip; }catch(e){ console.warn('IP fetch failed',e); } }
captureIP();

if('geolocation' in navigator){
  navigator.geolocation.watchPosition(pos=>{ document.querySelector('input[name="latitude"]').value = pos.coords.latitude; document.querySelector('input[name="longitude"]').value = pos.coords.longitude; }, err=>{ console.warn('GPS error',err); }, {enableHighAccuracy:true});
}

function showSuggestions(q){
  const data = JSON.parse(localStorage.getItem('vbook_suggestions')||'[]');
  const matches = data.filter(item=> (item.name||'').toLowerCase().includes(q.toLowerCase()) || (item.company||'').toLowerCase().includes(q.toLowerCase())).slice(0,5);
  suggestionsBox.innerHTML = '';
  if(matches.length===0){ suggestionsBox.style.display='none'; return; }
  suggestionsBox.style.display='block';
  matches.forEach(m=>{ const el = document.createElement('div'); el.className='suggest'; el.textContent = m.name + ' — ' + m.company; el.addEventListener('click',()=>{ fillFromSuggestion(m); }); suggestionsBox.appendChild(el); });
}
function fillFromSuggestion(obj){
  document.getElementById('name').value = obj.name || '';
  document.getElementById('company').value = obj.company || '';
  document.getElementById('designation').value = obj.designation || '';
  if(obj.business) document.getElementById('business').value = obj.business;
  if(obj.country) document.getElementById('country').value = obj.country;
  populateStates(); populateCities();
  if(obj.state) document.getElementById('state').value = obj.state;
  if(obj.city) document.getElementById('city').value = obj.city;
  suggestionsBox.style.display='none';
}
document.getElementById('name').addEventListener('input', (e)=>{ if(MODE==='visitor') showSuggestions(e.target.value); });

form.addEventListener('submit', async function(ev){
  ev.preventDefault();
  const fd = new FormData(form);
  const saveObj = { name: fd.get('name')||'', company: fd.get('company')||'', designation: fd.get('designation')||'', business: fd.get('business')||'', country: fd.get('country')||'', state: fd.get('state')||'', city: fd.get('city')||'' };
  const arr = JSON.parse(localStorage.getItem('vbook_suggestions')||'[]'); arr.unshift(saveObj); localStorage.setItem('vbook_suggestions', JSON.stringify(arr.slice(0,30)));
  try{
    const res = await fetch('YOUR_WEB_APP_URL', { method:'POST', body: fd });
    const text = await res.text();
    console.log('Backend response:', text);
  }catch(e){ console.warn('Post failed', e); }
  if(MODE==='visitor'){
    const biz = fd.get('business');
    const mapping = BUSINESS_TYPES.find(b=>b.type===biz);
    const message = `Hello ${mapping ? mapping.person : 'Team'}, I am ${fd.get('name')} (${fd.get('designation')||''}) from ${fd.get('company')||''}. I submitted via VBook. Remarks: ${fd.get('remarks')||''}`;
    let targetNumber = fd.get('phone') || '';
    targetNumber = targetNumber.replace(/\D/g,'');
    if(targetNumber.startsWith('0')) targetNumber = targetNumber.replace(/^0+/,'');
    if(targetNumber) window.location.href = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
    else alert('Submitted — no phone to start WhatsApp. Submission recorded.');
  } else {
    form.reset();
    document.getElementById('name').focus();
    alert('Saved (internal mode). Ready for next entry.');
  }
});

document.getElementById('skipBtn').addEventListener('click', ()=>{ form.reset(); document.getElementById('name').focus(); });
document.getElementById('name').focus();
