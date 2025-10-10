package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.OrderDetailsSummaryDTO;
import com.example.demo.entities.OrderDetails;
import com.example.demo.services.OrderDetailsService;

@RestController
@RequestMapping("/shopkeeper/orderdetails")
//@CrossOrigin(origins = "http://localhost:5173")
public class OrderDetailsController {

    @Autowired
    private OrderDetailsService ods;

    @GetMapping("/getall")
    public List<OrderDetails> getAll() {
        return ods.getAllOrderDetails();
    }

    @GetMapping("/shopkeeper/{shopkeeperId}/orders")
    public List<OrderDetailsSummaryDTO> getOrdersByShopkeeper(@PathVariable int shopkeeperId) {
        return ods.getOrderDetailsByShopkeeperId(shopkeeperId);
    }

}
