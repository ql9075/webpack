/*
 * webpack config
 */

var webpack = require('webpack'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	path = require('path'),
    _CONFIG_ = {} //配置
;

// 解决低版本node 没有promise的bug
require('es6-promise').polyfill();


// 初始化配置
configFn();


//传递变量插件
var definePlugin = new webpack.DefinePlugin({
   _ENVIRONMENT_:_CONFIG_.ENVIRONMENT 
});


module.exports = {
	//页面入口文件配置
	entry:{
		index:getEntrySources(['./src/js/main.js'])
		//index:'./src/js/main.js'
	},
	//入口文件输出配置	
	output:{
		path:_CONFIG_.PATH.package,
		//filename:'js/[hash].[name].bundle.js', // hash ＋ 文件名
		filename:'js/[name].bundle.js', 
		publicPath:_CONFIG_.PATH.publicPath
	},
	//加载器配置
	module:{
		loaders:[
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			//{ test: /\.css$/,loader:ExtractTextPlugin.extract("style", "css")},
			{ test: /\.js$/, exclude: /node_modules/, loader: 'react-hot!jsx-loader?harmony' },
			{ test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
			{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
		]
	},
	//插件
	plugins:[
	 	//new ExtractTextPlugin("./css/[name].css"),    //单独使用style标签加载css并设置其路径
 
		new HtmlWebpackPlugin({
	        template: './src/html/index.html',//模版路径
	        filename: './html/index.html',//生成的html存放路径
	       	inject:true,    //允许插件修改哪些内容，包括head与body
            hash:true,    //为静态资源生成hash值
	        chunks: ['vendors', 'index']
	    }),
	    definePlugin,
	    new webpack.HotModuleReplacementPlugin(),
	    new webpack.NoErrorsPlugin()
	],
	resolve: {
	    // you can now require('file') instead of require('file.coffee')
	    extensions: ['', '.js', '.json', '.coffee'] 
	},
	devServer:{
		contentBase:'./dist/html'
	}

};



//配置基本信息
function configFn(){
	 //命令  BUILD_LOCAL=1 webpack|| BUILD_DEV=1 webpack|| BUILD_PRERELEASE=1 webpack
	//本地
	if( process.env.BUILD_LOCAL || true ){
		console.log("__LOCAL__");
		_CONFIG_.ENVIRONMENT = '1';
		_CONFIG_.ENVIRONMENT_NAME = 'LOCAL';
		_CONFIG_.serverBase = 'http://127.0.0.1/';
		_CONFIG_.PATH ={
			static:'http://127.0.0.1/',
			//package:'./local/dist',
			package:path.resolve(__dirname,'local'),
			publicPath:'..'
		}
	}

	//开发
	if ( process.env.BUILD_DEV ) {
	  console.log("__DEV__");
	  _CONFIG_.ENVIRONMENT = '2';
	  _CONFIG_.ENVIRONMENT_NAME = 'DEV';
	  _CONFIG_.serverBase = 'http://147.0.0.1/';
	  _CONFIG_.PATH ={
		static:'http://147.0.0.1/',
		//package:'./dev/dist',
		package:path.resolve(__dirname,'dev'),
		publicPath:'..'
	  }
	}

	//线上
	if ( process.env.BUILD_PRERELEASE ) {
	  console.log("__PRERELEASE__");
	  _CONFIG_.ENVIRONMENT = '3';
	  _CONFIG_.ENVIRONMENT_NAME = 'PRERELEASE';
	  _CONFIG_.serverBase = 'http://m.jdpay.com/';
	  _CONFIG_.PATH = './prerelease/dist';
	  _CONFIG_.PATH ={
		static:'http://m.jdpay.com/',
		//package:'./prerelease/dist',
		package:path.resolve(__dirname,'prerelease'),
		publicPath:'..'
	  }
	}
}

function getEntrySources(sources) {
  if (_CONFIG_.ENVIRONMENT_NAME == 'LOCAL') {
  	sources = ['webpack-dev-server/client?http://127.0.0.1:9090','webpack/hot/only-dev-server',sources[0]]
  }
  return sources;
}
