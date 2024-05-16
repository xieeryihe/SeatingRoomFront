# Generated by Django 4.1 on 2023-05-02 06:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Building",
            fields=[
                (
                    "building_id",
                    models.CharField(max_length=20, primary_key=True, serialize=False),
                ),
                ("building_desc", models.CharField(max_length=200, null=True)),
                ("config_url", models.FileField(null=True, upload_to="media/configs/")),
                ("latitude", models.DecimalField(decimal_places=6, max_digits=10)),
                ("longitude", models.DecimalField(decimal_places=6, max_digits=10)),
                ("is_open", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="Manager",
            fields=[
                (
                    "manager_id",
                    models.CharField(max_length=12, primary_key=True, serialize=False),
                ),
                ("manager_name", models.CharField(max_length=20)),
                ("password", models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name="Room",
            fields=[
                (
                    "room_id",
                    models.CharField(max_length=20, primary_key=True, serialize=False),
                ),
                ("room_desc", models.CharField(max_length=200, null=True)),
                ("config_url", models.FileField(null=True, upload_to="media/configs/")),
                ("is_open", models.BooleanField(default=False)),
                (
                    "capacity",
                    models.DecimalField(decimal_places=0, default=150, max_digits=4),
                ),
                ("overnight", models.BooleanField(default=False)),
                (
                    "building_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="main.building"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Setting",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "max_reserve_span",
                    models.DecimalField(decimal_places=2, default=4.0, max_digits=4),
                ),
                ("start_reserve_time", models.TimeField()),
                ("end_reserve_time", models.TimeField()),
            ],
        ),
        migrations.CreateModel(
            name="Student",
            fields=[
                (
                    "stu_id",
                    models.CharField(max_length=12, primary_key=True, serialize=False),
                ),
                ("stu_name", models.CharField(max_length=20)),
                ("password", models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name="Seat",
            fields=[
                (
                    "seat_id",
                    models.CharField(max_length=20, primary_key=True, serialize=False),
                ),
                ("x_position", models.DecimalField(decimal_places=6, max_digits=10)),
                ("y_position", models.DecimalField(decimal_places=6, max_digits=10)),
                ("is_open", models.BooleanField(default=False)),
                ("is_reserved", models.BooleanField(default=False)),
                ("is_with_plug", models.BooleanField(default=False)),
                (
                    "room_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="main.room"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Reservation",
            fields=[
                ("rsv_id", models.AutoField(primary_key=True, serialize=False)),
                ("rsv_state", models.CharField(max_length=20)),
                ("make_rsv_time", models.DateTimeField()),
                ("start_rsv_time", models.DateTimeField()),
                ("end_rsv_time", models.DateTimeField()),
                (
                    "seat_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="main.seat"
                    ),
                ),
                (
                    "stu_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="main.student"
                    ),
                ),
            ],
        ),
    ]
