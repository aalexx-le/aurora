from cryptography.fernet import Fernet


def generate_encrypted_key(api_key, master_key):
    f = Fernet(master_key)
    encrypted_api_key = f.encrypt(api_key.encode()) 
    return encrypted_api_key

def decrypt_api_key(encrypted_api_key, master_key):
    f = Fernet(master_key)
    api_key = f.decrypt(encrypted_api_key.encode()).decode()
    return api_key