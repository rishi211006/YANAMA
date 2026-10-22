from fastapi import APIRouter, Response
from app.services.csv_processing.templates import get_csv_template

router = APIRouter(prefix="/templates", tags=["CSV Templates"])

@router.get("/{template_type}")
def download_template(template_type: str):
    csv_str = get_csv_template(template_type)
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=yanama_{template_type}_template.csv"}
    )
