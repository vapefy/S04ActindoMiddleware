# Actindo Middleware

Eine .NET 10 Minimal-API, die Produkt-, Kunden-, Transaktions- und Medien-Workflows zwischen NAV/ERP und Actindo kapselt. Die Middleware stellt klar definierte REST-Endpunkte bereit, übernimmt OAuth, Logging, Datenabbildungen und kümmert sich um parallele Synchronisation von Varianten und Inventurdaten.

## Funktionsumfang

- **Produktanlage / -aktualisierung** (`/actindo/products/create|save`): Legt Actindo-Produkte inkl. Varianten, Inventur und INDI-Sonderlogik an oder aktualisiert sie.
- **Produktbilder** (`/actindo/products/image`): Lädt Base64-kodierte Dateien ins Actindo-ECM und verknüpft sie mit dem Produkt.
- **Kundenanlage / -aktualisierung** (`/actindo/customer/create|save`): Erstellt/speichert Kundenstammdaten und Primäradresse.
- **Transaktionsliste** (`/actindo/transactions/get`): Gibt Business-Dokumente nach Datum direkt aus Actindo zurück.
- **OAuth-Automation**: `Infrastructure/Actindo/Auth` verwaltet Access/Refresh-Token inkl. persistiertem Refresh-Token (`.actindo-refresh-token`).
- **Umfassendes Logging**: Jeder externe Call schreibt Payload und Antwort in das ASP.NET-Logging (siehe `ActindoClient` + Services).

## Voraussetzungen

- .NET SDK 10 (mindestens 10.0.100)
- Zugriff auf die Actindo-APIs und gültige OAuth-Credentials
- Schreibrechte im Projektverzeichnis (für `.actindo-refresh-token`)
- Optional: Docker (24.x) für Container-Builds

## Projektstruktur (Auszug)

```
Application/
 ├── DTOs/…           (Produkt-, Kunden-, Request/Response-Modelle)
 └── Services/…       (Produkt-, Kunden-, Transaktions-, Bild-Workflows)
Controllers/           (ASP.NET MVC-Controller mit REST-Endpunkten)
Infrastructure/
 ├── Actindo/…        (HTTP-Client, OAuth-Service, Optionen)
 └── Serialization/…  (Hilfsklassen, z. B. EmptyStringJsonConverter)
Program.cs             (Host-Konfiguration, DI, Swagger)
Dockerfile             (Multi-Stage .NET Build & Runtime)
README.md              (diese Datei)
```

## Konfiguration

Die OAuth-Settings liegen in `appsettings.json` bzw. `appsettings.Development.json`:

```json
"ActindoOAuth": {
  "TokenEndpoint": "https://…/OAuth2Token.getAccessToken",
  "ClientId": "…",
  "ClientSecret": "…",
  "RefreshTokenFilePath": ".actindo-refresh-token"
}
```

- `RefreshTokenFilePath` kann absolut oder relativ gesetzt werden. Standard ist eine Datei im Projektstamm.
- Beim ersten Lauf muss der Service über den `ActindoAuthController` (Exchange Authorization Code) initialisiert werden, damit ein Refresh-Token persistiert wird.

## Lokale Entwicklung

```powershell
# Restore + Build
dotnet restore
dotnet build

# Start im Development-Modus mit HTTPS + Swagger
dotnet run
```

Swagger/OpenAPI ist im Development-Environment unter `/swagger` erreichbar.

### Wichtige Endpunkte

| Route                           | Beschreibung                                     |
|--------------------------------|---------------------------------------------------|
| `POST /actindo/products/create`| Neues Produkt inkl. Varianten anlegen             |
| `POST /actindo/products/save`  | Bestehendes Produkt + Varianten speichern         |
| `POST /actindo/products/image` | Bilder hochladen und verknüpfen                   |
| `POST /actindo/customer/create`| Kundenstamm + Primäradresse anlegen               |
| `POST /actindo/customer/save`  | Kundenstamm + Primäradresse aktualisieren         |
| `POST /actindo/transactions/get`| Actindo-Business-Dokumente filtern               |
| `POST /actindo/auth/token`     | Authorization Code gegen Token tauschen           |

Die Request-/Response-Schemas liegen in `Application/DTOs/Requests` und `…/Responses`.

## Parallelisierung & Performance

- Varianten laufen in `ProductSynchronizationService` parallel (max. 4 Threads), um lange Produktläufe zu verkürzen.
- Inventur-POSTs werden in eine Channel-Queue gelegt und von drei dedizierten Workern abgearbeitet, damit sie Varianten nicht blockieren.
- Vorteil: Gesamtzeit ≈ `max(variante)` statt Summe aller Varianten; Inventuren laufen unabhängig weiter.

## Logging

- **Payload-Logging**: Jeder Actindo-Call loggt Endpoint + JSON (Info-Level) vor dem Request.
- **Response-Logging**: Statuscode + Body werden ebenfalls geloggt.
- **Fehler**: Exceptions werden inkl. SKU/Context (z. B. Variantensync, Inventur) erfasst.
- Konfiguration der Log-Level erfolgt über `appsettings*.json`.

## Docker

Build & Run (Linux):

```bash
docker build -t actindo-middleware .
docker run --rm -p 8080:8080 \
  -v $(pwd)/appsettings.json:/app/appsettings.json \
  -v $(pwd)/.actindo-refresh-token:/app/.actindo-refresh-token \
  actindo-middleware
```

Der Container lauscht auf Port 8080 (`ASPNETCORE_URLS=http://+:8080`). Für HTTPS muss ein Reverse-Proxy (Traefik, Nginx) vorgeschaltet oder ASP.NET entsprechend konfiguriert werden.

## Sicherheitshinweise

- Refresh-Token-Datei und AppSettings enthalten sensible Daten – auf sichere Dateirechte achten.
- Logs enthalten Payloads inkl. Credentials/IDs – nur geschützte Speicherpfade verwenden.
- Bei Deployments in Produktion sollten Secrets (ClientId/Secret) über Environment-Variablen oder Secret-Stores injiziert werden.

## Erweiterungen / TODO

- Optional: Job-basierte Verarbeitung für extrem große Produktbatches.
- Health-Checks & Observability (Prometheus/OpenTelemetry) ergänzen.
- Tests (Unit/Integration) sobald stabile API-Stubs verfügbar sind.

Bei Fragen oder Erweiterungswünschen siehe Issues bzw. Ansprechpartner im Projektteam.
