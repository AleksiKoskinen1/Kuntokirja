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
				if(page == 2) return <WeightManagment/>
				if(page == 3) return <WeightManagment/>
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
		this.state = {	small : false, headOver : false , headStyle: {} , headReverse: "", smallSizeLimit: "", navLenght: ""};
		this.navDiv = null;
		this.headerDiv = null;
		this.logBut = null;
        this.setNavDiv = element => { this.navDiv = element; };
		this.setHeaderDiv = element => { this.headerDiv = element; };
		this.setLogBut = element => { this.logBut = element; };
		this.checkSize = this.checkSize.bind(this);
		
	}
	
	changeView (a,b) {
				
		b.preventDefault();
		this.props.viewChange(a);
	}
	checkSize(){
		if(!this.state.small){
			let headRight = this.headerDiv.getBoundingClientRect().right;
			let headLeft= this.headerDiv.getBoundingClientRect().left;
			let navRight = this.navDiv.getBoundingClientRect().right;
			let logButLeft = this.logBut.getBoundingClientRect().left;

			if(headLeft < navRight && !this.state.headOver){ 
				this.setState({
					headOver: true,
					headStyle: {'left': navRight, 'transform': 'translate(0%, -50%)' },
					headReverse: logButLeft
				});
			}
			else if(this.state.headOver && logButLeft > this.state.headReverse){
				this.setState({
					headOver: false,
					headStyle: {'left': '50%', 'transform': 'translate(-50%, -50%)' },
					headReverse: logButLeft
				});	
			}
			else if(logButLeft < headRight){
				this.setState({
					small: true,
					smallSizeLimit: window.innerWidth,
					headStyle: {},
					navLenght: navRight
				});	
			}
		}
		// Jos ollaan pienessä näkymässä
		else if(this.state.small && window.innerWidth > this.state.smallSizeLimit){
			this.setState({
				small: false,
				headStyle: {'left': this.state.navLenght, 'transform': 'translate(0%, -50%)' },
			});
		}
	}

	componentDidMount() { 
		window.addEventListener('resize', this.checkSize);
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
						
						<h3 id="pname">{this.props.name}</h3>
						<button ref={this.setLogBut} className="logout" onClick={this.props.logOut}>Kirjaudu ulos</button>
						<h2 className="mainHeader" ref={this.setHeaderDiv} style={this.state.headStyle}>Kuntoilun päiväkirja</h2>
					</div>				
				}
				{size &&
					<div>	

						<div className="dropdown">
							<div className="navbar">
								<div></div>
								<div></div>
								<div></div>
							</div>
							<div className="dropdown-content">
								<a href="#" onClick={this.changeView.bind(this, 1)}>Treeniohjelmat</a>
								<a href="#" onClick={this.changeView.bind(this, 2)}>Tulokset</a>
								<a href="#" onClick={this.changeView.bind(this, 3)}>Painonhallinta</a>
								<a href="#" onClick={this.logOut}>Kirjaudu ulos</a>
							</div>
						</div>

					
						
						<h2 className="mainHeaderSm mainHeader" ref={this.setHeaderDiv} style={this.state.headStyle}>Kuntoilun päiväkirja</h2>
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

