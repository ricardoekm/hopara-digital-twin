class UnsupportedFileError(ValueError):
    def __init__(self, mimetype: str):
        super().__init__(f'File format not supported | {mimetype=}')
        self.mimetype = mimetype

    def __str__(self):
        return f'UnsupportedFileError: {self.mimetype}'


class UnprocessableFileError(ValueError):
    def __init__(self, message: str | None = None):
        super().__init__(message)
