declare module "path-path"{
    export function getSearch(search: string, params?: Object={}):Object
    export function create(path: string):object
    export function resolve(origin: string, merge: string):string
    export function compare(route: Object, path: string, params?: Object={}) : Object | boolean
}