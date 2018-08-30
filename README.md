# path-path

Create a regular expression to compare pathnames based on wildcards, similar to how **Express.js** does it, all in <760 bytes gzip.

## create( path: string ):{ path: string, regExp: RegExp, params: array }

This function allows transforming the expression based on wildcards to a regular expression, with capture of parameters, this returns an object that is composed of the following properties:

* path : {string},  Is the origin of the expression.
* regExp : {RegExp}, Is the regular expression create from `path`.
* params : {array}, Are the parameters associative with the `path`

### Static pathname

```js
import {create} from "path-path";
create("/folder")
```

### Pathname with parameter

```js
import {create} from "path-path";
create("/:folder")
```

### Pathname with optional parameter

```js
import {create} from "path-path";
create("/:folder?")
```

### Pathname with optional parameter of multiple captures

```js
import {create} from "path-path";
create("/folder/:any...")
```


### Static pathname any

```js
import {create} from "path-path";
create("/folder/**")
```

## getSearch( search: string, params?: Object = {} )

allows to obtain from a URL, the `search` parameters associated with it.

```js
import {getSearch} from "path-path";
getSearch("id=10&url=www.example.com?id=100") // {id: 10, url: "www.example.com?id=100"}
```

## compare( route: return create, path: string, params?: = {} )

Verify if `path` is a valid route for `route`, it also obtains the search parameters of the route, if true, the comparison returns an object with the parameters of the route.

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

## join(a:string,b:string)

It allows joining 2 path, averaging the intersection with the slash character **"/"**.

```js
import {join} from "path-path";

join("/a","/b") // /a/b
join("/a","b") // /a/b
join("/a/","b") // /a/b
```