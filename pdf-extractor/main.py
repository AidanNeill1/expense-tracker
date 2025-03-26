from fastapi import FastAPI, UploadFile, File, HTTPException
from extractors.parse_pdf import extract_table_from_pdf
import tempfile
import shutil

app = FastAPI()


@app.post("/extract")
def extract(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(file.file, tmp)
        path = tmp.name

    transactions = extract_table_from_pdf(path)

    if not transactions:
        raise HTTPException(status_code=422, detail="Could not extract data from PDF")

    return {"transactions": transactions}
