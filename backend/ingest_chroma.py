"""
Script to ingest constitution_docs.json into ChromaDB using LangChain.
"""
import os
import json
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from config import config

def load_documents_from_json(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    docs = []
    for doc in data.get('documents', []):
        docs.append(Document(
            page_content=doc['page_content'],
            metadata=doc['metadata']
        ))
    return docs

def main():
    json_path = os.path.join(os.path.dirname(__file__), 'constitution_docs.json')
    if not os.path.exists(json_path):
        print(f"File not found: {json_path}")
        return
    print(f"Loading documents from {json_path}")
    documents = load_documents_from_json(json_path)
    print(f"Loaded {len(documents)} documents.")

    embeddings = HuggingFaceEmbeddings(
        model_name=config.EMBEDDING_MODEL,
        model_kwargs={'device': 'cpu'}
    )
    print(f"Using embedding model: {config.EMBEDDING_MODEL}")

    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=config.VECTOR_DB_PATH,
        collection_name=config.COLLECTION_NAME
    )
    print(f"ChromaDB created at {config.VECTOR_DB_PATH} with collection '{config.COLLECTION_NAME}'")

if __name__ == "__main__":
    main()
