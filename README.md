# AppCRM - Gestione Applicazioni

Un'applicazione web per la gestione e monitoraggio delle applicazioni aziendali, sviluppata con React, TypeScript e Supabase.

## 🚀 Caratteristiche

- **Dashboard Interattiva**: Visualizza statistiche e metriche delle tue applicazioni
- **Gestione Applicazioni**: Aggiungi, modifica ed elimina applicazioni con dettagli completi
- **Autenticazione Sicura**: Sistema di login basato su Supabase Auth
- **Design Moderno**: Interfaccia utente pulita e responsive
- **Database Integrato**: Utilizzo di Supabase per storage e autenticazione

## 🛠️ Tecnologie Utilizzate

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS personalizzato con variabili CSS
- **Icone**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Build Tool**: Vite

## 📋 Prerequisiti

- Node.js (versione 18 o superiore)
- Account Supabase
- Git

## 🚀 Installazione e Avvio

1. **Clona il repository**
   ```bash
   git clone https://github.com/tuo-username/appcrm.git
   cd appcrm
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura Supabase**
   - Crea un nuovo progetto su [Supabase](https://supabase.com)
   - Copia l'URL del progetto e la chiave anonima
   - Crea un file `.env.local` nella root del progetto:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Configura il Database**
   - Esegui lo script SQL in `schema.sql` nel SQL Editor di Supabase
   - Oppure usa le migrazioni di Supabase

5. **Avvia l'applicazione in modalità sviluppo**
   ```bash
   npm run dev
   ```

6. **Build per produzione**
   ```bash
   npm run build
   ```

## 📦 Deploy su Vercel

1. **Connetti il repository GitHub a Vercel**
   - Vai su [Vercel](https://vercel.com) e crea un nuovo progetto
   - Connetti il tuo repository GitHub
   - Vercel rileverà automaticamente che è un progetto Vite

2. **Configura le Environment Variables**
   - Nel dashboard di Vercel, vai alle impostazioni del progetto
   - Aggiungi le variabili d'ambiente:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   - Vercel effettuerà automaticamente il deploy ad ogni push
   - L'app sarà disponibile su un URL fornito da Vercel

## 📁 Struttura del Progetto

```
src/
├── components/
│   ├── Applications.tsx    # Gestione applicazioni
│   ├── Dashboard.tsx       # Dashboard principale
│   ├── Layout.tsx          # Layout dell'app
│   └── Login.tsx           # Modulo di login
├── lib/
│   └── supabase.ts         # Configurazione Supabase
├── App.tsx                 # Componente principale
├── App.css                 # Stili globali
└── main.tsx                # Entry point
```

## 🔧 Script Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Crea la build di produzione
- `npm run preview` - Anteprima della build
- `npm run lint` - Esegue ESLint

## 🤝 Contributi

Contributi sono benvenuti! Sentiti libero di aprire issue o pull request.

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT.

## 📞 Supporto

Per domande o supporto, apri una issue su GitHub.