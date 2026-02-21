#!/usr/bin/env python3

from rag_engine_simple import get_simple_rag_engine

def test_search():
    rag = get_simple_rag_engine()
    
    # Test search for fundamental rights
    query = "fundamental rights"
    results = rag.search_articles(query, k=5)
    
    print(f'Search query: {query}')
    print(f'Results found: {len(results)}')
    
    print('\n--- Search Results ---')
    for i, result in enumerate(results):
        article = result.get('article', 'Unknown')
        article_number = result.get('article_number', 'Unknown')
        content = result.get('content', '')
        
        print(f'{i+1}. {article} ({article_number})')
        print(f'   Content preview: {content[:200]}...')
        print()
    
    # Test search for Article 32 specifically
    print('='*50)
    query2 = "Article 32"
    results2 = rag.search_articles(query2, k=3)
    
    print(f'Search query: {query2}')
    print(f'Results found: {len(results2)}')
    
    print('\n--- Search Results ---')
    for i, result in enumerate(results2):
        article = result.get('article', 'Unknown')
        article_number = result.get('article_number', 'Unknown')
        content = result.get('content', '')
        
        print(f'{i+1}. {article} ({article_number})')
        print(f'   Content preview: {content[:300]}...')
        print()

if __name__ == '__main__':
    test_search()
