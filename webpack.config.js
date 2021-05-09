// `webpack` command will pick up this config setup by default
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// const MyPlugin = require("./src/myplugin"); //내가 만든 플러그인 예시
const webpack = require('webpack'); // 배너 정보를 아래에 직접 입력할때 사용 플러그인
const banner = require("./banner.js"); // 배너 정보를 따로 불러올때 사용 플러그인
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 이전 빌드파일 삭제 플러그인
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // css 추출 플러그인

//module.exports = {
module.exports = (env) => {
    let entryPath = env.mode === 'production'
        ? './public/index.js'
        : './src/index.js';

    return {
        mode: 'production',  // none, development, production
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
        //devtool: 'cheap-eval-source-map',
        plugins: [
            // new MyPlugin(),
            /*new webpack.BannerPlugin({
                banner: () => `빌드 날짜: ${new Date().toLocaleString()}`, // 배너 직접 입력 방식
            }),*/
            new webpack.BannerPlugin(banner), // 배너 불러오기 방식
            new HtmlWebpackPlugin({
                template: 'index.html', // index.html 템플릿을 기반으로 빌드 결과물을 추가해줌
                hash: true, // 정적 파일을 불러올때 쿼리문자열에 웹팩 해쉬값을 추가한다
           }),
            new CleanWebpackPlugin(), // 이전 빌드 폴더에 불필요한 파일 다 삭제
            ...(process.env.NODE_ENV === "production"
                ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
                : []),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    // use: ['style-loader', 'css-loader']
                    use: [
                        process.env.NODE_ENV === "production"
                            ? MiniCssExtractPlugin.loader // 프로덕션 환경
                            : "style-loader", // 개발 환경
                        "css-loader",
                    ],
                },
                /*{
                    test: /\.png$/, // .png 확장자로 마치는 모든 파일
                    loader: "file-loader", // 파일 로더를 적용한다
                    options: {
                        publicPath: "./", // prefix를 아웃풋 경로로 지정
                        name: "[name].[ext]?[hash]", // 파일명 형식
                    },
                },*/
                {
                    test: /\.png$/,
                    use: {
                        loader: 'url-loader', // url 로더를 설정한다
                        options: {
                            publicPath: './', // file-loader와 동일
                            name: '[name].[ext]?[hash]', // file-loader와 동일
                            limit: 5000 // 5kb 미만 파일만 data url로 처리
                        }
                    }
                }
            ]
        }
    }
};