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
	public List<User> getUsers() {
		User u = new User();
		u.setUsername("yuan");
		u.setPassword("123456");
		//ud.updata(u);
		//ud.insert(u);
		List<User> lu = ud.query("username = ?", new String[] {"wang"},1,2);
		//List<User> lu = ud.query(1, 2);
		return lu;
	}
}
