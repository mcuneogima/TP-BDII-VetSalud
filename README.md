# TP-BDII-VetSalud

Para correr el TP se debe tener el archivo .env configurado. Se puede correr:

``` bash
cp .env.example .env
```

para tener uno propio basado en uno simple para github Codespaces. 

## Instrucciones para correr el TP

Primero levantar los contenedores de las bases de datos con:

``` bash
docker compose up -d
```

Para instalar dependencias correr:

``` bash
npm i
```

Luego, correr los seeds para ambas bases con:

``` bash
npm run seed:mongo
npm run seed:redis
```

Luego para una query sin argumentos correr: 

``` bash
node queries/<nombre archivo de query>
```