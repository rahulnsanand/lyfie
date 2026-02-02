# Stage 1: Build React Frontend
FROM node:20 AS node-builder
WORKDIR /app
COPY web/package*.json ./
RUN npm install
COPY web/ .
RUN npm run build

# Stage 2: Build .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dotnet-builder
WORKDIR /src
COPY ["api/lyfie.api/lyfie.api.csproj", "api/lyfie.api/"]
COPY ["api/lyfie.core/lyfie.core.csproj", "api/lyfie.core/"]
COPY ["api/lyfie.data/lyfie.data.csproj", "api/lyfie.data/"]
RUN dotnet restore "api/lyfie.api/lyfie.api.csproj"
COPY . .
WORKDIR "/src/api/lyfie.api"
RUN dotnet publish "lyfie.api.csproj" -c Release -o /app/publish

# Stage 3: Final Production Image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=dotnet-builder /app/publish .
COPY --from=node-builder /app/dist ./wwwroot

# Create directories for persistence
# 1. /app/data for the SQLite DB
# 2. /app/keys for Argon2/Cookie session persistence
RUN mkdir -p /app/data /app/keys

# Environmental Variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/lyfie.db"
# This tells the app where to find the persistence keys
ENV DATA_PROTECTION_PATH=/app/keys 

EXPOSE 8080
ENTRYPOINT ["dotnet", "lyfie.api.dll"]
