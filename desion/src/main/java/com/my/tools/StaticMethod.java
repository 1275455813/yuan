package com.my.tools;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class StaticMethod {
	public static String getLocation(String x, String y) {
		String param = "callback=renderReverse&location="+ x +","+ y +"&output=json&pois=1&latest_admin=1&ak=ZGGKF5ONyVt5lIOTiGXa4uIeAjWvtYqH";
		String s = StaticMethod.sendGet("http://api.map.baidu.com/geocoder/v2/",param);
		System.out.println(s);
		s = s.substring(29, s.length() - 1);
		ObjectMapper mapper = new ObjectMapper();
		try {
			JsonNode js = mapper.readTree(s);
			s = js.get("result").get("formatted_address").asText();
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return s;
	}
	 public static String sendGet(String url, String param) {
	        String result = "";
	        BufferedReader in = null;
	        try {
	        	String urlNameString = urlDeal(url, param);
	            URL realUrl = new URL(urlNameString);
	            // 打开和URL之间的连接
	            URLConnection connection = realUrl.openConnection();
	            // 设置通用的请求属性
	            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	            // 建立实际的连接
	            connection.connect();
	            // 获取所有响应头字段
			/*
			 * Map<String, List<String>> map = connection.getHeaderFields(); // 遍历所有的响应头字段
			 * for (String key : map.keySet()) { System.out.println(key + "--->" +
			 * map.get(key)); }
			 */
	            // 定义 BufferedReader输入流来读取URL的响应
	            in = new BufferedReader(new InputStreamReader(
	                    connection.getInputStream()));
	            String line;
	            while ((line = in.readLine()) != null) {
	                result += line;
	            }
	        } catch (Exception e) {
	            System.out.println("发送GET请求出现异常！" + e);
	            e.printStackTrace();
	        }
	        // 使用finally块来关闭输入流
	        finally {
	            try {
	                if (in != null) {
	                    in.close();
	                }
	            } catch (Exception e2) {
	                e2.printStackTrace();
	            }
	        }
	        return result;
	    }

	    /**
	     * 向指定 URL 发送POST方法的请求
	     * 
	     * @param url
	     *            发送请求的 URL
	     * @param param
	     *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
	     * @return 所代表远程资源的响应结果
	     */
	    public static String sendPost(String url, String param) {
	        PrintWriter out = null;
	        BufferedReader in = null;
	        String result = "";
	        try {
	            URL realUrl = new URL(url);
	            // 打开和URL之间的连接
	            URLConnection conn = realUrl.openConnection();
	            // 设置通用的请求属性
	            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	            // 发送POST请求必须设置如下两行
	            conn.setDoOutput(true);
	            conn.setDoInput(true);
	            // 获取URLConnection对象对应的输出流
	            out = new PrintWriter(conn.getOutputStream());
	            // 发送请求参数
	            out.print(param);
	            // flush输出流的缓冲
	            out.flush();
	            // 定义BufferedReader输入流来读取URL的响应
	            in = new BufferedReader(
	                    new InputStreamReader(conn.getInputStream()));
	            String line;
	            while ((line = in.readLine()) != null) {
	                result += line;
	            }
	        } catch (Exception e) {
	            System.out.println("发送 POST 请求出现异常！"+e);
	            e.printStackTrace();
	        }
	        //使用finally块来关闭输出流、输入流
	        finally{
	            try{
	                if(out!=null){
	                    out.close();
	                }
	                if(in!=null){
	                    in.close();
	                }
	            }
	            catch(IOException ex){
	                ex.printStackTrace();
	            }
	        }
	        return result;
	    }
	    
	    private static String urlDeal(String url, String param) {
	    	String urld;
	    	if(param == null) {
        		urld = url;
        	}
        	else {
        		urld = url + "?" + param;
        	}
        	if(urld.indexOf("https://") != 0 && urld.indexOf("http://") != 0) {
        		urld = "https://" + urld;
        	}
        	return urld;
	    }
}
