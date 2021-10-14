import React, {Component} from 'react';

class Program extends Component {

    constructor(props) {
        super(props);
        this.state = {color: false}
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
          //  return Colors[this.props.dayOfW];
          if(this.state.color == false) this.state.color = '#' +  Math.random().toString(16).substr(-6);
          return this.state.color;
        };

    //    console.log(this.props);
        let endString = "", startString = "";
        let startT = this.props.program.startTime;
        let topPos = 0;
        let classType = "progcontainer";
        let duration = this.props.program.duration * 1.5;
        let endTime = this.props.program.duration * 0.5 + startT;
        if(this.props.program.half == 1){
          //  topPos = 1.5;
            endTime += 0.5;
            startString = startT + ":30";
        }
        else startString = startT + ":00";
        
        if(endTime % 1 != 0){
            endTime -= 0.5;
            endString = endTime + ":30";
        }
        else endString = endTime + ":00";

        if(this.props.dayofStatus == 3){
            classType = "progcontainer2"
        }
        else if(this.props.dayofStatus == 2){
            classType = "progcontainer3"
        }

        const getSecondText = () => {
            
            if(/*this.props.dayofStatus == 1 &&*/ this.props.program.duration != 1) return <div className="text2"><div className="overflowtime">{startString+ " - "+ endString}</div></div>;
        }
        
        return(
            <div className={classType} >
                <div onClick={this.handleProgram.bind(this)} onMouseLeave={this.mouseOut.bind(this)} onMouseOver={this.mouseIn.bind(this)}  className="progFocus" style={{height: duration + "rem",  width: "100%", backgroundColor: getColor()}}>
                    <div className="progbox2">
                        <div className="textInfo">
                            <div className="textCont">
                                <div className="text1">{this.props.program.program}</div>
                                {getSecondText()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
  
}

export default Program; //Jotta app osaa importtaa tämän