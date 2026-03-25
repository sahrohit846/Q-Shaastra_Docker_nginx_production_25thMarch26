from django import template
import re

register = template.Library()

CRITICAL_KEYWORDS = [
    'Quantum computing',
    'Entanglement',
    'hilbert space',
    'Quantum Sensing',
    'Don Riddell',
    'New Horizons space',
    'Kelli Weston Ari Aster’s farcical western'
]

def highlight_keywords(text):
    def repl(match):
        word = match.group(0)
        return f'<span class="keyword" data-word="{word.lower()}">{word} <span class="icon">🔊</span></span>'
    sorted_keywords = sorted(CRITICAL_KEYWORDS, key=len, reverse=True)
    pattern = r'\b(' + '|'.join(map(re.escape, sorted_keywords)) + r')\b'
    return re.sub(pattern, repl, text, flags=re.IGNORECASE)

@register.filter(name="auto_highlight")
def auto_highlight(text):
    if not text:
        return ""   # ✅ FIX: safely handle None

    pattern = r"(" + "|".join(re.escape(k) for k in CRITICAL_KEYWORDS) + r")"
    return re.sub(
        pattern,
        r"<span class='highlight'>\1</span>",
        text,
        flags=re.IGNORECASE,
    )
