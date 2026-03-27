package hopara.dataset;

public class SqlSanitizer {
	public static String cleanString(String string) {
		if ( string == null || string.isEmpty() ) {
			return string;
		}

		return string.replaceAll("[^\\w]", "").replaceAll("^\\d+", "");
	}

	public static String basicCleanString(String string) {
		if ( string == null || string.isEmpty() ) {
			return string;
		}

		return string.replaceAll("[\";]", "");
	}
}
