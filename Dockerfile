# 1. Build React App
FROM node:20 AS node-builder
WORKDIR /app
COPY ./lyfie-web/package*.json ./
RUN npm install
COPY ./lyfie-web/ .
RUN npm run build

# 2. Build .NET App
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-builder
WORKDIR /src
COPY ["lyfie.api/lyfie.api.csproj", "lyfie.api/"]
RUN dotnet restore "lyfie.api/lyfie.api.csproj"
COPY . .
WORKDIR "/src/lyfie.api"
RUN dotnet publish -c Release -o /app/publish

# 3. Final Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=dotnet-builder /app/publish .
# Copy React build into .NET's static files folder
COPY --from=node-builder /app/dist ./wwwroot 
ENTRYPOINT ["dotnet", "lyfie.api.dll"]