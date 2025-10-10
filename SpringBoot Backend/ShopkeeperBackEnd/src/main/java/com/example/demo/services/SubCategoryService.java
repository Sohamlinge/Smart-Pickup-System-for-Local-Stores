package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.SubCategory;
import com.example.demo.repositories.SubCategoryRepo;

@Service
public class SubCategoryService {
	
	@Autowired
	private SubCategoryRepo sr;
	
	public List<SubCategory> getSubCat()
	{
		return sr.findAll();
	}
	
	public List<SubCategory> getSubCategoriesByCategoryId(int catid) {
	    return sr.findByCategory_Catid(catid);
	}


}
