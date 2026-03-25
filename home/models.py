from django.db import models
from django.contrib.auth.models import User  # import Django’s default User model

class Contact (models.Model):
    sno = models.IntegerField(default=0)
    name = models.CharField(max_length=50)
    email = models.EmailField( max_length=60)
    phone =models.CharField(max_length=10)
    desc = models.TextField()
    date=models.DateField(auto_now_add=True)
    
    def __str__(self):
        return (" Name: "+self.name)


class UserProfile(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', primary_key=True)
    
     # NEW: display name stored on profile only (NOT on auth_user)
    name = models.CharField(max_length=150, blank=True, null=True)

    # Profile fields
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    occupation = models.CharField(max_length=100, blank=True, null=True)

    # Optional tracking fields
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

