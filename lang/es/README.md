# path-path

Crea una expresión regular para comparar pathnames a base comodines, similar a como lo realiza **Express.js**.

## create( path: string ):{ path: string, regExp: RegExp, params: array }

Esta función permite transformar la expresión a base de comodines a una expresión regular, con captura de parámetros, esta retorna un objeto que se compone de las siguientes propiedades:

* path : {string}, es el origen de la expresión.
* regExp : {RegExp}, es la expresión regular creada a base de `path`.
* params : {array}, son los parámetros asociados al `path`.

### Pathname estático

```js
import {create} from "path-path";
create("/folder")
```

### Pathname con parámetro

```js
import {create} from "path-path";
create("/:folder")
```

### Pathname con parámetro opcional

```js
import {create} from "path-path";
create("/:folder?")
```

### Pathname con parametro opcional de múltiples capturas

```js
import {create} from "path-path";
create("/folder/:any...")
```


### Pathname estático any

```js
import {create} from "path-path";
create("/folder/**")
```

## getSearch( search: string, params?: Object = {} )

permite obtener de una URL, los parámetros `search` asociados a ella.

```js
import {getSearch} from "path-path";
getSearch("id=10&url=www.example.com?id=100") // {id: 10, url: "www.example.com?id=100"}
```

## compare( route: return create, path: string, params?: = {} )

Verifica si `path` es una ruta válida para `route`, este también obtiene los parámetros search de la ruta, de ser verdadera la comparación retorna un objeto con los parámetros de la ruta.

```js
import {create, compare} from "path-path";

let route = create("/folder/:subfolder");

compare(route,"/parent/child") // {subfolder: "child"}
compare(route,"/parent") // false

```
## resolve(origin: string, merge:string)

Permite promediar 2 pathname tomado como base merge, esta función trabaja con las mismas expresiones asociadas a `create`.

```js
import {resolve} from "path-path";

resolve("/parent/child","/**/next") // "/parent/next"

resolve("/parent/child/subchild","/parent/:any...") // "/parent/child/subchild"

resolve("/parent/child","/**") // "/parent"
```