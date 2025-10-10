package com.example.demo.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.demo.entities.User;

@Repository // Marks this as a Spring Data JPA repository
public interface UserRepo extends JpaRepository<User, Integer> {

    // Custom query method to find user by username & password
    Optional<User> findByUnameAndPassword(String uname, String password);
    
    @Query("Select u from User u where uname = :uname and password = :password")
    Optional <User> getLogin(String uname,String password);

    @Query("SELECT u FROM User u " +
       "LEFT JOIN FETCH u.role " +
       "LEFT JOIN FETCH u.shopkeeper s " +
       "WHERE u.uname = :uname AND u.password = :password")
Optional<User> getLoginWithShopkeeper(String uname, String password);

}
