package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "shopkeeper")
public class Shopkeeper {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int sid;
	
	@OneToOne
	@JoinColumn(name = "uid")
	@JsonIgnoreProperties({"shopkeeper"}) 
	private User user;
	
	private String sname;
	private String gstno;
	private long sphoneno;
	private String saddress;
	
	public Shopkeeper() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Shopkeeper(int sid, User user, String sname, String gstno, long sphoneno, String saddress) {
		super();
		this.sid = sid;
		this.user = user;
		this.sname = sname;
		this.gstno = gstno;
		this.sphoneno = sphoneno;
		this.saddress = saddress;
	}

	public int getSid() {
		return sid;
	}

	public void setSid(int sid) {
		this.sid = sid;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getSname() {
		return sname;
	}

	public void setSname(String sname) {
		this.sname = sname;
	}

	public String getGstno() {
		return gstno;
	}

	public void setGstno(String gstno) {
		this.gstno = gstno;
	}

	public long getSphoneno() {
		return sphoneno;
	}

	public void setSphoneno(long sphoneno) {
		this.sphoneno = sphoneno;
	}

	public String getSaddress() {
		return saddress;
	}

	public void setSaddress(String saddress) {
		this.saddress = saddress;
	}

	@Override
	public String toString() {
		return "Shopkeeper [sid=" + sid + ", user=" + user + ", sname=" + sname + ", gstno=" + gstno + ", sphoneno="
				+ sphoneno + ", saddress=" + saddress + "]";
	}	
}
