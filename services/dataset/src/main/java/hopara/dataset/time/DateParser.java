package hopara.dataset.time;

import java.util.Date;

import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;
import org.joda.time.format.DateTimeParser;


public class DateParser {
	
		public static DateTimeParser getParser(String pattern ) {
			return DateTimeFormat.forPattern(pattern).getParser();
		}
	
    	public static final DateTimeParser[] dateParsers = { 
			getParser("yyyy-MM-dd'T'HH:mm:ss.SSS"),
			getParser("yyyy-MM-dd'T'HH:mm:ss.SSSZ"),
			getParser("yyyy-MM-dd'T'HH:mm:ssZ"),
			getParser("yyyy-MM-dd HH:mm:ssZ"),
	        getParser("yyyy-MM-dd'T'HH:mm:ss"),
			getParser("yyyy-MM-dd'T'HH:mm:ss.SSSSSS"),
			getParser("yyyyMMdd"),
			getParser("dd-MM-yyyy"),
			getParser("yyyy-MM"),
			getParser("yyyy-MM-dd"),
			getParser("MM/dd/yyyy"),
			getParser("yyyy/MM/dd"),
			getParser("dd MMM yyyy"),
			getParser("dd MMMM yyyy"),
			getParser("dd-MM-yyyy HH:mm"),
			getParser("yyyy-MM-dd HH:mm"),
			getParser("MM/dd/yyyy HH:mm"),
			getParser("yyyy/MM/dd HH:mm"),
			getParser("dd MMM yyyy HH:mm"),
			getParser("dd MMMM yyyy HH:mm"),
			getParser("yyyyMMddHHmmss"),
			getParser("yyyyMMdd HHmms"),
			getParser("yyyy-MM-dd HH:mm:ss"),
			getParser("MM/dd/yyyy HH:mm:ss"),
			getParser("yyyy/MM/dd HH:mm:ss"),
			getParser("dd MMM yyyy HH:mm:ss"),
			getParser("dd MMMM yyyy HH:mm:ss")
    	};
    	
    	public static final DateTimeFormatter formatter = new DateTimeFormatterBuilder().append(null, dateParsers).toFormatter();
    	
    	public static Date parse(String dateString) {
        	return formatter.parseDateTime(dateString).withZone(DateTimeZone.UTC).toDate();
    	}
}
