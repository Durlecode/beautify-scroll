const path = require('path')

module.exports = {
    mode: "production",
    devServer: {
        contentBase: path.join(__dirname, ''),
        watchContentBase: true
    },
    output: {
        filename: "index.js",
        globalObject: 'this',
        library: 'BeautifyScroll',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-private-methods',
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            }
        ]
    }
}