# Project Setup

This app uses **Node v18.20.3**.

### Local Development

1. Install dependencies:
   
```
   npm install
```
  
2. Run the app:
```
   npm run dev
```
### Using Docker (for Node version mismatch)
   
```
   docker-compose up --build
```
### Run app: 
```
http://localhost:5173/
```
## Holiday file:
Path in project:
```
   public/holidays.csv
```
Content: 
```
   holiday,date,repeat
   Praznik dela,1.5.,True
   Praznik dela,2.5.,True
   Novo leto,1.1.,True
   Silvestrovo, 31.12.,True
   Božič,25.12.,True
   Prešernov dan,8.2.,True
   Velika noč,31.3.2024,False
   Dan upora, 27.4.,True
   Dan državnosti,25.6.,True
   Dan reformacije,31.10.,True
   Dan spomina na mrtve,1.11.,True
   Dan samostojnosti in enotnosti,26.12.,True
   Binkoštna nedelja,19.5.2024,False
```