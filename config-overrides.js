const { override, fixBabelImports, addWebpackExternals, addWebpackAlias } = require('customize-cra');
const path = require("path");
const { config } = require('process');

module.exports = override(
    fixBabelImports('import', { //配置 antd 按需加载
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addWebpackExternals({ //不做打包处理配置，如直接以cdn引入的
        'react': 'React',
        'react-dom': 'ReactDOM',
        antd: 'antd',
        axios: 'axios',
        nprogress: 'NProgress',
    }),
    addWebpackAlias({ //路径别名
        '@': path.resolve(__dirname, 'src'),
    }),
    (config) => {
        config.devtool = false; // 生产环境打包去掉 map 
        return config;
    }
);