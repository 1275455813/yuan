package com.my.action;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.my.dao.UserDao;
import com.my.po.User;

@Controller
public class Login {
	
	@Autowired
	private UserDao ud;
	
	@ResponseBody
	@RequestMapping("desion/login")
	public int getUsers(String username, String password) {
		List<User> lu = ud.query("username = ?", new String[] {username},1,2);
		if(lu.size() == 0) {
			return 0;
		}
		else {
			User u = lu.get(0);
			if(u.getPassword().equals(password)) {
				return 1;
			}
			else {
				return 0;
			}
		}
	}

	@ResponseBody
	@RequestMapping("desion/adduser")
	public int addUser(User u) {
		int a = ud.insert(u);
		return a;
	}
	
	@RequestMapping("desion/index")
	public String toIndex() {
		return "login";
	}
	
	@RequestMapping("desion/image")
	public String image() {
		
		return "image";
	}
}
