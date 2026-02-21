# ConstitutionBD - RAG-powered Bangladesh Constitution Query System

🏛️ **ConstitutionBD** is an intelligent question-answering system for the Bangladesh Constitution using Retrieval-Augmented Generation (RAG) technology.

## 🚀 Features

- **🔍 Semantic Search**: Find relevant constitutional articles using natural language
- **🤖 AI-Powered Answers**: Get accurate answers with source citations
- **📚 Article-Aware Processing**: Smart chunking preserves legal context
- **✅ Citation Verification**: Automatically verifies referenced articles
- **🔗 Cross-Reference Detection**: Identifies related constitutional provisions
- **🌐 REST API**: Clean FastAPI backend for easy integration
- **💾 Vector Database**: Efficient ChromaDB storage for fast retrieval

## 📋 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   FastAPI Backend│    │   RAG Engine    │
│                 │◄──►│                 │◄──►│                 │
│  - User Queries │    │  - REST API     │    │  - Constitution │
│  - Results UI   │    │  - Validation   │    │    Processing   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                              ┌────────┴────────┐
                                              │                 │
                                        ┌─────▼─────┐   ┌─────▼─────┐
                                        │ ChromaDB  │   │ Gemini LLM│
                                        │Vector Store│   │   API     │
                                        └───────────┘   └───────────┘
```

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- Google Gemini API Key (free for educational use)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OpenLaw
   ```

2. **Install dependencies**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` and add your Google Gemini API key:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

4. **Run the application**
   ```bash
   python main.py
   ```

5. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - Alternative Docs: http://localhost:8000/redoc
   - Health Check: http://localhost:8000/health

## 📖 Usage

### 1. Ingest the Constitution

First, ingest the constitution text:

```bash
curl -X POST "http://localhost:8000/ingest-from-path" \
     -H "Content-Type: application/json" \
     -d '{"file_path": "data/constitution"}'
```

### 2. Query the Constitution

Ask questions about the constitution:

```bash
curl -X POST "http://localhost:8000/query" \
     -H "Content-Type: application/json" \
     -d '{
       "question": "What are the fundamental rights guaranteed in the constitution?",
       "include_sources": true
     }'
```

### 3. Search for Articles

Find semantically similar articles:

```bash
curl -X POST "http://localhost:8000/search" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "freedom of speech",
       "k": 5
     }'
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Google Gemini API key | Required |
| `LLM_PROVIDER` | LLM provider to use | `google` |
| `MODEL_NAME` | LLM model name | `gemini-1.5-flash` |
| `EMBEDDING_MODEL` | Embedding model | `sentence-transformers/all-MiniLM-L6-v2` |
| `CHUNK_SIZE` | Text chunk size | `1000` |
| `TOP_K_RESULTS` | Number of results to retrieve | `5` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |

## 📚 API Endpoints

### Core Endpoints

- `GET /` - API information
- `GET /health` - System health check
- `POST /query` - Ask constitutional questions
- `POST /search` - Semantic search for articles
- `POST /ingest` - Upload constitution file
- `POST /ingest-from-path` - Ingest from file path

### Utility Endpoints

- `GET /stats` - System statistics
- `GET /compare` - Compare with ChatGPT (demo)

## 🎯 Key Features Explained

### Smart Constitution Splitting
The system uses regex patterns to identify article boundaries and preserves legal context during chunking.

### Citation Verification
Automatically extracts article numbers from LLM responses and verifies they exist in the retrieved documents.

### Cross-Reference Detection
Identifies mentions of other articles within the text to provide comprehensive answers.

### Free Embeddings
Uses HuggingFace sentence transformers for free, high-quality text embeddings.

## 🔍 Example Queries

- "What are the fundamental rights?"
- "Explain the process of impeachment"
- "What powers does the President have?"
- "How are judges appointed?"
- "What is the role of the Prime Minister?"

## 🧪 Testing

Run the health check to verify system status:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "vector_store_ready": true,
  "llm_provider": "google",
  "message": "All systems operational"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini for providing free API access for educational use
- HuggingFace for open-source embedding models
- LangChain for the RAG framework
- ChromaDB for vector database functionality

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the configuration in `.env.example`

---

**Built with ❤️ for legal education and constitutional awareness in Bangladesh**
