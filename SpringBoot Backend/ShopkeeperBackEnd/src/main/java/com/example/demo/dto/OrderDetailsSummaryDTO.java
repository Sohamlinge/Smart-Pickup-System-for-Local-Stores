package com.example.demo.dto;

public class OrderDetailsSummaryDTO {
    private Integer orderdetailsid;
    private String uname;
    private String uphoneno;
    private String productname;
    private Integer qty;
    private Float price;

    public OrderDetailsSummaryDTO(Integer orderdetailsid, String uname, String uphoneno, String productname, Integer qty, Float price) {
        this.orderdetailsid = orderdetailsid;
        this.uname = uname;
        this.uphoneno = uphoneno;
        this.productname = productname;
        this.qty = qty;
        this.price = price;
    }

	public Integer getOrderdetailsid() {
		return orderdetailsid;
	}

	public void setOrderdetailsid(Integer orderdetailsid) {
		this.orderdetailsid = orderdetailsid;
	}

	public String getUname() {
		return uname;
	}

	public void setUname(String uname) {
		this.uname = uname;
	}

	public String getUphoneno() {
		return uphoneno;
	}

	public void setUphoneno(String uphoneno) {
		this.uphoneno = uphoneno;
	}

	public String getProductname() {
		return productname;
	}

	public void setProductname(String productname) {
		this.productname = productname;
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

