import pdfplumber
import re
from decimal import Decimal
import decimal


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
        # Convert to Decimal first for proper rounding
        amount = Decimal(cleaned)
        # If it's very close to zero (like -0.0), return 0
        if abs(amount) < Decimal("0.01"):
            return 0.0
        # Round to 2 decimal places and convert to float
        return float(round(amount, 2))
    except (ValueError, decimal.InvalidOperation):
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
        # Keep the original line content for transfers
        details = middle.replace("Transfer", "").strip()

        # If we have a next line that's a transfer continuation
        if next_line:
            next_line_content = re.sub(
                r"-?\s*R?\d[\d,\s]*\.\d{2}$", "", next_line
            ).strip()
            # Only append if it adds meaningful information
            if next_line_content and not next_line_content.lower() in [
                "transfere",
                "transfe",
                "transfer",
                "invesr",
            ]:
                if details:
                    details = f"{details} {next_line_content}"
                else:
                    details = next_line_content

            # If we still don't have meaningful details, try to extract from the amount
            if not details or details.isdigit():
                # For transfers, negative amount means "to", positive means "from"
                direction = "to" if amount < 0 else "from"
                details = f"Transfer {direction} account"

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
    elif "Declined" in middle:
        tx_type = "Declined"
        details = middle.replace("Declined", "").strip()
    else:
        # For other transactions, try to split on first space
        parts = middle.split(" ", 1)
        tx_type = parts[0]
        details = parts[1] if len(parts) > 1 else ""

    # Clean up details
    details = re.sub(r"\s+", " ", details).strip()
    if not details:
        details = tx_type  # Use transaction type if no details available

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
                    # Only skip next line if it was clearly part of this transaction
                    # (contains transfer-related words but no date)
                    if next_line and not re.match(
                        r"\d{1,2}\s+[A-Za-z]{3}\s+20\d{2}", next_line
                    ):
                        if any(
                            word.lower() in next_line.lower()
                            for word in ["Transfere", "Transfe", "Transfer", "Invesr"]
                        ):
                            i += 1
                i += 1

    return transactions
