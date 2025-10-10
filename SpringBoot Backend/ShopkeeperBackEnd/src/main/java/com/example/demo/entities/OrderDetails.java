package com.example.demo.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "orderdetails")
public class OrderDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderdetailsid;
    
    @ManyToOne
    @JoinColumn(name = "orderid", referencedColumnName = "orderid")
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "spid", referencedColumnName = "spid")
    private ProductShopkeeper productShopkeeper;

    private Integer qty;

    private Float price;

    // Getters and Setters

    public Integer getOrderdetailsid() {
        return orderdetailsid;
    }

    public void setOrderdetailsid(Integer orderdetailsid) {
        this.orderdetailsid = orderdetailsid;
    }

    public Orders getOrder() {
		return order;
	}

	public void setOrder(Orders order) {
		this.order = order;
	}

	public ProductShopkeeper getProductShopkeeper() {
        return productShopkeeper;
    }

    public void setProductShopkeeper(ProductShopkeeper productShopkeeper) {
        this.productShopkeeper = productShopkeeper;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }
}
