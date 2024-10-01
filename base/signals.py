#send, save -> signal for receiver
#-> signal fireoff before it's saved
from django.db.models.signals import pre_save
from django.contrib.auth.models import User

def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != "":
        user.username = user.email#override the username to email
        




pre_save.connect(updateUser, sender=User)

#need to connect to signal in apps.py