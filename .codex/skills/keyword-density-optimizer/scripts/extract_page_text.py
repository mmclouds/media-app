#!/usr/bin/env python3
"""
提取页面文本并合并引用文本：
- 解析页面与相对导入的本地组件
- 提取 JSX 直文本 + 字符串字面量
- 解析 t('key') 并从 messages/<locale>.json 取值
"""

import argparse
import json
import re
import sys
from pathlib import Path

IMPORT_RE = re.compile(r"(?:import|export)\s+[^;]*?from\s+['\"]([^'\"]+)['\"]")
T_CALL_RE = re.compile(r"\bt\(\s*['\"]([^'\"]+)['\"]\s*\)")


def find_repo_root(start: Path) -> Path:
    cur = start.resolve()
    for _ in range(10):
        if (cur / "package.json").exists():
            return cur
        if cur.parent == cur:
            break
        cur = cur.parent
    return start.resolve()


def resolve_import(base: Path, spec: str):
    if not spec.startswith("."):
        return None
    base_dir = base.parent
    raw = (base_dir / spec).resolve()
    candidates = []
    if raw.suffix:
        candidates.append(raw)
    else:
        for ext in [".tsx", ".ts", ".jsx", ".js"]:
            candidates.append(raw.with_suffix(ext))
        for ext in [".tsx", ".ts", ".jsx", ".js"]:
            candidates.append(raw / f"index{ext}")
    for path in candidates:
        if path.exists():
            return path
    return None


def strip_comments(code: str) -> str:
    # 简单移除块注释与行注释（可能不完全准确，但足够实用）
    code = re.sub(r"/\*.*?\*/", " ", code, flags=re.S)
    code = re.sub(r"//.*", " ", code)
    return code


def extract_jsx_text(code: str):
    items = []
    for match in re.findall(r">([^<{][^<>]*?)<", code):
        text = match.strip()
        if text:
            items.append(text)
    return items


def extract_string_literals(code: str):
    items = []
    string_re = re.compile(
        r"'([^'\\]*(?:\\.[^'\\]*)*)'|\"([^\"\\]*(?:\\.[^\"\\]*)*)\"|`([^`\\]*(?:\\.[^`\\]*)*)`"
    )
    for m in string_re.finditer(code):
        s = next(g for g in m.groups() if g is not None)
        if "${" in s:
            continue
        s = s.strip()
        if not s:
            continue
        # 排除明显的路径或标识
        if "/" in s or "\\" in s:
            continue
        if s.endswith((".png", ".jpg", ".jpeg", ".svg", ".webp")):
            continue
        if len(s) == 1:
            continue
        items.append(s)
    return items


def load_messages(messages_path: Path):
    if not messages_path.exists():
        return {}
    try:
        return json.loads(messages_path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def get_message_value(messages: dict, key: str):
    cur = messages
    for part in key.split("."):
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            return None
    if isinstance(cur, str):
        return cur
    return None


def collect_text_from_file(path: Path, messages: dict, include_literals: bool, include_jsx: bool):
    try:
        code = path.read_text(encoding="utf-8")
    except Exception:
        return [], []

    code = strip_comments(code)

    texts = []
    if include_jsx:
        texts.extend(extract_jsx_text(code))
    if include_literals:
        texts.extend(extract_string_literals(code))

    keys = T_CALL_RE.findall(code)
    t_texts = []
    for key in keys:
        val = get_message_value(messages, key)
        if val:
            t_texts.append(val)
    return texts, t_texts


def main():
    parser = argparse.ArgumentParser(description="提取页面文本并合并引用文本")
    parser.add_argument("--page", required=True, help="page.tsx 路径")
    parser.add_argument("--locale", default="en", help="locale（用于 messages/<locale>.json）")
    parser.add_argument("--messages", default=None, help="messages JSON 路径（可选）")
    parser.add_argument("--max-depth", type=int, default=3, help="相对导入递归深度")
    parser.add_argument("--include-literals", action="store_true", help="包含字符串字面量")
    parser.add_argument("--include-jsx", action="store_true", help="包含 JSX 直文本")
    parser.add_argument("--extra", action="append", default=[], help="额外文本文件，可重复")
    parser.add_argument("--out", default="-", help="输出文件，- 为 stdout")
    args = parser.parse_args()

    page_path = Path(args.page)
    if not page_path.exists():
        print(f"[ERROR] page 文件不存在: {page_path}", file=sys.stderr)
        sys.exit(1)

    repo_root = find_repo_root(page_path)
    messages_path = Path(args.messages) if args.messages else (repo_root / "messages" / f"{args.locale}.json")
    messages = load_messages(messages_path)

    include_literals = args.include_literals
    include_jsx = args.include_jsx

    visited = set()
    queue = [(page_path, 0)]
    all_texts = []
    all_t_texts = []

    while queue:
        current, depth = queue.pop(0)
        if current in visited:
            continue
        visited.add(current)

        texts, t_texts = collect_text_from_file(current, messages, include_literals, include_jsx)
        all_texts.extend(texts)
        all_t_texts.extend(t_texts)

        if depth >= args.max_depth:
            continue

        try:
            code = current.read_text(encoding="utf-8")
        except Exception:
            continue

        for spec in IMPORT_RE.findall(code):
            target = resolve_import(current, spec)
            if target:
                queue.append((target, depth + 1))

    # 额外文本
    for extra in args.extra:
        p = Path(extra)
        if p.exists():
            all_texts.append(p.read_text(encoding="utf-8"))

    # 合并输出
    output_lines = []
    output_lines.append("\n".join(all_texts))
    output_lines.append("\n".join(all_t_texts))
    output = "\n".join([s for s in output_lines if s.strip()])

    if args.out == "-":
        print(output)
    else:
        Path(args.out).write_text(output, encoding="utf-8")
        print(f"[OK] 输出到: {args.out}")


if __name__ == "__main__":
    main()
