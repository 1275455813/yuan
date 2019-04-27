package desion;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;

import com.my.tools.opencv.ImFeatures2d;
import com.my.tools.opencv.ImageProcess;

public class OpenCV {
	public static void main( String[] args ) throws FileNotFoundException, IOException{
		System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
		//直方图比较
		/*
		 * Mat img = Imgcodecs.imread("C://Users//qf//Pictures//test//1.jpg",
		 * Imgcodecs.IMREAD_COLOR ); Mat img1 =
		 * Imgcodecs.imread("C://Users/qf//Pictures//test//1.jpg",
		 * Imgcodecs.IMREAD_COLOR ); ImageProcess.compareHist(img, img1);
		 */
		//数组转mat
		double[] a = {253,2,3,4};
		Mat b= new Mat(2,2,CvType.CV_8UC1);
		int len = b.channels()*b.cols()*b.rows();
		byte[] c = new byte[len];
		b.put(0, 0, a);
		b.get(0,0,c);
		BufferedImage m3 = ImageProcess.Mat2BufImg(b);
		//Object out = m3.getRaster().getDataElements(0, 0, null);
        System.out.println((m3.getRGB(0, 0) & 0xff00)>> 8);
        //b.t()
        double[] p = b.get(0, 0);
		System.out.println(p[0]);
	}
}
