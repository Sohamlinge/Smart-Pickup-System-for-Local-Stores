package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Category;
import com.example.demo.repositories.CategoryRepo;

@Service
public class CategoryService {
	
	@Autowired
	private CategoryRepo cr;
	
	public List<Category> getCat()
	{
		return cr.findAll();
	}
}
