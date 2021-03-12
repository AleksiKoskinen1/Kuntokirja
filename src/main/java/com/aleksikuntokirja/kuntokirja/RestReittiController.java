package com.aleksikuntokirja.kuntokirja;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestReittiController {

	@Autowired
	private GymProgramRepository gymrepo;
	@Autowired
	private WeightRepository wrepo;
	@Autowired
	private UserRepository userrepo;
	
	@GetMapping("/api/getUser/{username}/{password}")
	public List<User> getUserByName(@PathVariable String username, @PathVariable String password){
		List<User> user = userrepo.findByNameAndPass(username, password);
		return user;
	}
	
	@PostMapping(path = "/api/createNewUser/{username}/{password}")
	public boolean addUser(@PathVariable String username,@PathVariable String password) {		
		
		List<User> user = userrepo.findByName(username);
		System.out.println(user);
		if (user.isEmpty()) {  //Katsotaan, että onko käyttäjätunnus varattu
			userrepo.save(new User(username, password));  
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
	
	@PostMapping(path = "/api/postProgram/{id}/{subject}/{program}/{start}/{end}/{date}")
	public void addProgramToUser(@PathVariable Long id, @PathVariable String subject,@PathVariable String program,@PathVariable String start,@PathVariable String end,@PathVariable String date) {
		
		String [] dates = date.split("\\.", 5); //Pisteen splittaus vaatii \\ eteen
		
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
		    gymrepo.save(new GymProgram(Integer.parseInt(startTimes[0]), duration, half, program,  subject, LocalDate.of(Integer.parseInt(dates[2]), Integer.parseInt(dates[1]), Integer.parseInt(dates[0])), curUser));
		}
	}
	
}
