package com.aleksikuntokirja.kuntokirja;

import java.time.LocalDate;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;

//@RepositoryRestResource(exported = false)  //EI NÄY APISSA
public interface ProgramResultsRepository extends CrudRepository<ProgramResults, Long> {
	
	@Modifying
	@Transactional
	@Query("UPDATE Results SET results = ?2 where program_id = ?1 AND result_date = ?3")
	public void updateResults(Long id, String content, LocalDate resultDate);
	 
	@Query(value = "SELECT id FROM Results where program_id = ?1 AND result_date = ?2", nativeQuery = true)
	public Long getProgramResults(Long id, LocalDate resultDate);
	
	@Query(value = "SELECT id FROM Results where program_id IN (?1) AND result_date = ?2", nativeQuery = true)
	public Long getProgramResultsTest(Long id, LocalDate resultDate);
	/*
	@Modifying
	@Transactional 
	@Query("DELETE FROM Results WHERE program_id = ?1 AND result_date = ?2 ", nativeQuery = true)
	public void deleteResults(Long id, LocalDate resultDate);
	 */
	@Modifying
	@Transactional
	@Query("DELETE FROM Results WHERE program_id = ?1")
	public void deleteResults(Long id);
	
}
