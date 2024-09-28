import socket

def test_smtp_connection():
    try:
        host = 'smtp.gmail.com'
        port = 587  # or 465
        socket.create_connection((host, port), timeout=10)
        print(f"Successfully connected to {host}:{port}")
    except Exception as e:
        print(f"Failed to connect to {host}:{port}. Error: {e}")

if __name__ == "__main__":
    test_smtp_connection()
