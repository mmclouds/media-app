#!/usr/bin/env python3
"""
关键词密度分析器
- 英文：按单词计数
- 非英文：按字符计数（中文及其他语言同此规则）
- 忽略大小写与特殊字符
"""

import argparse
import json
import sys
from collections import Counter
from pathlib import Path


def iter_tokens(text: str):
    tokens = []
    buf = []
    for ch in text.lower():
        if "a" <= ch <= "z" or "0" <= ch <= "9":
            buf.append(ch)
            continue
        # 非英文字符：按字符计数（排除空白与标点）
        if buf:
            tokens.append("".join(buf))
            buf = []
        if ch.isspace():
            continue
        # 仅保留字母/数字类字符
        if ch.isalpha() or ch.isdigit():
            tokens.append(ch)
    if buf:
        tokens.append("".join(buf))
    return tokens


def ngrams(tokens, n):
    if n <= 0:
        return []
    if len(tokens) < n:
        return []
    return [" ".join(tokens[i : i + n]) for i in range(len(tokens) - n + 1)]


def top_ngrams(tokens, n, topk):
    grams = ngrams(tokens, n)
    total = len(grams)
    counts = Counter(grams)
    items = []
    for gram, count in counts.most_common(topk):
        density = 0.0 if total == 0 else count / total
        items.append({"keyword": gram, "count": count, "density": density})
    return total, items


def calc_density(tokens, phrase: str):
    phrase_tokens = iter_tokens(phrase)
    n = len(phrase_tokens)
    if n == 0:
        return 0, 0.0
    grams = ngrams(tokens, n)
    total = len(grams)
    target = " ".join(phrase_tokens)
    count = sum(1 for g in grams if g == target)
    density = 0.0 if total == 0 else count / total
    return count, density


def main():
    parser = argparse.ArgumentParser(description="关键词密度分析")
    parser.add_argument("--text", required=True, help="输入文本文件路径")
    parser.add_argument("--top", type=int, default=10, help="每个 n-gram 输出数量")
    parser.add_argument("--target", action="append", default=[], help="指定目标关键词，可重复")
    parser.add_argument("--json", action="store_true", help="以 JSON 输出")
    args = parser.parse_args()

    text_path = Path(args.text)
    if not text_path.exists():
        print(f"[ERROR] 文本文件不存在: {text_path}", file=sys.stderr)
        sys.exit(1)

    text = text_path.read_text(encoding="utf-8")
    tokens = iter_tokens(text)
    total_tokens = len(tokens)

    result = {
        "total_tokens": total_tokens,
        "ngrams": {},
        "targets": [],
    }

    for n in range(1, 5):
        total_grams, items = top_ngrams(tokens, n, args.top)
        result["ngrams"][str(n)] = {
            "total": total_grams,
            "items": items,
        }

    for phrase in args.target:
        count, density = calc_density(tokens, phrase)
        result["targets"].append(
            {
                "keyword": phrase,
                "count": count,
                "density": density,
            }
        )

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    print(f"总词数/字数(按规则统计): {total_tokens}")
    for n in range(1, 5):
        block = result["ngrams"][str(n)]
        print(f"\nTop {args.top} - {n}-gram (总数: {block['total']})")
        for item in block["items"]:
            print(f"- {item['keyword']}  | {item['count']}  | {item['density']:.4%}")

    if result["targets"]:
        print("\n目标关键词密度")
        for item in result["targets"]:
            print(f"- {item['keyword']}  | {item['count']}  | {item['density']:.4%}")


if __name__ == "__main__":
    main()
