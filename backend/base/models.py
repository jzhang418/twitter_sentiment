from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    twitter_id = models.CharField(max_length=50, null=False, blank=False)
