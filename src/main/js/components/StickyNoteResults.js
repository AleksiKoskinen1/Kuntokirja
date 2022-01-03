
import React, {Component} from 'react';
import ContentEditable from 'react-contenteditable'

class StickyNoteResults extends Component {

    constructor(props) {
        super(props);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleSaveResults = this.handleSaveResults.bind(this);
        this.checkSize = this.checkSize.bind(this);
        this.contentEditable = React.createRef();
        this.timeDiv = null;
        this.butDiv = null;
        this.contDiv = null;
        this.setTimeDiv = element => { this.timeDiv = element; };
        this.setButDiv = element => { this.butDiv = element; };
        this.setContDiv = element => { this.contDiv = element; };
        let contentText = '<span>' + this.props.results+'</span>';
        this.state = {  content: contentText,
                        contentText : this.props.results, 
                        small: false
                     }; 
    } 

    handleContentChange(evt)  {
        this.setState({content: evt.target.value,
                       contentText: evt.currentTarget.innerText});
    }
    handleSaveResults(e){
        e.preventDefault();
        this.props.saveResults(this.props.note.id, this.state.contentText);
    }

    componentDidMount() { 
		window.addEventListener('resize', this.checkSize);
		this.checkSize();
	}
	componentWillUnmount() {
        window.removeEventListener("resize", this.checkSize);
    }

    checkSize(){

    /*    let timeDiv = this.timeDiv.getBoundingClientRect().right + 20;
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
        }*/
    }
   
    render() {

        let size = "sticky-note";
        let contentsize = "contents";
        
        const generateInfo = () => {

            if(!this.state.small){
                return(
                    <div className="programResultBtns" ref={this.setButDiv}>
                        <button title="Tallenna tehdyt muutokset ohjelmaan" className="saveProg pointer" onClick={this.handleSaveResults}>Tallenna</button>
                    </div>
                )
            }
            else{
                return(
                    <div className="programResultBtns" ref={this.setButDiv}>
                        <input className="talImages pointer" type="image" src="save.png" alt="T" title="Tallenna tehdyt muutokset ohjelmaan" onClick={this.handleSaveResults} width="24" height="24"></input>
                    </div>
                )

            }
        };
     
        return (
            <div key={this.props.note.id} className="program-note" >
                <div className="handle">
                    <div className="noteTitle">
                        Tulokset
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
                        {generateInfo()}
                                       
                </div>
            </div>
        )    
    }
}

export default StickyNoteResults; //Jotta app osaa importtaa tämän