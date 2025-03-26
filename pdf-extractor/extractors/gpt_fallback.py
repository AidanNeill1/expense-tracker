from dotenv import load_dotenv
import openai
import os


load_dotenv()  # 🔥 loads .env into environment
openai.api_key = os.getenv("OPENAI_API_KEY")


def extract_using_gpt(text):
    prompt = f"""
    Extract a list of transactions from the following bank statement text:
    Format as JSON array: [{{"date": "YYYY-MM-DD", "description": "...", "amount": 0.00}}]

    ---
{text}
---
    """

    response = openai.ChatCompletion.create(
        model="gpt-4", messages=[{"role": "user", "content": prompt}], temperature=0.2
    )

    try:
        return eval(response.choices[0].message.content)
    except:
        return []
