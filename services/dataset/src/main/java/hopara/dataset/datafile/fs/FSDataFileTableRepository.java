package hopara.dataset.datafile.fs;

import hopara.dataset.datafile.DataFile;
import hopara.dataset.datafile.DataFileTableRepository;

public class FSDataFileTableRepository extends DataFileTableRepository {
    protected String getInstallStatement() {
		return "";
	}

	@Override
	protected Boolean requireInstall() {
		return false;
	}

	@Override
	protected String getFilePath(DataFile dataFile) {
		return dataFile.getFilePath();
	}
}
