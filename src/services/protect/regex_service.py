import difflib
import re
from typing import List


def find_fixed_positions(strings):
    if not strings:
        return []

    reference = strings[0]
    fixed_chars = list(reference)

    for s in strings[1:]:
        new_fixed = []
        matcher = difflib.SequenceMatcher(None, reference, s)

        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            if tag == 'equal':
                new_fixed.extend(fixed_chars[i1:i2])
            else:
                new_fixed.extend([None] * (i2 - i1))

        fixed_chars = new_fixed

    return fixed_chars


def generate_regex_by_payloads(payloads):
    if not payloads:
        return ""

    if len(payloads) == 1:
        return re.escape(payloads[0])

    fixed_pattern = find_fixed_positions(payloads)

    regex_parts = []
    current_variable = False

    for i, char in enumerate(fixed_pattern):
        if char is None:
            if not current_variable:
                current_variable = True
                regex_parts.append("[\\s\\S]*?")
        else:
            current_variable = False
            regex_parts.append(re.escape(char))

    regex = ''.join(regex_parts)

    regex = re.sub(r'(\[\\\s\\\S\]\*\?){2,}', r'[\\s\\S]*?', regex)

    return {'regex': regex}

#
# def generate_fallback_regex(payloads: List[str]) -> str:
#     def find_longest_common_substring(s1, s2):
#         matcher = difflib.SequenceMatcher(None, s1, s2)
#         match = matcher.find_longest_match(0, len(s1), 0, len(s2))
#         if match.size > 0:
#             return s1[match.a:match.a + match.size]
#         return ""
#
#     if len(payloads) < 2:
#         return re.escape(payloads[0]) if payloads else ""
#
#     common = payloads[0]
#     for p in payloads[1:]:
#         common = find_longest_common_substring(common, p)
#         if not common:
#             break
#
#     if common and len(common) > 1:
#         return f".*{re.escape(common)}.*"
#
#     common_chars = set(payloads[0])
#     for p in payloads[1:]:
#         common_chars &= set(p)
#
#     special_chars = set('{}[]()<>$#@!%^&*+-*/\\|;:\'"`~')
#     common_special = common_chars & special_chars
#
#     if common_special:
#         char_pattern = ''.join(re.escape(c) for c in common_special)  
#         return f".*[{char_pattern}].*"
#
#     return ".*" + ".*".join(re.escape(c) for c in common_chars if c.strip()) + ".*" if common_chars else ".*"


def validate_requests(request_content, regex):
    match = re.search(regex, request_content)
    return match is None


def filter_requests(request_content, regex):
    matches = re.findall(regex, request_content)
    if matches and isinstance(matches[0], tuple):
        matches = [match[0] for match in matches]
    return [match.strip() for match in matches if match and match.strip()]
