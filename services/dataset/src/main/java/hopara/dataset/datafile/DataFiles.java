package hopara.dataset.datafile;

import java.util.ArrayList;

public class DataFiles extends ArrayList<DataFile> {

    public DataFile findByName(String name) {
        for ( var dataFile : this ) {
            if ( dataFile.hasSameName(name)) {
                return dataFile;
            }
        }

        return null;
    }
    
}
