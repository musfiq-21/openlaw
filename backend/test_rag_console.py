"""
Test script for querying the RAG engine directly (no API).
"""
from rag_engine_enhanced import ConstitutionRAG

def main():
    rag = ConstitutionRAG()
    print("RAG engine initialized.")
    print("Type your question about the Bangladesh Constitution (or 'exit' to quit):")
    while True:
        question = input("\nQ: ")
        if question.strip().lower() in {"exit", "quit"}:
            break
        result = rag.query(question)
        print("\nA:", result.answer)
        if result.sources:
            print("\nSources:")
            for src in result.sources:
                print(f"- Article {src['article_number']}: {src['content'][:100]}...")
        print("\nConfidence:", result.confidence)

if __name__ == "__main__":
    main()
