import random

from src.repositories.payload_repository import get_all_payload

char_groups = {
    "operators": ["+", "-", "*", "/", "%", "×", "·", "**", "|"],
    "brackets": ["{}", "[]", "()", "<>", "%%", "[%]", "(( ))", "{% %}"],
    "quotes": ['"', "'", "`", "“”", "‘’"],
    "whitespace": [" ", "\t", "\n", "%20"],
    "delimiters": [";", ",", ".", ":"],
    "numbers": [str(i) for i in range(10)],
    "word": list("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
}


def tokenize_payload(payload):
    tokens = []
    i = 0

    multi_char_operators = [op for op in char_groups["operators"] if len(op) > 1]

    while i < len(payload):
        found_multi = False
        for op in multi_char_operators:
            if payload[i:].startswith(op):
                tokens.append(("operators", op))
                i += len(op)
                found_multi = True
                break

        if found_multi:
            continue

        char = payload[i]

        group_name = None
        for name, chars in char_groups.items():
            if any(char in c for c in chars):
                group_name = name
                break

        if char.isalpha():
            word_start = i
            while i < len(payload) and payload[i].isalpha():
                i += 1
            word = payload[word_start:i]
            tokens.append(("word", word))
            continue

        if group_name:
            tokens.append((group_name, char))
        else:
            tokens.append(("unknown", char))

        i += 1

    return tokens


# Tạo các biến thể cho payload
def generate_payloads_child(payload, limit=None):
    # Parse payload thành tokens
    tokens = tokenize_payload(payload)
    variants = {payload}  # Bắt đầu với payload gốc

    # Nhóm các tokens theo loại để tạo biến thể
    word_groups = []

    # Đánh dấu các nhóm từ và các nhóm token khác
    current_index = 0
    while current_index < len(tokens):
        token_type, token_value = tokens[current_index]

        if token_type == "word":
            # Đây là một từ hoàn chỉnh
            word_groups.append(("word", current_index, token_value))
        else:
            # Đây là token khác
            word_groups.append((token_type, current_index, token_value))

        current_index += 1

    for group_type, start_idx, group_value in word_groups:
        for _ in range(2):
            new_tokens = tokens.copy()
            modified = False

            if group_type == "word":
                new_word = ""
                for char in group_value:
                    if random.random() < 0.7:
                        replacements = [c for c in char_groups["word"] if c != char]
                        if replacements:
                            new_word += random.choice(replacements)
                            modified = True
                        else:
                            new_word += char
                    else:
                        new_word += char

                if modified:
                    new_tokens[start_idx] = ("word", new_word)
            else:
                token_type, token_value = tokens[start_idx]
                replacements = [c for c in char_groups[token_type] if c != token_value]
                if replacements:
                    new_tokens[start_idx] = (token_type, random.choice(replacements))
                    modified = True

            if modified:
                new_payload = "".join(token[1] for token in new_tokens)
                if new_payload != payload:
                    variants.add(new_payload)

            if limit and len(variants) >= limit:
                return list(variants)[:limit]

    return list(variants)[:limit] if limit else list(variants)


def get_payloads_content():
    payload_models = get_all_payload()

    payloads = [payload.payload_content for payload in payload_models]

    return payloads
