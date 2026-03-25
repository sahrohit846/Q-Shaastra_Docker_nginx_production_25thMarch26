from django.shortcuts import render, HttpResponse, redirect
from django.http import FileResponse
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.models import User 
from django.contrib.auth import authenticate, login, logout, get_user_model, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.core.mail import send_mail

from datetime import datetime
import os
import random
import string

from home.models import Contact, User as HomeUser  # renamed to avoid conflict with auth User
from .models import *
from .helpers import send_forget_password_mail
from .forms import EmailForm, OTPForm, SetPasswordForm

from .models import UserProfile
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
import json
import requests  # type: ignore

from django.utils.timezone import make_aware
import logging
from dotenv import load_dotenv # type: ignore




load_dotenv() 
logger = logging.getLogger(__name__)

# Create your views here.
def index(request):
    # messages.sucess(request)
    numbers=list(range(20))
    # return render(request,'simulator.html',context)
    return render(request,'simulator.html',{'numbers':numbers})
def simulator(request):
    numbers=list(range(20))
    # return render(request,'simulator.html',context)
    return render(request,'simulator.html',{'numbers':numbers})
def about(request):
 
    return render(request,'about.html')



def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        desc = request.POST.get('desc')
       
        # Create an instance of the Contact model and save it to the database
        contact = Contact(name=name, email=email, phone=phone, desc=desc, date=datetime.today())
        contact.save()
        
        messages.success(request, "Your details have been successfully sent!")

        return render(request, 'contact.html')

    else:
        return render(request, 'contact.html')  # Render contact.html for GET requests

  
#*************************Regitration and login  **********************
def landing_page(request):
    return render(request, 'landing.html')
 
def user_dashboard(request):
    return render (request,'home.html')

def LogoutPage(request):
    logout(request)
    request.session.flush()
    # messages.success(request, "You have been logged out successfully.")
    return redirect('landing')

# ***************Create your views here.**********************

@login_required(login_url='login')   # Redirect to login if the user is not logged in
def HomePage(request):
    if request.user.is_superuser:
       return render(request, 'admin.site.urls')  # Separate template for admins
    else:
       return render(request, 'simulator.html')  # For regular users



from django.contrib import messages
from django.contrib.auth.hashers import make_password
from django.shortcuts import render, redirect
import string

def SignupPage(request):
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        try:
            uname = request.POST.get('username').strip().lower()  # normalize username to lowercase
            first_name = request.POST.get('first_name', '').strip()
            last_name = request.POST.get('last_name', '').strip()
            email = request.POST.get('email').strip()
            pass1 = request.POST.get('password1')
            pass2 = request.POST.get('password2')

            # Username format validation
            import re
            pattern = r'^[a-z0-9_.]{3,20}$'
            if not re.match(pattern, uname):
                messages.error(request, "Username must be 3-20 characters long, only lowercase letters, digits, underscores, or dots are allowed.")
                return redirect('signup')

            if User.objects.filter(username=uname).exists():
                messages.error(request, 'Username already exists')
                return redirect('signup')
            
            # Email domain validation
            allowed_domain = getattr(settings, "EMAIL_DOMAIN", None)
            if allowed_domain:
                if not email.endswith(allowed_domain):
                    messages.error(request, 'Invalid email address')
                    return redirect('signup')
            
            
            # Password complexity (use Django's validators in production)
            if (len(pass1) < 8 or not any(c.isupper() for c in pass1)
                or not any(c.islower() for c in pass1)
                or not any(c.isdigit() for c in pass1)
                or not any(c in string.punctuation for c in pass1)):
                messages.error(request, 'Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.')
                return redirect('signup')

            if pass1 != pass2:
                messages.error(request, "Passwords do not match!")
                return redirect('signup')

            # Create user securely
            my_user = User.objects.create_user(username=uname, email=email, password=pass1,first_name=first_name,
            last_name=last_name)
            my_user.save()
            messages.success(request, "Your account has been created successfully!")
            return redirect('login')

        except Exception as e:
            # Don’t show sensitive details to users
            messages.error(request, "An unexpected error occurred. Please try again.")
            # Optionally log for debugging
            logging.exception("Signup error: %s", e)
            return redirect('signup')
    return render(request, 'signup.html')


 # temporary for testing (optional if CSRF is handled properly)
def check_username(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username", "").strip().lower()
            is_available = not User.objects.filter(username=username).exists()
            return JsonResponse({"is_available": is_available})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)


# login page setup

# Function to generate a random 6-character CAPTCHA
def generate_captcha():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))
def LoginPage(request):
    # If the user is already logged in, redirect based on their role (superuser or regular user)
    if request.user.is_authenticated:
        if request.user.is_superuser:
            return redirect('admin:index')  # Redirect superusers to Django admin panel
        else:
            return redirect('home')  # Redirect regular users to the simulator page
        
    # If the user is not logged in, display the login page
    if request.method == 'POST':
        username = request.POST.get('username')
        pass1 = request.POST.get('pass')
        input_captcha = request.POST.get('captcha_input', '').strip()
        session_captcha = request.session.get('captcha', '')# Retrieve the CAPTCHA from the session
        # Check if both username and password are provided
        if not username or not pass1:
            messages.error(request, 'Both username & Password are required')
            return redirect('login')
         # CAPTCHA validation
        if input_captcha.lower() != session_captcha.lower():
            messages.error(request, 'Invalid CAPTCHA. Please try again.')
            return redirect('login')
        
        
        user = authenticate(request, username=username, password=pass1)

        if user is not None:
            login(request, user)       
            # Redirect based on whether the user is a superuser or a regular user
            if user.is_superuser:
                return redirect('admin:index')  # Redirect superusers to the Django admin panel
            else:
                return redirect('home')  # Redirect regular users to the simulator page

        else:
            messages.error(request, "Username or Password is incorrect!!!")
            return redirect('login')  # Redirect to the login page to show the message
# For GET requests, generate and store a new CAPTCHA
    captcha_text = generate_captcha()
    request.session['captcha'] = captcha_text
    return render(request, 'login.html', {'captcha_text': captcha_text})

 
  
 
 # View for Forgot Email ID

def ForgotEmailView(request):
   if request.method == 'POST':
        email = request.POST.get('email')
        try:
            user = User.objects.get(email=email)
            # Generate a new password
            new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
            user.set_password(new_password) # type: ignore
            user.save()
            # Send the new password to the user's email address
            send_mail(
                'Your New Password',
                f'Hello {user.username}, your new password is {new_password}.', # type: ignore
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            messages.success(request, 'A new password has been sent to your email.')
            return redirect('login')
        except User.DoesNotExist:
            messages.error(request, 'No user found with that email address.')
            return redirect('forgot_email')
   return render(request, 'forgot_email.html')
 
# Utility function to generate OTP/send otp 
def generate_otp():
    return random.randint(100000, 999999)

def send_otp_email(email, otp):
    subject = 'Your OTP for Password Reset'
    message = f'Your OTP for resetting the password is {otp}.'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)

#  Forgot Password 
def ForgotPasswordView(request):
    if request.method == 'POST':
        form = EmailForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            otp = generate_otp()
            request.session['otp'] = otp
            request.session['email'] = email
            send_otp_email(email, otp)
            messages.success(request, 'OTP sent to your email address.')
            return redirect('verify_otp')
    else:
        form = EmailForm()

    # Ensure the form is passed to the template in both GET and POST cases
    return render(request, 'forgot_password.html', {'form': form})
 
# for getting verify otp 
def verify_otp(request):
    if request.method == 'POST':
        form = OTPForm(request.POST)
        if form.is_valid():
            entered_otp = form.cleaned_data['otp']
            sent_otp = request.session.get('otp')
            if str(entered_otp) == str(sent_otp):
                # OTP is correct, redirect to password reset page
                return redirect('reset_password')
            else:
                messages.error(request, 'Invalid OTP. Please try again.')
    else:
        form = OTPForm()
    return render(request, 'verify_otp.html', {'form': form})



# Password Reset View (after OTP verification)
def reset_password(request):
    email = request.session.get('email')
    if not email:
        messages.error(request, 'Session expired. Please start the process again.')
        return redirect('forgot_password')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        messages.error(request, 'User not found.')
        return redirect('forgot_password')

    if request.method == 'POST':
        form = SetPasswordForm(request.POST)
        if form.is_valid():
            new_password = form.cleaned_data['password']
            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)  # Optional if user is logged in
            messages.success(request, 'Your password has been reset successfully.')
            # Clear session data
            request.session.flush()
            return redirect('login')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = SetPasswordForm()

    return render(request, 'reset_password.html', {'form': form})

logger = logging.getLogger(__name__)
@login_required
def profile_view(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profile = UserProfile(user=request.user)

    if request.method == 'POST':
        try:
            with transaction.atomic():
                user = request.user
                name = request.POST.get('name', '').strip()
                username = request.POST.get('username', '').strip()
                email = request.POST.get('email', '').strip()
   # Username is NOT editable, so no update for user.username
                # if username and username != user.username:
                #     user.username = username
                if email and email != user.email:
                    user.email = email
                user.save()

                profile.name = name or profile.name
                profile.contact_number = request.POST.get('contact_number', '').strip() or profile.contact_number
                profile.bio = request.POST.get('bio', '').strip() or profile.bio
                profile.location = request.POST.get('location', '').strip() or profile.location
                profile.occupation = request.POST.get('occupation', '').strip() or profile.occupation

                if 'profile_photo' in request.FILES:
                    profile.profile_photo = request.FILES['profile_photo']

                profile.save()

            messages.success(request, "Profile updated successfully.")
            return redirect('profile')
        except Exception as e:
            logger.exception("Error while updating profile")
            messages.error(request, "Could not update profile. Please try again.")

    return render(request, 'profile.html', {'user': request.user, 'profile': profile})

from django.http import JsonResponse
import asyncio
from .bot import send_message_to_channel

@csrf_exempt
def send_message(request):
    if request.method == "POST":
        msg = request.POST.get("message")
        try:
            # Ensure an event loop exists in this thread
            try:
                loop = asyncio.get_running_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)

            loop.create_task(send_message_to_channel(msg))

            return JsonResponse({"status": "success"})
        except Exception as e:
            logger.exception("Error while send message to Discord")
            return JsonResponse({"status": "error", "message": str(e)})
    return JsonResponse({"status": "error", "message": "Invalid request"})



from django.http import JsonResponse

MURF_API_KEY= os.getenv("MURF_API_KEY_P")
MURF_API_URL= 'https://api.murf.ai/v1/speech/stream'  # Check Murf docs for updates

def get_pronunciation_audio(request, word):
    try:
        clean_word = word.strip() if word else ""
        if not clean_word:
            return JsonResponse({"error": "No word provided"}, status=400)

        payload = {
            "text": clean_word,
            "voiceId": "en-US-natalie",  # Confirm this voiceId from Murf
            "format": "mp3"
        }
        headers = {
            "api-key": MURF_API_KEY,
            "Content-Type": "application/json"
        }
        response = requests.post(MURF_API_URL, json=payload, headers=headers)
        response.raise_for_status()  # Raise if 4xx or 5xx response

        json_data = response.json()
        audio_url = json_data.get("audio_url", "")
        if not audio_url:
            return JsonResponse({"error": "No audio URL received from Murf"}, status=500)

        return JsonResponse({"audio_url": audio_url})

    except requests.exceptions.HTTPError as http_err:
        # Log or return API error message
        err_msg = f"HTTP error from Murf API: {response.text}"
        print(err_msg)
        return JsonResponse({"error": err_msg}, status=500)
    except Exception as e:
        logger.exception("Error while pronouncing these word")
        print(f"Error in get_pronunciation_audio: {str(e)}")
        return JsonResponse({"error": "Internal Server Error"}, status=500)
    
