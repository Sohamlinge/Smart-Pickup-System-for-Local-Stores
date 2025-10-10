package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entities.Orders;
@Repository
public interface OrdersRepo extends JpaRepository<Orders, Integer> {

	 // Query to find all orders for a given shopkeeper by sid, fetching customer as well
    @Query("SELECT o FROM Orders o JOIN FETCH o.customer c WHERE o.shopkeeper.sid = :sid")
    List<Orders> findAllByShopkeeperSid(int sid);
}
