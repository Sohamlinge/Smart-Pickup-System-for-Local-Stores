package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entities.Product;
@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

	    List<Product> findBySubCategory_Subcatid(int subcatid);
	
}
