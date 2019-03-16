var path = require("path")
var filesize = require("rollup-plugin-filesize")
var typescript = require("rollup-plugin-typescript2")
var commonjs = require("rollup-plugin-commonjs")
var resolve = require("rollup-plugin-node-resolve")
var terser = require("rollup-plugin-terser").terser
//var alias = require("rollup-plugin-alias")
var replace = require("rollup-plugin-replace")

var { rollup } = require("rollup")

var emptyModulePath = path.resolve(__dirname, "empty.js")

function getExternals(target) {
    switch (target) {
        case "browser":
            return ["react", "mobx", "react-dom"]
        case "native":
            return ["react", "mobx", "react-native"]
        case "custom":
            return ["react", "mobx"]
    }
}

function getAliases(target) {
    switch (target) {
        case "browser":
            return { "react-native": emptyModulePath }
        case "native":
            return { "react-dom": emptyModulePath }
        case "custom":
            return { "react-native": emptyModulePath, "react-dom": emptyModulePath }
    }
}

function build(platformTarget, bundleFormat, srcFile, destFile) {
    var plugins = [
        replace({
            // for depencencies such as react-is
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        //alias({ "react-native": emptyModulePath }),
        typescript({
            tsconfig: "tsconfig.build.json",
            clean: true,
            check: true,
            useTsconfigDeclarationDir: true,
            tsconfigOverride:{
                removeComments: true
            }
        }),
        resolve({
            module: true,
            main: true
        }),
        commonjs()
    ]

    if (!destFile.includes("debug")) {
        plugins.push(terser())
    }

    plugins.push(filesize())

    return rollup({
        input: srcFile,
        external: getExternals(platformTarget),
        plugins: plugins
    })
    .then(function(bundle) {
            var options = {
                file: path.resolve(__dirname, "dist", destFile),
                format: bundleFormat,
                globals: {
                    "react": "React",
                    "react-dom": "ReactDOM",
                    "react-native": "ReactNative",
                    "preact": "Preact",
                    "mobx": "mobx"
                },
                name: "preact",
                exports: "named"
            }

            return bundle.write(options)
        })
        .catch(function(reason) {
            console.error(reason)
            process.exit(-1)
        })
}

const main = async () => {
    await build("browser", "es", "packages/preact/index.ts", "index.js")
    await build("browser", "es", "packages/preact/index_compat.ts", "compat.js")
    await build("browser", "es", "packages/preact/index_hooks.ts", "hooks.js")
}

main()
