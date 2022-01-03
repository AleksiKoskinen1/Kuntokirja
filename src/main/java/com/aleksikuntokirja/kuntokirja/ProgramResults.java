package com.aleksikuntokirja.kuntokirja;

import java.io.Serializable;
import java.sql.Date;
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
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity(name = "Results") 
@Table(name = "results")
public class ProgramResults {

	@Id 
	@GeneratedValue(strategy = GenerationType.AUTO) 
	private Long id; 
	private String results;
	private LocalDate resultDate;
	
	
	/*@OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gymProgram_id", nullable = false)
    private GymProgram gymProgram;*/
	
	/*
	 * Voi olla toistuva ohjelma, jolloin samaan ohjelmaan voi olla monta tulosta 
	 * (eri päiville, siks manytoone.  Muuten ois voinu olla onetoone)
	 */
	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name="program_id")
    private GymProgram program;
	

	private ProgramResults() {}

	public ProgramResults(String res, LocalDate resDate) {
		this.results = res;
		this.resultDate = resDate;
	}
 
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		ProgramResults results = (ProgramResults) o;
		return Objects.equals(id, results.id) &&
			Objects.equals(results, results.results) ;
	}

	@Override
	public int hashCode() {

		return Objects.hash(results);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getResults() {
		return results;
	}

	public void setResults(String results) {
		this.results = results;
	}
	
	public LocalDate getResultDate() {
        return resultDate;
    }
 
    public void setResultDate(LocalDate date) {
        this.resultDate = date;
    }
	
	public void setProgram(GymProgram gp) {
		this.program = gp;
	}/*
	public GymProgram getProgram() {
		return program;
	}*/

	@Override
	public String toString() {
	/*	return "ProgramResults{" +
			"id=" + id +
			", results=" + results+
			'}';*/
		return "hes" + results + " DATE: " + resultDate.toString();
	} 
}
