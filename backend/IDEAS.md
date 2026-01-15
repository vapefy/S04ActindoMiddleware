# IDEAS - Next Features for ActindoMiddleware

Aktueller Stand (kurz):
- REST Endpoints fuer Produkte/Kunden/Transaktionen/Medien
- OAuth Token Handling + persistiertes Refresh-Token
- SQLite Job-Historie inkl. Actindo Exchange Logs
- Modernes Frontend: Dashboard KPIs + Job Monitor + Replay (API Payload editierbar)

Unten sind neue Ideen, die den bestehenden Funktionsumfang sinnvoll erweitern, ohne das aktuelle Frontend/Backend zu duplizieren.

## 1) Erweiterte Suche, Filter und Saved Views (Job Monitor)
Ziel: In echten Fehler-Phasen schnell die relevanten Jobs finden (statt "letzte 20").

Frontend:
- Suchleiste (freier Text) ueber Endpoint, Error-Message und optional ueber JSON Payloads (API + Actindo Exchanges).
- Filter-Chips: Typ (Product/Customer/Transaction/Media), Status (OK/Fehler), Zeitfenster (letzte 1h/24h/7d), "nur Jobs mit Actindo-Fehlern".
- Saved Views: gespeicherte Filtersets (z.B. "Transaction Fehler letzte 24h") in `localStorage`, schnell per Dropdown umschalten.
- Pagination/Infinite Scroll: sauberes Nachladen statt harter `limit=20`.

Backend:
- `GET /dashboard/jobs` erweitert um Query-Parameter wie `from`, `to`, `cursor`/`before`, `q` (Text), `success`, `type`.
- Optional: extra Endpoint fuer "Counts by filter" (z.B. fuer UI-Badges).
- SQLite: sinnvolle Indizes (CompletedAt, Success, Type, Endpoint) und optional FTS (Full-Text Search) fuer Payload-Felder.

Akzeptanz:
- Ein konkreter Fehlerjob ist in < 10 Sekunden auffindbar (auch bei vielen Jobs).

## 2) Payload Diff + sichere Maskierung (Redaction)
Ziel: Replay sicherer machen und Aenderungen transparent darstellen.

Frontend:
- Neben dem Replay-Editor: Diff-Ansicht "Original vs Editiert" (side-by-side oder unified) fuer JSON.
- Toggle "Mask sensitive fields": Client-seitig Secrets/PII maskieren (z.B. `clientSecret`, `password`, `email`, `iban`, `token`) ohne das Original zu verlieren.
- Copy-Button kann wahlweise "masked" oder "raw" kopieren (Default: raw, aber klar beschriftet).

Backend:
- Zentraler Redaction-Helper, der vor Persist/Log bestimmte JSON-Pfade maskiert (konfigurierbare Liste).
- Option: Unmaskierte Payloads nur in SQLite behalten, aber nie in Console Logs schreiben.

Akzeptanz:
- Jede Replay-Aktion zeigt klar, was am Payload geaendert wurde.
- Keine Secrets landen versehentlich im Log.

## 3) Retry Queue mit Backoff + Circuit Breaker (Stabilitaet bei Actindo-Ausfall)
Ziel: Wenn Actindo nicht erreichbar ist, sollen Requests kontrolliert "geparkt" und spaeter wiederholt werden.

Frontend:
- Neue KPI-Kachel: "Queued Retries" + "Next retry in ...".
- Job-Detail: Retry Policy (naechster Versuch, Anzahl Versuche, letzter Fehler).
- Schalter pro Job: "Auto-Retry an/aus" (nur fuer whitelisted Endpoints, z.B. Media Upload).

Backend:
- Retry-Engine: Exponentieller Backoff, Max-Versuche, Jitter, klare Abbruchkriterien.
- Circuit Breaker: Bei Connectivity-Fehlern kurzzeitig "open", um Actindo nicht zu fluten.
- SQLite Tabellen fuer Retry-State (JobId, NextAttemptAt, Attempts, LastError, Enabled).

Akzeptanz:
- Bei Actindo-Timeouts bleibt die App stabil und erzeugt keine unkontrollierten Request-Stuerme.

## 4) Diagnostics Center (Self-Check & Support Bundle)
Ziel: Support/Operations koennen Probleme ohne Serverzugriff eingrenzen.

Frontend:
- Seite "Diagnostics": Buttons fuer "Test Actindo Connectivity", "Test OAuth", "Test SQLite", "Show config summary (masked)".
- "Download Support Bundle": ZIP mit anonymisierten Jobs (letzte N), Konfig (masked), Build-Version, Environment, Actindo Status.

Backend:
- `GET /diagnostics` (read-only) mit Checks + Latenzen + Fehlermeldungen.
- `GET /diagnostics/bundle` streamt ein Bundle (ohne Secrets).

Akzeptanz:
- Ein User kann ein Ticket mit Bundle erstellen, ohne manuelle Log-Sammlung.

## 5) Environment Profiles (Dev/Test/Prod) + Base-URL entkoppeln
Ziel: Nicht alle Endpoints hart auf eine Domain fest verdrahten und zwischen Umgebungen wechseln koennen.

Frontend:
- Profile Selector (lokal, ohne Login): zeigt aktive Umgebung (Name, BaseUrl), klare Warnfarbe wenn "Prod".

Backend:
- `ActindoEndpoints` umbauen: BaseUrl aus Config + relative Module-Pfade.
- Profiles in `appsettings*.json` oder optional in SQLite (lokal) mit Validation/Whitelist.

Akzeptanz:
- Umgebungswechsel ohne Code-Aenderung, weniger Deploy-Risiko.

## 6) Data Quality Gate (Schema/Business Rules vor dem Send)
Ziel: Viele Fehler entstehen durch unvollstaendige/inkonsistente Payloads und lassen sich frueh abfangen.

Frontend:
- Im Replay/Ad-hoc Editor: "Validate" Button, der Regeln prueft und klare Fehlermeldungen zeigt (inkl. JSON-Pfad).

Backend:
- Validations: Pflichtfelder, Laengen, Enum-Werte, einfache Business-Regeln (z.B. SKU not empty, Inventory >= 0).
- Validation Errors als strukturierte JSON Errors zurueckgeben und als Job-Fehler speichern.

Akzeptanz:
- Weniger "Actindo rejected payload" Fehler und schnelleres Feedback fuer User.

