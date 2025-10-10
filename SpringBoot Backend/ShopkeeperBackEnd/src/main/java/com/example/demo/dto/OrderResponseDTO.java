package com.example.demo.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OrderResponseDTO {
    private int orderid;
    private float totalprice;
    @JsonProperty("customer_datetime")
    private String customerDateTime;
    private String status;
    private String customerName;
    private int customerId;

    // Default no-argument constructor (required for serialization/deserialization)
    public OrderResponseDTO() {
    }

    // Constructor matching your JPQL 'new' expression parameters exactly
    public OrderResponseDTO(int orderid, float totalprice, LocalDateTime customer_datetime, LocalDateTime shopkeeper_datetime, String order_status, String customerName) {
        this.orderid = orderid;
        this.totalprice = totalprice;
        if (customer_datetime != null) {
            this.customerDateTime = customer_datetime.toString();
            if (shopkeeper_datetime != null) {
                this.customerDateTime += " / " + shopkeeper_datetime.toString();
            }
        } else {
            this.customerDateTime = "-";
        }
        this.status = order_status;
        this.customerName = customerName;
        this.customerId = 0; // default, set later if needed
    }

   
    // Getters and Setters

    public int getOrderid() {
        return orderid;
    }

    public void setOrderid(int orderid) {
        this.orderid = orderid;
    }

    public float getTotalprice() {
        return totalprice;
    }

    public void setTotalprice(float totalprice) {
        this.totalprice = totalprice;
    }

    public String getCustomerDateTime() {
        return customerDateTime;
    }

    public void setCustomerDateTime(String customerDateTime) {
        this.customerDateTime = customerDateTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }
}
