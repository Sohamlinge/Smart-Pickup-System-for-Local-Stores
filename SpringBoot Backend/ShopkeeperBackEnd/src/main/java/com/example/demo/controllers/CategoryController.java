package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Category;
import com.example.demo.services.CategoryService;

@RestController
@RequestMapping("/shopkeeper/category")
//@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

	@Autowired
	private CategoryService cs;
	
	@GetMapping("/getall")
	public List<Category> getCat()
	{
		return cs.getCat();
	}
}
