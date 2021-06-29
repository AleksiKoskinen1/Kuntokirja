
import React, {Component} from 'react';
const ReactDOM = require('react-dom'); 
const api = require('../api'); 
const fetch = require('../fetch');
const root = '/api';
const when = require('when');

class Login extends Component{
  
    constructor(props) {
		super(props);
        this.state = {newuser: false, errorText: "" };	
        this.handleLogin = this.handleLogin.bind(this);
        this.handleNewUser = this.handleNewUser.bind(this);
        this.username = null;
        this.password = null;
        this.newUsername = null;
        this.newPassword = null;
        this.newPassword2 = null;

        this.setUsername = element => { this.username = element; };
        this.setPassword = element => { this.password = element; };
        this.setnewUsername = element => { this.newUsername = element; };
        this.setnewPassword = element => { this.newPassword = element; };
        this.setnewPassword2 = element => { this.newPassword2 = element; };
    } 


    handleNewUser(e){
        e.preventDefault();

        this.newUsername.style="";
        this.newPassword.style="";
        this.newPassword2.style="";

        if(this.newUsername.value == "" && this.newPassword.value == "" && this.newPassword2.value == ""){
            this.newUsername.style="border-color:red";
            this.newPassword.style="border-color:red";
            this.newPassword2.style="border-color:red";

            this.setState({
                errorText: "Syötä kenttien tiedot!"
            });
            return;
        }
        else if(this.newUsername.value == "" && this.newPassword.value != "" && this.newPassword2.value != ""){
            this.newUsername.style="border-color:red";

            this.setState({
                errorText: "Käyttäjätunnus puuttuu!"
            });
            return;
        }
        else if(this.newUsername.value == "" && this.newPassword.value == "" && this.newPassword2.value != ""){
            this.newUsername.style="border-color:red";
            this.newPassword.style="border-color:red";
            
            this.setState({
                errorText: "Syötä kenttien tiedot!"
            });
            return;
        }
        else if(this.newUsername.value == "" && this.newPassword.value != "" && this.newPassword2.value == ""){
            this.newUsername.style="border-color:red";
            this.newPassword2.style="border-color:red";
            
            this.setState({
                errorText: "Syötä kenttien tiedot!"
            });
            return;
        }
        else if(this.newUsername.value != "" && this.newPassword.value == "" && this.newPassword2.value == ""){
            this.newPassword2.style="border-color:red";
            this.newPassword.style="border-color:red";
            
            this.setState({
                errorText: "Syötä salasanat!"
            });
            return;
        }
        else if(this.newUsername.value != "" && this.newPassword.value == "" && this.newPassword2.value != ""){
            this.newPassword.style="border-color:red";
            
            this.setState({
                errorText: "Syötä salasana!"
            });
            return;
        }
        else if(this.newUsername.value != "" && this.newPassword.value != "" && this.newPassword2.value == ""){
            this.newPassword2.style="border-color:red";
            
            this.setState({
                errorText: "Syötä salasana!"
            });
            return;
        }
        else if(this.newPassword.value != this.newPassword2.value){
            this.setState({
                errorText: "Salasanat eivät täsmää!"
            });
            return;
        }

        
        api({method: 'POST', path: '/api/createNewUser/'+this.newUsername.value + '/' +this.newPassword.value}).done(results => {
            
            console.log(results);
            //Katsotaan onko username varattu
            if(!results.entity){
                this.newUsername.style="border-color:red";

                this.setState({
                    errorText: "Käyttäjätunnus on jo käytössä!"
                });
                return;
            }
            else{
                this.newUsername.value = '';
                this.newPassword.value = '';
                this.newPassword2.value = '';

                this.setState({
                    newuser: false,
                    errorText: ""
                });
            }
           
        });

    }

    handleLogin(e){

        this.username.style="";
        this.password.style="";

        e.preventDefault();
        if(this.username.value == "" && this.password.value == ""){
            this.username.style="border-color:red";
            this.password.style="border-color:red";
            this.setState({
                errorText: "Syötä käyttäjätunnus ja salasana!"
            });
            return;
        }
        else if(this.username.value == ""){
            this.username.style="border-color:red";
            this.setState({
                errorText: "Käyttäjätunnus ei voi olla tyhjä!"
            });
            return;
        } 
        else if(this.password.value == ""){
            this.password.style="border-color:red";
            this.setState({
                errorText: "Salasana ei voi olla tyhjä!"
            });
            return;
        }

        api({method: 'GET', path: '/api/getUser/'+this.username.value+'/'+this.password.value}).done(results => {
            
            if(results.entity === undefined || results.entity.length == 0){
                this.setState({
                    errorText: "Väärä käyttäjätunnus ja/tai salasana!"
                });
            }
            else{
                this.props.login(results);
            }
        });
    
    }
    
    render() { 

        const newUser = (status, view) => e => {
            e.preventDefault();
            if(view == 1){
                this.username.value = '';
                this.password.value = '';
            }
            else if(view == 2){
                this.newUsername.value = '';
                this.newPassword.value = '';
                this.newPassword2.value = '';
            }
            
            this.setState({
                newuser: status,
                errorText: ""
            });


        };


        if(!this.state.newuser){
            return (
                <div className="loginform">
                        <div>

                            <h2>Kirjaudu sisään</h2>

                            <p>
                                Testiä varten on tehty käyttäjä demo salasanalla pass.
                            </p>
                            <form>
                                <span className="errorText">{this.state.errorText}</span>
                                <p>
                                    <input title="Syötä tähän käyttäjätunnuksesi" ref={this.setUsername} type="text" placeholder="Käyttäjätunnus" className="field"/>
                                </p>
                                <p>
                                    <input title="Syötä tähän salasanasi" ref={this.setPassword} type="password" placeholder="Salasana" className="field"/>                                    
                                </p>
                                <div>
                                    <button className="loginbtn pointer" onClick={this.handleLogin}>Kirjaudu sisään</button>
                                    <a href="#" onClick={newUser(true, 1)} className="newusertxt">Uusi käyttäjä?</a>
                                </div>
                            </form>
                        </div>
                </div>
            )
        }
        else if(this.state.newuser){
            return (
                <div className="loginform">
                        <div>
                            <h2>Luo käyttäjä</h2>

                            <form>
                                <span className="errorText">{this.state.errorText}</span>
                                <p>
                                    <input title="Syötä tähän uusi käyttäjätunnus" ref={this.setnewUsername} type="text" placeholder="Anna käyttäjätunnus" className="field"/>
                                </p>
                                <p>
                                    <input title="Syötä tähän salasanasi" ref={this.setnewPassword} type="password" placeholder="Anna salasana" className="field"/>
                                </p>
                                <p>
                                    <input title="Syötä tähän sama salasana kuin ylhäällä" ref={this.setnewPassword2} type="password" placeholder="Anna salasana uudestaan" className="field"/>
                                </p>
                                <div>
                                    <button className="loginbtn" onClick={this.handleNewUser}>Luo tunnus</button>
                                    <button className="backtologin" onClick={newUser(false, 2)}>Takaisin kirjautumiseen</button>
                                </div>
                            </form>
                        </div>
                </div>
            )
        }
	}
}




export default Login; //Jotta app osaa importtaa tämän