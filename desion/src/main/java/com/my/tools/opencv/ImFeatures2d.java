package com.my.tools.opencv;

import java.awt.GridLayout;
import java.awt.Image;
import java.util.ArrayList;
import java.util.List;

import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;

import org.opencv.core.Core;
import org.opencv.core.DMatch;
import org.opencv.core.KeyPoint;
import org.opencv.core.Mat;
import org.opencv.core.MatOfDMatch;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.core.Point;
import org.opencv.features2d.AKAZE;
import org.opencv.features2d.AgastFeatureDetector;
import org.opencv.features2d.BRISK;
import org.opencv.features2d.DescriptorMatcher;
import org.opencv.features2d.FastFeatureDetector;
import org.opencv.features2d.KAZE;
import org.opencv.features2d.MSER;
import org.opencv.features2d.ORB;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;;

public class ImFeatures2d {
	/**
	 * 
	 * @param gray_base 待检测对象
	 * @param gray_test 包含对象的图片
	 */
	public static Point findPic(Mat gray_base, Mat gray_test) {
		System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
		//Mat gray_base = Imgcodecs.imread(image, Imgcodecs.IMREAD_GRAYSCALE);
		//Mat gray_test = Imgcodecs.imread(image1, Imgcodecs.IMREAD_GRAYSCALE);
		//Imgproc.cvtColor(src_base, gray_base, Imgproc.COLOR_RGB2GRAY);
		//ORB orb = ORB.create();//运行很快，特征点少，不准
		BRISK orb = BRISK.create();//运行速度适中，相对准确
		//AKAZE orb = AKAZE.create();
		//KAZE orb = KAZE.create();//运行慢，特征点多，准确
		// 关键点及特征描述矩阵声明
		MatOfKeyPoint keyPoint1 = new MatOfKeyPoint(), keyPoint2 = new MatOfKeyPoint();
		Mat descriptorMat1 = new Mat(), descriptorMat2 = new Mat();
		// 计算ORB特征关键点
		orb.detectAndCompute(gray_base, new Mat(), keyPoint1, descriptorMat1);
		orb.detectAndCompute(gray_test, new Mat(), keyPoint2, descriptorMat2);
		//画特征点
		//DrawPoint(keyPoint1, gray_test);
		// 特征点匹配
		System.out.println(keyPoint1.size() + "," + keyPoint2.size());
		if (!keyPoint1.size().empty() && !keyPoint2.size().empty()) {
			// FlannBasedMatcher matcher = new FlannBasedMatcher();
			DescriptorMatcher matcher = DescriptorMatcher.create(DescriptorMatcher.BRUTEFORCE);
			MatOfDMatch matches = new MatOfDMatch();
			matcher.match(descriptorMat1, descriptorMat2, matches);
			// 最优匹配判断
			double max_dist = 0; double min_dist = 100;
			DMatch[] marr = matches.toArray();
			List<DMatch> goodDM = new ArrayList<DMatch>();
			for( int i = 0; i < descriptorMat1.rows(); i++ ){ 
				double dist = marr[i].distance;
			    if( dist < min_dist ) min_dist = dist;
			    if( dist > max_dist ) max_dist = dist;

			}
			System.out.println(marr.length);
			for( int i = 0; i < marr.length; i++ ){ 
				if( marr[i].distance <= 3*min_dist ){
					goodDM.add(marr[i]);
				}
			}
			
			// 中心点计算
			int x = 0,y = 0;
			for( int i = 0; i < goodDM.size(); i++ ){
			    //-- Get the keypoints from the good matches
				KeyPoint[] kparr2 = keyPoint2.toArray();
				int pt;
				pt = goodDM.get(i).trainIdx;
				Point p = kparr2[pt].pt;
				x += p.x;
				y += p.y;
			    }
			if(goodDM.size() < 8) {
				return new Point(-1, goodDM.size());
			}
			x = x/goodDM.size();
			y = y/goodDM.size();
			//System.out.println(x + "," + y);
			return new Point(x, y);
		}
		return new Point(-1, -1);
	}
	
	public static void DrawPoint(MatOfKeyPoint kp, Mat src, Image a) {
		String title = "test";
        JFrame frame = new JFrame(title);
        JLabel img = new JLabel();
        //frame.setLayout(new GridLayout(2, 2));
        Image tmpImg = ImageProcess.toBufferedImage(src);
        ImageIcon icon = new ImageIcon(a);
        img.setIcon(icon);
        frame.add(img);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setVisible(true);
	}
}
