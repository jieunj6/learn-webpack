// `webpack` command will pick up this config setup by default
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

//module.exports = {
module.exports = (env) => {
    let entryPath = env.mode === 'production'
        ? './public/index.js'
        : './src/index.js';

    return {
        mode: 'development',
        entry: entryPath,
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        devServer: {
            proxy: {
                '/api': {
                    target: 'domain.com',
                    changeOrigin: true
                }
            },
            port: 9000,
        },
        devtool: 'cheap-eval-source-map',
        plugins: [
            new HtmlWebpackPlugin({
                // index.html 템플릿을 기반으로 빌드 결과물을 추가해줌
                template: 'index.html',
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        }
    }
};