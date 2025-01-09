#!/bin/bash

# Increment the major version
npm version major -m "chore(release): bump to %s [major]"

# Get the new version
VERSION=$(node -p "require('./package.json').version")

# Push changes and tags
git push origin main --follow-tags

# Create GitHub release
gh release create "v$VERSION" --title "Release v$VERSION" --notes "Major release v$VERSION"
