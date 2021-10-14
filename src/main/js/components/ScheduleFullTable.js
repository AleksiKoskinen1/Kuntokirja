import React, {Component} from 'react';
import Program from './Program';
import moment from 'moment';
const api = require('../api'); 

class ScheduleFullTable extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        let repeatedProgs = new Array();
        let programStartDays = [];

        const formatItem = (item,index) => {

            if (item.charAt(item.length - 2) == ':') {
                repeatedProgs[index] = item.substr(item.length - 1);
                programStartDays[index] = item.substr(0, item.length - 2);
            }
            else if (item.charAt(item.length - 3) == ':') {
                repeatedProgs[index] = item.substr(item.length - 2);
                programStartDays[index] = item.substr(0, item.length - 3);
            }
            else if (item.charAt(item.length - 4) == ':') {
                repeatedProgs[index] = item.substr(item.length - 3);
                programStartDays[index] = item.substr(0, item.length - 4);
            }
            else{
                repeatedProgs[index] = 'none';
            }

        }

        let weeknumber = this.props.dayStr.isoWeek();
        let dayStatus = 0;
        let dayString = {0:"Maanantai", 1:"Tiistai",2:"Keskiviikko",3:"Torstai",4:"Perjantai",5:"Lauantai",6:"Sunnuntai"};
        
        const programs = this.props.progs.map((item) =>           
           programStartDays.push(moment(item.localDate).day() + "-" + item.startTime + "-" + item.half) 
         
        );
        
        if(this.props.repProgs.length > 0){

            for(let s=0;s<this.props.repProgs[1].length;s++){
                this.props.repProgs[1][s].map((item) =>
                    programStartDays.push(item) //Laitetaan ohjelmien viikot 
                );
            }
 
        }

        programStartDays.map((item,index) => formatItem(item,index));

        const cellHandler = (startTime,day, dayString) => e => {
            e.preventDefault();
            if(Array.from(document.getElementsByClassName("schedulertablehover")).length > 0) this.props.show(startTime, day, dayString);
        };

        const checkForFullSize = (dayOfWeek, timeOfDay) => {

            let indexOf = programStartDays.indexOf(dayOfWeek+"-"+timeOfDay+"-"+ "0");
            let indexOfHalf = programStartDays.indexOf(dayOfWeek+"-"+timeOfDay+"-"+ "1");
            let first = false;


            if(indexOf != -1){
                dayStatus = 1;
                first = true;
            }
            if(indexOfHalf != -1){
                if(first) dayStatus = 3;
                else dayStatus = 2;
            }
 
        }
        const putProgramIfExists = (dayOfWeek, timeOfDay) => {

            let indexOf = programStartDays.indexOf(dayOfWeek+"-"+timeOfDay+"-"+ "0");
          
            //katsotaan onko päivälle ohjelmaa (Tasatunnein)
            if(indexOf != -1){

                if(repeatedProgs[indexOf] == 'none'){
                    return <Program key={dayOfWeek+timeOfDay+"0"} half={0} dayOfW={dayOfWeek} showProgram={this.props.showProgram} program={this.props.progs[indexOf]} dayofStatus={dayStatus}/>;
                }
                else {
                    return <Program key={dayOfWeek+timeOfDay+"0"} half={0} dayOfW={dayOfWeek} showProgram={this.props.showProgram} program={this.props.repProgs[0][repeatedProgs[indexOf]]} dayofStatus={dayStatus}/>;
                }
            }
         
            else return "";

        }

        const putProgramIfExistsHalf = (dayOfWeek, timeOfDay) => {
             
            let indexOfHalf = programStartDays.indexOf(dayOfWeek+"-"+timeOfDay+"-"+ "1");
            
            //katsotaan onko päivälle ohjelmaa (Puolitunnein aloitus)
            
           if(indexOfHalf != -1){

                if(repeatedProgs[indexOfHalf] == 'none'){
                    return <Program key={dayOfWeek+timeOfDay+"0"} half={0} dayOfW={dayOfWeek} showProgram={this.props.showProgram} program={this.props.progs[indexOfHalf]} dayofStatus={dayStatus}/>;
                }
                else {
                    return <Program key={dayOfWeek+timeOfDay+"0"} half={0} dayOfW={dayOfWeek} showProgram={this.props.showProgram} program={this.props.repProgs[0][repeatedProgs[indexOfHalf]]} dayofStatus={dayStatus}/>;
                }
            }
            else return "";

        }

        const setStatus = () => {
            dayStatus = 0;
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
                                    {checkForFullSize(1, i)}
                                    {putProgramIfExists(1, i)}
                                    {putProgramIfExistsHalf(1, i)}
                                    {setStatus()}
                                </td>
                                <td onClick={cellHandler(i,dayString[1],moment(weekStartD, "DD.MM.YYYY").add(1, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {checkForFullSize(2, i)}
                                    {putProgramIfExists(2, i)}
                                    {putProgramIfExistsHalf(2, i)}
                                    {setStatus()}
                                </td>
                                <td onClick={cellHandler(i,dayString[2],moment(weekStartD, "DD.MM.YYYY").add(2, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {checkForFullSize(3, i)}
                                    {putProgramIfExists(3, i)}
                                    {putProgramIfExistsHalf(3, i)}
                                    {setStatus()}
                                </td>
                                <td onClick={cellHandler(i,dayString[3],moment(weekStartD, "DD.MM.YYYY").add(3, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {checkForFullSize(4, i)}
                                    {putProgramIfExists(4, i)}
                                    {putProgramIfExistsHalf(4, i)}
                                    {setStatus()}
                                </td>
                                <td onClick={cellHandler(i,dayString[4],moment(weekStartD, "DD.MM.YYYY").add(4, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {checkForFullSize(5, i)}
                                    {putProgramIfExists(5, i)}
                                    {putProgramIfExistsHalf(5, i)}
                                    {setStatus()}
                                </td>
                                <td onClick={cellHandler(i,dayString[5],moment(weekStartD, "DD.MM.YYYY").add(5, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {checkForFullSize(6, i)}
                                    {putProgramIfExists(6, i)}
                                    {putProgramIfExistsHalf(6, i)}
                                    {setStatus()}
                                </td>                                    
                                <td onClick={cellHandler(i,dayString[6],moment(weekStartD, "DD.MM.YYYY").add(6, 'days').format('DD.MM.YYYY'))} className="schecolumn schedulertablehover cellsize">
                                    {checkForFullSize(0, i)}
                                    {putProgramIfExists(0, i)} 
                                    {putProgramIfExistsHalf(0, i)}
                                    {setStatus()}
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

export default ScheduleFullTable; //Jotta app osaa importtaa tämän