package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entities.Cart;
@Repository
public interface CartRepo extends JpaRepository<Cart, Integer> {
//	 List<Cart> findByProductShopkeeper_Shopkeeper_Sid(int sid);
	
}
