const CAPTURE = /^\:([^\?\.]+)(\?|(?:\.){3}){0,1}$/;
const FOLDERS = /([^\/]+)/g;
const FOLDER = "[^\\/]";
const SPLIT = "(?:\\/){0,1}";

export function join(a = "", b = "") {
    return (a + "<?>" + b).replace(/(\/){0,1}\<\?\>(\/){0,1}/, "/");
}

function relative(str) {
    let dotdot = /\/[^\/]+\/(\.){2}/,
        dot = /\/(\.){1}/;
    str = str.replace(dotdot, "");
    if (dotdot.test(str)) str = relative(str);
    str = str.replace(dot, "");
    if (dotdot.test(str)) str = relative(str);
    return str;
}

export function getSearch(search, params = {}) {
    search = search.match(/[^\&]+/g) || [];
    return search.reduce((params, item) => {
        let position = item.search("="),
            param = item.slice(0, position >>> 0),
            value = position > -1 ? item.slice(position + 1) : undefined;
        params[param] = value;
        return params;
    }, params);
}

export function create(path) {
    let folders = ["^"],
        params = [],
        status = path.match(FOLDERS);
    if (status) {
        status.some(folder => {
            let status = folder.match(CAPTURE);
            if (status) {
                let [all, param, option] = status;
                params.push(param);
                switch (option) {
                    case "?":
                        folders.push(`${SPLIT}(${FOLDER}*)`);
                        break;
                    case "...":
                        folders.push(`(.*)`);
                        return true;
                    default:
                        folders.push(`\\/(${FOLDER}+)`);
                }
            } else {
                folders.push(
                    `\\/${
                        folder == "**"
                            ? `${FOLDER}+`
                            : folder.replace(/([^\w\d])/g, "\\$1")
                    }`
                );
            }
        });
    } else {
        folders.push(SPLIT);
    }
    return {
        path: path,
        regExp: RegExp(folders.join("") + "$"),
        params
    };
}

export function resolve(origin, merge) {
    let folders = [""];

    merge =
        merge[0] === "/"
            ? merge
            : origin + (origin[origin.length] === "/" ? "" : "/") + merge;

    origin = origin.match(FOLDERS) || [];
    merge = relative(merge).match(FOLDERS) || [];

    for (let i = 0; i < merge.length; i++) {
        let status = merge[i].match(CAPTURE),
            option = status ? status[2] : merge[i];

        switch (option) {
            case "?":
                if (origin[i]) folders.push(origin[i]);
                break;
            case "...":
                folders = folders.concat(origin.slice(i));
                break;
            default:
                folders.push(
                    status || merge[i] === "**" ? origin[i] : merge[i]
                );
        }
    }

    return folders.join("/");
}

export function compare(router, path, params = {}) {
    let query = path.match(/(?:\/){0,1}\?(.*)/);
    if (query) {
        params.query = getSearch(query[1]);
        path = path.slice(0, query.index);
    }
    let status = path.match(router.regExp);

    if (status) {
        status.slice(1).forEach((value, index) => {
            params[router.params[index]] = value;
        });
        return params;
    } else {
        return false;
    }
}
