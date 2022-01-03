import React, {Component, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import StickyNoteProgram from './StickyNoteProgram';
const api = require('../api'); 

//Uudempi react versio (hooks yms)
function programResults (props) {

 
    const [week, setWeek] = useState(() => {
        return moment(new Date()).isoWeek();
    });
    const [day, setDay] = useState(() => {
        return moment(new Date()).day();
    });

    const [click, setClick] = useState(false);
    const refs  = useRef([]);
    const refsdays  = useRef([]);

    console.log(props);
    console.log(day);

  //  console.log(props.user);
    useEffect( (e) => {

        console.log("USEEFFECT");

        api({method: 'GET', path: '/api/getUserRepeatanceProgramsWithDates/2021-10-28/2021-10-29/'+props.user.id}).done(repeatResults => {

            console.log(repeatResults);
        });


        const slider = document.querySelector('.parent');
        let mouseDown = false;
        let startX, scrollLeft;

        let startDragging = function (e) {
            setClick(true);
            mouseDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };
        let stopDragging = function (event) {
            mouseDown = false;
        };
        let mouseMoveD = function (e) {
            setClick(false);
            e.preventDefault();
            if(!mouseDown) { return; }
            const x = e.pageX - slider.offsetLeft;
            const scroll = x - startX;
            slider.scrollLeft = scrollLeft - scroll;
        };

        slider.scrollLeft = 10 + (65 * (week - 7));

        slider.addEventListener('mousemove', mouseMoveD, false);
        slider.addEventListener('mousedown', startDragging, false);
        slider.addEventListener('mouseup', stopDragging, false);
        slider.addEventListener('mouseleave', stopDragging, false);

        return () => {
            slider.removeEventListener('mousemove', mouseMoveD, false);
            slider.removeEventListener('mousedown', startDragging, false);
            slider.removeEventListener('mouseup', stopDragging, false);
            slider.removeEventListener('mouseleave', stopDragging, false);
          };

    }, []);

    const mouseClickD = function (e) {
        if(click){

            var cname = e.target.getAttribute('name');
            cname = cname.substring(1);
            for(let a = 1;a<=52;a++){
                refs.current[a].style.backgroundColor = "ghostwhite";    
            }
            refs.current[cname].style.backgroundColor = "lightgrey";
            setWeek(cname);
        } 
        setClick(false);
    };

    const changeDay = function (e) {

        for(let a = 0;a<=6;a++){
            refsdays.current[a].style.backgroundColor = "ghostwhite";    
        }
        e.target.style.backgroundColor = "lightgrey";
        setDay(e.target.getAttribute('name'));
    }

    
    const generateWeeks = () => {
        let content = []; 

        for (let i = 1; i <= 52; i++) {
            if(i == week) content.push(<td className="weekCell lg" ref={el => refs.current[i] = el} name={"g" + i} onClick={mouseClickD} key={"trow"+i}><h3 name={"g" + i} className="wcn">{i}</h3></td>);
            else content.push(<td className="weekCell" ref={el => refs.current[i] = el} name={"g" + i} onClick={mouseClickD} key={"trow"+i}><h3 name={"g" + i} className="wcn">{i}</h3></td>);
        }

        return <tr className="dtro">{content}</tr>;
    };

    const getWeekDayString = () => {
        if(day == 0) return "Sunnuntai";
        else if(day == 1) return "Maanantai";
        else if(day == 2) return "Tiistai";
        else if(day == 3) return "Keskiviikko";
        else if(day == 4) return "Torstai";
        else if(day == 5) return "Perjantai";
        else if(day == 6) return "Lauantai";
    }

    const selec = (dn) => {
        if(dn == day) return "wdtd lg";
        else return "wdtd";
    }
    const generateDays = () => {
        let content = []; 
        
        content.push(<td onClick={changeDay} className={selec(1)} name="1" ref={el => refsdays.current[0] = el} key={"drowma"}>Maanantai</td>);
        content.push(<td onClick={changeDay} className={selec(2)} name="2" ref={el => refsdays.current[1] = el} key={"drowti"}>Tiistai</td>);
        content.push(<td onClick={changeDay} className={selec(3)} name="3" ref={el => refsdays.current[2] = el} key={"drowke"}>Keskiviikko</td>);
        content.push(<td onClick={changeDay} className={selec(4)} name="4" ref={el => refsdays.current[3] = el} key={"drowto"}>Torstai</td>);
        content.push(<td onClick={changeDay} className={selec(5)} name="5" ref={el => refsdays.current[4] = el} key={"drowpe"}>Perjantai</td>);
        content.push(<td onClick={changeDay} className={selec(6)} name="6" ref={el => refsdays.current[5] = el} key={"drowla"}>Lauantai</td>);
        content.push(<td onClick={changeDay} className={selec(0)} name="0" ref={el => refsdays.current[6] = el} key={"drowsu"}>Sunnuntai</td>);
 
        return <tr className="dtro">{content}</tr>;
    };

    const programs = () => {
        return <StickyNoteProgram key={1} />;
    };
    
    return(
        <>
            <div id="mainb" className="mainBody">
                <div>
                    <div className="mainBodyHeader">
                        <h2>Tulokset</h2>
                    </div>		
                </div>
                <div className="md">
                    <p className="parentT">Viikko: <b>{week}</b></p>
                    <div clickable="true" className="parent" >
                        <div className="child">    
                            <table   className="resT">
                                <tbody id="table" className="tbr">
                                    {generateWeeks()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="md">
                    <p className="parentT">Viikonpäivä: <b>{getWeekDayString()}</b></p>
                    <div clickable="true">
                        <table className="resT2">
                            <tbody className="tbr">
                                {generateDays()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="parentT">Valitun päivän ohjelmat</p>
                <div className="progsdiv">
                    
                    <div className="programcontainer" clickable="true">
                        {programs()}
                    </div>
                </div>

            </div>
        </>

    )
    
}

export default programResults; //Jotta app osaa importtaa tämän