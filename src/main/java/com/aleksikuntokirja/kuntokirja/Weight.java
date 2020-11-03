package com.aleksikuntokirja.kuntokirja;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity 
public class Weight {

	private @Id @GeneratedValue Long id;
	private Integer weight;
	private String date;

	private Weight() {}

	public Weight(Integer weight, String date) {
		this.weight = weight;
		this.date = date;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Weight weights = (Weight) o;
		return Objects.equals(id, weights.id) &&
			Objects.equals(weight, weights.weight) &&
			Objects.equals(date, weights.date);
	}

	@Override
	public int hashCode() {

		return Objects.hash(weight, date);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getWeight() {
		return weight;
	}

	public void setWeight(Integer weight) {
		this.weight = weight;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	@Override
	public String toString() {
		return "Weight{" +
			"id=" + id +
			", weight=" + weight+
			", date='" + date + '\'' +
			'}';
	}
}
