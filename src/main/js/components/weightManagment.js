
import React, {Component} from 'react';
const ReactDOM = require('react-dom'); 
const client = require('../api'); 
const follow = require('../fetch');
const root = '/api';
const when = require('when');

class WeightManagment extends Component{

	constructor(props) {
		super(props);
		this.state = { weights: [], attributes: [], pageSize : 5, links : {} };		
		this.addRow = this.addRow.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.deleteWeight = this.deleteWeight.bind(this);
		this.loadWeightData = this.loadWeightData.bind(this);
		this.navPrev = this.navPrev.bind(this);
		this.navFirst = this.navFirst.bind(this);
		this.navNext = this.navNext.bind(this);
		this.navLast = this.navLast.bind(this);
		this.updateSize = this.updateSize.bind(this);
		
	}

	loadWeightData(pageSize) {
		follow(client, root, [ 
			{rel: 'weights', params: {size: pageSize}}]
		).then(results => {  //KAikki tuon apin eli kannan data, pagesize määrää määrän
			console.log(results);
			return client({  
				method: 'GET',
				path: results.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {  //Schema, eli tietokannan rakenne!
				this.schema = schema.entity;
				this.links = results.entity._links;
				return results;
			});
		}).then(secondResult => { 
			return secondResult.entity._embedded.weights.map(weight =>
				client({
					method: 'GET',
					path: weight._links.self.href
				})
			);
		}).then(promises => { 
			return when.all(promises); //Kun kaikki ovat valmistuneet
		}).done(lastResult => { 
			this.setState({
				weights: lastResult,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: this.links
			});
		});
	}

	componentDidMount() { 
		this.loadWeightData(this.state.pageSize);		
	}
	
	updateSize(size) {
		if (size !== this.state.pageSize) {
			this.loadWeightData(size);
		}
	}

	addRow(weightToAdd){

		const self = this;
		follow(client, root, ['weights']).then(response => {
			return client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: weightToAdd,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [{rel: 'weights', params: {'size': self.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
		
		window.location = "#"; //poistetaan dialogi
	}

	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(weightCollection => {
			this.links = weightCollection.entity._links;
			return weightCollection.entity._embedded.weights.map(weight =>
					client({
						method: 'GET',
						path: weight._links.self.href
					})
			);
		}).then(weightPromises => {
			return when.all(weightPromises);
		}).done(weights => {
			this.setState({
				weights: weights,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}

	/*
	** Poistetaan paino
	*/
	deleteWeight(employee) {
		client({method: 'DELETE', path: employee.entity._links.self.href}).done(response => {
			this.loadWeightData(this.state.pageSize);
		});
	}

	navFirst(e){
		e.preventDefault();
		this.onNavigate(this.state.links.first.href);
	}
	navPrev(e) {
		e.preventDefault();
		this.onNavigate(this.state.links.prev.href);
	}
	navNext(e) {
		e.preventDefault();
		this.onNavigate(this.state.links.next.href);
	}
	navLast(e) {
		e.preventDefault();
		this.onNavigate(this.state.links.last.href);
	}
	
	render() { 

		var dbweights;
		dbweights = this.state.weights.map(weight =>
			<Weight key={weight.entity._links.self.href}
					weight={weight}
					deleteWeight={this.deleteWeight}/>
		);

		const navLinks = [];
		if ("first" in this.state.links) {
			navLinks.push(<button key="first" onClick={this.navFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.state.links) {
			navLinks.push(<button key="prev" onClick={this.navPrev}>&lt;</button>);
		}
		if ("next" in this.state.links) {
			navLinks.push(<button key="next" onClick={this.navNext}>&gt;</button>);
		}
		if ("last" in this.state.links) {
			navLinks.push(<button key="last" onClick={this.navLast}>&gt;&gt;</button>);
		}

		return (
			<div id="mainb" className="mainBody">
				
				<div>
					<div className="mainBodyHeader">
						<h2>Painonhallinta</h2>
					</div>
					<AddWeight addRow={this.addRow} pageSize={this.state.pageSize} updateSize={this.updateSize}/>
					<div>
						<table id="weightT">
							<thead>
								<tr>
									<th>Päivämäärä</th>
									<th>Paino</th>
									<th></th>
								</tr>
							</thead>					
							<tbody>
								{dbweights}						
							</tbody>
						</table>
					</div>

					<div id="links">
						{navLinks}
					</div>
				</div>
			</div>
		)
	}
}

class Weight extends Component{

	constructor(props) {
		super(props);
	}

	delete(e) {
		e.preventDefault();
		this.props.deleteWeight(this.props.weight);
	}

	render() {
		return (
			<tr>
				<td>{this.props.weight.entity.date}</td>
				<td>{this.props.weight.entity.weight} kg</td>
				<td><button onClick={this.delete.bind(this)}>Poista paino</button></td>
			</tr>
		)
	}
}

class AddWeight extends Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		e.preventDefault();
		const pageSize = ReactDOM.findDOMNode(this.refs.showN).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updateSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.showN).value = pageSize.substring(0, pageSize.length - 1);
		}
	}

	handleSubmit(e) {
		e.preventDefault();
	
		var newWeight = {};
		newWeight['weight'] = ReactDOM.findDOMNode(this.refs["date"]).value.trim(); //Otetaan arvot ref arraysta
		newWeight['date'] = ReactDOM.findDOMNode(this.refs["weight"]).value.trim();

		ReactDOM.findDOMNode(this.refs["date"]).value = ""; //Nollataan arvot
		ReactDOM.findDOMNode(this.refs["weight"]).value = "";
		this.props.addRow(newWeight);
	
	}
	
	render() {

		return (
			/*
						<img src="/barbell.jpg" width="20" height="20" className="logout-icon"></img>*/
			<div id="addR">
				<label>Näytä kerralla:</label>
				<input className="weightIput" type="text" placeholder="Näytä" ref="showN" defaultValue={this.props.pageSize} onInput={this.handleInput}/>

				<a href="#addWeight" className="addBtn">
					<span>Lisää paino</span>
				</a>

				<div id="addWeight" className="modalDialog">
					<div>
						<a href="#" title="Sulje" className="close">X</a>

						<h2>Lisää uusi paino</h2>

						<form>
							<p>
								<input type="text" placeholder="Päivämäärä" ref="date" className="field"/>
							</p>
							<p>
								<input type="text" placeholder="Paino" ref="weight" className="field"/>
							</p>
							<button onClick={this.handleSubmit}>Lisää</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}



export default WeightManagment; //Jotta app osaa importtaa tämän