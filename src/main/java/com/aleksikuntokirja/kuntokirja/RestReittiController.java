package com.aleksikuntokirja.kuntokirja;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@RestController
public class RestReittiController {

	private static final String MY_SESSION_USER_ID = "userid";
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Bean
	public PasswordEncoder encoder() {
	    return new BCryptPasswordEncoder();
	}
	
	@Autowired
	private GymProgramRepository gymrepo;
	@Autowired
	private WeightRepository wrepo;
	@Autowired
	private UserRepository userrepo;
	
	@GetMapping("/api/getUser/{username}/{password}")
	public List<User> getUserByName(@PathVariable String username, @PathVariable String password, final HttpServletRequest request){
		
		List<User> user = userrepo.findByName(username);
		List<User> empty = new ArrayList<>();
		List<String> id  = new ArrayList<>();
    
		if(!user.isEmpty()) { //Käyttäjätunnus oli olemassa, katsotaan salasana (Duplikaatteja ei pitäisi koskaan mennä)
			
			if(passwordEncoder.matches(password, user.get(0).getPassword()) == true) {  //Katsotaan, onko encoodattu salasana oikea
				
				id.add(user.toString());
		    	request.getSession().setAttribute(MY_SESSION_USER_ID, id); //Jos oli user oikea, laitetaan sen id sessioon	
		    	return user;
			}
			else return empty;	
		}
		else {
			return empty;	
		}
	}
	
	@GetMapping("/api/getSession/")
	public Optional<User> getUserWithSession(final HttpSession session){
		
		@SuppressWarnings("unchecked")
		final List<String> id = (List<String>) session.getAttribute(MY_SESSION_USER_ID);
	        
	        if( !CollectionUtils.isEmpty(id)) {
	        	String aaa = id.get(0).toString();	        	
	        	aaa = aaa.replaceAll("[^1-9]", "");
	        	 
	        	long idN = Long.parseLong(aaa);
	        	Optional<User> user = userrepo.findById(idN);
	    		
	        	return user;
	        }
	        else return Optional.empty();
	}
	
	@PostMapping(path = "/api/createNewUser/{username}/{password}")
	public boolean addUser(@PathVariable String username,@PathVariable String password) {		
		
		List<User> user = userrepo.findByName(username);
		if (user.isEmpty()) {  //Katsotaan, että onko käyttäjätunnus varattu
		
			User newuser = new User();
			newuser.setName(username);
			newuser.setPassword(passwordEncoder.encode(password));
			userrepo.save(newuser);  
			return true;
		}
		else return false;
		
	}
	
	@DeleteMapping(path = "/api/delProg/{id}")
	public void delProg(@PathVariable Long id) {		
		gymrepo.deleteProgram(id); 		
	}
	
	@DeleteMapping(path = "/api/delWeight/{id}")
	public void delWeight(@PathVariable Long id) {		
		wrepo.deleteWeight(id); 		
	}
	
	@PostMapping(path = "/api/editWeight/{id}/{weight}")
	public void editWeight(@PathVariable Long id,@PathVariable Float weight) {		
		wrepo.updateWeight(id, weight); 		
	}
	
	@SuppressWarnings("null")
	@GetMapping("/api/getUserRepeatanceProgramsWithDates/{startDate}/{endDate}/{id}")
	public List<Object> getUserRepeatanceProgramsWithDates(@PathVariable String startDate, @PathVariable String endDate, @PathVariable Integer id){
			
		//Tässä haettu jokainen toistuva ohjelma (Ei haeta muita). Katsotaan jokainen läpi ja jos osuu valitulle viikolle, otetaan mukaan
		List<GymProgram> weekPrograms = gymrepo.getUserRepeatanceProgramsWithDates(LocalDate.parse(startDate),LocalDate.parse(endDate), id); 
		List<Object> newList = new ArrayList<Object>();
		
		String [] sDates = startDate.split("-", 5); //Pisteen splittaus vaatii \\ eteen
		String [] eDates = endDate.split("-", 5); //Pisteen splittaus vaatii \\ eteen
				
		LocalDate locS = LocalDate.of(Integer.parseInt(sDates[0]), Integer.parseInt(sDates[1]), Integer.parseInt(sDates[2]));   
		LocalDate locE = LocalDate.of(Integer.parseInt(eDates[0]), Integer.parseInt(eDates[1]), Integer.parseInt(eDates[2]));   
		locE = locE.plus(1, ChronoUnit.DAYS);  //Jotta silmukat käy vikan päivän läpi
		
		List<GymProgram> programList = new ArrayList<GymProgram>();
		List<Object> timeList = new ArrayList<Object>();
		
		for (int i = 0; i < weekPrograms.size(); i++){
			Integer rep = weekPrograms.get(i).getRepeatance(); 
			Integer repDur = weekPrograms.get(i).getRepDuration() + 1;  //while silmukka ottaa vikan
			
			List<String> progStrings = new ArrayList<String>();
			
			locS = LocalDate.of(Integer.parseInt(sDates[0]), Integer.parseInt(sDates[1]), Integer.parseInt(sDates[2])); //Laitetaan lähtökohtaan takas
			
			GymProgram singleProgram = weekPrograms.get(i);
			programList.add(singleProgram);
			
			LocalDate programDate =  singleProgram.getLocalDate();			
			int dayOfWeek = 0;
				
			while( !locS.equals(locE) ) {  //Käydään jokainen päivä läpi yksitellen
				int repDurStart = 1;
				programDate = singleProgram.getLocalDate();
				String one = "";
				dayOfWeek++;
				while(repDurStart != repDur) {						
					if(locS.equals(programDate)) {
						
						if(dayOfWeek == 7) dayOfWeek = 0; //Viikko alkaa 0 päivästä
						one = dayOfWeek + "-" + singleProgram.getStartTime() + "-" + singleProgram.getHalf() + ":" + i;  
						progStrings.add(one);
					}
					
					repDurStart++;
					
					if(rep == 2) programDate = programDate.plus(1, ChronoUnit.DAYS);  //Katsotaan milloin on lopetus päivä, eli lisätään päiviä keston verran
					else if(rep == 3) programDate = programDate.plus(1, ChronoUnit.WEEKS);
					else if(rep == 4) programDate = programDate.plus(4, ChronoUnit.WEEKS);  //LAsketaan 1 kuukausi = 4 viikkoa. Pysyy päivä samana ainakin
				}
				
				locS = locS.plus(1, ChronoUnit.DAYS);  //Katsotaan milloin on lopetus päivä, eli lisätään päiviä keston verran
			}
				
			timeList.add(progStrings);			
		}
				
		newList.add(programList);
		newList.add(timeList);
		
		return newList;
		
	}
	
	@GetMapping("/api/getUserProgramsWithDates/{startDate}/{endDate}/{id}")
	public List<GymProgram> getUserProgramsWithDates(@PathVariable String startDate, @PathVariable String endDate, @PathVariable Integer id){
		return gymrepo.getUserProgramsWithDates(LocalDate.parse(startDate),LocalDate.parse(endDate), id); 
		
	}
	
	@GetMapping("/api/getUserWeightsWithMY/{year}/{month}/{id}")
	public List<Weight> getUserWeightsWithMY(@PathVariable Integer year, @PathVariable Integer month, @PathVariable Integer id){
		return wrepo.getUserWeightsWithDates(year,month,id); 
		
	}
	
	@GetMapping("/api/getProgramById/{id}")
	public Optional<GymProgram> getProgById(@PathVariable Long id){
		return gymrepo.findById(id);
	}
	
	@GetMapping("/api/logout/")
	public void logout(final HttpServletRequest request){
		request.getSession().invalidate(); //Poistetaan sessio logoutissa		
	}
	
	@GetMapping("/api/getHighestId/")
	public Long getHighestId(){
		return gymrepo.findHighestId();
	}
	/*
	@GetMapping("/api/updateProgram/")
	public void updateProgram(){ 
		gymrepo.updateProgram();
	}
		*/
	
	@PostMapping(path = "/api/postWeight/{id}/{date}/{weight}")
	public void addWeightToUser(@PathVariable Long id, @PathVariable String date,@PathVariable Float weight) {
	
		String[] dateSplitted = date.split("\\.", 5);  //Pisteen splittaus vaatii \\ eteen
			
		Optional<User> user = userrepo.findById(id);
		if (user.isPresent()) {
		    User curUser = user.get();
	
		    //Katsotaan, että jos paino on olemassa, niin tehdään sen päivitys (vain 1 paino per päivä!) Jos ei olemassa, lisätään uusi
		    Long w = wrepo.getUserPossibleWeight(Integer.parseInt(dateSplitted[2]), Integer.parseInt(dateSplitted[1]), Integer.parseInt(dateSplitted[0]), id);
		    if (w == null) {
		    	wrepo.save(new Weight(weight, Integer.parseInt(dateSplitted[2]), Integer.parseInt(dateSplitted[1]), Integer.parseInt(dateSplitted[0]), curUser));
		    }
		    else {
		    	wrepo.updateWeight(w, weight);
		    }
		}
	}
	
	/*
	 * Toistuvuus (repeatance)
	 * 1 = Kerran 
	 * 2 = Päivittäin
	 * 3 = Viikottain
	 * 4 = Kuukausittain
	 */
	@PostMapping(path = "/api/postProgram/{id}/{subject}/{program}/{start}/{end}/{date}/{repeatance}/{repDuration}")
	public void addProgramToUser(@PathVariable Long id, @PathVariable String subject,@PathVariable String program,@PathVariable String start,@PathVariable String end,@PathVariable String date,@PathVariable Integer repeatance,@PathVariable Integer repDuration) {
		
		LocalDate durEndDate = null;
		LocalDate pStartDate = null;
		
		String [] dates = date.split("\\.", 5); //Pisteen splittaus vaatii \\ eteen
		
		pStartDate = LocalDate.of(Integer.parseInt(dates[2]), Integer.parseInt(dates[1]), Integer.parseInt(dates[0]));
		
		if(repeatance == 1 || repDuration == 1 || repDuration == 0) durEndDate = pStartDate;
		else {
			
			if(repeatance == 2) {
				durEndDate = pStartDate.plus(repDuration, ChronoUnit.DAYS);  //Katsotaan milloin on lopetus päivä, eli lisätään päiviä keston verran
			}
			else if(repeatance == 3) {
				durEndDate = pStartDate.plus(repDuration, ChronoUnit.WEEKS);  //Katsotaan milloin on lopetus päivä, eli lisätään viikkoja keston verran
			}
			else if(repeatance == 4) {
				durEndDate = pStartDate.plus(repDuration * 4, ChronoUnit.WEEKS);  //Katsotaan milloin on lopetus päivä, eli lisätään kuukausia keston verran
			}
			durEndDate = durEndDate.minus(1, ChronoUnit.DAYS);  //Jotta ei tule yhtä päivää liikaa (Lasketaan aloituspäivä mukaan)
		}
		
		int half = 0, duration = 0;
		String startHalf = "00", endHalf = "00";
		
		String [] startTimes = start.split(":", 2);
		String [] endTimes = end.split(":", 2);
		
		if(startTimes[1].equals("30")) {
			startHalf = "50";
			half = 1;
		}
		if(endTimes[1].equals("30")) endHalf = "50";
		
		duration = (Integer.parseInt(endTimes[0] + endHalf) - Integer.parseInt(startTimes[0] + startHalf)) / 50; //lasketaan kesto (30 min on 1 sykli)  
		
		Optional<User> user = userrepo.findById(id);
		if (user.isPresent()) {
		    User curUser = user.get();
		    gymrepo.save(new GymProgram(Integer.parseInt(startTimes[0]), duration, half, subject,  program, pStartDate, curUser, repeatance, repDuration, durEndDate));
		}
	}
	
}
