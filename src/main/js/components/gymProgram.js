
import React, {Component} from 'react';
const ReactDOM = require('react-dom'); 
const api = require('../api'); 
const fetch = require('../fetch');
const root = '/api';
const when = require('when');
import Calendar from 'react-calendar';
import moment from 'moment';
import StickyNote from './StickyNote';
import ScheduleFullTable from './ScheduleFullTable';

class GymProgram extends Component{

	constructor(props) {
        super(props);
        
        this.state = {
            date: new Date(),
            gymprograms: [],
            attributes: [],
            links: {},
            weekday: "",
            weekdayNro: 0,
            startNro: 0,
            endNro: 0,
            weekdates: [],
            dayStr: moment(new Date()),
            showNote: false,
            note: null,
            mainContentSize: "full",
            gymRepPrograms: []
            
          }

        this.onChange = this.onChange.bind(this);
        this.getDays = this.getDays.bind(this);
        this.getDayNro = this.getDayNro.bind(this);
        this.getWeekStart = this.getWeekStart.bind(this);
        this.getWeekEnd = this.getWeekEnd.bind(this);
        this.getSelectedWeekDates = this.getSelectedWeekDates.bind(this);
        this.newProgram = this.newProgram.bind(this);
        this.showProgram = this.showProgram.bind(this);
        this.deleteProgram = this.deleteProgram.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.checkSize = this.checkSize.bind(this);

        this.calDiv = null;
        this.stickyDiv = null;
        this.setStickyDiv = element => { this.stickyDiv = element; };
        this.setCalDiv = element => { this.calDiv = element; };
        
    } 

    loadGymData2(id = false) {

        let calW = this.calDiv.clientWidth;
        let minWi = 298;
        let size = "full";
        if(calW < minWi) size= "small";

        let startOfWeek = moment(this.state.date).startOf('isoweek');
        let dayS = startOfWeek;
        let endOfWeek = moment(this.state.date).endOf('isoweek');
        let start = startOfWeek.format('YYYY') + "-" + startOfWeek.format('MM') + "-" +startOfWeek.format('DD');
        let end = endOfWeek.format('YYYY') + "-" + endOfWeek.format('MM') + "-" +endOfWeek.format('DD');
        
		api({method: 'GET', path: '/api/getUserProgramsWithDates/'+start+'/'+end+'/'+this.props.user.id}).done(response => {
            api({method: 'GET', path: '/api/getUserRepeatanceProgramsWithDates/'+start+'/'+end+'/'+this.props.user.id}).done(repeatResults => {

                if(!id){
                    this.setState({
                        gymprograms: response.entity,
                        weekday: this.getDays(this.state.date),
                        weekdayNro: this.getDayNro(this.state.date),
                        startNro: this.getWeekStart(this.state.date),
                        endNro: this.getWeekEnd(this.state.date),
                        weekdates: this.getSelectedWeekDates(this.state.date),
                        dayStr: dayS,
                        showNote: false,
                        note: null,
                        mainContentSize: size,
                        gymRepPrograms: repeatResults.entity
                    });
                }
                else{
                    api({method: 'GET', path: '/api/getProgramById/'+id}).done(programNote => {
                        this.setState({
                            gymprograms: response.entity,
                            weekday: this.getDays(this.state.date),
                            weekdayNro: this.getDayNro(this.state.date),
                            startNro: this.getWeekStart(this.state.date),
                            endNro: this.getWeekEnd(this.state.date),
                            weekdates: this.getSelectedWeekDates(this.state.date),
                            dayStr: dayS,
                            showNote: true,
                            note: programNote.entity,
                            mainContentSize: size,
                            gymRepPrograms: repeatResults.entity
                        });
                    });
                }
            });  
        });
    }

    newProgram(subject, program, start, end, day, toistuvuus, kesto){
        api({method: 'POST', path: '/api/postProgram/'+ this.props.user.id + '/' + program + '/' + subject + '/' + start + '/' + end + '/' + day + '/' + toistuvuus + '/' + kesto}).done(response => {
            console.log(response);
            api({method: 'GET', path: '/api/getHighestId/'}).done(response => {
                this.loadGymData2(response.entity);
            });            
        });
    }

    showProgram(id){
        api({method: 'GET', path: '/api/getProgramById/'+id}).done(response => {
            this.setState({
                showNote: true,
                note: response.entity
            });
        });
    }

    getSelectedWeekDates(date){

        let dates = [];      
        let startOfWeek = moment(date).startOf('isoweek');

        let startdate = startOfWeek.format('YYYY') + "-" + startOfWeek.format('MM') + "-" +startOfWeek.format('DD');
        for(var i=0;i<7;i++){
            let new_date = moment(startdate, "YYYY-MM-DD").add(i, 'days');
            dates[i] = new_date.format('YYYY') + "-" + new_date.format('MM') + "-" +new_date.format('DD');
        }
        return dates;
    }
    
    onChange(cDate){

        let startOfWeek = moment(cDate).startOf('isoweek');
        let dayS = startOfWeek;
        let endOfWeek = moment(cDate).endOf('isoweek');
        let start = startOfWeek.format('YYYY') + "-" + startOfWeek.format('MM') + "-" +startOfWeek.format('DD');
        let end = endOfWeek.format('YYYY') + "-" + endOfWeek.format('MM') + "-" +endOfWeek.format('DD');

        api({method: 'GET', path: '/api/getUserProgramsWithDates/'+start+'/'+end+'/'+this.props.user.id}).done(response => {
            api({method: 'GET', path: '/api/getUserRepeatanceProgramsWithDates/'+start+'/'+end+'/'+this.props.user.id}).done(repeatResults => {
                this.setState({
                    date: cDate,
                    gymprograms: response.entity,
                    weekday: this.getDays(cDate),
                    weekdayNro: this.getDayNro(cDate),
                    startNro: this.getWeekStart(cDate),
                    endNro: this.getWeekEnd(cDate),
                    weekdates: this.getSelectedWeekDates(cDate),
                    dayStr: dayS,
                    gymRepPrograms: repeatResults.entity
                });
            });
        });
        
    } 

    getWeekStart(date){
        var start = new Date(moment(date).startOf('isoweek').toDate());
        return start.getDate();
    }

    getWeekEnd(date){
        var end = new Date(moment(date).endOf('isoweek').toDate());
        return end.getDate();
    }

    getDays(data){
        
        let day = data.getDay();
        if(day == 1) return "Maanantai";
        else if(day == 2) return "Tiistai";
        else if(day == 3) return "Keskiviikko";
        else if(day == 4) return "Torstai";
        else if(day == 5) return "Perjantai";
        else if(day == 6) return "Lauantai";
        else if(day == 0) return "Sunnuntai";
    }

    getDayNro(data){        
        return data.getDate();
    }

    checkSize(){

        let calWidth = this.calDiv.clientWidth;
        let minW = 298;
        let minWindowW = 1390;

        if(calWidth < minW && window.innerWidth < minWindowW && this.state.mainContentSize != "small"){
            this.setState({
                mainContentSize: "small"
            });
        }
        else if(calWidth > minW && window.innerWidth > minWindowW && this.state.mainContentSize != "full"){
            this.setState({
                mainContentSize: "full"
            });
        }
    }

	componentDidMount() {
        this.loadGymData2();
        window.addEventListener('resize', this.checkSize);

    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.checkSize);
    }
    
    deleteProgram(id){

        api({method: 'DELETE', path: '/api/delProg/'+id}).done(() => {
            this.loadGymData2();
        });
        
    }

    saveEdits(id, title, content){
    
        fetch(api, root, [
			{rel: 'gymPrograms'}]
		).done(results => {              
            api({method: 'GET', path: results.url + "/"+id}).done(program => {
                let entity = program.entity;
                entity.program = title;
                entity.subject = content;
                api({
                    method: 'PUT',
                    path: results.url + "/"+id,
                    entity: entity,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).done(() => {
                    this.loadGymData2(id);
                })
            });
        });
    }
	
	render() { 

        const size =  this.state.mainContentSize;
        let mainB = "mainBody";
        if(size == "small") mainB = "mainBodySm";

        const stickyNotes = () => {
            if(this.state.showNote){
                return <StickyNote size={size} key={this.state.note.id} note={this.state.note} saveEdits={this.saveEdits} deleteProgram={this.deleteProgram}/>;
            }
        };

		return (
			<div id="mainb" className={mainB}>
				
				<div>
					<div className="mainBodyHeader">
						<h2>Kuntosalin ohjelma</h2>
					</div>
				</div>

                {size == "full" &&
                    <div className="mainContent">
                   
                        <Scheduler  gymprograms={this.state.gymprograms}
                                    gymRepPrograms={this.state.gymRepPrograms} 
                                    weekday={this.state.weekday} 
                                    weekdayNro={this.state.weekdayNro}
                                    weekStart={this.state.startNro}
                                    weekEnd={this.state.endNro}
                                    weekdates={this.state.weekdates}
                                    dayStr={this.state.dayStr}
                                    size={size}                             
                                    newProgram={this.newProgram}
                                    showProgram={this.showProgram}
                                    usid={this.props.user.id} />
                        <div id="rightDivs">
                            <div id="calendarDiv" ref={this.setCalDiv}>  
                                <Calendar
                                    onChange={this.onChange}
                                    value={this.state.date}
                                    locale="fi-FI"
                                />
                            </div>
                            <div id="stickyDiv" >
                                {stickyNotes()}
                            </div>
                        </div>
                    </div>
                }
                {size == "small" &&

                    <div className="mainContent">

                        <div id="rightDivsSm">
                            <div id="calendarDivSm" ref={this.setCalDiv}> 
                                <Calendar
                                    onChange={this.onChange}
                                    value={this.state.date}
                                    locale="fi-FI"
                                />
                            </div>
                            <div id="stickyDivSm" ref={this.setStickyDiv}>
                                {stickyNotes()}
                            </div>
                        </div>

                        <Scheduler  gymprograms={this.state.gymprograms} 
                                    gymRepPrograms={this.state.gymRepPrograms} 
                                    weekday={this.state.weekday} 
                                    weekdayNro={this.state.weekdayNro}
                                    weekStart={this.state.startNro}
                                    weekEnd={this.state.endNro}
                                    weekdates={this.state.weekdates}
                                    dayStr={this.state.dayStr}
                                    size={size}                                    
                                    newProgram={this.newProgram}
                                    showProgram={this.showProgram}
                                    usid={this.props.user.id} />


                    </div>
                }

			</div>
		)
	}
}


class Scheduler extends Component{

	constructor(props) {
        super(props);
        
        this.state = {}
        this.show = this.show.bind(this);
        this.handleNewProgram = this.handleNewProgram.bind(this);
        this.checkMax = this.checkMax.bind(this);
        this.checkToisto = this.checkToisto.bind(this);
        this.modalDiv = null; this.startTime = null; 
        this.endTime = null; this.dayString = null;
        this.subject = null; this.program = null;
        this.selectedDay = null; this.subjectError = null;
        this.programError = null;
        this.timeError = null;
        this.kesto = null;
        this.toistuvuus = null;        

        this.setModalDivRef = element => { this.modalDiv = element; };
        this.setStartTimeRef = element => { this.startTime = element; };
        this.setEndTimeRef = element => { this.endTime = element; };
        this.setDayStringRef = element => { this.dayString = element; };
        this.setSubjectRef = element => { this.subject = element; };
        this.setProgramRef = element => { this.program = element; };
        this.setProgramError = element => { this.programError = element; };
        this.setSubjectError = element => { this.subjectError = element; };
        this.setTimeError = element => { this.timeError = element; };
        this.setKestoRef = element => { this.kesto = element; };
        this.setToistuvuusRef = element => { this.toistuvuus = element; };
        
         
    }

    checkToisto(){

        var elements = document.getElementsByClassName("tk");

        for (var i = 0; i < elements.length; i++){
            if(this.toistuvuus.value == 1) elements[i].style.display = "none";
            else elements[i].style.display = "";
        }
    }

    checkMax(){  //3 kirjainta max
        if (this.kesto.value.length > this.kesto.maxLength){
            this.kesto.value = this.kesto.value.slice(0, this.kesto.maxLength);
        }
    }
    show(startT, day, dayString){
        if (this.modalDiv){

            this.selectedDay = dayString;
            let end = startT + 1;
            this.startTime.value=startT+":00";
            this.endTime.value=end+":00";
            this.modalDiv.style.opacity = 1;
            this.modalDiv.style.pointerEvents = 'auto';
           
            this.dayString.innerHTML = day + " " + dayString;
        }
    }
    close(){
        this.modalDiv.style.opacity = 0;
        this.modalDiv.style.pointerEvents = 'none';
        this.subject.value = ""; //Nollataan arvot
        this.program.value = "";
        this.programError.innerHTML = "";
        this.subjectError.innerHTML = "";
        this.timeError.innerHTML = "";  //Putsataan mahdollinen err text
        this.toistuvuus.value="1";
        this.kesto.value="";

    }
    handleNewProgram(e){
        e.preventDefault();
        
        var ds = this.selectedDay.split(".");        
        var dstr = ds[2] + "-" + ds[1] + "-" + ds[0];

        var new_date = null;
        var selectedRepLastDay = "";
        var selRepDayPlusOne = "";

        if(this.toistuvuus.value == 2) new_date = moment(dstr, "YYYY-MM-DD").add(this.kesto.value, 'days');
        else if(this.toistuvuus.value == 3) new_date = moment(dstr, "YYYY-MM-DD").add(this.kesto.value, 'weeks');
        else if(this.toistuvuus.value == 4) new_date = moment(dstr, "YYYY-MM-DD").add(this.kesto.value * 4, 'weeks');  //kuukaus = 4 viikkoa
        if(this.toistuvuus.value != 1){

            selRepDayPlusOne = new_date.format('YYYY') + "-" + new_date.format('MM') + "-" +new_date.format('DD');
            new_date = new_date.subtract(1, 'days');
            selectedRepLastDay = new_date.format('YYYY') + "-" + new_date.format('MM') + "-" +new_date.format('DD');

            api({method: 'GET', path: '/api/getUserRepeatanceProgramsWithDates/'+dstr+'/'+selectedRepLastDay+'/'+this.props.usid}).done(repeatResults => {
                if(this.handleValidation(dstr, repeatResults.entity, selRepDayPlusOne)){
                    this.modalDiv.style.opacity = 0;
                    this.modalDiv.style.pointerEvents = 'none';
                    let subject = this.subject.value.trim();
                    let program = this.program.value.trim();
                    let kes = 0;
        
                    if(this.toistuvuus.value != 1 && this.kesto.value != "") kes = this.kesto.value;
        
                    this.props.newProgram(subject, program, this.startTime.value , this.endTime.value, this.selectedDay, this.toistuvuus.value, kes);
        
                    this.subject.value = ""; //Nollataan arvot
                    this.program.value = "";
                    this.timeError.innerHTML = "";  //Putsataan mahdollinen err text
                }

            });

        } 
        else{  //Ei haeta toistuvia

            if(this.handleValidation(dstr, null, null)){
                this.modalDiv.style.opacity = 0;
                this.modalDiv.style.pointerEvents = 'none';
                let subject = this.subject.value.trim();
                let program = this.program.value.trim();
                let kes = 0;
    
                if(this.toistuvuus.value != 1 && this.kesto.value != "") kes = this.kesto.value;
    
                this.props.newProgram(subject, program, this.startTime.value , this.endTime.value, this.selectedDay, this.toistuvuus.value, kes);
    
                this.subject.value = ""; //Nollataan arvot
                this.program.value = "";
                this.timeError.innerHTML = "";  //Putsataan mahdollinen err text
            }
        }
        

       
    }

    handleValidation(dstr, repeatResults, selRepDayPlusOne){
        let success = true;
        if(this.subject.value.trim() == ""){
            this.subjectError.innerHTML = "Kenttä ei voi olla tyhjä!";
            success = false;
        }
        else this.subjectError.innerHTML = "";
        if(this.program.value.trim() == ""){
            this.programError.innerHTML = "Kenttä ei voi olla tyhjä!";
            success = false;
        } 
        else this.programError.innerHTML = "";

        const takenTimes = [];

        Object.entries(this.props.gymprograms).map(([key, value]) => {  //Tähä et kattoo vaan SEN päivän, ei kaikkii

            if(dstr === value.localDate){

                var startT = value.startTime + "0";
                var realS = parseInt(startT);
                if(value.half == 1) realS = realS + 5;

                takenTimes[realS] = 1;
                let dura = value.duration;

                while(dura != 1){
                    
                    realS = realS + 5;
                    takenTimes[realS] = 1;
                    dura--;
                }
            }
        });

        if(this.toistuvuus.value == 1){ //Koitetaan lisää kerta ohjelmaa, riittää alla oleva
            Object.entries(this.props.gymRepPrograms[0]).map(([key, value]) => {  //Tähä et kattoo vaan SEN päivän, ei kaikkii

                let rep = value.repeatance;
                let repeDur = value.repDuration;
                let repSDay = value.localDate;
                let repDurStart = 0;
                var new_date = null;

                while(repDurStart != repeDur) {	

                    if(dstr === repSDay){

                        var startT = value.startTime + "0";
                        var realS = parseInt(startT);
                        if(value.half == 1) realS = realS + 5;
        
                        takenTimes[realS] = 1;
                        let dura = value.duration;
        
                        while(dura != 1){
                            
                            realS = realS + 5;
                            takenTimes[realS] = 1;
                            dura--;
                        }
                    }

                    if(rep == 2) new_date = moment(repSDay, "YYYY-MM-DD").add(1, 'days');
                    else if(rep == 3) new_date = moment(repSDay, "YYYY-MM-DD").add(1, 'weeks');
                    else if(rep == 4) new_date = moment(repSDay, "YYYY-MM-DD").add(4, 'weeks');  //kuukaus = 4 viikkoa
                    
                    repSDay = new_date.format('YYYY') + "-" + new_date.format('MM') + "-" +new_date.format('DD');
                    repDurStart = repDurStart + 1;        
                }
            });         

        }
        else{ //Lisätään toistuvaa ohjelmaa, pitää kattoo ettei osu toisee ohjelmaa esim kuukaude päästä

            while(dstr !== selRepDayPlusOne){

                Object.entries(repeatResults[0]).map(([key, value]) => {  //Tähä et kattoo vaan SEN päivän, ei kaikkii

                    let rep = value.repeatance;
                    let repeDur = value.repDuration;
                    let repSDay = value.localDate;
    
                    let repDurStart = 0;
                    var new_date = null;
    
                    while(repDurStart != repeDur) {	
    
                        if(dstr === repSDay){
    
                            var startT = value.startTime + "0";
                            var realS = parseInt(startT);
                            if(value.half == 1) realS = realS + 5;
            
                            takenTimes[realS] = 1;
                            let dura = value.duration;
            
                            while(dura != 1){
                                
                                realS = realS + 5;
                                takenTimes[realS] = 1;
                                dura--;
                            }
                        }
    
                        if(rep == 2) new_date = moment(repSDay, "YYYY-MM-DD").add(1, 'days');
                        else if(rep == 3) new_date = moment(repSDay, "YYYY-MM-DD").add(1, 'weeks');
                        else if(rep == 4) new_date = moment(repSDay, "YYYY-MM-DD").add(4, 'weeks');  //kuukaus = 4 viikkoa
                        
                        repSDay = new_date.format('YYYY') + "-" + new_date.format('MM') + "-" +new_date.format('DD');
    
                        repDurStart = repDurStart + 1;        
                    }
                });



                var new_date = null;
                if(this.toistuvuus.value == 2) new_date = moment(dstr, "YYYY-MM-DD").add(1, 'days');
                else if(this.toistuvuus.value == 3) new_date = moment(dstr, "YYYY-MM-DD").add(1, 'weeks');
                else if(this.toistuvuus.value == 4) new_date = moment(dstr, "YYYY-MM-DD").add(4, 'weeks');  //kuukaus = 4 viikkoa
                dstr = new_date.format('YYYY') + "-" + new_date.format('MM') + "-" +new_date.format('DD');

            }

        }

    //    console.log(takenTimes);
        var sTime = this.startTime.value.split(":");
        var eTime = this.endTime.value.split(":");
        var stt = sTime[0];
        var ett = eTime[0];

        if(sTime[1] == "30") stt = stt + "5";
        else stt = stt + "0";
        if(eTime[1] == "30") ett = ett + "5";
        else ett = ett + "0";
        
        stt = parseInt(stt);
        ett = parseInt(ett);
        
        while(stt != ett){
            if(typeof takenTimes[stt] !== 'undefined') {
                success = false;
                this.timeError.innerHTML = "Ohjelma menee päällekkäin toisen kanssa!";
            }
            stt = stt + 5;
        }

        return success;
        
    }
    
    render(){

        let scheduSize = "scheduler";
        if(this.props.size == "small"){
            scheduSize = "schedulerSm";
        }

        const startTimes = [];
        const endTimes = [];
        const repeatance = [];

        repeatance.push(<option value={1} key={1}>{"Kerran"}</option>);
        repeatance.push(<option value={2} key={2}>{"Päivittäin"}</option>);
        repeatance.push(<option value={3} key={3}>{"Viikottain"}</option>);
        repeatance.push(<option value={4} key={4}>{"Kuukausittain"}</option>);

        for(let i = 6;i<=22;i++){
            startTimes.push(<option value={i+":00"} key={"start"+i}>{i+":00"}</option>);
            startTimes.push(<option value={i+":30"} key={"start"+i+"3"}>{i+":30"}</option>);
            endTimes.push(<option value={i+":00"} key={"end"+i}>{i+":00"}</option>);
            endTimes.push(<option value={i+":30"} key={"end"+i+"3"}>{i+":30"}</option>);
        }
        endTimes.push(<option value={"23:00"} key={"end23"}>{"23:00"}</option>);
           
        return(

             <div id={scheduSize}>

                <ScheduleFullTable repProgs={this.props.gymRepPrograms} progs={this.props.gymprograms} show={this.show} start={this.props.weekStart} end={this.props.weekEnd}  curday={this.props.weekdayNro} dayStr={this.props.dayStr} showProgram={this.props.showProgram}/>

                <div ref={this.setModalDivRef} className="modalDialog">
                    <div>
                        <a href="#" onClick={this.close.bind(this)} title="Sulje" className="close">X</a>

                        <h2>Lisää uusi ohjelma</h2>

                        <form>

                            <p ref={this.setDayStringRef}></p>

                            <p ref={this.setTimeError} className="error"></p>

                            <label>Toistuvuus: </label>

                            <select onChange={this.checkToisto} ref={this.setToistuvuusRef} className="timesSelect">
                                {repeatance}
                            </select>

                            <label style={{"display" : "none"}} className="finishMargin2 tk">Kesto: </label>

                            <input style={{"display" : "none"}} maxLength = "3" onInput={this.checkMax} max="999" type="number" placeholder="Kpl" ref={this.setKestoRef} className="field2 tk"/>
                            <br></br><br></br>
                            <label className="finishMargin3">Aloitus: </label>

                            <select ref={this.setStartTimeRef} className="timesSelect">
                                {startTimes}
                            </select>

                            <label className="finishMargin">Lopetus: </label>

                            <select ref={this.setEndTimeRef} className="timesSelect">
                                {endTimes}
                            </select>
                                                    
                            <p>
                                <span ref={this.setSubjectError} className="error"></span>
                                <input type="text" placeholder="Otsikko" ref={this.setSubjectRef} className="field"/>
                            </p>
                            <p>
                                <span ref={this.setProgramError} className="error"></span>
                                <textarea rows="4" cols="50" placeholder="Ohjelma" ref={this.setProgramRef} className="field"/>
                            </p>
                            <button onClick={this.handleNewProgram}>Lisää ohjelma</button>
                        </form>
                    </div>
                </div>
            </div>

        )
    }
}

export default GymProgram; //Jotta app osaa importtaa tämän