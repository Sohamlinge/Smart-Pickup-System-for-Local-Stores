package com.example.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entities.ProductShopkeeper;

@Repository
public interface ProductShopkeeperRepo extends JpaRepository<ProductShopkeeper, Integer> {
	   List<ProductShopkeeper> findByShopkeeper_Sid(int sid); 
	   List<ProductShopkeeper> findByProduct_Pid(int pid); 
//	   List<ProductShopkeeper> findByProductShopkeeper_Spid(int spid); 
	   
	   List<ProductShopkeeper> findByShopkeeper_SidAndProduct_Pid(int sid, int pid);
	   
	// Optionally, find a unique record if your data model supports it
	    Optional<ProductShopkeeper> findFirstByShopkeeper_SidAndProduct_Pid(int sid, int pid);
}
