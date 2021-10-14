
import React, {Component} from 'react';
import ContentEditable from 'react-contenteditable'

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

        let timeDiv = this.timeDiv.getBoundingClientRect().right + 20;
        let butDiv = this.butDiv.getBoundingClientRect().left;
        let total = this.timeDiv.offsetWidth + this.butDiv.offsetWidth + 20;

        if(butDiv < timeDiv){  //Liian pieni näkymä napeille in here
            this.setState({
                small: true,
                smallSizeLimit: this.contDiv.offsetWidth
            });
        }
        else if(this.state.small && this.contDiv.offsetWidth > this.state.smallSizeLimit){
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

        const repeatString = () => {

            if(this.props.note.repeatance == 1) return "Kertaohjelma";
            else if(this.props.note.repeatance == 2) return "Päivittäinen";
            else if(this.props.note.repeatance == 3) return "Viikottainen";
            else if(this.props.note.repeatance == 4) return "Kuukausittainen";
       
        }

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
                        <input className="talImages pointer" type="image" src="save.png" alt="T" title="Tallenna tehdyt muutokset ohjelmaan" onClick={this.handleSaveEdits} width="24" height="24"></input>
                        <input className="pointer" type="image" src="trash.png" alt="P" title="Poista tämä ohjelma kalenterista" onClick={this.handleDeleteProgram} width="24" height="24"></input>
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
                        <p className="datespan">{repeatString()}</p> 
                    </div>
                   
                       
                        {generateInfo()}
                        
                    
                </div>
            </div>
        )    
    }
}

export default StickyNote; //Jotta app osaa importtaa tämän