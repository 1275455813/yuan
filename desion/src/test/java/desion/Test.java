package desion;

import org.json.JSONObject;

import com.my.tools.StaticMethod;

public class Test {
	//@Test
	public static void main(String[] args) {
		/*
		 * String param =
		 * "callback=renderReverse&location=35.658651,139.745415&output=json&pois=1&latest_admin=1&ak=ZGGKF5ONyVt5lIOTiGXa4uIeAjWvtYqH";
		 * String s =
		 * StaticMethod.sendGet("http://api.map.baidu.com/geocoder/v2/",param); //s =
		 * s.replaceAll("renderReverse&&renderReverse", ""); s = s.substring(29,
		 * s.length() - 1); JSONObject js = new JSONObject(s); JSONObject result =
		 * js.getJSONObject("result");
		 * System.out.print(result.get("formatted_address"));
		 */
		System.out.print(StaticMethod.getLocation("35.658651", "139.745415"));
	}
}
