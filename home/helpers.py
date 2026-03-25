
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six

from django.core.mail import send_mail
import uuid


def send_forget_password_mail (email):
  token =str(uuid.uuid4())
  subject ='Your forget password link'
  message =f'Hi  CLICK ON THIS LINK TO RESET YOUR PASSWORD http://127.0.0.1:8000/forgot_password/{token}/'
  
  
  
  
class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk) + six.text_type(timestamp) + six.text_type(user.is_active)
        )
account_activation_token = TokenGenerator()