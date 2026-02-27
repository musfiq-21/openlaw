# ConstitutionBD - সম্পূর্ণ সেটআপ গাইড

## 🚀 দ্রুত শুরু করুন

### পদক্ষেপ 1: প্রয়োজনীয় প্রোগ্রাম ইনস্টল করুন
- Python 3.8+
- Google Gemini API key (বিনামূল্যে পাওয়া যায়)

### পদক্ষেপ 2: ব্যাকএন্ড সেটআপ করুন

```bash
cd backend

# ঝাড়াইয়ে দিন (যদি আছে)
rmdir /s /q venv

# নতুন ভার্চুয়াল পরিবেশ তৈরি করুন
python -m venv venv

# পরিবেশ সক্রিয় করুন (Windows)
venv\Scripts\activate

# Linux/macOS-এ:
# source venv/bin/activate

# প্যাকেজ ইনস্টল করুন
pip install -r requirements.txt

# .env ফাইল তৈরি করুন
copy .env.example .env

# .env ফাইল সম্পাদনা করুন এবং আপনার API key যোগ করুন
notepad .env
```

**.env ফাইলের বিষয়বস্তু:**
```
GOOGLE_API_KEY=your-actual-api-key-here
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
MODEL_NAME=gemini-2.0-flash
TEMPERATURE=0.7
```

### পদক্ষেপ 3: সংবিধান ইনজেস্ট করুন

```bash
# অভিজ্ঞতার আগে চেক করুন যে ব্যাকএন্ড চলছে

# নতুন টার্মিনালে
python backend/ingest_chroma.py
```

### পদক্ষেপ 4: ব্যাকএন্ড শুরু করুন

```bash
python main.py
```

আপনি এটি দেখবেন:
```
🚀 Starting ConstitutionBD Backend Server...
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### পদক্ষেপ 5: ফ্রন্টএন্ড শুরু করুন

```bash
# নতুন টার্মিনালে
cd frontend
python serve.py
```

আপনি এটি দেখবেন:
```
🏛️  ConstitutionBD Frontend Server
Frontend:  http://localhost:3000
Backend:   http://localhost:8000
```

### পদক্ষেপ 6: ওয়েব ব্রাউজারে খুলুন

এখন ব্রাউজারে যান:
```
http://localhost:3000
```

## ✅ সবকিছু কাজ করছে কি না তা পরীক্ষা করুন

```bash
# স্বাস্থ্য পরীক্ষা
curl http://localhost:8000/health

# API ডকুমেন্টেশন
http://localhost:8000/docs
```

## 🎯 প্রথম প্রশ্ন করুন

ব্রাউজারে এখন আপনি:
1. "নাগরিকের মৌলিক অধিকার কি?" - প্রশ্ন করতে পারেন
2. "সংবিধান সংশোধনের প্রক্রিয়া" - খুঁজতে পারেন
3. ইতিহাস দেখতে পারেন

## 🔧 সমস্যা সমাধান

### `ModuleNotFoundError: No module named 'google'`
```bash
pip install google-generativeai
```

### `Connection refused` ত্রুটি
- ব্যাকএন্ড চলছে কি না চেক করুন: `python main.py`
- পোর্ট 8000 ব্যবহৃত হচ্ছে কিনা চেক করুন

### `CORS` ত্রুটি
- ব্যাকএন্ড CORS সাপোর্ট করে
- নিশ্চিত করুন ব্যাকএন্ড এবং ফ্রন্টএন্ড একই মেশিনে চলছে

### ফ্রন্টএন্ড খালি দেখাচ্ছে
- ব্রাউজার কনসোল খুলুন (F12)
- নেটওয়ার্ক ট্যাব চেক করুন
- `/health` কল সফল হচ্ছে কিনা দেখুন

## 📁 ফাইল স্ট্রাকচার

```
openlaw/
├── main.py                      # এন্ট্রি পয়েন্ট
├── backend/
│   ├── app.py                   # FastAPI অ্যাপ্লিকেশন
│   ├── rag_engine_enhanced.py   # RAG ইঞ্জিন
│   ├── ingest_chroma.py         # ডেটা ইঞ্জেশন
│   ├── requirements.txt         # Python প্যাকেজ
│   ├── config.py                # কনফিগারেশন
│   └── .env                     # API কী (তৈরি করুন)
├── frontend/
│   ├── index.html               # মূল পেজ
│   ├── app.js                   # মূল অ্যাপ্লিকেশন
│   ├── serve.py                 # সার্ভার
│   ├── features.html            # আসন্ন বৈশিষ্ট্য
│   └── README.md                # ফ্রন্টএন্ড গাইড
├── data/
│   └── constitution             # সংবিধান ফাইল
└── chroma_db/                   # ভেক্টর ডেটাবেস

```

## 🌐 উৎপাদনের জন্য স্থাপন

### Heroku-তে স্থাপন করুন

```bash
# Procfile তৈরি করুন
echo "web: python main.py" > Procfile

# Git commit করুন
git add .
git commit -m "Ready for deployment"

# Heroku-তে পুশ করুন
heroku create your-app-name
git push heroku main
```

### আপনার সার্ভারে স্থাপন করুন

```bash
# 1. বিল্ড করুন
pip install -r backend/requirements.txt

# 2. স্থিতিশীল সার্ভার ব্যবহার করুন (gunicorn)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 backend.app:app

# 3. বা nginx দিয়ে রিভার্স প্রক্সি করুন
# (nginx কনফিগ উদাহরণ নীচে)
```

## 📊 কর্মক্ষমতা

**সার্ভার প্রয়োজনীয়তা:**
- CPU: 1 কোর
- RAM: 512 MB (ন্যূনতম), 2 GB (সুপারিশকৃত)
- ডিস্ক: 500 MB+ (ChromaDB এর জন্য)

**প্রতিক্রিয়া সময়:**
- সার্চ: < 500ms
- উত্তর (Gemini): 2-5 সেকেন্ড

## 📚 আরও পড়ুন

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [RAG ইঞ্জিন ডকুমেন্টেশন](backend/RAG_ENGINE.md)

## 💡 পরবর্তী পদক্ষেপ

- [ ] সহজ ভাষা মডিউল যোগ করুন
- [ ] বহুভাষিক সমর্থন যোগ করুন
- [ ] মোবাইল অ্যাপ তৈরি করুন
- [ ] উৎপাদনে স্থাপন করুন

## 📞 সাহায্য প্রয়োজন?

যদি কোনো সমস্যা হয়:
1. GitHub Issues চেক করুন
2. Discord চ্যানেলে যোগ দিন
3. আমাদের ডকুমেন্টেশন পড়ুন

---

**🎉 সবকিছু প্রস্তুত! এখন প্রশ্ন করুন এবং উত্তর পান!**
