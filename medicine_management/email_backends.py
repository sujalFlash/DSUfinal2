from django.core.mail.backends.smtp import EmailBackend


class CustomEmailBackend(EmailBackend):
    def __init__(self, *args, **kwargs):
        # Set a custom timeout value (in seconds)
        self.timeout = kwargs.get('timeout', 1000)  # 60 seconds
        super().__init__(*args, **kwargs)

    def open(self, *args, **kwargs):
        # Use the custom timeout value when creating the connection
        self.connection = self.connection_class(
            host=self.host,
            port=self.port,
            timeout=self.timeout,
        )
        self.connection.connect()
