package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.SubCategory;
import com.example.demo.services.SubCategoryService;

@RestController
@RequestMapping("/shopkeeper/subcategory")
//@CrossOrigin(origins = "http://localhost:5173")
public class SubCategoryController {
	
	@Autowired
	private SubCategoryService scs;
	
	@GetMapping("/getall")
	public List<SubCategory> getSubCat()
	{
		return scs.getSubCat();
	}
	
	@GetMapping("/bycatid/{catid}")
	public List<SubCategory> getSubCategoriesByCategory(@PathVariable int catid) {
	    return scs.getSubCategoriesByCategoryId(catid);
	}
}
