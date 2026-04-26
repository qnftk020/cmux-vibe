import json
import re
import os

def load_signatures(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_corpus(path):
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8') as f:
        return [line.strip() for line in f if line.strip()]

def tokenize(text):
    return re.findall(r'[a-zA-Z가-힣]{2,}', text.lower())

def run_benchmark(signatures, corpus, label):
    results = []
    # 시그니처를 셋으로 변환하여 검색 속도 향상
    sig_pairs = {tuple(sorted((s['wordA'], s['wordB']))): s['score'] for s in signatures}
    
    match_count = 0
    total_score = 0
    
    for text in corpus:
        tokens = tokenize(text)
        matched_in_text = 0
        text_score = 0
        
        # 윈도우 5 적용하여 실제 백엔드와 동일하게 검증
        for i in range(len(tokens)):
            for j in range(i + 1, min(i + 5, len(tokens))):
                pair = tuple(sorted((tokens[i], tokens[j])))
                if pair in sig_pairs:
                    matched_in_text += 1
                    text_score += sig_pairs[pair]
        
        # 임계치(50점) 기준으로 탐지 여부 결정
        is_detected = text_score >= 50.0
        if is_detected:
            match_count += 1
            total_score += text_score
            
    return match_count, len(corpus)

def main():
    signatures = load_signatures('data/signatures.json')
    pos_corpus = load_corpus('data/injections.txt')
    neg_corpus = load_corpus('data/normal.txt')
    
    print(f"--- PMI Layer Large-scale Benchmark ---")
    print(f"Signatures loaded: {len(signatures)}")
    print(f"Positive samples: {len(pos_corpus)}")
    print(f"Negative samples: {len(neg_corpus)}")
    print("Running evaluation...")

    tp, total_pos = run_benchmark(signatures, pos_corpus, "Injection")
    fp, total_neg = run_benchmark(signatures, neg_corpus, "Normal")

    recall = tp / total_pos
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    fpr = fp / total_neg

    stats = {
        "metrics": {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "false_positive_rate": round(fpr, 6)
        },
        "confusion_matrix": {
            "tp": tp,
            "fn": total_pos - tp,
            "fp": fp,
            "tn": total_neg - fp
        },
        "threshold_used": 50.0
    }

    print(json.dumps(stats, indent=2))
    
    with open('data/pmi_benchmark_results.json', 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=2)

if __name__ == "__main__":
    main()
