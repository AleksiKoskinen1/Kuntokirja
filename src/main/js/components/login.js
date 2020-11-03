
import React, {Component} from 'react';
const ReactDOM = require('react-dom'); 
const api = require('../api'); 
const fetch = require('../fetch');
const root = '/api';
const when = require('when');

class Login extends Component{
  
    constructor(props) {
		super(props);
        this.state = {newuser: false };	
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

        if(this.newUsername.value == ""){
            console.log("USERNAME EI VOI OLLA EMPTY");
            return;
        }
        else if(this.newPassword.value != this.newPassword2.value){
            console.log("PASSUT EI OLLU SAMAT!");
            return;
        }

        console.log("OLI SAMATr");
        console.log('/api/createNewUser/'+this.newUsername.value + '/' +this.newPassword.value);
        api({method: 'POST', path: '/api/createNewUser/'+this.newUsername.value + '/' +this.newPassword.value}).done(results => {
            this.newUsername.value = '';
            this.newPassword.value = '';
            this.newPassword2.value = '';

            this.setState({
                newuser: false
            });
           
        });

    }

    handleLogin(e){

        e.preventDefault();
        
        api({method: 'GET', path: '/api/getUser/'+this.username.value}).done(results => {
            
            if(results.entity === undefined || results.entity.length == 0){
                console.log("WONR USER");
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
                newuser: status
            });


        };


        if(!this.state.newuser){
            return (
                <div className="loginform">
                        <div>

                            <h2>Kirjaudu sisään</h2>

                            <p>
                                Testiä varten on tehty käyttäjä demo salasanalla demo.
                            </p>
                            <form>
                                <p>
                                    <input ref={this.setUsername} type="text" placeholder="Käyttäjätunnus" className="field"/>
                                </p>
                                <p>
                                    <input ref={this.setPassword} type="password" placeholder="Salasana" className="field"/>
                                </p>
                                <div>
                                    <button className="loginbtn" onClick={this.handleLogin}>Kirjaudu sisään</button>
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
                                <p>
                                    <input ref={this.setnewUsername} type="text" placeholder="Anna käyttäjätunnus" className="field"/>
                                </p>
                                <p>
                                    <input ref={this.setnewPassword} type="password" placeholder="Anna salasana" className="field"/>
                                </p>
                                <p>
                                    <input ref={this.setnewPassword2} type="password" placeholder="Anna salasana uudestaan" className="field"/>
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