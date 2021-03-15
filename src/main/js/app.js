'use strict';


import React, {Component} from 'react';
const ReactDOM = require('react-dom'); 
const client = require('./api');  //Haetaan modulit	
const follow = require('./fetch');
const root = '/api';
const when = require('when');
import WeightManagment from './components/weightManagment';
import GymProgram from './components/GymProgram';
import Login from './components/Login';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {	loggedIn: false,
						page: 1, //kuntosaliohjelma oletuksena
						user: null
					};
		this.viewChange = this.viewChange.bind(this);	
		this.login = this.login.bind(this);	
		this.logOut = this.logOut.bind(this);		
		
	}


	viewChange(id) {
		this.setState({page: id});
	}

	logOut(e){

		e.preventDefault();	
		this.setState({
			loggedIn: false,
			page: 1,
			user: null
		});
	}

	login(results){
		this.setState({
			loggedIn: true,
			page: 1,
			user: results.entity[0]
		});
	}

	componentDidMount() {}

	render() {

		if(this.state.loggedIn){

			let page = this.state.page;

			const renderView = () =>{
				if(page == 1) return <GymProgram user={this.state.user}/>
				if(page == 3) return <WeightManagment user={this.state.user}/>
			}

			return (
				<div id="mainDiv">								
					<TopSection name={this.state.user.name} page={this.state.page}  logOut={this.logOut}  viewChange={this.viewChange}/>	
					{renderView()}
				</div>
			)
			
		}
		else if(!this.state.loggedIn){
			return(
				<div className="bgColor">
					<Login login={this.login} />
				</div>
			)
		}
		
	}
}
 
/*
* Ylapalkkiin kuuluvat kamat
*/
class TopSection extends Component{

	constructor(props) {

		super(props);
		this.state = {	small : false, headStyle: {} , smallSizeLimit: 772};
		this.navDiv = null;
		this.headerDiv = null;
		this.logBut = null;
		this.nameEle = null;
        this.setNavDiv = element => { this.navDiv = element; };
		this.setHeaderDiv = element => { this.headerDiv = element; };
		this.setLogBut = element => { this.logBut = element; };
		this.setNameEle = element => { this.nameEle = element; };
		this.checkSize = this.checkSize.bind(this);
		
	}
	
	changeView (a,b) {
				
		b.preventDefault();
		this.props.viewChange(a);
	}
	checkSize(){

		let headRight = this.headerDiv.getBoundingClientRect().right;
		let headLeft= this.headerDiv.getBoundingClientRect().left;
		

		if(!this.state.small){

			let navRight = this.navDiv.getBoundingClientRect().right;
			let logButLeft = this.logBut.getBoundingClientRect().left;
		
			let total = this.headerDiv.offsetWidth + this.navDiv.offsetWidth + this.logBut.offsetWidth + this.nameEle.offsetWidth + 120;

			if(total > window.innerWidth){
				this.setState({
					small: true,
					smallSizeLimit: total,
					headStyle: {'position': "absolute", 'left': '50%',  'transform': 'translate(-50%, -0%)' }
				});
			}
			else if(logButLeft < headRight){
				let w = window.innerWidth - logButLeft;
				this.setState({
					small: true,
					smallSizeLimit: window.innerWidth,
					headStyle: {'position': "absolute", 'left': '50%',  'transform': 'translate(-50%, -0%)' }
				});	
			}
	

		}
		// Jos ollaan pienessä näkymässä
		else if(this.state.small && window.innerWidth > this.state.smallSizeLimit){
	
			this.setState({
				small: false,
				headStyle: {},
			});
		}
	}

	componentDidMount() { 
		window.addEventListener('resize', this.checkSize);
		this.checkSize();
	}
	componentWillUnmount() {
        window.removeEventListener("resize", this.checkSize);
    }
	
	render() { 

		const size = this.state.small;
		const activeClasses =  [false, false, false];
		activeClasses[this.props.page - 1] = true;

		return (
			<div id="TopContent">
				{!size &&
					<div>						
						<ul id="nav" ref={this.setNavDiv} >				
							<li className={activeClasses[0]? "current" : ""}><a href="#" onClick={this.changeView.bind(this, 1)}>Treeniohjelmat</a></li>
							<li style={{'display': 'none'}}className={activeClasses[1]? "current" : ""}><a href="#" onClick={this.changeView.bind(this, 2)}>Tulokset</a></li>
							<li className={activeClasses[2]? "current" : ""}><a href="#" onClick={this.changeView.bind(this, 3)}>Painonhallinta</a></li>
						</ul>
						
						<h3 ref={this.setNameEle} id="pname">{this.props.name}</h3>

						<button ref={this.setLogBut} className="logout pointer" onClick={this.props.logOut}>Kirjaudu ulos</button>
						<img className="mainHeader" ref={this.setHeaderDiv} style={this.state.headStyle} src="kuntokirja.png" alt="Kuntokirja" width="323" height="66"></img>
					</div>				
				}
				{size &&
					<div>	

						<div className="dropdown">
							<div className="navbar"  ref={this.setNavDiv} >
								<div></div>
								<div></div>
								<div></div>
							</div>
							<div className="dropdown-content">
								<a href="#" onClick={this.changeView.bind(this, 1)}>Treeniohjelmat</a>
								<a href="#" onClick={this.changeView.bind(this, 2)}>Painonhallinta</a>
								<a href="#" onClick={this.props.logOut}>Kirjaudu ulos</a>
							</div>
						</div>

					
						<img className="mainHeaderSm mainHeader" ref={this.setHeaderDiv} style={this.state.headStyle} src="kuntokirja.png" alt="Kuntokirja" width="323" height="66"></img>
					</div>				
				}

			</div>
		)
	}
}


ReactDOM.render(
	<App />,
	document.getElementById('react')
)

