package com.aleksikuntokirja.kuntokirja;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.time.LocalDate;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface WeightRepository extends CrudRepository<Weight, Long> {

		@Query(value = "SELECT * FROM Weight where user_id = ?3 AND year = ?1 AND month = ?2 order by day DESC", nativeQuery = true)
		public List<Weight> getUserWeightsWithDates(Integer year,Integer month,Integer id);
		  
		@Query(value = "SELECT * FROM Weight where user_id = ?2 AND year = ?1 order by month ASC", nativeQuery = true)
		public List<Weight> getUserWeightsFromYear(Integer year,Integer id);
		
		@Query(value = "SELECT id FROM Weight where user_id = ?4 AND year = ?1 AND month = ?2 AND day = ?3", nativeQuery = true)
		public Long getUserPossibleWeight(Integer year,Integer month, Integer day,Long id);
		  
		@Modifying
		@Transactional
		@Query("UPDATE Weight SET weight = ?2, extrainfo = ?3 where id = ?1")
		public void updateWeight(Long id, Float weight, String info);
		
		@Modifying
		@Transactional
		@Query("DELETE FROM Weight w WHERE w.id = ?1")
		public void deleteWeight(Long id);
		
	
}