package hopara.dataset.filter;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.zip.GZIPInputStream;

import org.apache.commons.io.IOUtils;

public class Gzip {
    public static String uncompress(String compressed) {
        try {
            byte[] compressedData = java.util.Base64.getDecoder().decode(compressed);            
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            IOUtils.copy(new GZIPInputStream(new ByteArrayInputStream(compressedData)), out);
            return new String(out.toByteArray());
        }
        catch(Exception e ) {
            throw new RuntimeException(e);
        }
    }
    
}
