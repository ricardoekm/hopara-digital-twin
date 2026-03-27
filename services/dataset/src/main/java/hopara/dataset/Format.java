package hopara.dataset;

public class Format {
    public static String format(String format, Object... args) {
        return String.format(java.util.Locale.US,format, args);
    }
}
