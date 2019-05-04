package com.my.tools.opencv;

import java.io.IOException;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

public class ReSize {
	public static void main(String args[]) throws IOException {
		System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
		String i2 = "C://Users//qf//Pictures//test//zhuomian1.png";
		String bPath = "C:\\Users\\qf\\Documents\\FlamingoStudio\\b.png";
		Mat pic = Imgcodecs.imread(i2);
		String path = "C:\\Users\\qf\\Documents\\FlamingoStudio\\c.png";
		Mat pic1 = Imgcodecs.imread(path);
		Point p = ImFeatures2d.findPic(pic1, pic);
		System.out.println(p.x + "," + p.y);
	}
	
	void cut() {
		String bPath = "C:\\Users\\qf\\Documents\\FlamingoStudio\\b.png";
		Mat pic = Imgcodecs.imread(bPath);
		String path = "C:\\Users\\qf\\Documents\\FlamingoStudio\\c.png";
		Rect r = new Rect(158,1199,78,75);
		Imgcodecs.imwrite(path, cut(pic, r));
	}
	
	void myResize(){
		String path = "C:\\Users\\qf\\Documents\\FlamingoStudio\\b.png";
		String picPath = "C:\\Users\\qf\\Documents\\FlamingoStudio\\a.png";
		Mat pic = Imgcodecs.imread(picPath);
		Mat p = new Mat();
		Imgproc.resize(pic, p, new Size(720,1280));
		Imgcodecs.imwrite(path, p);
	}
	
	static Mat cut(Mat image, Rect r) {
		Mat m = new Mat(image, r);
		return m;
	}
}
