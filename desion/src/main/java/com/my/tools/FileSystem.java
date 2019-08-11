package com.my.tools;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.my.po.FileInfo;

/**
 * 文件管理系统操作实现类
 * 
 * <p>Copyright: Copyright (c) 2019</p>
 * <p>succez</p>
 * @author wangyuan
 * @createdate 2019年8月8日
 */
@Component
public class FileSystem {

	/**
	 * 获取根路径下的文件信息
	 * @return
	 * @throws IOException
	 */
	public List<FileInfo> getRootFiles() throws IOException {
		return getAllFiles(getRoot());
	}

	/**
	 * 获取指定路径下的文件信息
	 * @param path
	 * @return
	 * @throws IOException
	 */
	public List<FileInfo> getAllFiles(String path) throws IOException {
		List<FileInfo> list = new ArrayList<FileInfo>();

		File file = new File(path);
		String[] fileList = file.list();
		for (int i = 0; i < fileList.length; i++) {

			File f = new File(path + "/" + fileList[i]);
			FileInfo fi = new FileInfo();
			fi.setName(fileList[i]);
			fi.setDir(path);

			if (f.isDirectory()) {
				fi.setFile(false);
			}
			else {
				fi.setFile(true);
			}
			list.add(fi);
		}

		return list;
	}

	/**
	 * 获取文本文件的内容
	 * 
	 * @param dir
	 * @param fileName
	 * @return
	 * @throws IOException
	 */
	public String getFileContent(String dir, String fileName) throws IOException {
		String path = dir + "/" + fileName;
		String code = codeString(path);
		InputStreamReader isr = new InputStreamReader(new FileInputStream(path), code);
		BufferedReader br = new BufferedReader(isr);

		String lineTxt = null;
		StringBuffer content = new StringBuffer();
		while ((lineTxt = br.readLine()) != null) {
			content.append(lineTxt).append("\n");
		}
		return content.toString();
	}

	/**
	 * 保存前台更改的内容到文件
	 * 
	 * @param dir
	 * @param fileName
	 * @param content
	 * @throws IOException
	 */
	public void saveFile(String dir, String fileName, String content) throws IOException {
		String path = dir + "/" + fileName;
		FileWriter fw = new FileWriter(path);
		try {
			BufferedWriter bw = new BufferedWriter(fw);
			try {
				bw.write(content);
			}
			finally {
				bw.close();
			}
		}
		finally {
			fw.close();
		}
	}

	/**
	 * 返回一个根目录
	 * 
	 * @return
	 */
	private String getRoot() {
		return "D:/";
	}

	/**
	 * 获得文件编码  
	 * @param fileName
	 * @return
	 * @throws IOException 
	 * @throws Exception
	 */
	private String codeString(String fileName) throws IOException {
		BufferedInputStream bin = new BufferedInputStream(new FileInputStream(fileName));
		int p;
		try {
			p = (bin.read() << 8) + bin.read();
		}
		finally {
			bin.close();
		}
		String code = null;

		switch (p) {
			case 0xefbb:
				code = "UTF-8";
				break;
			case 0xfffe:
				code = "Unicode";
				break;
			case 0xfeff:
				code = "UTF-16BE";
				break;
			default:
				code = "GBK";
		}

		return code;
	}
}
