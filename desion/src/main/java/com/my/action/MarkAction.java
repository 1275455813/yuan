package com.my.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.my.dao.MarkDao;
import com.my.po.Mark;
import com.my.tools.StaticMethod;

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
	public int addMark(Mark po, String jd, String wd) {
		if(po.getPlace() == null) {
			String l = StaticMethod.getLocation(wd, jd);
			po.setPlace(l);
		}
		String id = UUID.randomUUID().toString();
		id = id.substring(id.length() - 12, id.length());
		//获取当前日期
		Date dt = new Date();   
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");   
	    String _time = sdf.format(dt);
	    
		po.setId(id);
		po.set_time(_time);
		int count = md.insert(po);
		return count;
	}
	
	/**
	 * 根据id获取图片
	 * @param id 事件的id
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/getPic")
	public String getPic(String  id) {
		List<Mark> lm = md.query("pic", "id=?", new String[]{id}, 1, 1);
		if(lm.size() >= 1) {
			return lm.get(0).getPic();
		}
		return null;
	}
	
	@ResponseBody
	@RequestMapping("/test")
	public String test(String jd, String wd) {
		System.out.println(jd + wd);
		String l = StaticMethod.getLocation(wd, jd);
		System.out.println(l);
		return l;
	}
}
