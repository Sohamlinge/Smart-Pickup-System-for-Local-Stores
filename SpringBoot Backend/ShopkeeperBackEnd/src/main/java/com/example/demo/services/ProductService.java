package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Product;
import com.example.demo.repositories.ProductRepo;

@Service
public class ProductService {
	
	@Autowired
	private ProductRepo pr;
	
	public List<Product> getPro()
	{
		return pr.findAll();
	}
	
	public List<Product> getProductsBySubCategoryId(int subcatid) {
	    return pr.findBySubCategory_Subcatid(subcatid);
	}
}
