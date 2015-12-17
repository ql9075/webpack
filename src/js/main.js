require('../css/index.css');
var React = require('react'),
	config = require('./config/config')(),
	Index = require('./Index')
;
console.log("mainss")

var App = React.createClass({
	render:function(){
		return ( 
			<div>
				<div>react</div> 
				<Index />
			</div>
		);
	}
});

console.log(config.serverBase);


React.render(<App />,document.body);
