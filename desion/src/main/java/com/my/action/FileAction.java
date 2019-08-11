package com.my.action;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.my.po.FileInfo;
import com.my.tools.FileSystem;

@Controller
@RequestMapping("/fileSystem")
public class FileAction {

	@Autowired
	FileSystem fileSystem;
	
	private static final Logger logger = LoggerFactory.getLogger(FileAction.class); 

	@RequestMapping("/index")
	public String toIndex() {
		return "index";
	}

	/**
	 * 获取根目录文件信息
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/root")
	public List<FileInfo> getRoot() {
		try {
			return fileSystem.getRootFiles();
		}
		catch (IOException e) {
			logger.info(e.getMessage());
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取指定路径下的文件信息
	 * @param dir
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/files")
	public List<FileInfo> getFiles(String dir, String name) {
		String path = dir + "/" + name;
		try {
			return fileSystem.getAllFiles(path);
		}
		catch (IOException e) {
			logger.info(e.getMessage());
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取指定路径下的文件信息
	 * @param dir
	 * @param name
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/getFileContent")
	public String getFileContent(String dir, String name) {
		try {
			return fileSystem.getFileContent(dir, name);
		}
		catch (IOException e) {
			logger.info(e.getMessage());
			e.printStackTrace();
		}
		return null;
	}

	@ResponseBody
	@RequestMapping("/saveFile")
	public boolean saveFile(String dir, String name, String content) {
		try {
			fileSystem.saveFile(dir, name, content);
			return true;
		}
		catch (IOException e) {
			logger.info(e.getMessage());
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 下载文件
	 * 
	 * @param response
	 * @param dir
	 * @param name
	 * @throws IOException
	 */
	@RequestMapping("/downloadFile")
	public void downloadFile(HttpServletResponse response, String dir, String name) throws IOException {
		//设置文件下载头  
		//response.addHeader("Content-Disposition", "attachment;filename=" + new String(name.getBytes("utf-8"),"ISO8859-1"));
		response.addHeader("Content-Disposition", "attachment;filename=" + name);
		//设置文件ContentType类型，这样设置，会自动判断下载文件类型    
		response.setContentType("multipart/form-data");
		//文件路径
		String path = dir + "/" + name;
		InputStream bis = new BufferedInputStream(new FileInputStream(new File(path)));
		try {
			BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
			try {
				int len = 0;
				while ((len = bis.read()) != -1) {
					out.write(len);
				}
				out.flush();
			}
			finally {
				out.close();
			}
		}
		finally {
			bis.close();
		}
	}
}
