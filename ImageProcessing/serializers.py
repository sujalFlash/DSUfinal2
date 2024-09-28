from rest_framework import serializers

class ImageUploadSerializer(serializers.Serializer):
    image = serializers.FileField()
    normalization = serializers.FloatField(required=False, default=1.0)
    resize_width = serializers.IntegerField(required=False, default=256)
    resize_height = serializers.IntegerField(required=False, default=256)
