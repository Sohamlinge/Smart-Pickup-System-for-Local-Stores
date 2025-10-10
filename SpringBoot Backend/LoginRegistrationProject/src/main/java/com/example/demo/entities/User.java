package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uid;

    @ManyToOne
    @JoinColumn(name = "rid", referencedColumnName = "rid", nullable = false)
    @JsonIgnoreProperties({"users"}) // only ignore the users list to avoid circular reference
    private Role role;
    
 // For shopkeeper relation (optional)
    // @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    // private Shopkeeper shopkeeper;

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties({"user"})
	private Shopkeeper shopkeeper;


    private String uname;
    private String password;
    private long phoneno;
    private String address;
    private String aadharno;
	public User() {
		super();
		// TODO Auto-generated constructor stub
	}
	public User(int uid, Role role, Shopkeeper shopkeeper, String uname, String password, long phoneno, String address,
			String aadharno) {
		super();
		this.uid = uid;
		this.role = role;
		this.shopkeeper = shopkeeper;
		this.uname = uname;
		this.password = password;
		this.phoneno = phoneno;
		this.address = address;
		this.aadharno = aadharno;
	}
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public Shopkeeper getShopkeeper() {
		return shopkeeper;
	}
	public void setShopkeeper(Shopkeeper shopkeeper) {
		this.shopkeeper = shopkeeper;
	}
	public String getUname() {
		return uname;
	}
	public void setUname(String uname) {
		this.uname = uname;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public long getPhoneno() {
		return phoneno;
	}
	public void setPhoneno(long phoneno) {
		this.phoneno = phoneno;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getAadharno() {
		return aadharno;
	}
	public void setAadharno(String aadharno) {
		this.aadharno = aadharno;
	}
	@Override
	public String toString() {
		return "User [uid=" + uid + ", role=" + role + ", shopkeeper=" + shopkeeper + ", uname=" + uname + ", password="
				+ password + ", phoneno=" + phoneno + ", address=" + address + ", aadharno=" + aadharno + "]";
	}   
}
