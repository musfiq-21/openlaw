#!/usr/bin/env python3

from rag_engine_simple import get_simple_rag_engine

def test_query():
    rag = get_simple_rag_engine()
    
    # Test a query about fundamental rights
    question = "What are the fundamental rights?"
    result = rag.query(question)
    
    print(f'Question: {question}')
    print(f'Answer: {result.answer[:300]}...')
    print(f'Sources found: {len(result.sources)}')
    print(f'Confidence: {result.confidence}')
    print(f'Verified citations: {result.verified_citations}')
    
    print('\n--- Sources ---')
    for i, source in enumerate(result.sources[:3]):
        print(f'{i+1}. {source.get("article", "Unknown")} - {source.get("article_number", "Unknown")}')
        print(f'   Content: {source.get("content", "")[:100]}...')
    
    # Test another query
    print('\n' + '='*50)
    question2 = "What does Article 32 say about life and liberty?"
    result2 = rag.query(question2)
    
    print(f'Question: {question2}')
    print(f'Answer: {result2.answer[:300]}...')
    print(f'Sources found: {len(result2.sources)}')
    print(f'Confidence: {result2.confidence}')

if __name__ == '__main__':
    test_query()
