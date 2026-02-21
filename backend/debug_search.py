#!/usr/bin/env python3

import os
from rag_engine_simple import get_simple_rag_engine

def debug_search():
    print(f"Current working directory: {os.getcwd()}")
    print(f"Constitution docs file exists: {os.path.exists('./constitution_docs.json')}")
    
    rag = get_simple_rag_engine()
    print(f"Documents loaded: {len(rag.documents)}")
    print(f"Articles indexed: {len(rag.article_index)}")
    
    if len(rag.documents) == 0:
        print("❌ No documents loaded - checking file path...")
        possible_paths = [
            "./constitution_docs.json",
            "backend/constitution_docs.json",
            "../backend/constitution_docs.json"
        ]
        for path in possible_paths:
            if os.path.exists(path):
                print(f"✅ Found at: {path}")
            else:
                print(f"❌ Not found: {path}")
    else:
        print("✅ Documents loaded successfully")
        
        # Test search
        query = "fundamental rights"
        results = rag.search_articles(query, k=5)
        
        print(f'Search query: {query}')
        print(f'Results found: {len(results)}')
        
        if len(results) > 0:
            print('First result:')
            result = results[0]
            print(f'  Article: {result.get("article", "Unknown")}')
            print(f'  Content preview: {result.get("content", "")[:100]}...')

if __name__ == '__main__':
    debug_search()
