package com.my.tools;

import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public class MyJDBC<T> {
	
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	/** 
	* 创建一个Class的对象来获取泛型的class 
	 */  
	private Class<T> clz;  
	
	private Class<T> _c = getClz();
	
	private String table = getTable();
	      
	@SuppressWarnings("unchecked")  
	private Class<T> getClz(){  
	    if (clz==null) {  
	        clz=(Class<T>)(((ParameterizedType)this.getClass().getGenericSuperclass()).getActualTypeArguments()[0]);  
	    }  
	    return clz;  
	}  
	
	/**
	 * 查询数据
	 * 
	 * @param sql
	 * @return
	 */
	public List<T> query() {
		RowMapper<T> rowMapper=new BeanPropertyRowMapper<T>(_c);
		List<T> data = jdbcTemplate.query("select * from " + table, rowMapper);
		return data;
	}
	
	public List<T> query(String where, Object[] args){
		RowMapper<T> rowMapper=new BeanPropertyRowMapper<T>(_c);
		List<T> data = jdbcTemplate.query("select * from " + table + " where " +where, args, rowMapper);
		return data;
	}
	
	public int updata(T po) {
		String pk = getPk();
		String set = "";
		String pkValue = null;
		
		java.lang.reflect.Field[] fields = po.getClass().getDeclaredFields();
		List<String> listValue = new ArrayList<String>();
		
		for(int i=0, len = fields.length; i < len; i++) {
			java.lang.reflect.Field f = fields[i];
			String name = f.getName();
			String value = null;
			try {
				value = getValue(po, name);
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			if(value != null && !name.equals(pk)) {
				set += name + "=?,";
				listValue.add(value);
			}
			if(name.equals(pk)) {
				pkValue  = value;
			}
		}
		listValue.add(pkValue);
		set = set.substring(0, set.length() - 1);
		String sql = "update " + table + " set " + set + " where " + pk +"=?";
		int size = listValue.size();
		Object[] param = new Object[size];
		for(int i=0;  i<size; i++) {
			param[i] = listValue.get(i);
		}
		
		int count = jdbcTemplate.update(sql, param);
		return count;
	}
	
	private String getValue(T po, String name) throws NoSuchMethodException, SecurityException, Exception{
		Method m = (Method) po.getClass().getMethod("get" + getMethodName(name));

	    String val = (String) m.invoke(po);// 调用getter方法获取属性值
		return val;
	}
	
	// 把一个字符串的第一个字母大写、效率是最高的、
	 private static String getMethodName(String fildeName) throws Exception{
	  byte[] items = fildeName.getBytes();
	  items[0] = (byte) ((char) items[0] - 'a' + 'A');
	  return new String(items);
	 }
	 
	 private String getTable() {
		 HashMap<String, String> mappings = Table_pk.getMappings();
		 return mappings.get(getClz().getSimpleName());
	 }
	 
	 private String getPk() {
		 HashMap<String, String> mappings = Table_pk.getMappings();
		 return mappings.get(table);
	 }
}
