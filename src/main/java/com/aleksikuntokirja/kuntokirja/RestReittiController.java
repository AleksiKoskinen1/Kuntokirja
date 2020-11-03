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
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestReittiController {

	@Autowired
	private GymProgramRepository gymrepo;
	@Autowired
	private UserRepository userrepo;
	
	@GetMapping("/api/getUser/{username}")
	public List<User> getUserByName(@PathVariable String username){
		List<User> user = userrepo.findByName(username);
		return user;
	}
	
	@PostMapping(path = "/api/createNewUser/{username}/{password}")
	public void addUser(@PathVariable String username,@PathVariable String password) {		
		userrepo.save(new User(username, password));  
	}
	
	@GetMapping("/api/getUserProgramsWithDates/{startDate}/{endDate}/{id}")
	public List<GymProgram> getUserProgramsWithDates(@PathVariable String startDate, @PathVariable String endDate, @PathVariable Integer id){
		return gymrepo.getUserProgramsWithDates(LocalDate.parse(startDate),LocalDate.parse(endDate), id); 
		
	}
	
	@GetMapping("/api/getProgramById/{id}")
	public Optional<GymProgram> getProgById(@PathVariable Long id){
		return gymrepo.findById(id);
	}
	
	@GetMapping("/api/getHighestId/")
	public Long getHighestId(){
		return gymrepo.findHighestId();
	}
	
	@GetMapping("/api/updateProgram/")
	public void updateProgram(){ 
		gymrepo.updateProgram();
	}
		
	@PostMapping(path = "/api/postProgram/{id}/{subject}/{program}/{start}/{end}/{date}")
	public void addProgramToUser(@PathVariable Long id, @PathVariable String subject,@PathVariable String program,@PathVariable String start,@PathVariable String end,@PathVariable String date) {
		
		String [] dates = date.split("\\.", 5);
		
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
