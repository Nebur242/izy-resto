#!/bin/bash

# Increment the patch version
npm version patch -m "chore(release): bump to %s [patch]"

# Get the new version
VERSION=$(node -p "require('./package.json').version")

# Push changes and tags
git push origin main --follow-tags

# Create GitHub release
gh release create "v$VERSION" --title "Release v$VERSION" --notes "Patch release v$VERSION"
