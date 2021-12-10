#!/bin/bash
grep "###" README.md | while read line; do
  title=$(echo $line | sed s/"### "//g)
  link=$(echo $title | sed s/" "/\-/g | awk '{print tolower($0)}')
  echo - [$title]\(\#$link\)
done
