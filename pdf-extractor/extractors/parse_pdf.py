import pdfplumber
import re
from decimal import Decimal


def clean_amount(amount_str):
    """Clean and convert amount string to float."""
    # Remove 'R' and any spaces
    cleaned = amount_str.replace("R", "").replace(" ", "")
    # Handle negative amounts
    if cleaned.startswith("-"):
        cleaned = "-" + cleaned[1:]
    # Remove any commas in numbers
    cleaned = cleaned.replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def parse_transaction_line(line, next_line=None):
    """Parse a single transaction line."""
    # First try to match the date and amount (these are most reliable)
    date_amount_match = re.match(
        r"(?P<date>\d{1,2}\s+[A-Za-z]{3}\s+20\d{2})\s+"  # Date
        r"(?P<middle>.*?)\s*"  # Everything in between
        r"(?P<amount>-?\s*R?\d[\d,\s]*\.\d{2})$",  # Amount at end
        line,
    )

    # If no amount in this line, check if it's a multi-line transfer
    if not date_amount_match and next_line:
        amount_match = re.search(r"(-?\s*R?\d[\d,\s]*\.\d{2})$", next_line)
        if amount_match:
            date_match = re.match(
                r"(?P<date>\d{1,2}\s+[A-Za-z]{3}\s+20\d{2})\s+" r"(?P<middle>.*?)$",
                line,
            )
            if date_match:
                date = date_match.group("date")
                middle = date_match.group("middle")
                # For multi-line transfers, we want to keep both lines
                next_line_content = next_line[: amount_match.start()].strip()
                amount = clean_amount(amount_match.group(1))
                date_amount_match = True  # Signal that we have a valid transaction
            else:
                return None
        else:
            return None
    elif date_amount_match:
        date = date_amount_match.group("date")
        middle = date_amount_match.group("middle")
        amount = clean_amount(date_amount_match.group("amount"))
    else:
        return None

    # Try to parse the middle section
    card_no = ""
    tx_type = ""
    details = ""

    # Check for card transactions
    if "***" in middle:
        card_match = re.match(r"(\*{3}\d+)\s+(.*)", middle)
        if card_match:
            card_no = card_match.group(1)
            middle = card_match.group(2)

    # Handle special transaction types
    if "Transfer" in middle:
        tx_type = "Transfer"
        # Extract transfer details from the first line
        transfer_patterns = [
            r"(Inter account transfer (?:to|from) account.*?)(?=\s*$)",
            r"(Discovery Bank account.*?)(?=\s*$)",
            r"(Transfer to.*?)(?=\s*$)",
        ]

        # Try to find transfer details in the first line
        transfer_details = None
        for pattern in transfer_patterns:
            match = re.search(pattern, middle)
            if match:
                transfer_details = match.group(1)
                break

        # Handle the details based on whether we have a next line
        if transfer_details:
            details = transfer_details
            # If we have a next line, append its content (except amount)
            if next_line:
                next_line_content = re.sub(
                    r"-?\s*R?\d[\d,\s]*\.\d{2}$", "", next_line
                ).strip()
                if next_line_content:
                    details = f"{details}\n{next_line_content}"
        else:
            # No pattern match found, use the middle content
            details = middle.replace("Transfer", "").strip()
            # If we have a next line, append its content (except amount)
            if next_line:
                next_line_content = re.sub(
                    r"-?\s*R?\d[\d,\s]*\.\d{2}$", "", next_line
                ).strip()
                if next_line_content:
                    details = f"{details}\n{next_line_content}"

    elif "EFT" in middle:
        tx_type = "EFT"
        details = middle.replace("EFT", "").strip()
    elif "Fee" in middle:
        tx_type = "Fee"
        details = middle.replace("Fee", "").strip()
    elif "Interest" in middle:
        tx_type = "Interest"
        details = middle.replace("Interest", "").strip()
    elif "Reward" in middle:
        tx_type = "Reward"
        details = middle.replace("Reward", "").strip()
    elif "Debit order" in middle:
        tx_type = "Debit order"
        details = middle.replace("Debit order", "").strip()
    else:
        # For other transactions, try to split on first space
        parts = middle.split(" ", 1)
        tx_type = parts[0]
        details = parts[1] if len(parts) > 1 else ""

    return {
        "date": date,
        "card_number": card_no.strip(),
        "type": tx_type.strip(),
        "details": details.strip(),
        "amount": amount,
    }


def extract_table_from_pdf(path):
    transactions = []

    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue

            lines = text.split("\n")
            i = 0
            while i < len(lines):
                line = lines[i]
                next_line = lines[i + 1] if i + 1 < len(lines) else None

                # Skip non-transaction lines
                if not re.match(r"\d{1,2}\s+[A-Za-z]{3}\s+20\d{2}", line):
                    i += 1
                    continue

                # Skip balance lines
                if "balance" in line.lower():
                    i += 1
                    continue

                transaction = parse_transaction_line(line, next_line)
                if transaction:
                    transactions.append(transaction)
                    # Skip the next line if it was part of this transaction
                    if next_line and any(
                        word in next_line for word in ["Transfere", "Transfe", "Invesr"]
                    ):
                        i += 1
                i += 1

    return transactions
