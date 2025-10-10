package com.example.demo.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "product_shopkeeper")
public class ProductShopkeeper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int spid;

    @ManyToOne
    @JoinColumn(name = "sid")
    private Shopkeeper shopkeeper;

    @ManyToOne
    @JoinColumn(name = "pid")
    private Product product;

    private double price;
    private String stockStatus;

    // ✅ No-arg constructor (required by JPA)
    public ProductShopkeeper() {
    }

    // ✅ All-args constructor
    public ProductShopkeeper(Product product, Shopkeeper shopkeeper, double price, String stockStatus) {
        this.product = product;
        this.shopkeeper = shopkeeper;
        this.price = price;
        this.stockStatus = stockStatus;
    }

    // ✅ Getters and Setters
    public int getSpid() {
        return spid;
    }

    public void setSpid(int spid) {
        this.spid = spid;
    }

    public Shopkeeper getShopkeeper() {
        return shopkeeper;
    }

    public void setShopkeeper(Shopkeeper shopkeeper) {
        this.shopkeeper = shopkeeper;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(String stockStatus) {
        this.stockStatus = stockStatus;
    }
    
    
}
