class Library:
    def __init__(self, tenant, name, editable=True):
        self.name = name
        self.tenant = tenant
        self.editable = editable

    def __json__(self):
        return self.__dict__
