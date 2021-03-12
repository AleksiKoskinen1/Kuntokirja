
import React, {Component} from 'react';
const ReactDOM = require('react-dom'); 
const client = require('../api'); 
const follow = require('../fetch');
const root = '/api';
const api = require('../api'); 
import moment from 'moment';
const when = require('when');
import Recharts from 'recharts'
import { LineChart, Line, XAxis, YAxis } from "recharts";

class WeightManagment extends Component{

	constructor(props) {
		super(props);

		const curY = new Date().getFullYear();
		const curM = new Date().getMonth() + 1; //Alkaa 0:sta

		this.state = { weights: [], attributes: [], year: curY, month: curM};		
		this.addRow = this.addRow.bind(this);
		this.changeCalender = this.changeCalender.bind(this);
		this.deleteWeight = this.deleteWeight.bind(this);
		this.editWeight = this.editWeight.bind(this);
		this.loadWeightData = this.loadWeightData.bind(this);
		this.updateSize = this.updateSize.bind(this);
		
	}
	
	loadWeightData() {
		console.log(this.props.user.id);

		api({method: 'GET', path: '/api/getUserWeightsWithMY/'+this.state.year+'/'+this.state.month+'/'+this.props.user.id}).done(response => {
			this.setState({
				weights: response.entity,
				
			});
		});

	}

	componentDidMount() { 
		this.loadWeightData();		
	}
	
	updateSize(size) {

			this.loadWeightData();
		
	}

	addRow(weightToAdd){

		console.log(weightToAdd);
		api({method: 'POST', path: '/api/postWeight/'+ this.props.user.id + '/' + weightToAdd.date + '/' + weightToAdd.weight + '/'}).done(() => {
			this.loadWeightData();	
			window.location = "#"; //poistetaan dialogi
        });
		
		
	}

	changeCalender(year, month){
		
		if(!year){

			let m = parseInt(month) + 1; //alkaa 0:sta, lisätään 1
			api({method: 'GET', path: '/api/getUserWeightsWithMY/'+this.state.year+'/'+m+'/'+this.props.user.id}).done(response => {
				this.setState({
					weights: response.entity,
					month: m
					
				});
			});
		}
		else if(!month){

			let y = parseInt(year);
			api({method: 'GET', path: '/api/getUserWeightsWithMY/'+y+'/'+this.state.month+'/'+this.props.user.id}).done(response => {
				this.setState({
					weights: response.entity,
					year: y
					
				});
			});
		}
		
	}

	//Poistetaan paino

	deleteWeight(id) {
		api({method: 'DELETE', path: '/api/delWeight/'+id}).done(() => {
            this.loadWeightData();
        });
	}
	//Muokataan painoa
	editWeight(id, weight) {
		api({method: 'POST', path: '/api/editWeight/'+id+'/'+weight}).done(() => {
			this.loadWeightData();
			window.location = "#"; //poistetaan dialogi
			
        });
	}

	render() { 

		var dbweights;
		dbweights = this.state.weights.map(weight =>
			<Weight key={weight.id}
					weight={weight}
					deleteWeight={this.deleteWeight}
					editWeight={this.editWeight}/>
		);

		const data = [];
		var minYvalue = 0;
		var maxYvalue = 10;
		var countCharW = 0;
		var begin = false;
		for (let i=(this.state.weights.length-1); i>=0; i--) {
			if(!begin){
		
				minYvalue = this.state.weights[i].weight-2;
				maxYvalue = this.state.weights[i].weight+2;
				begin=true;
			}
			else{
				if(this.state.weights[i].weight < minYvalue) minYvalue = this.state.weights[i].weight-2;
				if(this.state.weights[i].weight > maxYvalue) maxYvalue = this.state.weights[i].weight+2;
			}
			
			countCharW += 70;
			let keyValue = {
				day: this.state.weights[i].day,
				value: this.state.weights[i].weight
			};
			data.push(keyValue);
		}

		if(countCharW < 300) countCharW = 300;  //Jotta ei mene liian pieneksi taulukko, jos esim on laitettu vain 1 paino
		if(countCharW > 700) countCharW = 700;  //Eikä liian suureksi..voisi olli myös vakio 700 mutta joo mennää thäl
		console.log(minYvalue);
		console.log(maxYvalue);
		console.log(this.state.weights);
		console.log(data);

		return (
			
			<div id="mainb" className="mainBody">
				<div>
					<div className="mainBodyHeader">
						<h2>Painonhallinta</h2>
					</div>
					<div>
						<AddWeight changeCalender={this.changeCalender} addRow={this.addRow} pageSize={this.state.pageSize} updateSize={this.updateSize} curY={this.state.year} curM={this.state.month}/>
					</div>
					<div className="weightInfoDiv">
						<div className="weightDiv">
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
						<div className="chartDiv">
							<LineChart
							width={countCharW}
							height={300}
							data={data}
							margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
							>
							<Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
							<XAxis dataKey="day" />
							<YAxis domain={[minYvalue, maxYvalue]} />
							</LineChart>
						</div>
					</div>			
				</div>
			</div>
		)
	}
}

class Weight extends Component{

	constructor(props) {
		super(props);
		
		this.wSpan = null;
		this.weightP = null;
		this.setWSpan = element => { this.wSpan = element; };
		this.setWDiv = element => { this.weightP = element; };
	}

	delete(e) {
		e.preventDefault();
		this.props.deleteWeight(this.props.weight.id);
	}
	edit(e) {
		e.preventDefault();

	
		//Katsotaan, että on syötetty validi float numero 
		if(!/^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/.test(this.weightP.value)){
			this.wSpan.style="color:red";
			return;
		} else this.wSpan.style="color: black";

		this.props.editWeight(this.props.weight.id, this.weightP.value);

		this.weightP.value = "";
	}
	
	render() {

		const dayString = () => {
			let m = this.props.weight.month+""; //pistetää stringiks
			let d = this.props.weight.day+"";

			if(m.length == 1) m = "0" + m; 
			if(d.length == 1) d = "0" + d; 

			return d + "." + m + "." + this.props.weight.year;

		};

		
		return (
			<tr>
				<td>{dayString()}</td>
				<td>{this.props.weight.weight} kg</td>
				<td>
					<input onClick={this.delete.bind(this)} className="talImages pointer" type="image" src="trash.png" alt="Poista" title="Poista paino" width="15" height="15"></input>
					<a href="#editWeight">
						<img src="edit.png" alt="Muokkaa" title="Muokkaa painoa" width="15" height="15" className="logout-icon"></img>
					</a>
					<div>
						<div id="editWeight" className="modalDialog">
							<div>
								<a href="#" title="Sulje" className="close">X</a>

								<h2>Syötä uusi paino</h2>

								<form>
									<span ref={this.setWSpan} className="inputInfo">Syötä uusi paino kiloina esim. 95.40</span>
									<p>
										<input ref={this.setWDiv} type="text" placeholder="Paino" className="field"/>
									</p>

									<button onClick={this.edit.bind(this)}>Lisää</button>
								</form>
							</div>
						</div>
					</div>
				</td>
			</tr>
		)
	}
}

class AddWeight extends Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.monthChange = this.monthChange.bind(this);
		this.yearChange = this.yearChange.bind(this);
		this.dateDiv = null;
        this.weightDiv = null;
		this.dateSpan = null;
        this.weightSpan = null;
		this.setDateDiv = element => { this.dateDiv = element; };
        this.setWeightDiv = element => { this.weightDiv = element; };
		this.setDateSpan = element => { this.dateSpan = element; };
		this.setWeightSpan = element => { this.weightSpan = element; };
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
		console.log(this.dateDiv.value);
		console.log(this.weightDiv.value);
		//Katsotaan että pvm on syötetty pyydetyssä muodossa, ja on muutenkin validi pvm
		if(!moment(this.dateDiv.value, "DD.MM.YYYY", true).isValid()){
			this.dateSpan.style="color:red";
			return;
		} else this.dateSpan.style="color: black";
		//Katsotaan, että on syötetty validi float numero 
		if(!/^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/.test(this.weightDiv.value)){
			this.weightSpan.style="color:red";
			return;
		} else this.weightSpan.style="color: black";
	
		newWeight['weight'] = this.weightDiv.value; 
		newWeight['date'] = this.dateDiv.value; 

		this.weightDiv.value = "";
		
		this.props.addRow(newWeight);
	
	}

	monthChange(selectHandler){
		this.props.changeCalender(false, selectHandler.target.value);        
    } 
	yearChange(selectHandler){
		this.props.changeCalender(selectHandler.target.value,false);        
    } 
	
	render() {

		const date = new Date();
		let m  = (date.getMonth() + 1) + "";
		let d  = date.getDate() + "";

		if(m.length == 1) m = "0" + m; 
		if(d.length == 1) d = "0" + d; 

		const curDay = d + "."+ m + "." + date.getFullYear();
		const years = [];
		const curY = date.getFullYear();
		for(let i = curY;i>=(curY-5);i--){
			years.push(<option value={i} key={i}>{i}</option>);
        }
		
		return (
			/*
						<img src="/barbell.jpg" width="20" height="20" className="logout-icon"></img>
						<input className="weightIput" type="text" placeholder="Näytä" ref="showN" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
					
					<input className="weightIput" type="text" placeholder="Näytä" ref="showN" defaultValue={this.props.pageSize} onInput={this.handleInput}/>

						*/
			<div id="addR">
				<div>
					<label className="wLabelLeft">Vuosi:</label>
					<select value={this.props.curY} className="" onChange={this.yearChange}>
						{years}
					</select>				
					
					<label className="wLabelLeft wLabelRight">Kuukausi:</label>
					<select value={this.props.curM - 1} className="wSelectRight" onChange={this.monthChange}>
						<option value="0" key="Tammikuu">Tammikuu</option>
						<option value="1" key="Helmikuu">Helmikuu</option>
						<option value="2" key="Maaliskuu">Maaliskuu</option>
						<option value="3" key="Huhtikuu">Huhtikuu</option>
						<option value="4" key="Toukokuu">Toukokuu</option>
						<option value="5" key="Kesäkuu">Kesäkuu</option>
						<option value="6" key="Heinäkuu">Heinäkuu</option>
						<option value="7" key="Elokuu">Elokuu</option>
						<option value="8" key="Syyskuu">Syyskuu</option>
						<option value="9" key="Lokakuu">Lokakuu</option>
						<option value="10" key="Marraskuu">Marraskuu</option>
						<option value="11" key="Joulukuu">Joulukuu</option>
					</select>
					
					<a href="#addWeight" className="addBtn">
						<span>Lisää paino</span>
					</a>
				</div>
				<div>
					<div id="addWeight" className="modalDialog">
						<div>
							<a href="#" title="Sulje" className="close">X</a>

							<h2>Lisää uusi paino</h2>

							<form>
								<span ref={this.setDateSpan} className="inputInfo">Syötä päivämäärä (dd.mm.yyyy)</span>
								<p>
									<input type="text" defaultValue={curDay} placeholder="Päivämäärä" ref={this.setDateDiv} className="field"/>
									
								</p>
								<span ref={this.setWeightSpan} className="inputInfo">Syötä paino kiloina esim. 95.40</span>
								<p>
									<input type="text" placeholder="Paino" ref={this.setWeightDiv} className="field"/>
									
								</p>
								<button onClick={this.handleSubmit}>Lisää</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}



export default WeightManagment; //Jotta app osaa importtaa tämän