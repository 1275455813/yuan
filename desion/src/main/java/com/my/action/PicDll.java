package com.my.action;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;

import org.opencv.core.Mat;
import org.opencv.core.Point;
import org.opencv.imgcodecs.Imgcodecs;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.my.tools.opencv.ImFeatures2d;

@Controller
@RequestMapping("desion/picdll")
public class PicDll {
	
	@ResponseBody
	@RequestMapping("/featuresfind")
	public Point FeaturesFind(String small, String big) {
		try {
			Mat a = base64ToMat(small);
			Mat b = base64ToMat(big);
			return ImFeatures2d.findPic(a, b);
		} catch (IOException e) {
			e.printStackTrace();
			return new Point(-1,-1);
		}
	}
	
	private Mat base64ToMat(String picStr) throws IOException{
		String url = "C://Users//qf//Pictures//test//zhuanhuan.png";
		picStr = picStr.replaceAll(" ","+");
		Base64.Decoder d = Base64.getDecoder();
		byte[] sm = d.decode(picStr);
		FileOutputStream fileOutputStream = new FileOutputStream(new File(url));
		try {
			fileOutputStream.write(sm);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}finally {
			fileOutputStream.close();
		}
		return Imgcodecs.imread(url);
	}
}
