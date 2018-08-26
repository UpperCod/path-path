const CAPTURE = /^\:([^\?\.]+)(\?|(?:\.){3}){0,1}$/;
const FOLDERS = /([^\/]+)/g;
const FOLDER = "[^\\/]";
const SPLIT = "(?:\\/){0,1}";

export function getSearch(search, params = {}) {
    search = search.replace("?", "").match(/[^\&]+/g) || [];
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
    let foldersOrigin = origin.match(FOLDERS),
        foldersMerge = merge.match(FOLDERS),
        folders = [""];

    for (let i = 0; i < foldersMerge.length; i++) {
        let merge = foldersMerge[i],
            origin = foldersOrigin[i],
            status = merge.match(CAPTURE),
            option = status ? status[2] : merge;

        switch (option) {
            case "?":
                if (origin) folders.push(origin);
                break;
            case "...":
                folders = folders.concat(foldersOrigin.slice(i));
                break;

            default:
                folders.push(
                    status
                        ? origin || option
                        : option === "**"
                            ? origin
                            : option
                );
        }
    }
    return folders.join("/");
}

export function compare(router, path, params = {}) {
    let query = path.match(/([^\?]+)(.*)/);
    if (query[2]) {
        params.query = getSearch(query[2]);
        path = query[1];
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
