// VBook JS Logic
const modePassword = 'Unlock@123'; // example internal mode password
let mode = 'visitor';

const countries = ["India","USA","UK","Canada","Australia","Germany","France","Japan","China","Brazil"];
const indianStates = {
  'Maharashtra':['Mumbai','Pune','Nagpur','Nashik','Aurangabad'],
  'Karnataka':['Bangalore','Mysore','Mangalore','Hubli','Belgaum'],
  'Delhi':['New Delhi','Dwarka','Rohini','Saket','Karol Bagh'],
  'Tamil Nadu':['Chennai','Coimbatore','Madurai','Tiruchirapalli','Salem'],
  'Gujarat':['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar'],
  'Rajasthan':['Jaipur','Udaipur','Jodhpur','Kota','Ajmer'],
  'West Bengal':['Kolkata','Howrah','Darjeeling','Durgapur','Siliguri'],
  'Punjab':['Chandigarh','Ludhiana','Amritsar','Jalandhar','Patiala'],
  'Haryana':['Gurugram','Faridabad','Panipat','Ambala','Hisar'],
  'Uttar Pradesh':['Lucknow','Kanpur','Noida','Agra','Varanasi']
};
const businessTypes = [
  {type:'Exporter',dept:'B2B',person:'Adhiraj'},
  {type:'International Certification',dept:'B2B',person:'Adhiraj'},
  {type:'Digital Marketing',dept:'E-Commerce',person:'Sahil'},
  {type:'Ecommerce Services',dept:'E-Commerce',person:'Sahil'},
  {type:'Trader',dept:'General Trade',person:'Amit'},
  {type:'Retailer',dept:'General Trade',person:'Amit'},
  {type:'Wholesaler',dept:'General Trade',person:'Amit'},
  {type:'Distributor',dept:'General Trade',person:'Amit'},
  {type:'Marketing',dept:'Marketing',person:'Arsh'},
  {type:'Quality',dept:'Quality',person:'Neha'},
  {type:'Hotels',dept:'Sales',person:'Yogesh'},
  {type:'HOReCa',dept:'Sales',person:'Yogesh'}
];

// Populate countries
const countrySelect = document.getElementById('country');
countries.forEach(c=>{ const opt = document.createElement('option'); opt.value=c; opt.text=c; countrySelect.appendChild(opt); });
countrySelect.value='India';

// Populate states and cities dynamically
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');
function populateStates(){
  stateSelect.innerHTML='';
  const selectedCountry = countrySelect.value;
  if(selectedCountry==='India'){
    Object.keys(indianStates).forEach(s=>{ const opt=document.createElement('option'); opt.value=s; opt.text=s; stateSelect.appendChild(opt); });
  }
}
function populateCities(){
  citySelect.innerHTML='';
  const selectedState = stateSelect.value;
  if(indianStates[selectedState]){
    indianStates[selectedState].forEach(c=>{ const opt=document.createElement('option'); opt.value=c; opt.text=c; citySelect.appendChild(opt); });
  }
}
countrySelect.addEventListener('change',()=>{ populateStates(); populateCities(); });
stateSelect.addEventListener('change',populateCities);
populateStates();
populateCities();

// Populate businesses
const businessSelect = document.getElementById('business');
businessTypes.forEach(b=>{ const opt=document.createElement('option'); opt.value=b.type; opt.text=b.type; businessSelect.appendChild(opt); });

// Password & mode handling
document.getElementById('loginBtn').addEventListener('click',()=>{
  const pwd = document.getElementById('modePassword').value;
  if(pwd===modePassword){ mode='internal'; } else { mode='visitor'; }
  document.getElementById('mode-select').style.display='none';
  document.getElementById('form-container').style.display='block';
});

// Device info
function getDeviceInfo(){
  return navigator.userAgent + ' | ' + screen.width+'x'+screen.height;
}
document.querySelector('input[name="deviceInfo"]').value=getDeviceInfo();

// IP capture
async function getIP(){
  try{ const res=await fetch('https://api.ipify.org?format=json'); const data=await res.json(); document.querySelector('input[name="ipAddress"]').value=data.ip; } catch(e){ console.error(e); }
}
getIP();

// GPS
if(navigator.geolocation){
  navigator.geolocation.watchPosition(p=>{
    document.querySelector('input[name="latitude"]').value=p.coords.latitude;
    document.querySelector('input[name="longitude"]').value=p.coords.longitude;
  },err=>console.error(err),{enableHighAccuracy:true});
}

// Submit handler
document.getElementById('vbookForm').addEventListener('submit',e=>{
  e.preventDefault();
  const formData = new FormData(e.target);
  const obj = {};
  formData.forEach((v,k)=>obj[k]=v);

  // Post to Apps Script
  fetch('YOUR_WEB_APP_URL',{method:'POST',body:formData})
    .then(r=>r.text()).then(res=>{
      if(mode==='visitor'){
        // WhatsApp redirect
        const business = businessTypes.find(b=>b.type===obj.business);
        if(business){
          const msg=\`Hello \${obj.name}, thank you for contacting us!\`; 
          const num=obj.phone.replace(/^\+91/,''); 
          window.location.href=\`https://wa.me/\${num}?text=\${encodeURIComponent(msg)}\`;
        }
      }
      e.target.reset();
    });
});
