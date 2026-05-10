# Virus Scanner App

** Link aplicatie vercel: https://virus-scanner-app.vercel.app/
** Link aplicatie GitHub: https://github.com/stefanx132/VirusScannerApp
** Link aplicatie Youtube: https://youtu.be/RFTUDMi00z8

# 1. Introducere

Internetul și tehnologia digitală au transformat radical și ireversibil modul în care societatea interacționează, lucrează și își gestionează viața de zi cu zi. Odată cu migrarea masivă a serviciilor esențiale în mediul online – de la operațiuni bancare și comerț electronic, până la comunicarea de zi cu zi – spațiul digital a devenit o țintă extrem de atractivă pentru actorii rău intenționați. Astfel, am fost martorii unei creșteri exponențiale a amenințărilor cibernetice, care au evoluat rapid de la simpli viruși informatici la atacuri complexe de tip phishing, ransomware sau tehnici avansate de inginerie socială.

Din păcate, gradul de sofisticare a acestor atacuri depășește adesea nivelul de cunoștințe tehnice al utilizatorului de rând. Un link primit printr-un simplu email sau un mesaj pe rețelele de socializare poate părea perfect legitim, ascunzând însă capcane capabile să compromită date personale și financiare sensibile. În această lume vastă a pericolelor online, factorul uman devine adesea veriga cea mai slabă. De aceea, fiecare utilizator are nevoie de un instrument de încredere care să acționeze ca un filtru și să îi ofere siguranță înainte de a face un simplu click.

Prin urmare, instrumentele moderne de analiză a securității au depășit stadiul de simple programe care rulează ascuns în fundal. Astăzi, ele au devenit nu doar mijloace proactive de protecție, ci și unelte vitale de educare și conștientizare. Explicând în mod transparent și accesibil de ce o anumită resursă este periculoasă, aceste soluții transformă utilizatorul dintr-o potențială victimă într-un navigator informat, oferindu-ne tuturor o fereastră către un mediu online mult mai sigur.

# 2. Descrierea problemei

Atacurile de tip phishing și distribuția de malware prin intermediul link-urilor frauduloase reprezintă în prezent principala cauză a compromiterii datelor cu caracter personal și financiar. De cele mai multe ori, aceste amenințări sunt concepute pentru a imita perfect paginile web legitime ale unor instituții de încredere, manipulând vizual și psihologic victima. Problema majoră constă în faptul că o mare parte din populație nu deține educația digitală sau instrumentele tehnice necesare pentru a verifica manual siguranța și integritatea unei resurse web înainte de a o accesa. Astfel, utilizatorii simpli devin extrem de vulnerabili în fața atacatorilor care exploatează o simplă neatenție sau lipsa de vigilență.

Pentru a remedia această vulnerabilitate, proiectul de față propune o soluție tehnică prin care orice persoană poate verifica instantaneu un URL suspect. Sistemul preia datele de securitate și le traduce într-un format vizual clar și ușor de interpretat, afișând numărul exact de detecții malițioase sau suspecte. Mai mult, pentru a asigura o funcționare eficientă și a optimiza la maximum consumul de resurse și timpii de așteptare impuși de interfețele de programare externe, aplicația a fost dotată cu un mecanism inteligent de stocare. Fiecare interogare nouă este arhivată automat într-o bază de date NoSQL în cloud, denumită Firestore. În momentul în care se inițiază o nouă scanare pentru același link, sistemul ocolește cererea externă și extrage instantaneu rezultatul din arhivă, oferind un răspuns în fracțiuni de secundă.

Pe lângă componenta tehnică de scanare și arhivare, aplicația integrează un asistent virtual bazat pe inteligență artificială, conceput pentru a oferi suport permanent. Acest modul interactiv nu se limitează doar la o simplă afișare de date, ci are rolul de a explica termeni tehnici complicați într-un limbaj natural și accesibil oricui. Prin intermediul acestui asistent, aplicația își depășește statutul de simplu utilitar, devenind o platformă educațională care îndrumă utilizatorii cu privire la bunele practici de securitate cibernetică și îi ajută să înțeleagă proactiv mecanismele din spatele atacurilor online.

# 3. Descriere API

În cadrul aplicației au fost folosite următoarele 3 servicii majore în cloud, prin intermediul unui API REST și a SDK-urilor specifice:

VirusTotal API, prin care am accesat informații și analize de securitate despre adresele URL introduse de utilizator. API-ul a fost integrat în aplicație nativ, folosind funcția fetch din JavaScript. Pentru a ne putea folosi de acest serviciu, aplicația face request-uri de tip POST pentru a trimite link-ul la analiză, iar Google (Alphabet) returnează un ID. Mai apoi, prin request-uri de tip GET, preluăm raportul final care este afișat pe ecran clientului.

Google Gemini API, pe care l-am folosit pentru a integra un asistent de inteligență artificială direct în panoul de control. Am comunicat cu modelul gemini-3-flash-preview printr-un endpoint REST. Aici, mesajele utilizatorului sunt transmise pentru a fi procesate, iar API-ul returnează răspunsuri contextuale despre securitate. Acesta este transmis ca răspuns către client și afișat în fereastra de chat.

Firebase (Auth & Firestore), drept soluție completă de Backend-as-a-Service (BaaS) și bază de date NoSQL scalabilă și flexibilă, ideală pentru stocarea și gestionarea istoricului de scanări. Prin integrarea SDK-ului Firebase în JavaScript, am putut realiza operațiile CRUD necesare pentru gestionarea conturilor de utilizatori și a datelor scanate. Utilizând Firestore, m-am asigurat că aplicația poate gestiona eficient datele și poate oferi o experiență rapidă, preluând instant rezultatele arhivate.

# Tehnologii folosite

Lumea nu poate trăi fără aplicații mobile și web securizate în zilele noastre. Totul este digitizat, de la tranzacții bancare la comunicare, iar acest lucru atrage nenumărate amenințări. Datorită instrumentelor moderne de dezvoltare care oferă o experiență intuitivă, ne putem proteja mai ușor printr-o interfață clară și ușor de folosit.

Interfața aplicației este realizată folosind tehnologii web standard (HTML și JavaScript), structurate astfel încât să asigure o navigare fluidă, fără a bloca ecranul utilizatorului în timpul încărcării datelor. Pentru partea de design am optat pentru soluții moderne de stilizare, care permit crearea unor pagini web atrăgătoare și care se adaptează perfect pe orice dimensiune de ecran, fie că vorbim de telefon sau calculator. Aceste instrumente ne-au ajutat să implementăm rapid un design elegant și modern, de tip „Dark Mode” (mod întunecat), bazat pe elemente vizuale cu ușoare transparențe, oferind un aspect profesional.

Sistemul din spatele aplicației (baza de date) este delegat complet către infrastructura Firebase, funcționând direct în mediul cloud. Aceasta ne permite să folosim mediul securizat furnizat de Google pentru a gestiona conturile utilizatorilor și a stoca arhiva de scanări, eliminând astfel necesitatea de a configura și întreține un server fizic propriu.

Pentru organizarea și salvarea codului sursă am folosit platforma GitHub, iar publicarea aplicației pe internet a fost realizată prin intermediul serviciului Vercel. Această platformă ne-a permis să configurăm un mediu de lucru sigur, unde parolele și cheile de acces ale aplicației sunt protejate și ascunse de public. În acest fel, aplicația a fost lansată cu succes și poate fi accesată prin următorul link: https://virus-scanner-app.vercel.app/ .

# 4. Flux de date

Exemplu de request de tip POST care trimite un URL spre analiză motorului VirusTotal:

(https://www.virustotal.com/api/v3/urls) (alături de header-ul x-apikey și body-ul de tip FormData conținând link-ul).

** Exemplu de request de tip GET care preia rezultatele detaliate ale scanării de la VirusTotal pe baza unui ID unic de analiză:

(https://www.virustotal.com/api/v3/analyses/){id_analiză}

** Exemplu de request de tip POST care interoghează asistentul Gemini:
(https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=){API_KEY_GEMINI}

# Metode HTTP

Metodele HTTP folosite au fost:

POST pentru a trimite un URL nou către sistemul de analiză VirusTotal.

GET pentru a prelua periodic statusul și raportul final al scanării (malicious, suspicious, harmless).

POST pentru a trimite prompt-urile introduse de utilizator către asistentul de Inteligență Artificială și a primi răspunsul generat.

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

# Referințe

https://docs.virustotal.com/reference/overview
https://ai.google.dev/docs
https://firebase.google.com/docs/web/setup
https://vercel.com/docs
https://sigurantaonline.ro/politia-romana-dnsc-arb-si-mastercard-lanseaza-campania-nationala-uniti-impotriva-escrocheriilor/
https://sigurantaonline.ro/spear-phishing-ce-este-si-cum-ne-putem-proteja/
https://www.enisa.europa.eu/topics/cyber-threats
https://dnsc.ro/
https://www.europol.europa.eu/publications-events/main-reports/iocta-report