from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MenuItem
from .serializers import MenuSerializer


@api_view(['GET'])
def get_menu(request):

    items = MenuItem.objects.filter(is_available=True)

    serializer = MenuSerializer(items, many=True, context={"request": request})

    return Response(serializer.data)