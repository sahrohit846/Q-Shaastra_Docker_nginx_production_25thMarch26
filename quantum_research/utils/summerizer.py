
# import re
# import traceback
# from django.views.decorators.cache import never_cache
# from django.utils.decorators import method_decorator
# import torch  # type: ignore
# import os
# import logging
# from quantum_research.mongo_models import ResearchArticle
# from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer # type: ignore
# from newspaper import Article  # type: ignore
# from mongoengine.errors import DoesNotExist # type: ignore
# from dotenv import load_dotenv # type: ignore




# # Load .env file
# load_dotenv()
# logger = logging.getLogger(__name__)

# # lazy loading for model 
# tokenizer = None
# model = None
# device = None


# def load_model():
#     global tokenizer, model, device

#     if model is None:
#         print("[SUMMARIZER] Loading model...")


#         model_name = "google/pegasus-xsum"

#         tokenizer = AutoTokenizer.from_pretrained(model_name)
#         model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

#         device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
#         model.to(device)
#         model.eval()

#         print("[SUMMARIZER] Model loaded successfully.")
#         print(f"[INFO] Using device: {device}")

# # NewsAPI Key 
# NEWS_API_KEY=os.getenv("QUANTUM_NEWS_API_KEY")


# # Load tokenizer and model
# model_name = "google/pegasus-xsum"
# # tokenizer = PegasusTokenizer.from_pretrained(model_name)
# # model = PegasusForConditionalGeneration.from_pretrained(model_name)
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# # Force CPU usage (fix CUDA mismatch & errors)
# device = torch.device("cpu")
# model = model.to(device)
# model.eval()

# print("[SUMMARIZER] Model loaded successfully.")
# print(f"[INFO] Using device: {device}")



# def clean_article_text(text):
#     text = re.sub(r'<[^>]+>', '', text)       # Remove HTML tags
#     text = re.sub(r'\s+', ' ', text)          # Normalize whitespace
#     return text.strip()

# # Generate  generate_summary 

# def generate_summary(article_text):
#     load_model()
#     if not article_text or len(article_text.strip()) < 30:
#         print("[WARN] Skipping summarization: insufficient content.")
#         return "[Summary unavailable: content too short]"

#     article_text = clean_article_text(article_text)

#     print(f"[INFO] Article Length (chars): {len(article_text)}")
#     print(f"[INFO] Article Preview: {article_text[:200]}")

#     # ---- Decide a safe max source length based on model + tokenizer ----
#     model_max_pos = getattr(model.config, "max_position_embeddings", 1024)
#     tokenizer_max_len = getattr(tokenizer, "model_max_length", 1024)

#     # Final safe limit (you can cap it if you want, but not above model_max_pos)
#     max_input_len = min(model_max_pos, tokenizer_max_len, 1024)

#     print(f"[INFO] Using max_input_len={max_input_len}")

#     try:
#         inputs = tokenizer(
#             article_text,                 # Pegasus doesn't need "summarize:" prefix
#             return_tensors="pt",
#             max_length=max_input_len,
#             truncation=True
#         )

#         print("[DEBUG] input_ids shape:", inputs["input_ids"].shape)

#         input_ids = inputs["input_ids"].to(device)
#         attention_mask = inputs["attention_mask"].to(device)

#         summary_ids = model.generate(
#             input_ids=input_ids,
#             attention_mask=attention_mask,
#             max_length=150,
#             min_length=60,
#             length_penalty=2.0,
#             num_beams=4,
#             early_stopping=True
#         )

#         summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
#         print("[INFO] Summary generated successfully.")
#         return summary

#     except Exception as e:
#         print(f"[ERROR] Summarization failed: {e}")
#         traceback.print_exc()

#         # ---------- Fallback: re-summarize with even shorter input ----------
#         print("[INFO] Retrying with shortened version of the article...")

#         try:
#             # Take a smaller chunk in characters, then still truncate by tokens
#             short_text = article_text[:1000]

#             fallback_max_input_len = max_input_len // 2  # even safer
#             print(f"[INFO] Fallback max_input_len={fallback_max_input_len}")

#             inputs = tokenizer(
#                 short_text,
#                 return_tensors="pt",
#                 max_length=fallback_max_input_len,
#                 truncation=True
#             )

#             print("[DEBUG] fallback input_ids shape:", inputs["input_ids"].shape)

#             input_ids = inputs["input_ids"].to(device)
#             attention_mask = inputs["attention_mask"].to(device)

#             summary_ids = model.generate(
#                 input_ids=input_ids,
#                 attention_mask=attention_mask,
#                 max_length=100,
#                 min_length=25,
#                 length_penalty=2.0,
#                 num_beams=4,
#                 early_stopping=True
#             )

#             summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
#             print("[INFO] Fallback summary generated.")
#             return summary

#         except Exception as e2:
#             print(f"[ERROR] Fallback also failed: {e2}")
#             traceback.print_exc()
#             return "[Summary unavailable due to error]"




# Load environment variables
# load_dotenv()

# logger = logging.getLogger(__name__)

# # Global lazy-load variables
# tokenizer = None
# model = None
# device = None


# def load_model():
#     """
#     Lazy load the Pegasus summarization model.
#     Loads only once when first needed.
#     """

#     global tokenizer, model, device

#     if model is None:
#         print("[SUMMARIZER] Loading Pegasus model...")

#         model_name = "google/pegasus-xsum"

#         tokenizer = AutoTokenizer.from_pretrained(model_name)
#         model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

#         # Automatically select CUDA if available
#         device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

#         model.to(device)
#         model.eval()

#         print(f"[SUMMARIZER] Model loaded successfully.")
#         print(f"[INFO] Using device: {device}")


# def clean_article_text(text):
#     """
#     Clean HTML and normalize whitespace.
#     """
#     text = re.sub(r'<[^>]+>', '', text)
#     text = re.sub(r'\s+', ' ', text)
#     return text.strip()


# def generate_summary(article_text):
#     """
#     Generate AI summary using Pegasus model.
#     """

#     load_model()

#     if not article_text or len(article_text.strip()) < 30:
#         logger.warning("Skipping summarization: insufficient content.")
#         return "[Summary unavailable: content too short]"

#     article_text = clean_article_text(article_text)

#     logger.info(f"Article length: {len(article_text)} chars")

#     try:

#         model_max_pos = getattr(model.config, "max_position_embeddings", 1024)
#         tokenizer_max_len = getattr(tokenizer, "model_max_length", 1024)

#         max_input_len = min(model_max_pos, tokenizer_max_len, 1024)

#         inputs = tokenizer(
#             article_text,
#             return_tensors="pt",
#             max_length=max_input_len,
#             truncation=True
#         )

#         input_ids = inputs["input_ids"].to(device)
#         attention_mask = inputs["attention_mask"].to(device)

#         summary_ids = model.generate(
#             input_ids=input_ids,
#             attention_mask=attention_mask,
#             max_length=150,
#             min_length=60,
#             num_beams=4,
#             length_penalty=2.0,
#             early_stopping=True
#         )

#         summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

#         logger.info("Summary generated successfully.")

#         return summary

#     except Exception as e:

#         logger.error(f"Summarization failed: {e}")
#         traceback.print_exc()

#         # fallback summarization
#         try:

#             logger.info("Retrying with shortened text...")

#             short_text = article_text[:1000]

#             inputs = tokenizer(
#                 short_text,
#                 return_tensors="pt",
#                 max_length=512,
#                 truncation=True
#             )

#             input_ids = inputs["input_ids"].to(device)
#             attention_mask = inputs["attention_mask"].to(device)

#             summary_ids = model.generate(
#                 input_ids=input_ids,
#                 attention_mask=attention_mask,
#                 max_length=100,
#                 min_length=25,
#                 num_beams=4,
#                 early_stopping=True
#             )

#             summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

#             logger.info("Fallback summary generated.")

#             return summary

#         except Exception as e2:

#             logger.error(f"Fallback also failed: {e2}")
#             traceback.print_exc()

#             return "[Summary unavailable due to error]"








import re
import traceback
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
import torch  # type: ignore
import os
import logging
from quantum_research.mongo_models import ResearchArticle
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer # type: ignore
from newspaper import Article  # type: ignore
from mongoengine.errors import DoesNotExist # type: ignore
from dotenv import load_dotenv # type: ignore


# Load .env file
load_dotenv()
logger = logging.getLogger(__name__)

# lazy loading for model
tokenizer = None
model = None
device = None


def load_model():
    global tokenizer, model, device

    if model is None:
        print("[SUMMARIZER] Loading model...")

        model_name = "google/pegasus-xsum"

        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model.to(device)
        model.eval()

        print("[SUMMARIZER] Model loaded successfully.")
        print(f"[INFO] Using device: {device}")


# NewsAPI Key
NEWS_API_KEY = os.getenv("QUANTUM_NEWS_API_KEY")


def clean_article_text(text):
    text = re.sub(r'<[^>]+>', '', text)       # Remove HTML tags
    text = re.sub(r'\s+', ' ', text)          # Normalize whitespace
    return text.strip()


def generate_summary(article_text):
    load_model()
    if not article_text or len(article_text.strip()) < 30:
        print("[WARN] Skipping summarization: insufficient content.")
        return "[Summary unavailable: content too short]"

    article_text = clean_article_text(article_text)

    print(f"[INFO] Article Length (chars): {len(article_text)}")
    print(f"[INFO] Article Preview: {article_text[:200]}")

    model_max_pos = getattr(model.config, "max_position_embeddings", 1024)
    tokenizer_max_len = getattr(tokenizer, "model_max_length", 1024)
    max_input_len = min(model_max_pos, tokenizer_max_len, 1024)

    print(f"[INFO] Using max_input_len={max_input_len}")

    try:
        inputs = tokenizer(
            article_text,
            return_tensors="pt",
            max_length=max_input_len,
            truncation=True
        )

        print("[DEBUG] input_ids shape:", inputs["input_ids"].shape)

        input_ids = inputs["input_ids"].to(device)
        attention_mask = inputs["attention_mask"].to(device)

        summary_ids = model.generate(
            input_ids=input_ids,
            attention_mask=attention_mask,
            max_length=150,
            min_length=60,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True
        )

        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        print("[INFO] Summary generated successfully.")
        return summary

    except Exception as e:
        print(f"[ERROR] Summarization failed: {e}")
        traceback.print_exc()

        print("[INFO] Retrying with shortened version of the article...")

        try:
            short_text = article_text[:1000]
            fallback_max_input_len = max_input_len // 2

            print(f"[INFO] Fallback max_input_len={fallback_max_input_len}")

            inputs = tokenizer(
                short_text,
                return_tensors="pt",
                max_length=fallback_max_input_len,
                truncation=True
            )

            print("[DEBUG] fallback input_ids shape:", inputs["input_ids"].shape)

            input_ids = inputs["input_ids"].to(device)
            attention_mask = inputs["attention_mask"].to(device)

            summary_ids = model.generate(
                input_ids=input_ids,
                attention_mask=attention_mask,
                max_length=100,
                min_length=25,
                length_penalty=2.0,
                num_beams=4,
                early_stopping=True
            )

            summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            print("[INFO] Fallback summary generated.")
            return summary

        except Exception as e2:
            print(f"[ERROR] Fallback also failed: {e2}")
            traceback.print_exc()
            return "[Summary unavailable due to error]"