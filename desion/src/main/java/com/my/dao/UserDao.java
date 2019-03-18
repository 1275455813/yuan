package com.my.dao;

import org.springframework.stereotype.Repository;

import com.my.po.User;
import com.my.tools.MyJDBC;

@Repository
public class UserDao extends MyJDBC<User>{
	
}
