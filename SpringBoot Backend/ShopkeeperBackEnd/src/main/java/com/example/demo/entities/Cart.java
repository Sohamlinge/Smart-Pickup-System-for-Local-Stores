package com.example.demo.entities;

import jakarta.persistence.*;

@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cartid;

    @ManyToOne
    @JoinColumn(name = "spid")
    private ProductShopkeeper productShopkeeper;

    @ManyToOne
    @JoinColumn(name = "customerid")
    private User customer;

    private int qty;

	public Cart() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Cart(int cartid, ProductShopkeeper productShopkeeper, User customer, int qty) {
		super();
		this.cartid = cartid;
		this.productShopkeeper = productShopkeeper;
		this.customer = customer;
		this.qty = qty;
	}

	public int getCartid() {
		return cartid;
	}

	public void setCartid(int cartid) {
		this.cartid = cartid;
	}

	public ProductShopkeeper getProductShopkeeper() {
		return productShopkeeper;
	}

	public void setProductShopkeeper(ProductShopkeeper productShopkeeper) {
		this.productShopkeeper = productShopkeeper;
	}

	public User getCustomer() {
		return customer;
	}

	public void setCustomer(User customer) {
		this.customer = customer;
	}

	public int getQty() {
		return qty;
	}

	public void setQty(int qty) {
		this.qty = qty;
	}

	@Override
	public String toString() {
		return "Cart [cartid=" + cartid + ", productShopkeeper=" + productShopkeeper + ", customer=" + customer
				+ ", qty=" + qty + "]";
	}
}
