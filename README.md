# Actindo Middleware

ASP.NET 10 Middleware mit Responsive-Frontend fuer Actindo-Workflows. Die App kapselt Produkt-, Kunden-, Transaktions- und Medienprozesse, zeigt Job-Laeufe im Dashboard, erlaubt Replays und verwaltet Actindo-Credentials, Endpoints und API-Bearer-Tokens zentral in SQLite.

## Highlights
- Actindo-Workflows: Produkte/Varianten anlegen oder speichern, Bilder hochladen, Kunden anlegen/speichern, Transaktionen abrufen.
- Dashboard & Job Monitor: Live-Kacheln fuer Status/Fehler, Job-Tabelle mit Request/Response-JSON (scrollbar, Copy-Button), Replay/Delete, Actindo-Erreichbarkeit und Token-Gueltigkeit im Header.
- Products & Customers: Tabellen fuer alle erzeugten Produkte/Kunden (Actindo-ID, SKU, Name, Debitorennummer, Variantenhinweis), Suche mit Live-Filter, Refresh. Optionaler Sync-Vorlauf ueber Actindo `GET_PRODUCT_LIST` (Button aktuell deaktiviert, Endpoint konfigurierbar).
- Settings (Admin): Bearer/Refresh-Token, Actindo OAuth-Credentials, Actindo-Endpunkte (inkl. `GET_PRODUCT_LIST`) editierbar und in SQLite persistent.
- User & Roles: Login mit Session-Cookie, Rollen `read`/`write`/`admin`; Registrierungen via `register.html` werden in `users.html` vom Admin freigegeben/abgelehnt. Navigation zeigt den eingeloggten User und blendet Admin-Seiten nur bei Rolle `admin` ein.
- API-Schutz: Backend-Endpunkte akzeptieren Cookie-Login oder einen statischen Bearer-Token fuer Tools wie Postman.

## Architektur & Persistenz
- Framework: .NET 10, klassische Controller.
- Datenhaltung: SQLite `App_Data/dashboard.db` (prod) bzw. `App_Data/dashboard.dev.db` (Development) fuer Jobs, Settings, User, Registrierungen, Tokens und Actindo-Endpunkte.
- Frontend: Statische Seiten unter `wwwroot/` (`dashboard.html`, `jobs.html`, `products.html`, `customers.html`, `users.html`, `register.html`, `settings.html`, `login.html`) mit gemeinsamer Navbar und Blau/Weiss-Optik.

## Authentifizierung & Rollen
- Cookie-Login: `POST /auth/login` legt ein Session-Cookie. Rollen:
  - `read`: nur ansehen.
  - `write`: zusaetzlich Replay/Loeschen.
  - `admin`: alles inkl. User- und Settings-Verwaltung.
- Registrierung: `POST /auth/register` oder `register.html` legt einen offenen Antrag an; Admin entscheidet in `users.html`.
- Bootstrap: Falls noch keine User existieren: `POST /auth/bootstrap` erstellt den ersten Admin.
- Bearer fuer API-Clients: Header `Authorization: Bearer <token>`. Default-Token (aenderbar via Config `StaticBearer:Token`):
  `oS4rP1nXQk8sJ3hC7dG2zF9aVwB0YpLmR2tH8eQxU5bN7kZcA1fM6jTqE3vW9yL`
- Zugriff: Frontend-Seiten leiten ohne Login auf `login.html` um; Settings/Users nur fuer Admins.

## Wichtige Endpunkte
### Actindo-Proxies
- `POST /actindo/products/create` | `POST /actindo/products/save`
- `POST /actindo/products/image`
- `POST /actindo/customer/create` | `POST /actindo/customer/save`
- `POST /actindo/transactions/get`

### Dashboard & Monitoring
- `GET /dashboard/summary` (Kacheln + Actindo-Status)
- `GET /dashboard/jobs` | `POST /dashboard/jobs/replay` | `DELETE /dashboard/jobs`

### Produkte & Kunden
- `GET /products` (persistierte Produkte der Middleware)
- `GET /products/sync` (Vorlauf aus Actindo `GET_PRODUCT_LIST`, nur master/single)
- `GET /customers` (aus Job-Historie ermittelte Kunden)

### Auth / User / Registrierungen
- `POST /auth/login` | `POST /auth/logout` | `GET /auth/me`
- `POST /auth/bootstrap` (erster Admin)
- `POST /auth/register` (Neuregistrierung)
- `GET /users` | `POST /users/{id}/role`
- `GET /registrations` | `POST /registrations/{id}/approve` | `POST /registrations/{id}/reject`

### Settings
- `GET /settings` | `POST /settings`  
  Speichert Actindo OAuth (TokenEndpoint, ClientId/Secret), Access/Refresh-Token, Actindo-Endpunkte inkl. `GET_PRODUCT_LIST`.

## Konfiguration
- Basis-Config in `appsettings*.json` (OAuth-Defaults, ConnectionString, optional `StaticBearer:Token`). Laufzeitwerte fuer Tokens/Credentials/Endpoints werden in SQLite gepflegt und koennen im UI unter `settings.html` geaendert werden.
- Dateien unter `App_Data/` werden bei Bedarf angelegt. Bei Schemaaenderungen kann die DB geloescht werden (Datenverlust beachten), sie wird automatisch neu erstellt.

## Lokale Entwicklung
```powershell
dotnet restore
dotnet run
```
- Development nutzt `App_Data/dashboard.dev.db` und erlaubt Swagger/OpenAPI unter `/openapi`.
- Frontend unter `http://localhost:5094/` (`login.html` zuerst). Ohne Login erfolgt Redirect.
- API-Tests per Bearer: `curl -H "Authorization: Bearer <token>" http://localhost:5094/dashboard/summary`

## Weitere Hinweise
- Actindo-Erreichbarkeit wird im Header visualisiert; Token-Refresh laeuft taktgesteuert und kann manuell in `settings.html` angepasst werden.
- Job-Detailansichten zeigen Request/Response in scrollbaren Codebloecken mit Copy-Button.
- Product-Sync-Button ist aktuell deaktiviert, Endpunkt `GET_PRODUCT_LIST` ist dennoch in Settings/DB hinterlegt.
