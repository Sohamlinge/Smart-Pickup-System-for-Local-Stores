package com.example.demo.entities;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderid;

    private float totalprice;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "customer_datetime") // updated
    private LocalDateTime customer_datetime;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "shopkeeper_datetime") // updated
    private LocalDateTime shopkeeper_datetime;


    private String order_status;

    @ManyToOne
    @JoinColumn(name = "custid")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "sid")
    private Shopkeeper shopkeeper;

    public Orders() {}

    public Orders(int orderid, float totalprice, LocalDateTime customer_datetime, LocalDateTime shopkeeper_datetime,
                  String order_status, User customer, Shopkeeper shopkeeper) {
        this.orderid = orderid;
        this.totalprice = totalprice;
        this.customer_datetime = customer_datetime;
        this.shopkeeper_datetime = shopkeeper_datetime;
        this.order_status = order_status;
        this.customer = customer;
        this.shopkeeper = shopkeeper;
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

    public LocalDateTime getCustomer_datetime() {
        return customer_datetime;
    }

    public void setCustomer_datetime(LocalDateTime customer_datetime) {
        this.customer_datetime = customer_datetime;
    }

    public LocalDateTime getShopkeeper_datetime() {
        return shopkeeper_datetime;
    }

    public void setShopkeeper_datetime(LocalDateTime shopkeeper_datetime) {
        this.shopkeeper_datetime = shopkeeper_datetime;
    }

    public String getOrder_status() {
        return order_status;
    }

    public void setOrder_status(String order_status) {
        this.order_status = order_status;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public Shopkeeper getShopkeeper() {
        return shopkeeper;
    }

    public void setShopkeeper(Shopkeeper shopkeeper) {
        this.shopkeeper = shopkeeper;
    }

    @Override
    public String toString() {
        return "Orders [orderid=" + orderid + 
               ", totalprice=" + totalprice + 
               ", customer_datetime=" + customer_datetime + 
               ", shopkeeper_datetime=" + shopkeeper_datetime + 
               ", order_status=" + order_status +
               ", customer=" + (customer != null ? customer.getUname() : "null") + "]";
    }
}
