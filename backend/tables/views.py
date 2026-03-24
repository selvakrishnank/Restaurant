from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Table
from .serializers import TableSerializer


class TableListView(APIView):

    def get(self, request):

        zone = request.GET.get("zone")

        tables = Table.objects.all()

        if zone and zone != "all":
            tables = tables.filter(zone=zone)

        serializer = TableSerializer(tables, many=True)

        return Response(serializer.data)



class UpdateTableStatusView(APIView):

    def patch(self, request, table_id):

        table = Table.objects.get(id=table_id)

        if table.status == "available":
            table.status = "occupied"

        elif table.status == "occupied":
            table.status = "reserved"

        else:
            table.status = "available"

        table.save()

        return Response({"message": "status updated"})