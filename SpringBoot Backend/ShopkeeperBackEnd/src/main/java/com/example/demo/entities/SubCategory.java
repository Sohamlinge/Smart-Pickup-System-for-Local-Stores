package com.example.demo.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "subcategory")
public class SubCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int subcatid;
	
	private String subcatname;
	
	@ManyToOne
	@JoinColumn(name = "catid")
	@JsonIgnoreProperties({"subCategories"})
	private Category category;
	
	 @OneToMany(mappedBy = "subCategory", cascade = CascadeType.ALL)
	 @JsonIgnoreProperties({"subCategory"})
	    private List<Product> products;

	public SubCategory() {
		super();
		// TODO Auto-generated constructor stub
	}

	public SubCategory(int subcatid, String subcatname, Category category, List<Product> products) {
		super();
		this.subcatid = subcatid;
		this.subcatname = subcatname;
		this.category = category;
		this.products = products;
	}

	public int getSubcatid() {
		return subcatid;
	}

	public void setSubcatid(int subcatid) {
		this.subcatid = subcatid;
	}

	public String getSubcatname() {
		return subcatname;
	}

	public void setSubcatname(String subcatname) {
		this.subcatname = subcatname;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

	@Override
	public String toString() {
		return "SubCategory [subcatid=" + subcatid + ", subcatname=" + subcatname + ", category=" + category
				+ ", products=" + products + "]";
	}
	
	 
}
