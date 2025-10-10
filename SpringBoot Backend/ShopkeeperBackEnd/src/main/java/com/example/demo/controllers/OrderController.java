package com.example.demo.controllers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.OrderResponseDTO;
import com.example.demo.entities.Orders;
import com.example.demo.services.OrderService;

@RestController
@RequestMapping("/shopkeeper/orders")
//@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService os;

    @GetMapping("/getall")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrdersWithCustomerName() {
        List<OrderResponseDTO> dtos = os.getAllWithCustomerName();
        if (dtos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/shopkeeper/{sid}")
    public ResponseEntity<List<Orders>> getOrdersByShopkeeper(@PathVariable int sid) {
        List<Orders> dtos = os.getOrdersByShopkeeperSid(sid);
        if (dtos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(dtos);
    }
    
    @PutMapping("/{orderId}/shopkeeper-datetime")
    public ResponseEntity<String> updateShopkeeperDateTime(
        @PathVariable int orderId,
        @RequestParam String datetime) {

        LocalDateTime shopkeeperDateTime;
        try {
            shopkeeperDateTime = LocalDateTime.parse(datetime, DateTimeFormatter.ISO_DATE_TIME);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid datetime format");
        }

        boolean updated = os.updateShopkeeperDateTime(orderId, shopkeeperDateTime);
        if (updated) {
            return ResponseEntity.ok("Shopkeeper datetime updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> changeOrderStatus(
        @PathVariable int orderId,
        @RequestParam String status) {

        boolean updated = os.changeOrderStatus(orderId, status);
        if (updated) {
            return ResponseEntity.ok("Order status updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
