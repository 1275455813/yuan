package com.my.po;

/**
 * 文件信息类
 * 
 * <p>Copyright: Copyright (c) 2019</p>
 * <p>succez</p>
 * @author wangyuan
 * @createdate 2019年8月8日
 */
public class FileInfo {

	//文件名
	private String name;

	//是否是文件
	private boolean isFile;

	//文件路径
	private String dir;

	public String getDir() {
		return dir;
	}

	public void setDir(String dir) {
		this.dir = dir;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isFile() {
		return isFile;
	}

	public void setFile(boolean isFile) {
		this.isFile = isFile;
	}
}
