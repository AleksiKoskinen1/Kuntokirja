package com.aleksikuntokirja.kuntokirja;

import java.time.LocalDate;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

	private final WeightRepository weightRepository;
	private final GymProgramRepository gymProgramRepository;
	private final UserRepository userRepository;
	private List<GymProgram> prosrams = new ArrayList<>();

	@Autowired 
	public DatabaseLoader(WeightRepository weightRepository, GymProgramRepository gymProgramRepository, UserRepository userRepository) {
		this.weightRepository = weightRepository;
		this.gymProgramRepository = gymProgramRepository;
		this.userRepository = userRepository;
	}

	@Override
	public void run(String... strings) throws Exception {
		this.weightRepository.save(new Weight(121, "13.07.2020"));  //Linkitetään useriin later
		this.weightRepository.save(new Weight(107, "23.08.2020"));
		
	
		User u = new User("demo", "demo");
		System.out.println(u);
		GymProgram g = new GymProgram(8, 2, 0, "TREENIA PALJON!!!", "Treenausta paljon", LocalDate.of(2020, 11, 3), u);
		GymProgram g2 = new GymProgram(9, 2, 0, "TREENIA PALJON!!!", "Treenfdsljon", LocalDate.of(2020, 11, 2), u);
		List<GymProgram> prs = Arrays.asList(g, g2);	
		
		u.setPrograms(prs);
		
		userRepository.save(u);
		
		
		User u2 = new User("aleksi", "aleksi");
		GymProgram g3 = new GymProgram(11, 2, 0, "TREdsadasON!!!", "Treljon", LocalDate.of(2020, 10, 7), u2);
		GymProgram g4 = new GymProgram(12, 3, 0, "TewrwerwN!!!", "Twwwsljon", LocalDate.of(2020, 10, 8), u2);
		List<GymProgram> prs2 = Arrays.asList(g3, g4);
		
		u2.setPrograms(prs2);
		
		userRepository.save(u2);
		
		
	}
}