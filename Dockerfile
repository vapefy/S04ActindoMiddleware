# =============================================================================
# Multi-stage build: Frontend (Node) + Backend (.NET)
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build Frontend
# -----------------------------------------------------------------------------
FROM node:22-alpine AS frontend-build
WORKDIR /frontend

# Install dependencies first (better caching)
COPY frontend/package.json ./
COPY frontend/package-lock.json* ./
RUN npm install

# Build frontend
COPY frontend/ ./
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Build Backend
# -----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src

# Restore dependencies first (better caching)
COPY backend/*.csproj ./
RUN dotnet restore

# Build and publish
COPY backend/ ./
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# -----------------------------------------------------------------------------
# Stage 3: Final Runtime Image
# -----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/publish .

# Copy frontend build to wwwroot
COPY --from=frontend-build /frontend/build ./wwwroot

# Configure ASP.NET
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ActindoMiddleware.dll"]
