from rag_engine_simple import get_simple_rag_engine

def test_ingestion():
    rag = get_simple_rag_engine()
    success = rag.ingest_constitution('../data/constitution')
    
    print(f'Ingestion successful: {success}')
    print(f'Documents loaded: {len(rag.documents)}')
    print(f'Articles indexed: {len(rag.article_index)}')
    
    if len(rag.documents) > 0:
        print('\nFirst 10 documents:')
        for i, doc in enumerate(rag.documents[:10]):
            article_name = doc.metadata.get('article', 'Unknown')
            content_length = len(doc.page_content)
            print(f'{i+1}. {article_name} - {content_length} chars')
    
    print('\nSample articles in index ')
    article_keys = list(rag.article_index.keys())[:5]
    for key in article_keys:
        content = rag.article_index[key]
        print(f'Article {key}: {len(content)} chars')

if __name__ == '__main__':
    test_ingestion()
