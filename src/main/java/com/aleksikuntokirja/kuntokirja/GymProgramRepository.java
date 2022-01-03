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
  
  @Query(value = "SELECT * FROM Program where localdate >= ?1 AND localdate <= ?2 AND user_id = ?3 AND (repeatance = 1 OR rep_duration = 1 OR rep_duration = 0)", nativeQuery = true)
  public List<GymProgram> getUserProgramsWithDates(LocalDate startDate, LocalDate endDate, Integer id);
  
  @Query(value = "SELECT * FROM Program AS p LEFT JOIN results as R ON p.id = r.program_id where p.localdate = ?1 AND p.user_id = ?2 AND (p.repeatance = 1 OR p.rep_duration = 1 OR p.rep_duration = 0)", nativeQuery = true)
  public List<GymProgram> getUserProgramsWithDatesv2(LocalDate startDate, Integer id);
  
  
  @Query(value = "SELECT * FROM Program where localdate <= ?2 AND rep_end_time >= ?1 AND user_id = ?3 AND repeatance != 1 AND rep_duration != 1 AND rep_duration != 0", nativeQuery = true)
  public List<GymProgram> getUserRepeatanceProgramsWithDates(LocalDate startDate, LocalDate endDate, Integer id);
   
  @Query(value = "select id from Program order by id desc limit 1", nativeQuery = true)
  public Long findHighestId();
  
  /*
  @Modifying
  @Query(value = "UPDATE Program c SET c.program = 'jooo' WHERE c.id = 2", nativeQuery = true)
  public void updateProgram();
  */
  @Modifying
  @Transactional
  @Query("DELETE FROM Program c WHERE c.id = ?1")
  public void deleteProgram(Long id);
  
}
