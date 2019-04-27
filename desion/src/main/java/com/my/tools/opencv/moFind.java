package com.my.tools.opencv;

import org.opencv.core.*;
import org.opencv.core.Point;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
class MatchTemplateDemoRun implements ChangeListener{
    Boolean use_mask = false;
    Mat img = new Mat(), templ = new Mat();
    Mat mask = new Mat();
    int match_method;
    JLabel imgDisplay = new JLabel(), resultDisplay = new JLabel();
    public void run(String[] args) {
        if (args.length < 2)
        {
            System.out.println("Not enough parameters");
            System.out.println("Program arguments:\n<image_name> <template_name> [<mask_name>]");
            System.exit(-1);
        }
        img = Imgcodecs.imread( args[0], Imgcodecs.IMREAD_COLOR );
        templ = Imgcodecs.imread( args[1], Imgcodecs.IMREAD_COLOR );
        if(args.length > 2) {
            use_mask = true;
            mask = Imgcodecs.imread( args[2], Imgcodecs.IMREAD_COLOR );
        }
        if(img.empty() || templ.empty() || (use_mask && mask.empty()))
        {
            System.out.println("Can't read one of the images");
            System.exit(-1);
        }
        matchingMethod();
        createJFrame();
    }
    private void matchingMethod() {
        Mat result = new Mat();
        Mat img_display = new Mat();
        img.copyTo( img_display );
        int result_cols =  img.cols() - templ.cols() + 1;
        int result_rows = img.rows() - templ.rows() + 1;
        result.create( result_rows, result_cols, CvType.CV_32FC1 );
        Boolean method_accepts_mask = (Imgproc.TM_SQDIFF == match_method ||
                match_method == Imgproc.TM_CCORR_NORMED);
        if (use_mask && method_accepts_mask)
        { Imgproc.matchTemplate( img, templ, result, match_method, mask); }
        else
        { Imgproc.matchTemplate( img, templ, result, match_method); }
        Core.normalize( result, result, 0, 1, Core.NORM_MINMAX, -1, new Mat() );
        Point matchLoc;
        Core.MinMaxLocResult mmr = Core.minMaxLoc( result );
        //  For all the other methods, the higher the better
        if( match_method  == Imgproc.TM_SQDIFF || match_method == Imgproc.TM_SQDIFF_NORMED )
        { matchLoc = mmr.minLoc; }
        else
        { matchLoc = mmr.maxLoc; }
        Imgproc.rectangle(img_display, matchLoc, new Point(matchLoc.x + templ.cols(),
                matchLoc.y + templ.rows()), new Scalar(0, 0, 0), 2, 8, 0);
        Imgproc.rectangle(result, matchLoc, new Point(matchLoc.x + templ.cols(),
                matchLoc.y + templ.rows()), new Scalar(0, 0, 0), 2, 8, 0);
        Image tmpImg = toBufferedImage(img_display);
        ImageIcon icon = new ImageIcon(tmpImg);
        imgDisplay.setIcon(icon);
        result.convertTo(result, CvType.CV_8UC1, 255.0);
        tmpImg = toBufferedImage(result);
        icon = new ImageIcon(tmpImg);
        resultDisplay.setIcon(icon);
    }
    public void stateChanged(ChangeEvent e) {
        JSlider source = (JSlider) e.getSource();
        if (!source.getValueIsAdjusting()) {
            match_method = (int)source.getValue();
            matchingMethod();
        }
    }
    public Image toBufferedImage(Mat m) {
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
    private void createJFrame() {
        String title = "Source image; Control; Result image";
        JFrame frame = new JFrame(title);
        frame.setLayout(new GridLayout(2, 2));
        frame.add(imgDisplay);
        int min = 0, max = 5;
        JSlider slider = new JSlider(JSlider.VERTICAL, min, max, match_method);
        slider.setPaintTicks(true);
        slider.setPaintLabels(true);
        // Set the spacing for the minor tick mark
        slider.setMinorTickSpacing(1);
        // Customizing the labels
        Hashtable<Integer, JLabel> labelTable = new Hashtable<Integer, JLabel>();
        labelTable.put( new Integer( 0 ), new JLabel("0 - SQDIFF") );
        labelTable.put( new Integer( 1 ), new JLabel("1 - SQDIFF NORMED") );
        labelTable.put( new Integer( 2 ), new JLabel("2 - TM CCORR") );
        labelTable.put( new Integer( 3 ), new JLabel("3 - TM CCORR NORMED") );
        labelTable.put( new Integer( 4 ), new JLabel("4 - TM COEFF") );
        labelTable.put( new Integer( 5 ), new JLabel("5 - TM COEFF NORMED : (Method)") );
        slider.setLabelTable( labelTable );
        slider.addChangeListener(this);
        frame.add(slider);
        frame.add(resultDisplay);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setVisible(true);
    }
}
public class moFind
{
    public static void main(String[] args) throws IOException {
        // load the native OpenCV library
    	
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        // run code
        //String i1 = "D:\\opencv\\sources\\samples\\data\\zhuo1.png";
        //String i2 = "D:\\opencv\\sources\\samples\\data\\zhuomian.png";
        String i1 = "C://Users//qf//Pictures//test//zhuo1.png";
        String i2 = "C://Users//qf//Pictures//test//zhuomian1.png";
        //new MatchTemplateDemoRun().run(new String[]{i2,i1});
        //File tar = new File(i1);
        //FileInputStream in = new FileInputStream(tar);
        //BufferedImage bf1 = ImageIO.read(in);
        //int a = 0;
        Mat m1 = ImageProcess.BufToMat(ImageIO.read(new FileInputStream(new File(i1))));
        Mat m2 = ImageProcess.BufToMat(ImageIO.read(new FileInputStream(new File(i2))));
        BufferedImage m3 = ImageIO.read(new FileInputStream(new File(i1)));
        
        Object out = m3.getRaster().getDataElements(0, 0, null);
        //System.out.println(m3.getColorModel().getGreen(out));
        //System.out.println(a);
        Mat m11  = new Mat(m1.width(),m1.height(),0);
        Mat m22  = new Mat(m2.width(),m2.height(),0);
        Imgproc.cvtColor(m1, m11, Imgproc.COLOR_RGB2GRAY);
        Imgproc.cvtColor(m2, m22, Imgproc.COLOR_RGB2GRAY);
        Point result = ImFeatures2d.findPic(m11, m22);
		System.out.println(result.x + "," + result.y);
		Mat gray_base = Imgcodecs.imread(i1, Imgcodecs.IMREAD_GRAYSCALE);
		Mat gray_test = Imgcodecs.imread(i2, Imgcodecs.IMREAD_GRAYSCALE);
		result = ImFeatures2d.findPic(gray_base, gray_test);
		System.out.println(result.x + "," + result.y);
    }
}
