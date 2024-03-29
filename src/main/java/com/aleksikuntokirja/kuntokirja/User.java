package com.aleksikuntokirja.kuntokirja;

import java.io.Serializable;
import java.util.*;

import javax.persistence.*;

import org.springframework.context.annotation.Bean;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
///import org.springframework.security.crypto.password.PasswordEncoder;

import com.fasterxml.jackson.annotation.JsonIgnore;

//@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@Entity(name = "User_entity") 
@Table(name = "user_entity")
public class User {

	@Id 
	@GeneratedValue(strategy = GenerationType.AUTO) 
	private Long id; 

	private String name; 

	private @JsonIgnore String password; 
	
	@OneToMany(
	        mappedBy = "user",
    		fetch = FetchType.LAZY,
	        cascade = CascadeType.ALL/*,
	        orphanRemoval = true*/
	    )
	private List<GymProgram> programs = new ArrayList<GymProgram>();
	
	@OneToMany(
	        mappedBy = "user",
    		fetch = FetchType.LAZY,
	        cascade = CascadeType.ALL//,
	      //  orphanRemoval = true
	    )
	private List<Weight> weights = new ArrayList<Weight>();
	
	public User() {}

	public User(String name, String password) {
		this.name = name;
		this.password = password;  
	}
	
	

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		User user = (User) o;
		return Objects.equals(id, user.id) &&
			Objects.equals(name, user.name) &&
			Objects.equals(password, user.password);
	}

	@Override
	public int hashCode() {

	//	int result = Objects.hash(id, name, password);
	//	result = 31 * result;// + Arrays.hashCode(roles);
		return 31; // result;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	} 
	
	public void setPassword(String password) {
		this.password = password;
	}

	public String getPassword() {
		return password;
	}
	/*
	public List<GymProgram> getPrograms() {
		return programs;
	}
*/
	public void setPrograms(List<GymProgram> programs) {
		this.programs = programs;
	}
	/*
	public List<Weight> getWeights() {
		return weights;
	}

	public void setWeights(List<Weight> weights) {
		this.weights = weights;
	}
	*/
	
	@Override
	public String toString() {
		
		return ""+ this.id +"";
	} 

}