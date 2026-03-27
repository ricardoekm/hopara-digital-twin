package hopara.dataset.datafile.s3;

import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.datafile.DataFile;
import hopara.dataset.datafile.DataFileTableRepository;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;

public class S3DataFileTableRepository extends DataFileTableRepository {
	@Autowired
	private AwsCredentialsProvider awsCredentialsProvider;

	@Override
	protected Boolean requireInstall() {
		return true;
	}

    protected String getInstallStatement() {
		var credentials = awsCredentialsProvider.resolveCredentials();
		
		var httpfsInstall = "INSTALL httpfs;";
		httpfsInstall += "LOAD httpfs;";
		httpfsInstall += "SET s3_access_key_id='" + credentials.accessKeyId() + "';";
		httpfsInstall += "SET s3_secret_access_key='" + credentials.secretAccessKey() + "';";
		httpfsInstall += "SET s3_region='us-east-1';";
		return httpfsInstall;
	}

	@Override
	protected String getFilePath(DataFile dataFile) {
		return "s3://" + dataFile.getFilePath();
	}
}
