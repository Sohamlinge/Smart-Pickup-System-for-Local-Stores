package com.example.demo.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.OrderResponseDTO;
import com.example.demo.entities.Orders;
import com.example.demo.repositories.OrdersRepo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

@Service
public class OrderService {

    @Autowired
    private OrdersRepo or;

    @PersistenceContext
    private EntityManager em;

    /**
     * Fetch all orders with customer name combined in DTO,
     * updated to reflect new LocalDateTime fields and property names.
     */
    public List<OrderResponseDTO> getAllWithCustomerName() {
        String jpql = "SELECT new com.example.demo.dto.OrderResponseDTO(" +
                      "o.orderid, " +
                      "o.totalprice, " +
                      "o.customer_datetime, " +      // changed from customer_datatime to customer_datetime
                      "o.shopkeeper_datetime, " +    // changed from shopkeeper_datatime to shopkeeper_datetime
                      "o.order_status, u.uname) " +  // uname as customer name property
                      "FROM Orders o JOIN o.customer u";

        TypedQuery<OrderResponseDTO> query = em.createQuery(jpql, OrderResponseDTO.class);
        return query.getResultList();
    }
    
    /**
     * Get all orders filtered by shopkeeper sid, returning full Orders entities.
     */
    public List<Orders> getOrdersByShopkeeperSid(int sid) {
        return or.findAllByShopkeeperSid(sid);
    }
    
    /**
     * Set or update the shopkeeper's date and time for a specific order.
     */
    @Transactional
    public boolean updateShopkeeperDateTime(int orderId, LocalDateTime shopkeeperDateTime) {
        Optional<Orders> orderOpt = or.findById(orderId);
        if (orderOpt.isPresent()) {
            Orders order = orderOpt.get();
            order.setShopkeeper_datetime(shopkeeperDateTime);
            or.save(order);
            return true;
        }
        return false;  // order not found
    }

    /**
     * Change the status of an order.
     */
    @Transactional
    public boolean changeOrderStatus(int orderId, String newStatus) {
        Optional<Orders> orderOpt = or.findById(orderId);
        if (orderOpt.isPresent()) {
            Orders order = orderOpt.get();
            order.setOrder_status(newStatus);
            or.save(order);
            return true;
        }
        return false;  // order not found
    }
}
