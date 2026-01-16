# Stage 1: Build React Frontend (Vite)
FROM node:20 AS node-builder
WORKDIR /app
# Path: LYFIE/web/
COPY web/package*.json ./
RUN npm install
COPY web/ .
RUN npm run build

# Stage 2: Build .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-builder
WORKDIR /src

# Copy project files using exact paths from root
# Path: LYFIE/api/lyfie.api/lyfie.api.csproj
COPY ["api/lyfie.api/lyfie.api.csproj", "api/lyfie.api/"]
COPY ["api/lyfie.core/lyfie.core.csproj", "api/lyfie.core/"]
COPY ["api/lyfie.data/lyfie.data.csproj", "api/lyfie.data/"]

# Restore based on the main entry project
RUN dotnet restore "api/lyfie.api/lyfie.api.csproj"

# Copy the rest of the source code
COPY . .

# Move into the specific project folder to publish
WORKDIR "/src/api/lyfie.api"
RUN dotnet publish "lyfie.api.csproj" -c Release -o /app/publish

# Stage 3: Final Production Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=dotnet-builder /app/publish .
# Vite builds to 'dist' by default; copy it to .NET's static files folder
COPY --from=node-builder /app/dist ./wwwroot

# Setup SQLite persistence
RUN mkdir -p /app/data
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/lyfie.db"

EXPOSE 8080
ENTRYPOINT ["dotnet", "lyfie.api.dll"]
