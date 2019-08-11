package desion;

import javax.servlet.ServletException;

import org.json.JSONObject;
import org.springframework.web.servlet.DispatcherServlet;

import com.my.tools.StaticMethod;

public class Test {
	//@Test
	public static void main(String[] args) throws ServletException {
		DispatcherServlet d = new DispatcherServlet();
		d.init();
	}
	
	static private void a() {
		System.out.println("a");
		b();
	}
	
	static private void b() {
		System.out.println("b");
		a();
	}
}
