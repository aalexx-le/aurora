import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from cryptography.fernet import Fernet
from utils.encrypt import decrypt_key, generate_encrypted_key


def test_successful_encryption_and_decryption():
    # Setup
    master_key = "pRlbqjx9R1-uqcEQN_1gdH5O2Gq7zjkfV0kS8uW2FfQ="
    original_secret = "abcd1234"
    encrypted = generate_encrypted_key(original_secret, master_key)
    
    # Test
    result = decrypt_key(encrypted, master_key)
    
    # Verify
    assert result == original_secret
    
    
def test_successful_decryption():
    # Setup - Use valid Fernet token for this specific master key
    master_key = "pRlbqjx9R1-uqcEQN_1gdH5O2Gq7zjkfV0kS8uW2FfQ="
    original_secret = "abcd1234"
    encrypted = "gAAAAABnm2q4618PjWRrG4Vdineafp-Bq0Hg1f1vNyNxSjB4XHHw6MVaRSEGrU6QWMvTdPPyeA7cg3bi0UEKRJIG8TcHxAFX_yU7DqAK5avOO4AtjkAXhw8"  # Valid encrypted value
    
    # Test
    result = decrypt_key(encrypted, master_key)
    
    # Verify
    assert result == original_secret

def test_invalid_master_key():
    master_key = Fernet.generate_key()
    wrong_key = Fernet.generate_key()
    encrypted = generate_encrypted_key("test-secret", master_key)
    
    with pytest.raises(Exception):
        decrypt_key(encrypted, wrong_key)

def test_tampered_ciphertext():
    master_key = Fernet.generate_key()
    encrypted = generate_encrypted_key("valid-secret", master_key)
    
    # Tamper with the ciphertext (now working with strings)
    tampered = encrypted[:-1] + "x"  # Modify last character
    
    with pytest.raises(Exception):
        decrypt_key(tampered, master_key)

def test_non_base64_input():
    master_key = Fernet.generate_key()
    
    with pytest.raises(Exception):
        decrypt_key("not-base64-encoded", master_key) 