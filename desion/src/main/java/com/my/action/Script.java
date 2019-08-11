package com.my.action;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.my.po.Step;

@Controller
@RequestMapping("desion/script")
public class Script {
	
	/**
	 * 执行下一步
	 * @param name
	 * @param function
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/getNext")
	public Step getStep(String name, String function) {
		Step s = new Step();
		s.setColor("10|10|ffffff");
		s.setX(1);
		s.setY(2);
		s.setDelayTime(2000);
		return s;
	}
}
