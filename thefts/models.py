# -*- coding: utf-8 -*-
""" Models for the thefts application.
"""

# models
from base.models import BaseModel
from users.models import User

# django
from django.contrib.gis.db import models


class Report(BaseModel):
    """ The Report class holds all the information about a theft.
    """
    LOCK_TYPES = ((0, "Ninguno"), (1, "U-Lock"), (2, "Cadena"),
                  (3, "Cable"), (4, "Otro"))

    user = models.ForeignKey(
        User,
        related_name="thefts",
        help_text=("Bike owner")
    )
    location = models.PointField(
        null=False,
        help_text=("Theft's location coordinates")
    )

    lock_type = models.PositiveIntegerField(
        default=0, choices=LOCK_TYPES,
        help_text=("Lock type used when bike stolen")
    )
    date = models.DateTimeField(
        null=False, blank=False,
        help_text=("Theft date")
    )
    unseen_time = models.PositiveIntegerField(
        default=0,
        help_text=("Time in minutes when bike was unseen, \
                   before notice the theft.")
    )
    bike_price = models.PositiveIntegerField(
        default=0,
        help_text=("Bike estimated price. Not shown on theft details. \
                   Collected for statistical purposes.")
    )
    circumstances = models.TextField(
        help_text=("Additional information about theft circumstances")
    )
    bike_specs = models.TextField(
        help_text=("Bike specifications to facilitate the recovering")
    )
    with_violence = models.BooleanField(
        default=False,
        help_text=("True if violence whas used to stole the bike")
    )
    police_report_filled = models.BooleanField(
        default=False,
        help_text=("True if police report was filled")
    )
    found = models.BooleanField(
        default=False,
        help_text=("True if bike was found")
    )
    found_details = models.TextField(
        help_text=("Details about how the bike was recovered.")
    )
