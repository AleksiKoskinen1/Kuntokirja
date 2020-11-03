package com.aleksikuntokirja.kuntokirja;

import java.time.LocalDate;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity(name = "Program") 
@Table(name = "program")
public class GymProgram {

	@Id 
	@GeneratedValue(strategy = GenerationType.AUTO) 
	private Long id; 
    private Integer startTime;
	private Integer duration; //per 30 mins
	private Integer half;
	private String subject;
	private String program;
	private LocalDate localdate;
	
	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name="user_id")
    private User user;

	private GymProgram() {}

	public GymProgram(Integer startTime, Integer duration, Integer half, String subject, String program, LocalDate localdate, User user) {
		this.startTime = startTime;
		this.duration = duration;
		this.half = half;
		this.subject = subject;
		this.program = program;
		this.localdate = localdate;
		this.user = user;
	}


	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		GymProgram gymprogram = (GymProgram) o;
		return Objects.equals(id, gymprogram.id) &&
            Objects.equals(startTime, gymprogram.startTime) &&
			Objects.equals(duration, gymprogram.duration) &&
			Objects.equals(half, gymprogram.half) &&
			Objects.equals(subject, gymprogram.subject) &&
			Objects.equals(program, gymprogram.program) &&
			Objects.equals(localdate, gymprogram.localdate)&&
			Objects.equals(user, gymprogram.user);
	}

	@Override
	public int hashCode() {

		return Objects.hash(startTime, duration, half, subject, program, localdate, user);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public LocalDate getLocalDate() {
        return localdate;
    }
 
    public void setLocalDate(LocalDate date) {
        this.localdate = date;
    }

	public Integer getStartTime() {
		return startTime;
	}

	public void setStartTime(Integer startTime) {
		this.startTime = startTime;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}
	
	public Integer getHalf() {
		return half;
	}

	public void setHalf(Integer half) {
		this.half = half;
    }
	
	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}
    
    public String getProgram() {
		return program;
	}

	public void setProgram(String program) {
		this.program = program;
	}
	/*
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}*/

	@Override
	public String toString() {
		
		return "GymProgram{" +
			"id=" + id +
			", startTime=" + startTime+
       /*     ", duration='" + duration + 
            ", program=" + program + '\'' +
            ", User=" + user.toString() + '\'' +*/
			'}';
	}
}
