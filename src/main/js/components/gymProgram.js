
import React, {Component} from 'react';
const ReactDOM = require('react-dom'); 
const api = require('../api'); 
const fetch = require('../fetch');
const root = '/api';
const when = require('when');
import Calendar from 'react-calendar';
import moment from 'moment';
import ContentEditable from 'react-contenteditable'

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
            mainContentSize: "full"
            
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

    //    let right = this.calDiv.getBoundingClientRect().right;
    //    right += 400;
    //    let size = "full";
    //    console.log("right: " +right);
    //    console.log("SIZE!!" + size);
    //    console.log("winddow!!" + window.innerWidth);
   //     if(window.innerWidth < right ) size= "small";
   //     console.log(this.props.user);
        let calW = this.calDiv.clientWidth;
        let minWi = 298;
        let size = "full";
        if(calW < minWi) size= "small";

     //   console.log("SIZE11!!" + size);
        let startOfWeek = moment(this.state.date).startOf('isoweek');
        let dayS = startOfWeek;
        let endOfWeek = moment(this.state.date).endOf('isoweek');
        let start = startOfWeek.format('YYYY') + "-" + startOfWeek.format('MM') + "-" +startOfWeek.format('DD');
        let end = endOfWeek.format('YYYY') + "-" + endOfWeek.format('MM') + "-" +endOfWeek.format('DD');

		api({method: 'GET', path: '/api/getUserProgramsWithDates/'+start+'/'+end+'/'+this.props.user.id}).done(response => {
                
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
                    mainContentSize: size
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
                        mainContentSize: size
                    });
                });
            }
        });

    }

    newProgram(subject, program, start, end, day){
        
        api({method: 'POST', path: '/api/postProgram/'+ this.props.user.id + '/' + subject + '/' + program + '/' + start + '/' + end + '/' + day}).done(response => {
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
            this.setState({
                date: cDate,
                gymprograms: response.entity,
                weekday: this.getDays(cDate),
                weekdayNro: this.getDayNro(cDate),
                startNro: this.getWeekStart(cDate),
                endNro: this.getWeekEnd(cDate),
                weekdates: this.getSelectedWeekDates(cDate),
                dayStr: dayS
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
      /*  let right = this.calDiv.clientWidth;
        console.log("TABLE right: " +right);
        right += 400;
        console.log("window width: " +window.innerWidth);  */
     //   console.log(this.state);

        let calWidth = this.calDiv.clientWidth;
        let minW = 298;
        let minWindowW = 1390;
    //    console.log("calWidth: " +calWidth);
     //   console.log("window width: " +window.innerWidth);
        if(calWidth < minW && window.innerWidth < minWindowW && this.state.mainContentSize != "small"){
         //   console.log("checkSizeSMALL");
            this.setState({
                mainContentSize: "small"
            });
        }
        else if(calWidth > minW && window.innerWidth > minWindowW && this.state.mainContentSize != "full"){
       //     console.log("checkSizeFULL");
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
     
        console.log(id);
        fetch(api, root, [
			{rel: 'gymPrograms'}]
		).done(results => {              
            api({method: 'GET', path: results.url + "/"+id}).done(program => {
           //     console.log(program);
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

        console.log(this.state);
     //   console.log("RENDER + sIZE : " + size);
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
                                    weekday={this.state.weekday} 
                                    weekdayNro={this.state.weekdayNro}
                                    weekStart={this.state.startNro}
                                    weekEnd={this.state.endNro}
                                    weekdates={this.state.weekdates}
                                    dayStr={this.state.dayStr}
                                    size={size}                             
                                    newProgram={this.newProgram}
                                    showProgram={this.showProgram} />
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
                                    weekday={this.state.weekday} 
                                    weekdayNro={this.state.weekdayNro}
                                    weekStart={this.state.startNro}
                                    weekEnd={this.state.endNro}
                                    weekdates={this.state.weekdates}
                                    dayStr={this.state.dayStr}
                                    size={size}                                    
                                    newProgram={this.newProgram}
                                    showProgram={this.showProgram} />


                    </div>
                }

			</div>
		)
	}
}

class StickyNote extends Component {

    constructor(props) {
        super(props);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleSaveEdits = this.handleSaveEdits.bind(this);
        this.handleDeleteProgram = this.handleDeleteProgram.bind(this);
        this.checkSize = this.checkSize.bind(this);
        this.titleEditable = React.createRef();
        this.contentEditable = React.createRef();
        this.timeDiv = null;
        this.butDiv = null;
        this.contDiv = null;
        this.setTimeDiv = element => { this.timeDiv = element; };
        this.setButDiv = element => { this.butDiv = element; };
        this.setContDiv = element => { this.contDiv = element; };
        let titleText = '<span style="color: black; font-size: 1.2rem; ">' + this.props.note.program+'</span>';
        let contentText = '<span>' + this.props.note.subject+'</span>';
        this.state = {title: titleText,
                      titleText: this.props.note.program,
                      content: contentText,
                      contentText : this.props.note.subject,
                      small: false
                     };
    } 

    handleTitleChange(evt){
        this.setState({title: evt.target.value,
                       titleText: evt.currentTarget.innerText});
    }
    handleContentChange(evt)  {
        this.setState({content: evt.target.value,
                       contentText: evt.currentTarget.innerText});
    }
    handleSaveEdits(e){
        e.preventDefault();
        this.props.saveEdits(this.props.note.id, this.state.titleText, this.state.contentText);
    }
    handleDeleteProgram(e){
        e.preventDefault();
        this.props.deleteProgram(this.props.note.id);
    }

    componentDidMount() { 
		window.addEventListener('resize', this.checkSize);
		this.checkSize();
	}
	componentWillUnmount() {
        window.removeEventListener("resize", this.checkSize);
    }

    checkSize(){

     //   console.log(this.timeDiv.getBoundingClientRect());
        let timeDiv = this.timeDiv.getBoundingClientRect().right + 20;
        let butDiv = this.butDiv.getBoundingClientRect().left;
        let total = this.timeDiv.offsetWidth + this.butDiv.offsetWidth + 20;
     /*   console.log(total);
        console.log(this.contDiv.offsetWidth);
        console.log(timeDiv);
        console.log(butDiv);*/
        if(butDiv < timeDiv){  //Liian pieni näkymä napeille in here
          //  console.log("SMALL");
            this.setState({
                small: true,
                smallSizeLimit: this.contDiv.offsetWidth
            });
        }
        else if(this.state.small && this.contDiv.offsetWidth > this.state.smallSizeLimit){
           // console.log("FULL");
            this.setState({
                small: false
            });
        }
    }

    render() {

        let size = "sticky-note";
        let contentsize = "contents";
        if(this.props.size == "small"){
            size = "sticky-noteSm";
            contentsize ="contentsSm";
        } 

        let endString = "", startString = "";
        let startT = this.props.note.startTime;
        let height = (startT - 6) * 3;
        
        let duration = this.props.note.duration * 1.5;
        let endTime = this.props.note.duration * 0.5 + startT;
        if(this.props.note.half == 1){
            height += 1.5;
            endTime += 0.5;
            startString = startT + ":30";
        }
        else startString = startT + ":00";
        
        if(endTime % 1 != 0){
            endTime -= 0.5;
            endString = endTime + ":30";
        }
        else endString = endTime + ":00";
       
        const dateString = () => {

            var dateS = this.props.note.localDate.split("-");
            return dateS[2]+"."+dateS[1]+"."+dateS[0];
        };

        const generateInfo = () => {

            if(!this.state.small){
                return(
                    <div className="programDataBtns" ref={this.setButDiv}>
                        <button title="Tallenna tehdyt muutokset ohjelmaan" className="saveProg pointer" onClick={this.handleSaveEdits}>Tallenna</button>
                        <button title="Poista tämä ohjelma kalenterista" className="pointer" onClick={this.handleDeleteProgram}>Poista ohjelma</button>
                    </div>
                )
            }
            else{
                return(
                    <div className="programDataBtns" ref={this.setButDiv}>
                        <input className="talImages pointer" type="image" src="save.png" alt="T" title="Tallenna tehdyt muutokset ohjelmaan" width="24" height="24"></input>
                        <input className="pointer" type="image" src="trash.png" alt="P" title="Poista tämä ohjelma kalenterista" width="24" height="24"></input>
                    </div>
                )

            }
        };
      
        return (
            <div key={this.props.note.id} className={size} >
                <div className="handle">
                    <div className="noteTitle">
                        <ContentEditable
                        innerRef={this.titleEditable}
                        html={this.state.title} 
                        disabled={false}      
                        onChange={this.handleTitleChange} 
                        tagName='article'
                    />
                    </div>
                </div>
                <div className={contentsize} ref={this.setContDiv}>
                    <ContentEditable
                        innerRef={this.contentEditable}
                        html={this.state.content} 
                        disabled={false}      
                        onChange={this.handleContentChange} 
                        tagName='article'
                    />
                </div>
                <div>
                    <div className="programData" ref={this.setTimeDiv}>
                        <p className="datespan">{startString+ " - "+ endString}</p>
                        <p className="datespan">{dateString()}</p>
                    </div>
                   
                       
                        {generateInfo()}
                        
                    
                </div>
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
        this.modalDiv = null; this.startTime = null; 
        this.endTime = null; this.dayString = null;
        this.subject = null; this.program = null;
        this.selectedDay = null; this.subjectError = null;
        this.programError = null;

        this.setModalDivRef = element => { this.modalDiv = element; };
        this.setStartTimeRef = element => { this.startTime = element; };
        this.setEndTimeRef = element => { this.endTime = element; };
        this.setDayStringRef = element => { this.dayString = element; };
        this.setSubjectRef = element => { this.subject = element; };
        this.setProgramRef = element => { this.program = element; };
        this.setProgramError = element => { this.programError = element; };
        this.setSubjectError = element => { this.subjectError = element; };

        
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
    }
    handleNewProgram(e){
        e.preventDefault();

        if(this.handleValidation()){
            this.modalDiv.style.opacity = 0;
            this.modalDiv.style.pointerEvents = 'none';
            let subject = this.subject.value.trim();
            let program = this.program.value.trim();
            
            this.props.newProgram(subject, program, this.startTime.value , this.endTime.value, this.selectedDay);

            this.subject.value = ""; //Nollataan arvot
            this.program.value = "";
        }
    }

    handleValidation(){
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
        return success;
    }
    
    render(){

        let scheduSize = "scheduler";
        if(this.props.size == "small"){
            scheduSize = "schedulerSm";
        }

        const startTimes = [];
        const endTimes = [];

        for(let i = 6;i<=22;i++){
            startTimes.push(<option value={i+":00"} key={"start"+i}>{i+":00"}</option>);
            startTimes.push(<option value={i+":30"} key={"start"+i+"3"}>{i+":30"}</option>);
            endTimes.push(<option value={i+":00"} key={"end"+i}>{i+":00"}</option>);
            endTimes.push(<option value={i+":30"} key={"end"+i+"3"}>{i+":30"}</option>);
        }
        endTimes.push(<option value={"23:00"} key={"end23"}>{"23:00"}</option>);
        

        return(

            <div id={scheduSize}>

                <ScheduleFullTable progs={this.props.gymprograms} show={this.show} start={this.props.weekStart} end={this.props.weekEnd}  curday={this.props.weekdayNro} dayStr={this.props.dayStr} showProgram={this.props.showProgram}/>

                <div ref={this.setModalDivRef} className="modalDialog">
                    <div>
                        <a href="#" onClick={this.close.bind(this)} title="Sulje" className="close">X</a>

                        <h2>Lisää uusi ohjelma</h2>

                        <form>

                            <p ref={this.setDayStringRef}></p>

                            <label>Aloitus: </label>

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

class Program extends Component {

    constructor(props) {
        super(props);
    }

    handleProgram(){
        this.props.showProgram(this.props.program.id);
    }

    mouseIn(){
        Array.from(document.getElementsByClassName("schecolumn")).forEach(
            function(element, index, array) {
                element.classList.remove("schedulertablehover");
            }
        );
    }
    mouseOut(){
        Array.from(document.getElementsByClassName("schecolumn")).forEach(
            function(element, index, array) {
                element.classList.add("schedulertablehover");
            }
        );
    }

    render() {

        const Colors = ["lightsalmon", "lightseagreen", "lightgreen", "lightskyblue", "orange", "brown", "lightgrey"];
        const getColor = () => {            
            return Colors[this.props.dayOfW];
        };

        let endString = "", startString = "";
        let startT = this.props.program.startTime;
        let topPos = 0;
        
        let duration = this.props.program.duration * 1.5;
        let endTime = this.props.program.duration * 0.5 + startT;
        if(this.props.program.half == 1){
            topPos = 1.5;
            endTime += 0.5;
            startString = startT + ":30";
        }
        else startString = startT + ":00";
        
        if(endTime % 1 != 0){
            endTime -= 0.5;
            endString = endTime + ":30";
        }
        else endString = endTime + ":00";
        
        return(
            <div onMouseLeave={this.mouseOut.bind(this)} onMouseOver={this.mouseIn.bind(this)}  onClick={this.handleProgram.bind(this)} className="progcontainer" style={{top: topPos + "rem"}}>
                <div className="progFocus" style={{height: duration + "rem",  width: "100%", backgroundColor: getColor()}}>
                    <div className="progbox2">
                        <div className="textInfo">
                            <div className="textCont">
                                <div className="text1">{this.props.program.program}</div>
                                <div className="text2"><div className="overflowtime">{startString+ " - "+ endString}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
  
}

class ScheduleFullTable extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        let weeknumber = this.props.dayStr.isoWeek();
        let dayString = {0:"Maanantai", 1:"Tiistai",2:"Keskiviikko",3:"Torstai",4:"Perjantai",5:"Lauantai",6:"Sunnuntai"};
        let programStartDays = [];
        console.log(this.props.progs);
        const programs = this.props.progs.map((item) =>           
           programStartDays.push(moment(item.localDate).day() + ":" + item.startTime + ":" + item.half) //Laitetaan ohjelmien viikot
         
        );

        console.log(programStartDays);

        const cellHandler = (startTime,day, dayString) => e => {
            e.preventDefault();
            if(Array.from(document.getElementsByClassName("schedulertablehover")).length > 0) this.props.show(startTime, day, dayString);
        };

        const putProgramIfExists = (dayOfWeek, timeOfDay) => {

            console.log(programStartDays);
            let indexOf = programStartDays.indexOf(dayOfWeek+":"+timeOfDay+":"+ "0");
            let indexOfHalf = programStartDays.indexOf(dayOfWeek+":"+timeOfDay+":"+ "1");
            //katsotaan onko päivälle ohjelmaa (Tasatunnein)
            if(indexOf != -1){
                console.log("DAY OF WEEK");
                console.log(dayOfWeek);
                console.log("timeOfDay");
                console.log(timeOfDay);
                console.log("indexOf");
                console.log(indexOf);
                return  <Program key={dayOfWeek+timeOfDay+"0"} half={0} dayOfW={dayOfWeek} showProgram={this.props.showProgram} program={this.props.progs[indexOf]}/>;
            }
            //katsotaan onko päivälle ohjelmaa (Puolitunnein aloitus)
            if(indexOfHalf != -1){
                return  <Program key={dayOfWeek+timeOfDay+"1"} half={1} dayOfW={dayOfWeek} showProgram={this.props.showProgram} program={this.props.progs[indexOfHalf]}/>;
            }
            else return "";

            
        }

        const generateHeader = (start,end,cur) => {
            let content = [];
            
            var endOfMonth = end - start;
            let monthChange = false;
            if(endOfMonth < 0) monthChange = true;
            let change = 6 - end;
            let beginNew = 1;
            for (let i = 0; i <= 6; i++) {
                if(i==0) content.push(<th key={"h"+i} className='headercell'><p className="dayName">{dayString[i]}</p> <p className="dayN">{start}</p></th>);
                else if(i==6) content.push(<th key={"h"+i} className='headercell'><p className="dayName">{dayString[i]}</p> <p className="dayN">{end}</p></th>);
                else if(!monthChange) content.push(<th key={"h"+i} className='headercell'><p className="dayName">{dayString[i]}</p> <p className="dayN">{start+i}</p></th>); //Kuu ei vaihdu, voidaan normi plus lasku tehdä
                else if(monthChange){ //Kuu vaihtuu, katsotaan että menee viikko oikein numeroissa
                    if(i > change){
                        content.push(<th key={"h"+i} className='headercell'><p className="dayName">{dayString[i]}</p> <p className="dayN">{beginNew}</p></th>);
                        beginNew++;
                    } 
                    else content.push(<th key={"h"+i} className='headercell'><p className="dayName">{dayString[i]}</p> <p className="dayN">{start+i}</p></th>);
                }
            }

            return content;
        };
        
        const generateRows = () => {
            let content = [];
            let weekStartD = this.props.dayStr.format('DD.MM.YYYY'); 
            for (let i = 6; i <= 22; i++) {
                content.push(<tr className="scheduletr" key={"row"+i}>
                                <td className='firstcellsize borderbottom'>
                                    <p className="timetd">{i+":00"}</p>
                                </td>
                                <td onClick={cellHandler(i,dayString[0], weekStartD)} className="schecolumn schedulertablehover cellsize">
                                    {putProgramIfExists(1, i)}
                                </td>
                                <td onClick={cellHandler(i,dayString[1],moment(weekStartD, "DD.MM.YYYY").add(1, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {putProgramIfExists(2, i)}
                                </td>
                                <td onClick={cellHandler(i,dayString[2],moment(weekStartD, "DD.MM.YYYY").add(2, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {putProgramIfExists(3, i)}
                                </td>
                                <td onClick={cellHandler(i,dayString[3],moment(weekStartD, "DD.MM.YYYY").add(3, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {putProgramIfExists(4, i)}
                                </td>
                                <td onClick={cellHandler(i,dayString[4],moment(weekStartD, "DD.MM.YYYY").add(4, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {putProgramIfExists(5, i)}
                                </td>
                                <td onClick={cellHandler(i,dayString[5],moment(weekStartD, "DD.MM.YYYY").add(5, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {putProgramIfExists(6, i)}
                                </td>                                    
                                <td onClick={cellHandler(i,dayString[6],moment(weekStartD, "DD.MM.YYYY").add(6, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {putProgramIfExists(0, i)}
                                </td>
                            </tr>);
            }

            return content;
        };

        return(

            <table className="posLeft">
                <thead>
                    <tr className="scheduletr" key={"scheduleheader"}>
                        <th className='firstcellsize' style={{'color': 'black', 'fontSize': '13px'}}>Viikko<br></br>{weeknumber}</th>
                        {generateHeader(this.props.start, this.props.end, this.props.curday)}
                    </tr>               
                </thead>
                <tbody>
                    {generateRows()}
                </tbody>

            </table>


        )
    }
  
}




export default GymProgram; //Jotta app osaa importtaa tämän