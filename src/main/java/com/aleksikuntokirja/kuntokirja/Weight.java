package com.aleksikuntokirja.kuntokirja;

import java.sql.Date;
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

@Entity(name = "Weight") 
@Table(name = "weight")
public class Weight {

	@Id 
	@GeneratedValue(strategy = GenerationType.AUTO) 
	private Long id; 
	private Float weight;
	private Integer year;  //Otetaan jokainen erikseen tällä kertaa. 
	private Integer month;
	private Integer day;
	
	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name="user_id")
    private User user;

	private Weight() {}

	public Weight(Float weight, Integer year, Integer month, Integer day, User user) {
		this.weight = weight;
		this.year = year;
		this.month = month;
		this.day = day;
		this.user = user;
	}
 
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Weight weights = (Weight) o;
		return Objects.equals(id, weights.id) &&
			Objects.equals(weight, weights.weight) &&
			Objects.equals(year, weights.year) &&
			Objects.equals(month, weights.month) &&
			Objects.equals(day, weights.day) &&
			Objects.equals(user, weights.user);
	}

	@Override
	public int hashCode() {

		return Objects.hash(weight, year, month, day, user);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Float getWeight() {
		return weight;
	}

	public void setWeight(Float weight) {
		this.weight = weight;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}
	public Integer getMonth() {
		return month;
	}

	public void setMonth(Integer month) {
		this.month = month;
	}
	public Integer getDay() {
		return day;
	}

	public void setDay(Integer day) {
		this.day = day;
	}
	/*
	public void setUser(User u) {
		this.user = u;
	}
	
	public String getUser(User u) {
		return u.toString();
	}
*/
	@Override
	public String toString() {
		return "Weight{" +
			"id=" + id +
			", weight=" + weight+
			", year='" + year + '\'' +
			", userID=" + user.getName()+
			'}';
	} 
}
