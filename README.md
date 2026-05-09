# Virus Scanner App

** Link aplicatie vercel: https://virus-scanner-app.vercel.app/
** Link aplicatie GitHub: https://github.com/stefanx132/VirusScannerApp
** Link aplicatie Youtube: 

# 1. Introducere

Internetul și tehnologia digitală au transformat radical modul în care interacționăm. Odată cu această expansiune, am fost martorii unei creșteri exponențiale a amenințărilor cibernetice, de la viruși informatici la atacuri de tip phishing. 

În această lume vastă a pericolelor online, fiecare utilizator are nevoie de un instrument de încredere care să îi ofere siguranță. Astfel, instrumentele de analiză a securității au devenit nu doar mijloace de protecție, ci și unelte de educare și conștientizare, oferindu-ne o fereastră către un mediu online mai sigur.

# 2. Descrierea problemei

Atacurile de tip phishing și distribuția de malware prin link-uri frauduloase reprezintă principala cauză a compromiterii datelor. O mare parte din populație nu știe cum să verifice siguranța unei resurse web înainte de a o accesa. 

**Soluția:** Acest proiect oferă posibilitatea de a verifica instantaneu un URL, prezentând rezultatele sub o formă clară, alături de numărul de detecții malițioase sau suspecte. Pentru a optimiza consumul de resurse și timp (cota API API-urilor externe), aplicația arhivează automat scanările într-o bază de date (Firestore). La o nouă scanare a aceluiași link, rezultatul este extras instant din arhivă.

În plus, aplicația include un **Asistent Virtual AI** care poate explica termeni tehnici și poate educa utilizatorii cu privire la bunele practici de securitate cibernetică.

# 3. Descriere API

În cadrul aplicației au fost folosite următoarele 3 servicii majore în cloud, prin intermediul unui API REST și a SDK-urilor specifice:

** VirusTotal API (v3), prin care am accesat informații și analize de securitate despre adresele URL introduse de utilizator. API-ul a fost integrat în aplicație nativ, folosind funcția fetch din JavaScript. Pentru a ne putea folosi de acest serviciu, aplicația face request-uri de tip POST pentru a trimite link-ul la analiză, iar Google (Alphabet) returnează un ID. Mai apoi, prin request-uri de tip GET, preluăm raportul final care este afișat pe ecran clientului.

** Google Gemini API, pe care l-am folosit pentru a integra un asistent de inteligență artificială direct în panoul de control. Am comunicat cu modelul gemini-3-flash-preview printr-un endpoint REST. Aici, mesajele utilizatorului sunt transmise pentru a fi procesate, iar API-ul returnează răspunsuri contextuale despre securitate. Acesta este transmis ca răspuns către client și afișat în fereastra de chat.

** Firebase (Auth & Firestore), drept soluție completă de Backend-as-a-Service (BaaS) și bază de date NoSQL scalabilă și flexibilă, ideală pentru stocarea și gestionarea istoricului de scanări. Prin integrarea SDK-ului Firebase în JavaScript, am putut realiza operațiile CRUD necesare pentru gestionarea conturilor de utilizatori și a datelor scanate. Utilizând Firestore, m-am asigurat că aplicația poate gestiona eficient datele și poate oferi o experiență rapidă, preluând instant rezultatele arhivate.

# Tehnologii folosite

Lumea nu poate trăi fără aplicații mobile și web securizate în zilele noastre. Totul este digitizat, de la tranzacții bancare la comunicare, iar acest lucru atrage nenumărate amenințări. Datorită cadrelor eficiente care oferă o experiență perfectă pentru utilizator, ne putem proteja mai ușor. O astfel de bibliotecă robustă pentru stilizare este Tailwind CSS.

Frontend-ul este realizat în HTML5 și Vanilla JavaScript (ES6 Modules), utilizând manipularea directă a DOM-ului (Document Object Model) și funcții asincrone (async/await) pentru a asigura o interfață fluidă, fără a bloca experiența utilizatorului. Pentru design am folosit Tailwind CSS, care permite crearea de pagini web atrăgătoare și perfect responsive prin intermediul claselor utilitare. Tailwind oferă o suită cuprinzătoare de instrumente UI pentru a ajuta la livrarea de funcții noi mai rapid, permițând implementarea unui design complex tip "Dark Mode" și "Glassmorphism" direct din codul HTML.

Partea de backend a aplicației este delegată complet către infrastructura Firebase, funcționând pe un model de tip arhitectură Serverless. Firebase ne permite să folosim mediul de cloud furnizat de Google pentru a executa autentificarea și a stoca datele, eliminând necesitatea de a menține un server propriu de Node.js.

Pentru versionarea și stocarea codului sursă am folosit GitHub, iar deploy-ul aplicației este realizat prin intermediul platformei Vercel. Prin aceasta, am putut seta environmentul pe care să ruleze aplicația, adăugând cheile API ca variabile secrete, aplicație care poate fi accesată prin acest link: https://virus-scanner-app.vercel.app/ .

# 4. Flux de date

# Exemple de request / response

** Exemplu de request de tip POST care trimite un URL spre analiză motorului VirusTotal:
[https://www.virustotal.com/api/v3/urls](https://www.virustotal.com/api/v3/urls) (alături de header-ul x-apikey și body-ul de tip FormData conținând link-ul).

** Exemplu de request de tip GET care preia rezultatele detaliate ale scanării de la VirusTotal pe baza unui ID unic de analiză:
[https://www.virustotal.com/api/v3/analyses/](https://www.virustotal.com/api/v3/analyses/){id_analiză}

** Exemplu de request de tip POST care interoghează asistentul Gemini:
[https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=](https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=){API_KEY_GEMINI}

# Metode HTTP

Metodele HTTP folosite au fost:

POST pentru a trimite un URL nou către sistemul de analiză VirusTotal.

GET pentru a prelua periodic statusul și raportul final al scanării (malicious, suspicious, harmless).

POST pentru a trimite prompt-urile introduse de utilizator către asistentul de Inteligență Artificială (Gemini) și a primi răspunsul generat.

Interogări interne SDK (Echivalent GET/POST) pentru a citi istoricul utilizatorului logat din Firestore și pentru a adăuga documente noi în colecția "scans" la finalizarea unei analize.

# Autentificare și servicii utilizate

Cele mai importante trei API-uri care au fost integrate în cadrul aplicației Sistem Analiză Securitate necesită autentificare cu ajutorul unor API key-uri furnizate de serviciile respective, care se pot obține doar după ce utilizatorul își creează un cont pentru fiecare.

În cadrul platformei Google Firebase, utilizarea autentificării și a bazei de date Firestore este gratuită în limita pachetului "Spark" (free tier), care oferă suficiente resurse de stocare și lățime de bandă pentru utilizarea zilnică a aplicației fără a fi taxată adițional.

Utilizarea API-ului VirusTotal nu costă, însă pentru a primi API key-ul este nevoie de crearea unui cont pe platforma lor. Acest pachet gratuit este limitat la un anumit număr de request-uri pe minut/zi (standard 4 request-uri pe minut, 500 pe zi), aspect gestionat în aplicație prin arhivarea scanărilor în Firestore pentru a evita consumul inutil al cotei. Același lucru se aplică pentru Google Gemini API, unde este necesară crearea unui cont pe Google AI Studio și generarea unui key pentru a realiza procesul de generare a textelor, fiind de asemenea supus limitărilor impuse de varianta gratuită de acces.

# 5. Concluzii

Din perspectiva mea, proiectul "VirusScanner App" bazat pe cloud computing reprezintă o soluție inovatoare și utilă pentru a aduce instrumentele avansate de securitate (Threat Intelligence) într-o formă accesibilă și prietenoasă utilizatorilor de rând. Prin integrarea serviciilor în cloud și utilizarea unor tehnologii moderne, proiectul oferă o experiență fluidă și eficientă utilizatorilor săi, protejându-i de potențiale amenințări informatice.

Aplicația abordează problema lipsei de educație și a instrumentelor de verificare în mediul digital, având în vedere că doar un procent mic din populație deține cunoștințe avansate de securitate IT. Prin scanarea automată a linkurilor, interpretarea clară a rezultatelor și prezența unui asistent AI gata să explice orice termen, aplicația se adresează unui public larg și divers.

Utilizarea serviciilor cloud, cum ar fi VirusTotal, Google Gemini și Firebase Firestore, demonstrează beneficiile tehnologiei cloud în dezvoltarea și implementarea aplicațiilor, oferind acces la resurse de calcul uriașe fără a necesita putere de procesare locală. De asemenea, integrarea cu platforme precum GitHub și Vercel facilitează dezvoltarea, versionarea și distribuirea rapidă și sigură a aplicației.

În concluzie, "VirusScanner App" reprezintă un exemplu de succes al utilizării cloud computing pentru a aduce valoare și utilitate utilizatorilor într-un domeniu critic precum securitatea datelor. Aplicația oferă o experiență interactivă și informativă, facilitând navigarea în siguranță pe internet într-un mod accesibil și eficient.