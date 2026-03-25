
from django import forms

# for email
class EmailForm(forms.Form):
    email = forms.EmailField(label='Enter your email', max_length=100,widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email'}))

# for otp 
class OTPForm(forms.Form):
    otp = forms.CharField(label='Enter OTP', max_length=6, widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter the 6-digit OTP'}))


# for password
class SetPasswordForm(forms.Form):
    password = forms.CharField(label='Enter new password', widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter new password'}),
        min_length=8  # Password should have a minimum length for security
    )
    confirm_password = forms.CharField(label='Confirm new password', widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirm new password'}),
        min_length=8
    )
    
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        
        # Check if the two passwords match
        if password != confirm_password:
            raise forms.ValidationError('Passwords must match')
        return cleaned_data
        
        





















































# from django import forms

# # For email
# class EmailForm(forms.Form):
#     email = forms.EmailField(
#         label='Enter your email', 
#         max_length=100,
#         widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email'})
#     )

# # For OTP
# class OTPForm(forms.Form):
#     otp = forms.CharField(
#         label='Enter OTP', 
#         max_length=6,
#         widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter the 6-digit OTP'})
#     )

# # For setting a new password
# class SetPasswordForm(forms.Form):
#     password = forms.CharField(
#         label='Enter new password', 
#         widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter new password'}),
#         min_length=8  # Password should have a minimum length for security
#     )
#     confirm_password = forms.CharField(
#         label='Confirm new password', 
#         widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirm new password'}),
#         min_length=8
#     )
    
#     def clean(self):
#         cleaned_data = super().clean()
#         password = cleaned_data.get('password')
#         confirm_password = cleaned_data.get('confirm_password')

#         # Check if the two passwords match
#         if password != confirm_password:
#             raise forms.ValidationError('Passwords do not match. Please try again.')

#         return cleaned_data
