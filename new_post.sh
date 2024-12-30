#!/bin/bash

if [ -z "$1" ]; then
  echo "用法: ./new_post.sh '文章标题' [分类] [标签]"
  exit 1
fi

TITLE="$1"
DATE=$(date +"%Y-%m-%d")
TIME=$(date +"%H:%M:%S %z")
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
FILENAME="_posts/${DATE}-${SLUG}.md"

CATEGORY=${2:-未分类}
TAGS=${3:-未标签}

cat <<EOL > "$FILENAME"
---
layout: post
title: "$TITLE"
date: ${DATE} ${TIME}
categories: [${CATEGORY}]
tags: [${TAGS}]
---

# $TITLE

这里是文章内容。
EOL

echo "新文章已创建: $FILENAME"
