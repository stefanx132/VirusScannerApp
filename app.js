import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig, vtApiKey, geminiApiKey } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const getEl = (id) => document.getElementById(id);

// --- 1. GESTIONARE AUTENTIFICARE ȘI SESIUNE ---
const btnLogin = getEl('btnLogin');
const btnFinalizeRegister = getEl('btnFinalizeRegister');
const btnLogout = getEl('btnLogout');

if (btnLogin) {
    btnLogin.onclick = async () => {
        const email = getEl('email').value.trim();
        const pass = getEl('password').value;
        if (!email || !pass) return alert("Vă rugăm să introduceți credențialele de acces.");
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            window.location.href = "dashboard.html";
        } catch (e) {
            alert("Eroare la autentificare: Credențiale invalide.");
        }
    };
}

if (btnFinalizeRegister) {
    btnFinalizeRegister.onclick = async () => {
        const email = getEl('regEmail').value.trim();
        const pass = getEl('regPassword').value;
        const confirm = getEl('confirmPassword').value;
        if (pass !== confirm) return alert("Eroare: Parolele introduse nu coincid.");
        if (pass.length < 6) return alert("Eroare: Parola trebuie să conțină minimum 6 caractere.");
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            alert("Contul a fost creat cu succes. Redirecționare în curs...");
            window.location.href = "dashboard.html";
        } catch (e) {
            alert("Eroare la înregistrare: " + e.message);
        }
    };
}

if (btnLogout) {
    btnLogout.onclick = async () => {
        try {
            await signOut(auth);
            window.location.href = "index.html";
        } catch (e) {}
    };
}

onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;
    const isAuthPage = path.includes("index.html") || path.includes("register.html") || path.endsWith("/");
    if (user) {
        const emailDisplay = getEl('userEmailDisplay');
        if (emailDisplay) emailDisplay.innerText = user.email;
        if (isAuthPage) window.location.href = "dashboard.html";
    } else {
        if (path.includes("dashboard.html")) window.location.href = "index.html";
    }
});

// --- 2. INTERFAȚĂ UTILIZATOR ---
const userMenuBtn = getEl('userMenuBtn');
const userDropdown = getEl('userDropdown');
if (userMenuBtn && userDropdown) {
    userMenuBtn.onclick = (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    };
    window.addEventListener('click', () => userDropdown.classList.add('hidden'));
}

const openChat = getEl('openChat');
const closeChat = getEl('closeChat');
const chatContainer = getEl('chat-container');
if (openChat) openChat.onclick = () => chatContainer.classList.remove('hidden');
if (closeChat) closeChat.onclick = () => chatContainer.classList.add('hidden');

// --- 3. ANALIZĂ SECURITATE ȘI FIRESTORE ---
async function fetchVTReport(analysisId) {
    // MODIFICAT AICI PENTRU PROXY VERCEL
    const res = await fetch(`/proxy-vt/analyses/${analysisId}`, {
        headers: { 'x-apikey': vtApiKey, 'accept': 'application/json' }
    });
    const data = await res.json();
    return data.data.attributes;
}

function renderResult(resultSection, stats, isDangerous, source) {
    resultSection.className = `mt-8 p-6 rounded-2xl border backdrop-blur-sm ${isDangerous ? 'border-red-500/50 bg-red-900/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-emerald-500/50 bg-emerald-900/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]'}`;
    
    // Înlocuim emoji-urile cu pictograme SVG subțiri și texte tehnice
    const sourceBadge = source === 'db' 
        ? `<span class="bg-blue-900/50 text-blue-300 text-xs px-2.5 py-1 rounded border border-blue-700/50 ml-auto flex items-center gap-1.5 font-mono tracking-wide"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg> REZULTAT DIN ARHIVĂ</span>` 
        : `<span class="bg-purple-900/50 text-purple-300 text-xs px-2.5 py-1 rounded border border-purple-700/50 ml-auto flex items-center gap-1.5 font-mono tracking-wide"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg> SCANARE ÎN TIMP REAL</span>`;

    // Iconițe pentru status (Alertă vs Sigur)
    const statusIcon = isDangerous 
        ? `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
        : `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

    resultSection.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg flex items-center gap-2 tracking-wide ${isDangerous ? 'text-red-400' : 'text-emerald-400'}">
                ${statusIcon}
                ${isDangerous ? 'AMENINȚARE DETECTATĂ' : 'NICIO AMENINȚARE DETECTATĂ'}
            </h3>
            ${sourceBadge}
        </div>
        <p class="text-sm text-slate-300 mb-4 leading-relaxed">${isDangerous ? 'Sistemele de analiză au identificat semnături malițioase sau comportament suspect asociat acestei resurse.' : 'Analiza nu a relevat niciun comportament suspect. Resursa respectă standardele de integritate și securitate.'}</p>
        <div class="mt-3 flex gap-4 text-sm font-mono bg-slate-900/80 p-4 rounded-xl border border-slate-800/50">
            <div class="flex flex-col"><span class="text-slate-500 text-xs uppercase tracking-wider">Maliciose</span><span class="text-red-400 font-bold text-lg">${stats.malicious}</span></div>
            <div class="flex flex-col"><span class="text-slate-500 text-xs uppercase tracking-wider">Suspecte</span><span class="text-yellow-400 font-bold text-lg">${stats.suspicious}</span></div>
            <div class="flex flex-col"><span class="text-slate-500 text-xs uppercase tracking-wider">Sigure</span><span class="text-emerald-400 font-bold text-lg">${stats.harmless}</span></div>
        </div>`;
}

const btnScan = getEl('btnScan');
if (btnScan) {
    btnScan.onclick = async () => {
        const urlInput = getEl('vtLink').value.trim();
        const resultSection = getEl('result-section');
        if (!urlInput) return alert("Vă rugăm să introduceți o adresă URL validă.");

        const originalBtnHtml = btnScan.innerHTML;
        btnScan.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Procesare...`;
        btnScan.disabled = true;
        
        resultSection.classList.remove('hidden');
        resultSection.className = "mt-8 text-left transition-all duration-300";

        try {
            resultSection.innerHTML = `<p class="text-cyan-400 font-medium animate-pulse flex items-center justify-center gap-2">Căutare în baza de date locală...</p>`;
            
            const scansRef = collection(db, "scans");
            const q = query(scansRef, where("url", "==", urlInput));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0].data();
                renderResult(resultSection, docData.stats, docData.isDangerous, 'db');
                btnScan.innerHTML = originalBtnHtml;
                btnScan.disabled = false;
                return; 
            }

            resultSection.innerHTML = `<p class="text-purple-400 font-medium animate-pulse flex items-center justify-center gap-2">Conectare la serverele VirusTotal...</p>`;

            const formData = new FormData();
            formData.append('url', urlInput);
            
            // MODIFICAT AICI PENTRU PROXY VERCEL
            const response = await fetch('/proxy-vt/urls', {
                method: 'POST',
                headers: { 'x-apikey': vtApiKey, 'accept': 'application/json' },
                body: formData
            });

            const initialData = await response.json();
            const analysisId = initialData.data.id;
            let report = null;
            const maxAttempts = 10;

            for (let i = 1; i <= maxAttempts; i++) {
                resultSection.innerHTML = `
                    <div class="flex items-center justify-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div class="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <p class="text-slate-300 font-mono text-sm">Verificare status analiză VT: etapa ${i} din ${maxAttempts}...</p>
                    </div>`;
                await new Promise(r => setTimeout(r, 4000));
                report = await fetchVTReport(analysisId);
                if (report.status === "completed") break;
            }

            const stats = report.stats;
            const isDangerous = stats.malicious > 0 || stats.suspicious > 0;

            await addDoc(collection(db, "scans"), {
                url: urlInput,
                stats: stats,
                isDangerous: isDangerous,
                scannedBy: auth.currentUser.email,
                scannedAt: serverTimestamp()
            });

            renderResult(resultSection, stats, isDangerous, 'api');
        } catch (e) {
            resultSection.className = "mt-8 p-6 rounded-2xl border border-red-500/50 bg-red-900/20";
            resultSection.innerHTML = `<p class="text-red-400 flex items-center gap-2">Eroare la procesare: ${e.message}</p>`;
        } finally {
            btnScan.innerHTML = originalBtnHtml;
            btnScan.disabled = false;
        }
    };
}

// --- 4. LOGICĂ ISTORIC SCANĂRI (MODAL) ---
const btnHistory = getEl('btnHistory');
const historyModal = getEl('historyModal');
const closeHistory = getEl('closeHistory');
const historyList = getEl('historyList');
const historyModalContent = getEl('historyModalContent');

if (btnHistory) {
    btnHistory.onclick = async () => {
        // Deschidem modalul cu efect de fade in
        historyModal.classList.remove('hidden');
        setTimeout(() => {
            historyModal.classList.remove('opacity-0');
            historyModalContent.classList.remove('scale-95');
        }, 10);

        historyList.innerHTML = `<div class="flex justify-center items-center py-10"><div class="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>`;

        try {
            // Aducem doar scanările utilizatorului logat
            const scansRef = collection(db, "scans");
            const q = query(scansRef, where("scannedBy", "==", auth.currentUser.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                historyList.innerHTML = `<p class="text-center text-slate-400 py-8">Nu ai nicio scanare în arhiva ta momentan.</p>`;
                return;
            }

            let scans = [];
            querySnapshot.forEach(doc => {
                scans.push({ id: doc.id, ...doc.data() });
            });
            
            // Sortăm client-side ca să punem cele mai noi scanări sus
            scans.sort((a, b) => {
                const timeA = a.scannedAt ? a.scannedAt.toMillis() : 0;
                const timeB = b.scannedAt ? b.scannedAt.toMillis() : 0;
                return timeB - timeA; 
            });

            let html = '';
            scans.forEach(scan => {
                const dateStr = scan.scannedAt ? new Date(scan.scannedAt.toMillis()).toLocaleString('ro-RO') : 'Dată necunoscută';
                html += `
                    <div class="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-600 transition-colors">
                        <div class="overflow-hidden flex-1 w-full">
                            <p class="text-white font-mono text-sm truncate" title="${scan.url}">${scan.url}</p>
                            <p class="text-slate-500 text-xs mt-1 flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                ${dateStr}
                            </p>
                        </div>
                        <div class="flex items-center justify-between w-full md:w-auto gap-4 shrink-0">
                            <!-- Aici am modificat pentru claritate -->
                            <div class="flex gap-4 text-xs bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/50">
                                <div class="flex items-center gap-1.5" title="Semnături malițioase (viruși)">
                                    <span class="text-slate-400">Maliciose:</span>
                                    <span class="text-red-400 font-bold font-mono">${scan.stats.malicious}</span>
                                </div>
                                <div class="flex items-center gap-1.5" title="Comportament suspect">
                                    <span class="text-slate-400">Suspecte:</span>
                                    <span class="text-yellow-400 font-bold font-mono">${scan.stats.suspicious}</span>
                                </div>
                                <div class="flex items-center gap-1.5" title="Resurse sigure">
                                    <span class="text-slate-400">Sigure:</span>
                                    <span class="text-emerald-400 font-bold font-mono">${scan.stats.harmless}</span>
                                </div>
                            </div>
                            <!-- Badge-ul final -->
                            <span class="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider ${scan.isDangerous ? 'bg-red-900/50 text-red-400 border border-red-700/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'}">
                                ${scan.isDangerous ? 'MALIȚIOS' : 'SIGUR'}
                            </span>
                        </div>
                    </div>
                `;
            });
            historyList.innerHTML = html;

        } catch (e) {
            historyList.innerHTML = `<p class="text-center text-red-400 py-8">Eroare la încărcarea arhivei: ${e.message}</p>`;
        }
    };
}

const closeModalFunc = () => {
    historyModal.classList.add('opacity-0');
    historyModalContent.classList.add('scale-95');
    setTimeout(() => { historyModal.classList.add('hidden'); }, 300);
};

if (closeHistory) closeHistory.onclick = closeModalFunc;
if (historyModal) {
    historyModal.onclick = (e) => {
        if (e.target === historyModal) closeModalFunc();
    };
}

// --- 5. ASISTENT AI (GEMINI) ---
async function askGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${geminiApiKey}`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        return "Sistem offline. Serviciul AI nu este disponibil.";
    }
}

const sendChatBtn = getEl('sendChat');
if (sendChatBtn) {
    sendChatBtn.onclick = async () => {
        const input = getEl('chatInput');
        const msgArea = getEl('chat-messages');
        const text = input.value.trim();
        if (!text) return;

        const uDiv = document.createElement('div');
        uDiv.className = "bg-blue-600 text-white p-3.5 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl text-sm shadow-md self-end max-w-[85%] ml-auto";
        uDiv.innerHTML = text;
        msgArea.appendChild(uDiv);
        input.value = "";
        msgArea.scrollTop = msgArea.scrollHeight;

        const loadingDiv = document.createElement('div');
        loadingDiv.className = "bg-slate-800 p-3.5 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl text-slate-400 border border-slate-700 shadow-sm max-w-[85%] mr-auto flex gap-1 items-center";
        loadingDiv.innerHTML = `<div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div><div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div><div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>`;
        msgArea.appendChild(loadingDiv);
        msgArea.scrollTop = msgArea.scrollHeight;

        const aiRes = await askGemini(text);
        
        msgArea.removeChild(loadingDiv);
        const aDiv = document.createElement('div');
        aDiv.className = "bg-slate-800 p-3.5 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl text-slate-300 border border-slate-700 shadow-sm max-w-[85%] mr-auto";
        aDiv.innerHTML = aiRes.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-slate-400">$1</em>');
        msgArea.appendChild(aDiv);
        msgArea.scrollTop = msgArea.scrollHeight;
    };

    const input = getEl('chatInput');
    if (input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') sendChatBtn.click();
        });
    }
}