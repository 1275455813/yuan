package com.my.tools.opencv;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

public class ImageProcess{
	   /**
	 * 通过直方图比较两张图片
	 * @param _src  原始图
	 * @param _des   目标图
	 * @return
	 */
	public static int compareHist(Mat _src, Mat _des) {
		System.out.println("\n==========直方图比较==========");
			try {
	 
				long startTime = System.currentTimeMillis();
				System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
	 
				Mat mat_src = _src;
				Mat mat_des = _des;
	 
				if (mat_src.empty() || mat_des.empty()) {
					throw new Exception("no file.");
				}
	 
				Mat hsv_src = new Mat();
				Mat hsv_des = new Mat();
	 
				// 转换成HSV
				Imgproc.cvtColor(mat_src, hsv_src, Imgproc.COLOR_BGR2HSV);
				Imgproc.cvtColor(mat_des, hsv_des, Imgproc.COLOR_BGR2HSV);
	 
				List<Mat> listImg1 = new ArrayList<Mat>();
				List<Mat> listImg2 = new ArrayList<Mat>();
				listImg1.add(hsv_src);
				listImg2.add(hsv_des);
	 
				MatOfFloat ranges = new MatOfFloat(0, 255);
				MatOfInt histSize = new MatOfInt(50);
				MatOfInt channels = new MatOfInt(0);
	 
				Mat histImg1 = new Mat();
				Mat histImg2 = new Mat();
	 
				Imgproc.calcHist(listImg1, channels, new Mat(), histImg1, histSize,
						ranges);
				Imgproc.calcHist(listImg2, channels, new Mat(), histImg2, histSize,
						ranges);
	 
				Core.normalize(histImg1, histImg1, 0, 1, Core.NORM_MINMAX, -1,
						new Mat());
				Core.normalize(histImg2, histImg2, 0, 1, Core.NORM_MINMAX, -1,
						new Mat());
	 
				double result0, result1, result2, result3;
				result0 = Imgproc.compareHist(histImg1, histImg2, 0);
				result1 = Imgproc.compareHist(histImg1, histImg2, 1);
				result2 = Imgproc.compareHist(histImg1, histImg2, 2);
				result3 = Imgproc.compareHist(histImg1, histImg2, 3);
	 
				// 0 - 相关性：度量越高，匹配越准确 “> 0.9”
				// 1 - 卡方: 度量越低，匹配越准确 "< 0.1"
				// 2 - 交叉核: 度量越高，匹配越准确 "> 1.5"
				// 3 - 巴氏距离: 度量越低，匹配越准确 "< 0.3"
				System.out.println("相关性（度量越高，匹配越准确 [基准：0.9]）,当前值:" + result0);
				System.out.println("卡方（度量越低，匹配越准确 [基准：0.1]）,当前值:" + result1);
				System.out.println("交叉核（度量越高，匹配越准确 [基准：1.5]）,当前值:" + result2);
				System.out.println("巴氏距离（度量越低，匹配越准确 [基准：0.3]）,当前值:" + result3);
	 
				int count = 0;
				if (result0 > 0.9)
					count++;
				if (result1 < 0.1)
					count++;
				if (result2 > 1.5)
					count++;
				if (result3 < 0.3)
					count++;
				int retVal = 0;
				if (count >= 3) {
					//这是相似的图像
					retVal = 1;
				}
	 
				long estimatedTime = System.currentTimeMillis() - startTime;
	 
				System.out.println("花费时间= " + estimatedTime + "ms");
	 
				return retVal;
			} catch (Exception e) {
				System.out.println("例外:" + e);
		}
		return 0;
	}
	
	/**
	 * Mat对象转BufferedImage
	 * @param matrix(Mat对象)
	 * @param fileExtension(图片后辍，格式为 ".jpg", ".png", etc)
	 * @return
	 */
	public static BufferedImage Mat2BufImg (Mat matrix) {
		
		MatOfByte mob = new MatOfByte();
		Imgcodecs.imencode(".jpg", matrix, mob);
		// convert the "matrix of bytes" into a byte array
		byte[] byteArray = mob.toArray();
		BufferedImage bufImage = null;
		try {
			InputStream in = new ByteArrayInputStream(byteArray);
			bufImage = ImageIO.read(in);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return bufImage;
	}
	
	public static BufferedImage toBufferedImage(Mat m) {
        int type = BufferedImage.TYPE_BYTE_GRAY;
        if ( m.channels() > 1 ) {
            type = BufferedImage.TYPE_3BYTE_BGR;
        }
        int bufferSize = m.channels()*m.cols()*m.rows();
        byte [] b = new byte[bufferSize];
        m.get(0,0,b); // get all the pixels
        BufferedImage image = new BufferedImage(m.cols(),m.rows(), type);
        final byte[] targetPixels = ((DataBufferByte) image.getRaster().getDataBuffer()).getData();
        System.arraycopy(b, 0, targetPixels, 0, b.length);
        return image;
    }
	
	/**
     * BufferedImage转换成Mat
     * 
     * @param original
          *            要转换的BufferedImage
     * @param imgType
     *            bufferedImage的类型 如 BufferedImage.TYPE_3BYTE_BGR
     * @param matType
          *            转换成mat的type 如 CvType.CV_8UC3(彩色图),CvType.CV_8UC1(灰度图)
     */
	public static Mat BufToMat (BufferedImage original) {
		if (original == null) {
			throw new IllegalArgumentException("original == null");
        }

        // Don't convert if it already has correct type
		/*
		 * if (original.getType() != imgType) {
		 * 
		 * // Create a buffered image BufferedImage image = new
		 * BufferedImage(original.getWidth(), original.getHeight(), imgType);
		 * 
		 * // Draw the image onto the new buffer Graphics2D g = image.createGraphics();
		 * try { g.setComposite(AlphaComposite.Src); g.drawImage(original, 0, 0, null);
		 * } finally { g.dispose(); } }
		 */

        byte[] pixels = ((DataBufferByte) original.getRaster().getDataBuffer()).getData();
        //Mat mat = Mat.eye(original.getHeight(), original.getWidth(), 16);
        Mat mat = new Mat(original.getHeight(), original.getWidth(), CvType.CV_8UC3);
        mat.put(0, 0, pixels);
        return mat;
    }
}
