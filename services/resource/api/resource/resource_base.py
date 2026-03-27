
class ResourceBase:
    @staticmethod
    def cleanup_metadata(metadata):
        return {key: value for key, value in metadata.items() if value is not None}
