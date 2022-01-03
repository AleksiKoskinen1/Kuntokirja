package com.aleksikuntokirja.kuntokirja;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
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
	private Integer repeatance;
	private Integer repDuration;
	private LocalDate repEndTime;
	
	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name="user_id")
    private User user;
	
/*	@OneToOne(mappedBy = "gymProgram",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private ProgramResults presults;*/
	
	@OneToMany(
	        mappedBy = "program",
    		fetch = FetchType.LAZY,
	        cascade = CascadeType.ALL//,
	      //  orphanRemoval = true
	    )
	private List<ProgramResults> presults = new ArrayList<ProgramResults>();

	private GymProgram() {}

	public GymProgram(Integer startTime, Integer duration, Integer half, String subject, String program, LocalDate localdate/*, User user*/, Integer repeatance, Integer repDuration, LocalDate repEndTime) {
		this.startTime = startTime;
		this.duration = duration;
		this.half = half;
		this.subject = subject;
		this.program = program;
		this.localdate = localdate;
//		this.user = user;
		this.repeatance = repeatance;
		this.repDuration = repDuration;
		this.repEndTime = repEndTime;
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
			Objects.equals(repeatance, gymprogram.repeatance) &&
			Objects.equals(repDuration, gymprogram.repDuration) &&
			Objects.equals(repEndTime, gymprogram.repEndTime);// &&
		//	Objects.equals(user, gymprogram.user);
	}

	@Override
	public int hashCode() {

		return Objects.hash(startTime, duration, half, subject, program, localdate, repeatance, repDuration, repEndTime/*, user*/);
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
	public Integer getRepeatance() {
		return repeatance;
	}
	public void setRepeatance(Integer repeatance) {
		this.repeatance = repeatance;
	}
	public Integer getRepDuration() {
		return repDuration;
	}
	public void setRepDuration(Integer repDuration) {
		this.repDuration = repDuration;
	}
	public LocalDate getRepEndTime() {
		return repEndTime;
	}
	public void setRepEndTime(LocalDate endt) {
		this.repEndTime = endt;
	}
	
	public void setPresults(List<ProgramResults> gp) {
		this.presults = gp;
	}
	
	public List<ProgramResults> getPresults() {
		return presults;
	}
	
	public void setUser(User u ) {
		this.user = u;
	}
	public User getUser() {
		return user;
	}
	
	
	
	@Override
	public String toString() {
		
		/*return "GymProgram{" +
			"iddd=" + id +
			"iddd=" + user.toString() +
			"iddd=" + presults.toString() +
			", startTime=" + startTime+
            ", duration='" + duration + 
            ", program=" + program + '\'' +
			'}';*/
		return "GymProgram ID: " + id + " RESULTS: "  + presults.toString() + "";
	}
}
