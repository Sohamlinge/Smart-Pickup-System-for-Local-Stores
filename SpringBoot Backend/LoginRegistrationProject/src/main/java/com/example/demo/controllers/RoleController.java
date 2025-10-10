package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Role;
import com.example.demo.services.RoleService;

@RestController
@RequestMapping("/auth/role")
//@CrossOrigin(origins = "http://localhost:5173")
public class RoleController {

    @Autowired
    private RoleService rs;

    @GetMapping("/all")
    public List<Role> getAll() {
        return rs.getAll();
    }
}
