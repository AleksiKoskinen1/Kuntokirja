package com.aleksikuntokirja.kuntokirja;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.Repository;

//@RepositoryRestResource(exported = false)
public interface UserRepository extends CrudRepository<User, Long> {

	@Query("select i from User_entity i where i.name = ?1 and i.password = ?2")
	public List<User> findByNameAndPass(String username, String pass);
	  
	@Query("select i from User_entity i where i.name = ?1")
	public List<User> findByName(String username);
		
	
	
	/*User save(User user);

	
	User findByName(String name);
*/
}