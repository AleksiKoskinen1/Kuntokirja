import React, {Component, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import StickyNoteProgram from './StickyNoteProgram';
import StickyNoteResults from './StickyNoteResults';
const api = require('../api'); 
const fetch = require('../fetch');
const root = '/api';

//Uudempi react versio (hooks yms)
function programResults (props) {

    const [year, setYear] = useState(() => {
        const dat = new Date();
        return dat.getFullYear();
    });

    const [week, setWeek] = useState(() => {
        return moment(new Date()).isoWeek();
    });
    const [day, setDay] = useState(() => {
        return moment(new Date()).day();
    });

    const [dayPrograms, setPrograms] = useState(() => {
        return [];
    });

    const refs  = useRef([]);
    const refsdays  = useRef([]);
   

    useEffect( (e) => {

        loadPrograms();

        return () => {
          
          };

    }, [year, day, week]);  //Updeitataan näkymä aina kun dropareissa tapahtuu muutoksia (Eli ladataan useeffect metodi)

    const loadPrograms = function () {

        var isoday;
        if(day != 0) isoday = day - 1;
        else isoday = 6;
        var selectedDay = moment(year + "-01-01", "YYYY-MM-DD").add(week, 'weeks').startOf('isoweek').add(isoday, 'days').format('YYYY-MM-DD');
        api({method: 'GET', path: '/api/getUserProgramsAndResultsWithDates/'+selectedDay+'/'+selectedDay+'/'+props.user.id}).done(response => {
            setPrograms(response.entity);
        });  
    }

    const deleteProgram = function (id) {

        api({method: 'DELETE', path: '/api/delProg/'+id}).done(() => {
            loadPrograms();
        });
        
    }

    const saveResults = function (id, content){

        var isoday;
        if(day != 0) isoday = day - 1;
        else isoday = 6;
        var selectedDay = moment(year + "-01-01").add(week, 'weeks').startOf('isoweek').add(isoday, 'days').format('YYYY-MM-DD');

        api({method: 'POST', path: '/api/postResult/'+ id + '/' + content + '/' + selectedDay + '/'}).done(() => {

      //      console.log("sUSCCESS, ehkä tee joku ilmotus");

        });

    }

    const saveEdits = function (id, title, content) {
    
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
                    loadPrograms();
                })
            });
        });
    }

    const changeYear = function (e) {
        setYear(e.target.value);
    }

    const changeWeek = function (e) {
        setWeek(e.target.value);
    }

    const changeDay = function (e) {
        setDay(e.target.value);
    }

    const programs = () => {

        if(dayPrograms.length > 0){
        
            let content = [];  

            for (let i = 0; i < dayPrograms[1].length; i++) {
                if(dayPrograms[1][i].length > 0){

                    var resultText = "";
                    var isoday;
                    var resID = "";
                    if(day != 0) isoday = day - 1;
                    else isoday = 6; 
                    var selectedDay = moment(year + "-01-01").add(week, 'weeks').startOf('isoweek').add(isoday, 'days').format('YYYY-MM-DD');
                    for(let x = 0; x < dayPrograms[0][i].presults.length; x++){
                        if(dayPrograms[0][i].presults[x].resultDate == selectedDay){
                            resultText = dayPrograms[0][i].presults[x].results;
                            resID = dayPrograms[0][i].presults[x].results.id;
                        }
                    }

                    content.push(<tr key={"tr" + i}>
                                    <td><StickyNoteProgram note={dayPrograms[0][i]} key={dayPrograms[0][i].id} saveEdits={saveEdits} deleteProgram={deleteProgram} /></td>
                                    <td><StickyNoteResults results={resultText} note={dayPrograms[0][i]} key={"note"+dayPrograms[0][i].id+selectedDay} saveResults={saveResults} /></td>
                                </tr>);
                }   
            }

            return <>{content}</>;
        }
        else{

            return(
                <></>
                );
        }
    };

    const years = [];
    const date = new Date();
    const curY = date.getFullYear();
    for(let i = curY;i>=(curY-5);i--){
        years.push(<option value={i} key={i}>{i}</option>);
    }

    const weeknumbers = []; 
    for (let i = 1; i <= 52; i++) {
        weeknumbers.push(<option value={i} ref={el => refs.current[i] = el} key={"wn"+i}>{i}</option>);
    }

    const weekdays = []; 
        
    weekdays.push(<option value={1} ref={el => refsdays.current[0] = el} key={"drowma"}>Maanantai</option>);
    weekdays.push(<option value={2} ref={el => refsdays.current[1] = el} key={"drowti"}>Tiistai</option>);
    weekdays.push(<option value={3} ref={el => refsdays.current[2] = el} key={"drowke"}>Keskiviikko</option>);
    weekdays.push(<option value={4} ref={el => refsdays.current[3] = el} key={"drowto"}>Torstai</option>);
    weekdays.push(<option value={5} ref={el => refsdays.current[4] = el} key={"drowpe"}>Perjantai</option>);
    weekdays.push(<option value={6} ref={el => refsdays.current[5] = el} key={"drowla"}>Lauantai</option>);
    weekdays.push(<option value={0} ref={el => refsdays.current[6] = el} key={"drowsu"}>Sunnuntai</option>);
    
    return(
        <>
            <div id="mainb" className="mainBody">
                <div>
                    <div className="mainBodyHeader">
                        <h2>Tulokset</h2>
                    </div>		
                </div>

                <div id="addR">
                    <div>

                        <label className="wLabelLeft wLabelRight">Vuosi:</label>
                        <select defaultValue={curY} className=""  onChange={changeYear}>
                            {years}
                        </select>				
                        
                        <label className="wLabelLeft wLabelRight">Viikko:</label>
                        <select defaultValue={week} onChange={changeWeek}>
                            {weeknumbers}
                        </select>
                        
                        <label className="wLabelLeft wLabelRight">Viikonpäivä:</label>
                        <select defaultValue={day} className="wSelectRight" onChange={changeDay}>
                            {weekdays}
                        </select>
                      
                    </div>
                </div>

                <div className="progsdiv">
                    
                    <div className="programcontainer" clickable="true">
                        <table>
                            <thead>
                                <tr>
                                    <th>Ohjelma</th>
                                    <th>Tulos</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {programs()}
                                  
                            </tbody>
                        </table>
                      
                    </div>
                </div>

            </div>
        </>

    )
    
}

export default programResults; //Jotta app osaa importtaa tämän