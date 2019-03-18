package com.my.tools;

import java.io.File;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

public class Table_pk {
	
	private HashMap<String, String> mappings = new HashMap<String, String>();
	
	private Table_pk() {
		getTable_pk();
	}
	
	private static Table_pk tp = new Table_pk();
	
	private void getTable_pk() {
	try {   
		File f = new File("src/main/resources/mappers.xml");   
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();   
		DocumentBuilder builder = factory.newDocumentBuilder();   
		Document doc = builder.parse(f);   
		NodeList nl = doc.getElementsByTagName("mapper");   
		for (int i = 0; i < nl.getLength(); i++) {   
		    String c = doc.getElementsByTagName("class").item(i).getFirstChild().getNodeValue();
		    String t = doc.getElementsByTagName("table").item(i).getFirstChild().getNodeValue();
		    String p = doc.getElementsByTagName("pk").item(i).getFirstChild().getNodeValue();
		    mappings.put(c, t);
		    mappings.put(t, p);
		}   
		} catch (Exception e) {   
		   e.printStackTrace();   
		   }   
	}
	
	public static HashMap<String, String> getMappings() {
		return tp.mappings;
	}
}
