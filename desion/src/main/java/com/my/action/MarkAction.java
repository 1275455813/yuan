package com.my.action;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.my.dao.MarkDao;
import com.my.po.Mark;

@Controller
@RequestMapping("desion/mark")
public class MarkAction {

	@Autowired
	private MarkDao md;
	
	@ResponseBody
	@RequestMapping("/getAllMarks")
	public List<Mark> getAllMarks() {
		List<Mark> lm = md.query(0, null);
		return lm;
	}
	
	@ResponseBody
	@RequestMapping("/addMark")
	public int addMark(Mark po) {
		int count = md.insert(po);
		return count;
	}
}
