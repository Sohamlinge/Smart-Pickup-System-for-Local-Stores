package com.example.demo.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Role;
import com.example.demo.repositories.RoleRepo;

@Service
public class RoleService {
    @Autowired
    private RoleRepo rr;

    public List<Role> getAll() {
        return rr.findAll();
    }

    public Role getRoleById(int rid) {
        return rr.findById(rid).orElse(null);
    }
}
