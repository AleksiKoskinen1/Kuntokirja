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
public interface GymProgramRepository extends CrudRepository<GymProgram, Long> {

  @Query("select i from Program i where i.localdate >= ?1 AND i.localdate <= ?2")
  public List<GymProgram> getProgramsWithDates(LocalDate startDate, LocalDate endDate);  
  
  @Query(value = "SELECT * FROM Program where localdate >= ?1 AND localdate <= ?2 AND user_id = ?3", nativeQuery = true)
  public List<GymProgram> getUserProgramsWithDates(LocalDate startDate, LocalDate endDate, Integer id);
   
  @Query(value = "select id from Program order by id desc limit 1", nativeQuery = true)
  public Long findHighestId();
  
  /*
  @Modifying
  @Query(value = "UPDATE Program c SET c.program = 'jooo' WHERE c.id = 2", nativeQuery = true)
  public void updateProgram();
  */
  @Modifying
  //@Query(value = "DELETE FROM Program WHERE startTime = 11", nativeQuery = true)
  @Transactional
  @Query("DELETE FROM Program c WHERE c.id = ?1")
  public void deleteProgram(Long id);
  
}
