# VBook Futuristic Form - Package

## Setup

1. Replace `YOUR_WEB_APP_URL` placeholder inside `script.js` with your deployed Apps Script Web App URL.
2. Replace `YOUR_SHEET_ID_HERE` in `Code.gs` with your Google Sheet ID.
3. Deploy Apps Script:
   - Open Google Apps Script, create new project, paste Code.gs, save.
   - Deploy -> New deployment -> Select "Web app" -> Execute as: Me -> Who has access: Anyone
   - Copy the Web App URL.

4. Save all front-end files (index.html, style.css, script.js, manifest.json, service-worker.js) in a folder.
5. Serve via static host or open `index.html` directly in browser (some PWA features require HTTPS/hosting).
6. For PWA install, host on HTTPS and open in mobile browser -> Add to Home Screen.

## Notes

- Visitor Mode is default. Click lock icon to open Internal Mode login.
- Internal mode password default: `vbook2025`. Change in `script.js` for production.
- GPS permission will be requested by browser when needed and only works on HTTPS.
- IP capture uses ipify.org.
