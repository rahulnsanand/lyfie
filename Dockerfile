# Stage 1: Build React Frontend
FROM node:20 AS node-builder
WORKDIR /app
COPY ./web/package*.json ./
RUN npm install
COPY ./web/ .
RUN npm run build

# Stage 2: Build .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-builder
WORKDIR /src
COPY ["api/api.csproj", "api/"] 
RUN dotnet restore "api/api.csproj"
COPY . .
WORKDIR "/src/api"
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Final Production Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=dotnet-builder /app/publish .
COPY --from=node-builder /app/dist ./wwwroot

RUN mkdir -p /app/data
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/lyfie.db"

EXPOSE 8080
ENTRYPOINT ["dotnet", "api.dll"]
