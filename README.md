# TP-BDII-VetSalud

Para correr el TP se debe tener el archivo .env configurado. Se puede correr:

``` bash
cp .env.example .env
```

para tener uno propio basado en uno simple para github Codespaces. 

## Instrucciones para correr el TP

Primero levantar los contenedores de las bases de datos con (se levantan automaticamente si se usa Github Codespaces):

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

o

``` bash
npm run seed:mongo:extended
npm run seed:redis:extended
```

para mayor volumen de datos.

Finalmente, para una query sin argumentos correr: 

``` bash
node queries/<nombre archivo de query>
```

Estas son las queries sin argumentos: 1, 2, 4, 5, 6, 7, 8 y 9.

Las queries con un argumento son: 

``` bash
node queries/q3_historial_pacientes.js <id_paciente>
```

``` bash
node queries/q10_pacientes_por_sucursal.js <sucursal>
```

Las queries con dos argumentos son:

``` bash
node queries/q15_actualizar_stock.js <id_producto> <cantidad>
```