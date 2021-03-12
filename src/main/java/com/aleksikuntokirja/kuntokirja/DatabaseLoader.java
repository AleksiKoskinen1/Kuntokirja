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
	/*
	private Date parseDate(String date) {
	    try {
	        return new Date(DATE_FORMAT.parse(date).getTime());
	    } catch (ParseException e) {
	        throw new IllegalArgumentException(e);
	    }
	}*/

	@Override
	public void run(String... strings) throws Exception {
		//this.weightRepository.save(new Weight(121, "13.07.2020"));  //Linkitetään useriin later
		//this.weightRepository.save(new Weight(107, "23.08.2020"));
		
	
		User u = new User("demo", "pass");
		System.out.println(u);
		
		long millis=System.currentTimeMillis();  
        Date date=new java.sql.Date(millis); 
        
        //Tehdään demolle muutama paino valmiiks (1.5kk)
        Weight w = new Weight(84.2f, 2021,2,1, u);
		Weight w2 = new Weight(84.6f, 2021,2,2, u);
		Weight w3 = new Weight(84.9f, 2021,2,3 , u);
		Weight w4 = new Weight(85.4f, 2021,2,4, u);
		Weight w5 = new Weight(85.8f, 2021,2,5, u);
		Weight w6 = new Weight(85.4f, 2021,2,6 , u);
		Weight w7 = new Weight(84.6f, 2021,2,7, u);
		Weight w8 = new Weight(84.2f, 2021,2,8, u);
		Weight w9 = new Weight(83.6f, 2021,2,9, u);
		Weight w10 = new Weight(83.4f, 2021,2,10 , u);
		Weight w11 = new Weight(83.1f, 2021,2,11, u);
		Weight w12 = new Weight(82.8f, 2021,2,12, u);
		Weight w13 = new Weight(83.4f, 2021,2,13, u);
		Weight w14 = new Weight(83.4f, 2021,2,14, u);
		Weight w15 = new Weight(83.1f, 2021,2,15, u);
		Weight w16 = new Weight(83f, 2021,2,16, u);
		Weight w17 = new Weight(82.6f, 2021,2,17 , u);
		Weight w18 = new Weight(82.4f, 2021,2,18, u);
		Weight w19 = new Weight(82.1f, 2021,2,19, u);
		Weight w20 = new Weight(81.4f, 2021,2,20 , u);
		Weight w21 = new Weight(81f, 2021,2,21, u);
		Weight w22 = new Weight(81.4f, 2021,2,22 , u);
		Weight w23 = new Weight(81.6f, 2021,2,23, u);
		Weight w24 = new Weight(81.4f, 2021,2,24 , u);
		Weight w25 = new Weight(81.9f, 2021,2,25, u);
		Weight w26 = new Weight(82.4f, 2021,2,26 , u);
		Weight w27 = new Weight(82.6f, 2021,2,27, u);
		Weight w28 = new Weight(81.9f, 2021,2,28, u);
		
		Weight w29 = new Weight(82.2f, 2021,3,1, u);
		Weight w30 = new Weight(82.6f, 2021,3,2, u);
		Weight w31 = new Weight(82.9f, 2021,3,3 , u);
		Weight w32 = new Weight(83.4f, 2021,3,4, u);
		Weight w33 = new Weight(83.1f, 2021,3,5, u);
		Weight w34 = new Weight(82.8f, 2021,3,6 , u);
		Weight w35 = new Weight(82.6f, 2021,3,7, u);
		Weight w36 = new Weight(83.6f, 2021,3,8, u);
		Weight w37 = new Weight(83.9f, 2021,3,9, u);
		
		List<Weight> wgs = Arrays.asList(w,w2,w3,w4,w5,w6,w7,w8,w9,w10,w11,w12,w13,w14,w15,w16,w17,w18,w19,w20,w21,w22,w23,w24,w25,w26,w27,w28,w29,w30,w31,w32,w33,w34,w35,w36,w37);	
		
		GymProgram g = new GymProgram(8, 3, 0, "Penkkipunnerrus 4x8", "Penkki Päivä!", LocalDate.of(2021, 3, 15), u);
		GymProgram g2 = new GymProgram(12, 2, 1, "Kykky 4x10", "Jalka Päivä!", LocalDate.of(2021, 3, 16), u);
		GymProgram g3 = new GymProgram(11, 2, 1, "Eri venytyksia 30 min", "Venyttely", LocalDate.of(2021, 3, 17), u);
		GymProgram g4 = new GymProgram(14, 4, 0, "Hauis 4x10", "Kippari Kallet", LocalDate.of(2021, 3, 18), u);
		GymProgram g5 = new GymProgram(15, 3, 0, "Ojentajia taljassa 5x10", "Ojentajia!", LocalDate.of(2021, 3, 19), u);
		GymProgram g6 = new GymProgram(18, 2, 0, "Venyttelyä 30min", "Venyttely", LocalDate.of(2021, 3, 20), u);
		GymProgram g7 = new GymProgram(10, 5, 1, "Selkää tangolla 4x10\\r\\nOlkapäät tangolla 5x8", "Selkä ja olkapäät!", LocalDate.of(2021, 3, 21), u);
		List<GymProgram> prs = Arrays.asList(g,g2,g3,g4,g5,g6,g7);	
		
		u.setPrograms(prs);
		u.setWeights(wgs);
		
		userRepository.save(u);
		
		
		User u2 = new User("aleksi", "aleksi");
		GymProgram g13 = new GymProgram(11, 2, 0, "TREdsadasON!!!", "Treljon", LocalDate.of(2020, 10, 7), u2);
		GymProgram g14 = new GymProgram(12, 3, 0, "TewrwerwN!!!", "Twwwsljon", LocalDate.of(2020, 10, 8), u2);
		List<GymProgram> prs2 = Arrays.asList(g13, g14);
		
		u2.setPrograms(prs2);
		
	/*	Weight w11 = new Weight(117, (java.sql.Date) date, u2);
		Weight w12 = new Weight(113,  (java.sql.Date) date, u2);
		List<Weight> wgs2 = Arrays.asList(w11,w12);	
		
		u2.setWeights(wgs2);*/
		userRepository.save(u2);
		
		
	}
}