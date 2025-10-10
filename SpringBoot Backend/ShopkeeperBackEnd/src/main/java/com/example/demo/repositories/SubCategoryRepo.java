package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entities.SubCategory;
@Repository
public interface SubCategoryRepo extends JpaRepository<SubCategory, Integer> {
    List<SubCategory> findByCategory_Catid(int catid);
}
