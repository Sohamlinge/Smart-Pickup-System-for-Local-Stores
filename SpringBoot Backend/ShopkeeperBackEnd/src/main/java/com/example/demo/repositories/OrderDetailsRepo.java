package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entities.OrderDetails;

public interface OrderDetailsRepo extends JpaRepository<OrderDetails, Integer> {
	
	@Query(value = "SELECT od.orderdetailsid, u.uname, u.phoneno, p.pname, od.qty, od.price " +
            "FROM orderdetails od " +
            "LEFT JOIN product_shopkeeper ps ON od.spid = ps.spid " +
            "LEFT JOIN products p ON p.pid = ps.pid " +
            "LEFT JOIN orders o ON od.orderid = o.orderid " +
            "LEFT JOIN users u ON o.custid = u.uid " +
            "WHERE ps.spid IN (SELECT spid FROM product_shopkeeper WHERE sid = :shopkeeperId)", nativeQuery = true)
List<Object[]> findOrderDetailsByShopkeeperId(@Param("shopkeeperId") int shopkeeperId);


}
