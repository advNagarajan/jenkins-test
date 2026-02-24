from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Jenkins CI/CD test successful 🚀"}