let { create, compare, resolve, getSearch } = require("./dist/path-path");

describe("Test create and compare", () => {
    test("1: Static route", () => {
        let route = create("/");
        expect(compare(route, "/")).toEqual({});
    });

    test("2: Static route", () => {
        let route = create("/folder");
        expect(compare(route, "/folder")).toEqual({});
    });

    test("3: Static route", () => {
        let route = create("/folder");
        expect(compare(route, "/")).toBe(false);
    });

    test("4: With parameter", () => {
        let route = create("/:folder");
        expect(compare(route, "/hello")).toEqual({ folder: "hello" });
    });

    test("5: With parameters 2", () => {
        let route = create("/:folder1/:folder2");
        expect(compare(route, "/hello/world")).toEqual({
            folder1: "hello",
            folder2: "world"
        });
    });

    test("6: With parameters 100", () => {
        let value = {},
            pathname = "",
            current = "";
        for (let i = 0; i < 100; i++) {
            let param = "param_" + i,
                folder = "folder_" + i;
            pathname += "/:" + param;
            current += "/" + folder;
            value[param] = folder;
        }
        let route = create(pathname);

        expect(compare(route, current)).toEqual(value);
    });

    test("5: With optional parameter of multiple captures", () => {
        let route = create("/:folder1/:folder2...");
        expect(compare(route, "/hello/world/next")).toEqual({
            folder1: "hello",
            folder2: "/world/next"
        });
    });

    test("5: Static pathname any", () => {
        let route = create("/:folder1/**");
        expect(compare(route, "/hello/world")).toEqual({
            folder1: "hello"
        });
    });
});

describe("Test resolve", () => {
    test("1: merge by type parameter (:)", () => {
        expect(resolve("/parent-1/parent-2", "/child-1/:child-2")).toBe(
            "/child-1/parent-2"
        );
    });
    test("2: merge by parameter (:?)", () => {
        expect(resolve("/parent-1", "/child-1/:child-2?")).toBe("/child-1");
    });

    test("3: merge by parameter (:...)", () => {
        expect(
            resolve("/parent-1/parent-2/parent-3", "/child-1/:child-2...")
        ).toBe("/child-1/parent-2/parent-3");
    });

    test("4: merge by parameter (**)", () => {
        expect(resolve("/parent-1/parent-2/parent-3", "/child-1/**")).toBe(
            "/child-1/parent-2"
        );
    });
});

describe("Test getSearch", () => {
    test("1: merge by type parameter (:)", () => {
        expect(getSearch("id=10&url=www.example.com?id=100")).toEqual({
            id: "10",
            url: "www.example.com?id=100"
        });
    });

    test("2: merge by type parameter (:)", () => {
        expect(
            getSearch(
                "url_1=www.example.com?id=100&url_2=www.example.com?id=200&url_3=www.example.com?id=300"
            )
        ).toEqual({
            url_1: "www.example.com?id=100",
            url_2: "www.example.com?id=200",
            url_3: "www.example.com?id=300"
        });
    });
});
