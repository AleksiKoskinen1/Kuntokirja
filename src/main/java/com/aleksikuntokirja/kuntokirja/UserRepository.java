package com.aleksikuntokirja.kuntokirja;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

//@RepositoryRestResource(exported = false)
public interface UserRepository extends CrudRepository<User, Long> {
	  
	@Query("select i from User_entity i where i.name = ?1")
	public List<User> findByName(String username);
		
	
}