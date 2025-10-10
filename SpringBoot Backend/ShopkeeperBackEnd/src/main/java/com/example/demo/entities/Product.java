package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int pid;

	private String pname;

	private String description;
	
	@Column(name = "image")  // or your column name
	private String imageUrl;

	@ManyToOne
	@JoinColumn(name = "subcatid")
	@JsonIgnoreProperties({"products"})
	private SubCategory subCategory;

	public Product() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Product(int pid, String pname, String description, SubCategory subCategory) {
		super();
		this.pid = pid;
		this.pname = pname;
		this.description = description;
		this.subCategory = subCategory;
	}

	public int getPid() {
		return pid;
	}

	public void setPid(int pid) {
		this.pid = pid;
	}

	public String getPname() {
		return pname;
	}

	public void setPname(String pname) {
		this.pname = pname;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public SubCategory getSubCategory() {
		return subCategory;
	}

	public void setSubCategory(SubCategory subCategory) {
		this.subCategory = subCategory;
	}
	
	public String getImage() {
	    return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
	    this.imageUrl = imageUrl;
	}

	@Override
	public String toString() {
		return "Product [pid=" + pid + ", pname=" + pname + ", description=" + description + ", subCategory="
				+ subCategory + "]";
	}
	
	
}
