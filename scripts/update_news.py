# coding: utf-8
"""Fetch a five-headline science reading issue. No AI text or API key required."""
from pathlib import Path
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen
from urllib.parse import urlparse
from email.utils import parsedate_to_datetime
import html
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
FEED = 'https://www.nasa.gov/feed/'

def load(path):
    return json.loads((ROOT / path).read_text(encoding='utf-8'))

def save(path, data):
    target = ROOT / path
    temporary = target.with_suffix('.tmp')
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(target)

def main():
    today = datetime.now(timezone(timedelta(hours=8))).date().isoformat()
    issues = load('data/issues.json')
    issue_id = today + '-science'
    if any(i['id'] == issue_id for i in issues):
        print('Today already archived; preserving existing issue.')
        return
    request = Request(FEED, headers={'User-Agent': 'EAPLearningHub/3.0 (RSS reading links)'})
    with urlopen(request, timeout=30) as response:
        feed = ET.fromstring(response.read(4_000_000))
    articles, seen = [], set()
    for item in feed.findall('./channel/item'):
        title = html.unescape(item.findtext('title', '')).strip()
        link = item.findtext('link', '').strip()
        published = item.findtext('pubDate', '')
        parsed = urlparse(link)
        if not title or parsed.scheme != 'https' or not (parsed.hostname == 'nasa.gov' or (parsed.hostname or '').endswith('.nasa.gov')) or link in seen:
            continue
        try:
            date = parsedate_to_datetime(published).date().isoformat()
        except (ValueError, TypeError):
            continue
        seen.add(link)
        # Link-only cards: do not republish third-party summaries, photos, or articles.
        articles.append(dict(title=title, titleEn='', topic='科学与太空',
            en=title, zh='英文标题阅读卡：请打开 NASA 原文了解详情，再整理自己的观点。',
            sourceName='NASA 官方原文', sourceUrl=link, published=date,
            question='What does this development suggest about science, public investment or society?'))
        if len(articles) == 5:
            break
    if len(articles) != 5:
        raise RuntimeError('Fewer than five valid source items; existing archives are untouched.')
    latest = next((i for i in issues if i['id'].endswith('-science')), None)
    if latest and [a['sourceUrl'] for a in load(latest['file'])['articles']] == [a['sourceUrl'] for a in articles]:
        print('Source has no changes; no duplicate issue created.')
        return
    issue = dict(id=issue_id, date=today, title='每日五篇 · 科学新闻标题阅读',
        note='NASA RSS 最近五篇英文标题与原文链接；日期是收录日期，每篇另标来源发布日期，可能含前日内容。不是完整双语新闻简报。图片为本站示意插图。',
        articles=articles)
    path = 'data/' + issue_id + '.json'
    materials = load('data/materials.json')
    materials.extend(dict(id=issue_id+':'+a['title'], date=today, title=a['title'], topic=a['topic'], text=a['en'], sourceUrl=a['sourceUrl'], note='') for a in articles)
    save(path, issue)
    save('data/materials.json', materials)
    issues.insert(0, dict(id=issue_id, date=today, title=issue['title'], file=path))
    save('data/issues.json', issues)
    print('Archived five source links:', path)

if __name__ == '__main__':
    main()
