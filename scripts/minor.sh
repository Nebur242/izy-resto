#!/bin/bash

# Increment the minor version
npm version minor -m "chore(release): bump to %s [minor]"

# Get the new version
VERSION=$(node -p "require('./package.json').version")

# Push changes and tags
git push origin main --follow-tags

# Create GitHub release
gh release create "v$VERSION" --title "Release v$VERSION" --notes "Minor release v$VERSION"
